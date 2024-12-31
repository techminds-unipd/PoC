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

load_dotenv()
app = Flask(__name__)

@app.route("/execute", methods=['POST'])
def execute():
    data = request.get_json()
    googleToken = data.get('googleTokenFile')
    #pprint.pprint(googleToken)
    fake_token_file=io.StringIO(str(googleToken))
    #token_file_name=create_token_file(googleToken)
    credentials = get_gmail_credentials(
        token_file=fake_token_file,
        client_secrets_file="credentials.json",
        scopes=["https://www.googleapis.com/auth/gmail.readonly"]
    )
    #api_resource = build_resource_service(credentials)
    #toolkit= GmailToolkit(api_resource=api_resource)
    #tools=toolkit.get_tools()
    #llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1)
    #SYSTEM_PROMPT="You are a bot that takes a request in italian or english and uses the appropriate tools to satisfy it. The final answer MUST BE in the same language as the user prompt, but the reasoning MUST BE in english."
    #graph = create_react_agent(llm, tools)
    #inputs={"messages": [("user", "Summarize the latest email.") ]}
    #for s in graph.stream(inputs, stream_mode="values"):
    #    message = s["messages"][-1]
    #    if isinstance(message, tuple):
    #        print(message)
    #    else:
    #        message.pretty_print()
    #TODO: Capire come ottenere l'ultimo messaggio in formato clean
    #delete_secrets_file(token_file_name)
    pprint.pprint("----------------FINE EXECUTE----------------")
    return {'status': 'success'}



#Crea il file json con le credenziali dell'utente in modo da usare il toolkit Google
def create_token_file(googleToken):
    if googleToken:
        file_name='token'+str(hash(googleToken))+'.json'
        with open(file_name, mode="w") as token_file:
            with open('token_template.json', 'r') as template_file:
                json_file = json.load(template_file)
            json_file['token'] = googleToken
            json.dump(json_file, token_file)
        return file_name
    return False

#Funzione chiamata alla fine della computazione dell'agente, per rimuovere le credenziali dell'utente
def delete_secrets_file(token_file_name):
    os.remove(token_file_name)