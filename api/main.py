from fastapi import FastAPI, UploadFile, File, HTTPException
import mailbox
import os
import json
from dotenv import load_dotenv
import openai
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import tempfile

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Job Tracker API is running"}

@app.post("/extract")
async def extract(file: UploadFile = File(...)):

    contents = await file.read()
    
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    
    mbox = mailbox.mbox(tmp_path)

    json_list = []

    for msg in mbox:

        prompt = f"""You are an assistant that reads job application emails and extracts structured information. You MUST return ONLY valid JSON with no extra text, explanation, or markdown.

        The JSON must have exactly the following keys:

Rules:
1. If any field is not mentioned in the email, return "N/A".
2. The "status" field must always be one of the options above.
3. Dates must be in the format YYYY-MM-DD. If the date is missing or unclear, use "N/A".
4. The email will contain only one job application.
5. DO NOT return anything except the JSON object.

Add the new json object onto {json_list}.

If {json_list} has an object with the same company and role, meaning the email is 
an update of the status of a job and not a new job, 
update the status of that object and don't make a new object."""
        
        system_prompt = """"date_applied": "YYYY-MM-DD or 'N/A'",
"company_name": "string or 'N/A'",
"job_position_name": "string or 'N/A'",
"status": "applied, interview offered, interview scheduled, rejected, offered",
"date_status_last_updated": "YYYY-MM-DD or 'N/A'"""
            
        response = await openai.ChatCompletion.acreate(
            model = "gpt-3.5-turbo",
            messages=[  {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}],
            temperature = 0
        )
        
        json_obj = json.loads(response.choices[0].message.content)
        json_list.append(json_obj)

    return json_list
