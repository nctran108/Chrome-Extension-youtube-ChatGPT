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

@app.route('/response', methods=['POST'])
def response_msg():
    # load data from frontend
    data = json.loads(request.data)
    # get video transcript
    transcript = get_transcript(data['videoID'])
    # add user question to the transcript
    user_input = data['user_input']
    user_input = transcript + "\n" + user_input
    # ask openai
    response = {
        "answer": get_answers(user_input)
    }
    # return the response to frontend
    return jsonify(response), 200

def get_transcript(video_id):
    # use youtube api to get the video transcript
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    # convert it to string that include time and transcript
    transcript_msg = ' '.join([f"{data['start']}: {data['text']}," for data in transcript])
    print(transcript_msg)
    return transcript_msg

def get_answers(prompt):
    messages =[{
        "role": "user",
         "content": prompt
    }]
    # get openai response
    response = client.chat.completions.create(model=config.GPT_MODEL, messages=messages)
    return response.choices[0].message.content.strip()


if __name__ == '__main__':
    app.run(port=config.PORT)