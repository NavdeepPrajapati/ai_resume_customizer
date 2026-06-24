import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)

# Create model
model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def customize_resume(resume_text, jd_text):

   prompt = f"""
You are a professional ATS Resume Writer.

JOB DESCRIPTION:
{jd_text}

ORIGINAL RESUME:
{resume_text}

OBJECTIVE:
Create an ATS-optimized version of the resume tailored to the Job Description.

IMPORTANT RULES:

1. The resume MUST start with the candidate information extracted from the original resume:
   - Name
   - Email
   - Phone
   - LinkedIn/GitHub (if present)

2. Do NOT start with:
   - ATS Score
   - Matching Skills
   - Missing Skills
   - ATS Analysis
   - Suggestions
   - Recommendations

3. Do NOT write headings such as:
   - Customized Skills Section
   - Customized Work Experience Section
   - Customized Projects Section
   - Customized Resume

4. Write the resume exactly like a professional job-ready resume.

5. Use only professional resume section titles such as:
   - Professional Summary
   - Education
   - Work Experience
   - Internship Experience
   - Projects
   - Technical Skills
   - Positions of Responsibility
   - Certifications
   - Relevant Coursework

6. Reorder sections according to JD relevance.
   Example:
   AI/ML Role:
   Summary → Experience → Projects → Skills → Education → POR

   Mechanical Role:
   Summary → Education → Experience → Projects → Skills → POR

7. Never place ATS analysis inside the resume.

8. Resume should appear as a final resume ready to submit.

------------------------------------------------

AFTER THE COMPLETE RESUME ONLY:

# ATS ANALYSIS

## ATS SCORE

Calculate ATS score using:

- Skills Match = 40%
- Experience Match = 30%
- Projects Match = 20%
- Education Match = 10%

Provide:
- ATS Score
- Matching Skills
- Missing Skills
- Improvement Suggestions

The ATS Analysis must appear ONLY AFTER the complete resume.

Return only the final formatted resume followed by ATS Analysis.
"""

   
   try:

      response = model.generate_content(prompt)

      return response.text

   except Exception as e:

      return f"Error generating resume: {str(e)}"