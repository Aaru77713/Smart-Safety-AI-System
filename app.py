import os
import streamlit as st
from google import genai

# -----------------------------
# LOAD KNOWLEDGE FILE
# -----------------------------
with open("knowledge.txt", "r", encoding="utf-8") as f:
    knowledge = f.read()

# -----------------------------
# GEMINI
# -----------------------------
api_key = os.environ["GEMINI_API_KEY"]
client = genai.Client(api_key=api_key)

# -----------------------------
# CHATBOT
# -----------------------------
st.title("🛡️ Saathi-AI")
st.subheader("Smart Safety System Assistant")

question = st.text_input("Ask a question")

if question:

    # First ask Gemini to determine whether
    # the knowledge file contains the answer.
    check_prompt = f"""
You are a strict knowledge checker.

KNOWLEDGE FILE:
{knowledge}

USER QUESTION:
{question}

TASK:
Determine whether the knowledge file contains enough information
to answer the user's question.

If YES, answer the question ONLY using the knowledge file.

If NO, reply with exactly:
NOT_FOUND

Do not add anything else.
"""

    check_response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=check_prompt
    )

    answer = check_response.text.strip()

    # -----------------------------
    # KNOWLEDGE FILE HAS THE ANSWER
    # -----------------------------
    if "NOT_FOUND" not in answer:
        st.write(answer)

    # -----------------------------
    # KNOWLEDGE FILE DOES NOT HAVE IT
    # → USE GEMINI
    # -----------------------------
    else:
        fallback_prompt = f"""
You are Saathi-AI, a Smart Safety System Assistant.

The user's question was not answered by our internal knowledge file.

Answer the question normally and clearly.

User question:
{question}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=fallback_prompt
        )

        st.write(response.text)