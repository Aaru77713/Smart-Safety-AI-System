import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai


# ==========================================
# 1. FLASK APP
# ==========================================

app = Flask(__name__)

# Frontend ko Python API access karne dena
CORS(app)


# ==========================================
# 2. LOAD KNOWLEDGE FILE
# ==========================================

try:

    with open(
        "knowledge.txt",
        "r",
        encoding="utf-8"
    ) as f:

        knowledge = f.read()


    print("knowledge.txt loaded successfully.")


except Exception as error:

    print(
        "Knowledge file error:",
        error
    )

    knowledge = ""


# ==========================================
# 3. GEMINI API SETUP
# ==========================================

api_key = os.environ.get(
    "GEMINI_API_KEY"
)


# API key check
if not api_key:

    print(
        "ERROR: GEMINI_API_KEY is not set."
    )

    client = None


else:

    client = genai.Client(
        api_key=api_key
    )

    print(
        "Gemini client initialized."
    )



# ==========================================
# 4. HOME ROUTE
# ==========================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "success": True,

        "message":
            "Saathi AI chatbot API is running"

    })



# ==========================================
# 5. CHAT ROUTE
# ==========================================

@app.route(
    "/chat",
    methods=["POST"]
)
def chat():

    try:

        # ==================================
        # GEMINI CLIENT CHECK
        # ==================================

        if client is None:

            return jsonify({

                "success": False,

                "reply":
                    "Gemini API key is not configured."

            }), 500



        # ==================================
        # FRONTEND SE DATA LENA
        # ==================================

        data = request.get_json(
            silent=True
        )


        if not data:

            return jsonify({

                "success": False,

                "reply":
                    "No message received."

            }), 400



        # ==================================
        # USER MESSAGE
        # ==================================

        question = data.get(
            "message",
            ""
        ).strip()


        if question == "":

            return jsonify({

                "success": False,

                "reply":
                    "Please enter a question."

            }), 400



        print(
            "User Question:",
            question
        )



        # ==================================
        # KNOWLEDGE FILE CHECK
        # ==================================

        check_prompt = f"""
You are a strict knowledge checker.

KNOWLEDGE FILE:

{knowledge}


USER QUESTION:

{question}


TASK:

Determine whether the knowledge file contains
enough information to answer the user's question.

If YES:

Answer the question ONLY using the knowledge file.

If NO:

Reply with exactly:

NOT_FOUND

Do not add anything else.
"""



        check_response = (
            client.models.generate_content(

                model="gemini-3.6-flash",

                contents=check_prompt
            )
        )



        # Gemini response safety check
        if not check_response.text:

            raise Exception(
                "No response received from Gemini."
            )



        answer = (
            check_response.text.strip()
        )



        print(
            "Knowledge Check:",
            answer
        )



        # ==================================
        # ANSWER KNOWLEDGE FILE ME MIL GAYA
        # ==================================

        if "NOT_FOUND" not in answer:

            return jsonify({

                "success": True,

                "source":
                    "knowledge",

                "reply":
                    answer
            })



        # ==================================
        # GEMINI FALLBACK
        # ==================================

        fallback_prompt = f"""
You are Saathi-AI.

You are a Smart Safety System Assistant.

The user's question was not answered by the
internal Saathi knowledge file.

Answer the user's question clearly,
simply and helpfully.

USER QUESTION:

{question}
"""



        response = (
            client.models.generate_content(

                model="gemini-3.6-flash",

                contents=fallback_prompt
            )
        )



        # Response check
        if not response.text:

            raise Exception(
                "Gemini returned an empty response."
            )



        bot_reply = (
            response.text.strip()
        )



        # ==================================
        # SEND RESPONSE TO FRONTEND
        # ==================================

        return jsonify({

            "success": True,

            "source":
                "gemini",

            "reply":
                bot_reply
        })



    # ======================================
    # ERROR HANDLING
    # ======================================

    except Exception as error:

        print(
            "CHATBOT ERROR:",
            error
        )


        return jsonify({

            "success": False,

            "reply":
                "Sorry, Saathi AI is currently unavailable."

        }), 500



# ==========================================
# 6. START CHATBOT SERVER
# ==========================================

if __name__ == "__main__":

    print(
        "Starting Saathi AI..."
    )


    print(
        "Chatbot URL: http://127.0.0.1:8000"
    )


    app.run(

        host="127.0.0.1",

        port=8000,

        debug=True

    )