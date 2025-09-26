from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from pathlib import Path

# LangChain & Gemini integration
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SerpAPIWrapper
from langchain.agents import initialize_agent
from langchain.tools import Tool

# Load API keys
load_dotenv()
gemini_key = os.getenv("GOOGLE_API_KEY")
serpapi_key = os.getenv("SERPAPI_API_KEY")

CORS(app)

# Serve React frontend from front/build when available (production)
front_build_path = Path(__file__).resolve().parent.joinpath('..', 'front', 'build')
front_build_path = str(front_build_path)

app = Flask(__name__, static_folder=front_build_path, static_url_path='/')
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
    # In local/dev we keep debug on, but in production Gunicorn will be used.
    debug_flag = os.getenv('FLASK_DEBUG', 'True').lower() in ('1', 'true', 'yes')
    app.run(host="0.0.0.0", port=int(os.getenv('PORT', 5000)), debug=debug_flag)


# Serve React's index.html for any other route (client-side routing support)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve the React app's static files. If a file isn't found, return index.html

    This allows client-side routing to work when the app is deployed as a
    single container that serves both API and frontend.
    """
    try:
        # If the requested resource exists in the build static folder, serve it
        if path != "" and (Path(app.static_folder) / path).exists():
            return send_from_directory(app.static_folder, path)
        # Otherwise serve index.html
        return send_from_directory(app.static_folder, 'index.html')
    except Exception:
        return jsonify({'status': 'error', 'message': 'Frontend not built'}), 500
