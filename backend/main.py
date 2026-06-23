# from fastapi import FastAPI, UploadFile, File
# import shutil

# from parser import extract_pdf_text

# app = FastAPI()


# @app.get("/")
# def home():
#     return {"message": "Backend Running"}


# @app.post("/upload")
# async def upload_resume(
#     resume: UploadFile = File(...)
# ):

#     file_path = resume.filename

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(
#             resume.file,
#             buffer
#         )

#     text = extract_pdf_text(file_path)

#     return {
#         "resume_text": text
#     }
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from parser import extract_pdf_text
from llm import customize_resume

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/customize")
async def customize_resume_api(
    jd: str = Form(...),
    resume: UploadFile = File(...)
):

    # Validate PDF
    if not resume.filename.endswith(".pdf"):
        return {
            "error": "Only PDF files are allowed"
        }

    # Save uploaded PDF
    file_path = resume.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            resume.file,
            buffer
        )

    # Extract text from PDF
    resume_text = extract_pdf_text(
        file_path
    )

    # Send to Gemini
    customized_resume = customize_resume(
        resume_text,
        jd
    )

    # Optional: delete uploaded file
    os.remove(file_path)

    return {
        "customized_resume": customized_resume
    }