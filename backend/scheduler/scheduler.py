from datetime import datetime, timedelta
import json
import os
import time
import openai
from google.cloud import firestore


# Set OpenAI API key from environment variables
openai.api_key = os.getenv('OPENAI_KEY')

def get_date_from_days(days_from_now):
   """
   Calculate a future date based on the number of days from today.

   Args:
   days_from_now (int): Number of days from the current date

   Returns:
   str: Future date formatted as 'DD-MM-YYYY'
   """
   # Get the current date
   current_date = datetime.now()

   # Calculate the future date
   future_date = current_date + timedelta(days=days_from_now)

   # Format the date as a string and return it
   return future_date.strftime('%d-%m-%Y')

def wait_for_run_completion(thread_id, run_id, timeout=300, poll_interval=5):
   """
   Poll the status of a run until completion or timeout.

   Args:
   thread_id (str): The ID of the thread
   run_id (str): The ID of the run
   timeout (int): Maximum time in seconds to wait for the run to complete
   poll_interval (int): Time in seconds between status checks

   Returns:
   str or None: Status of the run if completed or None if timed out
   """
   start_time = time.time()
   while time.time() - start_time < timeout:
      run = openai.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
      run_status = run.status
      if run_status == 'completed':
         return run_status
      time.sleep(poll_interval)
   return None

def send_message(assistant_id, thread_id, query, timeout=300):
   """
   Send a query message to OpenAI assistant and wait for the response.

   Args:
   assistant_id (str): The ID of the assistant
   thread_id (str): The ID of the thread
   query (str): The query message to be sent
   timeout (int): Maximum time in seconds to wait for a response

   Returns:
   dict or None: JSON response from the assistant or None if an error occurs
   """
   message = openai.beta.threads.messages.create(
      thread_id=thread_id,
      role="user",
      content=query,
   )
   run = openai.beta.threads.runs.create(thread_id=thread_id, assistant_id=assistant_id)
   run_status = wait_for_run_completion(thread_id, run.id, timeout=timeout)

   if run_status:
      # Retrieve messages from the completed run
      messages = list(openai.beta.threads.messages.list(thread_id=thread_id, run_id=run.id))
      if messages and messages[0].content:
         try:
            # Decode JSON response
            response_text = messages[0].content[0].text.value
            json_data = json.loads(response_text)
            return json_data
         except (json.JSONDecodeError, AttributeError) as e:
            print(f"Error decoding JSON: {e}")
            return None
   return None

def main():
   """
   Main function to generate daily DevOps tips.

   Fetches DevOps tips for the upcoming week.
   """
   assistant_id = os.getenv('ASSISTANT_ID')

   # Using one thread keeps previous tokens to evaulative e.g. not same devops tips showing up.
   thread_id = os.getenv('THREAD_ID')

   daily_devops = []

   for i in range(1, 8):
      input_query = f"Using the daily_devops schema, give me a daily_devops JSON for date: {get_date_from_days(i)}. Use UK English. Do not give tips that were already given in this thread."
      response = send_message(assistant_id, thread_id, input_query)
      daily_devops.append(response)
   
   db = firestore.Client()
   for item in daily_devops:
      doc_ref = db.collection(u'daily_devops').document(item['date'])
      doc_ref.set(item)

if __name__ == "__main__":
   main()