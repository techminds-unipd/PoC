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

load_dotenv()
app = Flask(__name__)

@app.route("/execute", methods=['POST'])
def execute():
    data = request.get_json()
    google_token = data.get('googleTokenFile')
    workflow = data.get('workflow')
    token_file_path=create_token_file(google_token)
    print(token_file_path)
    # Parsing workflow
    for edge in workflow["edges"]:
      fromNodeService = getWorkflowServiceById(workflow["nodes"], edge["fromNodeId"])
      toNodeService   = getWorkflowServiceById(workflow["nodes"], edge["toNodeId"])
      #*----TEMP----
      fromNodeService = "GmailToolkit"
      toNodeService = "PastebinTool"
      #*----END-TEMP----
      agent_query = f"DESCRIBE EVERY tool you call and show me with which arguments\nUSING the tools from {fromNodeService}\nDO THIS action: \"{edge['action']}\"\nAT THE END use the tools of {toNodeService}"
      run_agent(agent_query, token_file_path)
    #TODO: Capire come ottenere l'ultimo messaggio in formato clean
    pprint.pprint("----------------FINE EXECUTE----------------")
    return {'status': 'success'}



#Crea il file json con le credenziali dell'utente in modo da usare il toolkit Google
#Ritorna il percorso di un tempfile
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
    #! Non è presente una gestione degli errori


def run_agent(query, token_file_path):
    llm = ChatGroq(model="gemma2-9b-it", temperature=0)

    credentials = get_gmail_credentials(
        token_file=token_file_path,
        client_secrets_file="credentials.json",
        scopes=["https://www.googleapis.com/auth/gmail.readonly"]
    )
    api_resource = build_resource_service(credentials=credentials)

    toolkit = GmailToolkit(api_resource=api_resource)
    tools = list(filter(lambda x: x.name!='send_gmail_message', toolkit.get_tools()))
    tools.append(PastebinCreateBinTool())

    agent_executor = create_react_agent(llm, tools)

    events = agent_executor.stream(
      {"messages": [("user", query)]},
      stream_mode="values",
    )
    for event in events:
      event["messages"][-1].pretty_print()

    print("END Workflow")
