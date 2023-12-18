from flask import Flask, request, jsonify, json
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import config
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=config.OpenAI_API_KEY)
os.environ["OPEN_API_KEY"] = config.OpenAI_API_KEY


           
@app.route('/transcript', methods=['POST'])
def transcript():
    data = json.loads(request.data)
    print("Message received in Python backend-string:", data['videoID'])
    # Send a response back to the extension if needed
    transcript = get_transcript(data['videoID'])
    answers = get_answers(transcript)
    print(answers)
    response = {
        "transcript": "OpenAI Answered The Transcript!"
    }
    return jsonify(response), 200

def get_transcript(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    transcript_msg = ' '.join([f"{data['start']}: {data['text']}," for data in transcript])
    print(transcript_msg)
    return transcript_msg

@app.route('/response', methods=['POST'])
def response_msg():
    data = json.loads(request.data)
    transcript = get_transcript(data['videoID'])
    user_input = data['user_input']
    user_input = transcript + "\n" + user_input
    response = {
        "answer": get_answers(user_input)
    }
    return jsonify(response), 200

def get_answers(prompt):
    messages =[{
        "role": "user",
         "content": prompt
    }]
    response = client.chat.completions.create(model=config.GPT_MODEL, messages=messages)
    return response.choices[0].message.content.strip()


if __name__ == '__main__':
    app.run(port=config.PORT)