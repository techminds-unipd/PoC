from flask import Flask, app, request
import os.path
from langchain_google_community import GmailToolkit
from langchain_google_community.gmail.utils import(
    build_resource_service,
    get_gmail_credentials,
)
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
import pprint


app = Flask(__name__)
load_dotenv()
if not os.getenv("GROQ_API_KEY"):
    exit(1)
llm = ChatGroq(model="llama-3.3-70b-versatile")
SYSTEM_PROMPT="You are a bot that takes a request and uses the appropriate tools to satisfy it."

@app.route("/execute", methods=['POST'])
def execute():
    data = request.get_json()
    #pprint.pprint(data)
    credentials = get_gmail_credentials(
        token_file="token.json",
        client_secrets_file="credentials.json",
        scopes=["https://www.googleapis.com/auth/gmail.readonly"]
    )
    api_resource = build_resource_service(credentials=credentials)
    toolkit= GmailToolkit(api_resource=api_resource)
    tools=toolkit.get_tools()
    graph = create_react_agent(llm, tools)
    inputs={"messages": [("user", "Summarize the latest email")]}
    for s in graph.stream(inputs, stream_mode="values"):
        message = s["messages"][-1]
        if isinstance(message, tuple):
            print(message)
        else:
            message.pretty_print()
    #TODO: Capire come ottenere l'ultimo messaggio in formato clean
    return {'status': 'success'}

