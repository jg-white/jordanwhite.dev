from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from google.cloud import firestore

# Initialise Flask app
app = Flask(__name__)
CORS(app)

# Load environment variables from .env
load_dotenv()

db = firestore.Client()

def get_todays_date():
   current_date = datetime.now()
   return current_date.strftime('%d-%m-%Y')

@app.route('/get-daily-devops', methods=['GET'])
def get_daily_devops():
   today_date_id = get_todays_date()

   try:
      # Fetch the document by ID directly
      doc_ref = db.collection('daily_devops').document(today_date_id)
      doc = doc_ref.get()

      if doc.exists:
         # Convert document to JSON
         doc_data = doc.to_dict()
         return jsonify(doc_data), 200
      else:
         return jsonify({"error": "No document found for today's date"}), 404

   except Exception as e:
      return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
   app.run(host="0.0.0.0", port=8080, debug=True)
