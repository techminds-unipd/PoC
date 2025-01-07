from langchain_core.tools import BaseTool
from langchain_core.callbacks import CallbackManagerForToolRun
from typing import Type, Optional
from pydantic import BaseModel, Field
import os.path
import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import json

SCOPES = ["https://www.googleapis.com/auth/calendar"]

class GCalendarSearchEventSchema(BaseModel):
    query: str = Field(description="Free text search terms to find events that match these terms")

class GCalendarSearchEventTool(BaseTool):
    name: str = "google_calendar_search"
    description: str = "A tool for searching Google Calendar events and meetings."
    args_schema: Type[GCalendarSearchEventSchema] = GCalendarSearchEventSchema
    creds: Credentials = None

    def __init__(self, token_file_path):
        super().__init__()
        if os.path.exists(token_file_path):
            self.creds = Credentials.from_authorized_user_file(token_file_path, SCOPES)
        if not self.creds or not self.creds.valid:
            exit(1)

    def search_event(self, query):
        try:
            now = datetime.datetime.utcnow().isoformat() + "Z"
            service = build("calendar", "v3", credentials=self.creds)
            events_result = service.events().list(calendarId='primary', timeMin=now, singleEvents=True, orderBy="startTime", q=query).execute()
            events = events_result.get("items", [])
            if not events:
                return "No upcoming events found."
            else:
                return json.dumps(events)

        except HttpError as error:
            print(f"An error occurred: {error}")

    def _run(
            self,
            query: str,
            run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        result = self.search_event(query)
        return result
