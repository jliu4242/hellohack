from fastapi import FastAPI, UploadFile, File, HTTPException
import mailbox
import os
import json
from dotenv import load_dotenv
import openai
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

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
    try:
        # Read the uploaded file content
        content = await file.read()
        
        # Only accept .mbox files
        if not file.filename.endswith('.mbox'):
            raise HTTPException(status_code=400, detail="Only .mbox files are supported")
        
        # Process .mbox file
        return await process_mbox_file(content)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

async def process_mbox_file(content):
    """Process .mbox file with ChatGPT to extract job application information"""
    try:
        # Convert bytes to string for processing
        mbox_content = content.decode('utf-8', errors='ignore')
        
        # Create prompt for ChatGPT to analyze .mbox file
        prompt = f"""
        Please analyze the following .mbox email file content and extract job application information. 
        Look for emails related to job applications, interviews, offers, and rejections.
        
        Return a JSON array with the following structure for each job application found:
        {{
            "id": "unique_id",
            "company": "company_name",
            "position": "job_title",
            "dateApplied": "YYYY-MM-DD",
            "startDate": "YYYY-MM-DD or null",
            "status": "Applied|Interview Scheduled|Offer Extended|Rejected"
        }}
        
        .mbox file content:
        {mbox_content[:5000]}  # Limit content to avoid token limits
        
        Please extract all job applications from this email data and return only the JSON array.
        If no job applications are found, return an empty array.
        """
        
        # Call ChatGPT API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts job application data from email files (.mbox format) and returns structured JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        # Extract the response content
        chatgpt_response = response.choices[0].message.content.strip()
        
        # Try to parse the JSON response
        try:
            extracted_data = json.loads(chatgpt_response)
            return {
                "success": True,
                "data": extracted_data,
                "message": f"Successfully extracted {len(extracted_data)} job applications from .mbox file",
                "raw_response": chatgpt_response
            }
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw response
            return {
                "success": True,
                "data": [],
                "message": "ChatGPT processed the .mbox file but couldn't extract structured job applications",
                "raw_response": chatgpt_response
            }
            
    except Exception as e:
        return {
            "success": False,
            "data": [],
            "message": f"Error processing .mbox file with ChatGPT: {str(e)}",
            "raw_response": None
        }

@app.post("/analyze")
async def analyze_applications(data: List[Dict[str, Any]]):
    """Analyze job applications and provide insights using ChatGPT"""
    try:
        # Convert applications to string for analysis
        applications_str = json.dumps(data, indent=2)
        
        prompt = f"""
        Analyze the following job applications and provide insights:
        
        {applications_str}
        
        Please provide:
        1. Summary statistics (total applications, by status, by company)
        2. Trends and patterns
        3. Recommendations for improving application success
        4. Key insights about the job search process
        
        Format your response as a structured analysis.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a career counselor that analyzes job application data and provides actionable insights."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        analysis = response.choices[0].message.content.strip()
        
        return {
            "success": True,
            "analysis": analysis,
            "applications_count": len(data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing applications: {str(e)}")