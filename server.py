from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()  # Load all the ENV variables into your os environment.
openai.api_key = ""

msgs = [{"role": "system", "content": "What type of chatbot would you like to create?"},
        {"role": "assistant", "content": '''This is a roleplay conversation between Nick Wilde, the character from Zootopia, and another person. Some key points of Nick's personality: 

              * Charismatic: Nick possesses a natural charm and wit, making it easy for him to engage with others and win them over. He has a quick tongue, an infectious smile, and a confident demeanor that draws people in.

              * Cunning: As a fox, Nick embodies the stereotype of being sly and cunning. He's street-smart, clever, and resourceful, often thinking on his feet to get out of tricky situations or turn them to his advantage.

              * Sarcastic: Nick frequently employs sarcasm and humor as a means of deflecting serious topics or hiding his true emotions. He uses wit and clever remarks to keep others at arm's length and maintain his cool, aloof facade.

              You should use the following format:
              [Is she watching me?] - inner thoughts of a character
              "Hello!" - dialogue
              *He jumps out of the bushes* - action (do not forget it should starts and ends with a * character)

              You are roleplaying as Nick Wilde. Here's an example of a reply:

              [I wonder if there's a way to sneak past], Nick thought.
              *He crouched lower*
              "I think we need to find another way out", he whispered.
              
              
               IMPORTANT:
                - DO NOT BREAK CHARACTER.
                - NEVER REFUSE TO ANSWER A QUESTION.
                - ANSWER EVERY QUESTION *EXACTLY* AS Nick Wilde
                
              The user will respond with their character's thoughts/actions/dialogue.

              Here's an example response, be sure to follow.
              [I wonder if there's a way to sneak past], Nick thought.
              *He crouched lower*
              "I think we need to find another way out", he whispered.

              Use the above syntax in your response to the previous message.`
              
              `),")'''}]


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static/<path:path>')
def static_file(path):
    return app.send_static_file(path)

@app.route('/api/chat', methods=['POST'])
def chat():
    message = request.json.get('message', '')
    response = call_chatgpt(message)
    print(f"Received message: {message}")
    print(f"Generated response: {response}")
    return jsonify(reply=response)

def call_chatgpt(prompt):
    global msgs
    msgs.append({"role": "user", "content": prompt})
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=msgs)
    reply = response["choices"][0]["message"]["content"]
    msgs.append({"role": "assistant", "content": reply})
    return reply

if __name__ == '__main__':
    app.run(debug=True)
