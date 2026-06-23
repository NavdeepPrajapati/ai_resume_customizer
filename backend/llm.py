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
You are an expert ATS Resume Optimizer and Career Coach.

Your task is to customize a candidate's resume according to the given Job Description.

IMPORTANT RULES:
1. Do NOT invent fake work experience.
2. Do NOT invent fake projects.
3. Do NOT invent fake achievements.
4. Improve wording and presentation only.
5. Reorder skills and experience based on relevance to the JD.
6. Add ATS-friendly keywords where appropriate.
7. Keep the resume professional and concise.

JOB DESCRIPTION:
------------------------------------------------
{jd_text}
------------------------------------------------

CANDIDATE RESUME:
------------------------------------------------
{resume_text}
------------------------------------------------

Return the response in the following format:

# ATS MATCH ANALYSIS

- Matching Skills:
- Missing Skills:
- Suggested Keywords:

# CUSTOMIZED PROFESSIONAL SUMMARY

(Write an improved summary aligned with the JD)

# CUSTOMIZED SKILLS SECTION

(Reorder and highlight relevant skills)

# CUSTOMIZED EXPERIENCE SECTION

(Rewrite experience bullets to emphasize JD relevance)

# IMPROVEMENT SUGGESTIONS

(List missing skills, certifications, tools, or keywords)

# FINAL ATS SCORE

(Estimate ATS score out of 100 and explain briefly)
"""

    try:

        response = model.generate_content(prompt)

        return response.text

    except Exception as e:

        return f"Error generating resume: {str(e)}"