from flask import Flask, app, request
import os.path
import json
from langchain_google_community import GmailToolkit
from langchain_google_community.gmail.utils import(
    build_resource_service,
    get_gmail_credentials,
)
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
import pprint
import io
import tempfile
from custom_tools.Pastebin import PastebinCreateBinTool
from custom_tools.GCalendarCreateEvent import GCalendarCreateEventTool
from custom_tools.GCalendarSearchEvent import GCalendarSearchEventTool
import datetime, time

load_dotenv()
app = Flask(__name__)

@app.route("/execute", methods=['POST'])
def execute():
    data = request.get_json()
    google_token = data.get('googleTokenFile')
    workflow = data.get('workflow')
    token_file_path=create_token_file(google_token)

    for edge in workflow["edges"]:
        fromNodeService = getWorkflowServiceById(workflow["nodes"], edge["fromNodeId"])
        toNodeService   = getWorkflowServiceById(workflow["nodes"], edge["toNodeId"])

        #! Questo è qui solo perchè il backend non salva ancora pastebin ma gdocs
        if toNodeService == "gDocs":
            toNodeService = "pastebin"

        tools = returnRightToolsFromService(fromNodeService, token_file_path) + returnRightToolsFromService(toNodeService, token_file_path)

        agent_query = f"DESCRIBE EVERY tool you call and show me with which arguments\nUSING the tools from {fromNodeService}\nDO THIS action: \"{edge['action']}\"\nAT THE END use the tools of {toNodeService}.\n The current time is: {datetime.datetime.now()} and timezone: {time.tzname}"

        results = run_agent(agent_query, tools)
        print(results)

        #TODO: Capire come ottenere l'ultimo messaggio in formato clean

    pprint.pprint("----------------FINE EXECUTE----------------")
    return {'status': 'success'}

def returnRightToolsFromService(serviceName, token_file_path):
    credentials = get_gmail_credentials(
        token_file=token_file_path,
        client_secrets_file="credentials.json",
        scopes=["https://www.googleapis.com/auth/gmail", "https://www.googleapis.com/auth/calendar"]
    )
    api_resource = build_resource_service(credentials=credentials)

    match serviceName:
            case "gmail":
                toolkit = GmailToolkit(api_resource=api_resource)
                return list(filter(lambda x: x.name!='send_gmail_message', toolkit.get_tools()))
            case "googleCalendar":
                return [GCalendarCreateEventTool(token_file_path), GCalendarSearchEventTool(token_file_path)]
            case "pastebin":
                return [PastebinCreateBinTool()]
            case _:
                return []


def create_token_file(google_token):
    if google_token:
        token_temp_file=tempfile.NamedTemporaryFile(mode='w', delete=False) #! vedere meglio come fare il delete per non avere file permanenti
        token_temp_file.write(json.dumps(google_token))
        token_temp_file.flush()
        return token_temp_file.name
    return False


def getWorkflowServiceById(nodes, nodeId):
  for node in nodes:
    if node["id"] == nodeId:
      return node["service"]
  return ""

def run_agent(query, tools):
    llm = ChatGroq(model="gemma2-9b-it", temperature=0)
    agent_executor = create_react_agent(llm, tools)

    events = agent_executor.stream(
        {"messages": [("user", query)]},
        stream_mode="values",
    )
    for event in events:
        event["messages"][-1].pretty_print()

    print("END Workflow")
    return events
