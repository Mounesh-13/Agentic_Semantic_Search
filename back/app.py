from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# LangChain & Gemini integration
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SerpAPIWrapper
from langchain.agents import initialize_agent
from langchain.tools import Tool

# Load API keys
load_dotenv()
gemini_key = os.getenv("GOOGLE_API_KEY")
serpapi_key = os.getenv("SERPAPI_API_KEY")

app = Flask(__name__)
CORS(app)

# Set up LLM and Search Agent
llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-pro", temperature=0.7)
search = SerpAPIWrapper(serpapi_api_key=serpapi_key)
search_tool = Tool(
    name="Search",
    func=search.run,
    description="Searches the web for recent information."
)
agent = initialize_agent(
    [search_tool],
    llm,
    agent_type="zero-shot-react-description",
    handle_parsing_errors=True,
    max_iterations=15,  # Increase as needed
    max_execution_time=90  # seconds
)


@app.route('/api/search', methods=['POST'])
def api_search():
    data = request.get_json()
    query = data.get("query", "")
    try:
        # Use Gemini LLM directly for faster response
        answer = llm.invoke(query)
        # Return only the content field if present
        if hasattr(answer, "content"):
            return jsonify({"answer": answer.content})
        return jsonify({"answer": str(answer)})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"answer": "Error: " + str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Lightweight health check for quick readiness checks.

    Returns 200 OK with a small JSON payload so dev tooling and scripts
    can verify the server is up without invoking the LLM.
    """
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
