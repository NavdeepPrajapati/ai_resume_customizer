import os

print("Current folder:", os.getcwd())
print("Files in current folder:")
print(os.listdir())

from parser import extract_pdf_text
from llm import customize_resume

resume_text = extract_pdf_text("resume.pdf")

jd = """
Looking for Data Analyst.
Must know Python, SQL,
Machine Learning and Data Visualization.
"""

result = customize_resume(
    resume_text,
    jd
)

print(result)