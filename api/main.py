from fastapi import FastAPI, UploadFile, File
import mailbox
import os
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors imports CORSMiddleware


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

print('hello world')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.post("/")
# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

@app.post("/extract")
async def extract(file: UploadFile...):
    
    get mbox.
    
    for msg in mbox:
        
        const res = client.chat.completions.await(
            model: 'gpt-3.5-turbo',
            content [
                
            ]
        )
        
        
