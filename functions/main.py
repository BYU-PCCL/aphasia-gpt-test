import json
from firebase_functions import firestore_fn, https_fn, options
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from data_classes import Bio, Prompt, TestCase, Context
from test_prompt import test_prompt

initialize_app()


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["http://localhost:3000"],
        cors_methods=["POST"]
    )
)
def testPrompt(req: https_fn.Request) -> https_fn.Response:
    """Take the prompt parameter and run the test cases against it."""
    data = req.get_json()
    prompt = data['prompt'] if 'prompt' in data else None
    if prompt is None:
        return https_fn.Response("No prompt parameter provided", status=400)

    test_cases_json = json.loads('''
        [
          {
            "id": 1,
            "utterance": "table book help",
            "context": {
              "setting": "home",
              "tone": "neutral",
              "conversation_type": "chat"
            },
            "bio": {
              "name": "Jimmy Lee",
              "age": 36,
              "about_me": "I am an accountant from Montana. I have 3 kids and a dog. I love to hike and fish."
            },
            "good_completions": [
              "Can you hand me that book on the table?",
              "I need a table or something to put my book on.",
              "The table has too many books on it.",
              "See that self-help book on that table?",
              "Please set this book on the table."
            ]
          },
          {
            "id": 2,
            "utterance": "i sandwich eat not not",
            "context": {
              "setting": "home",
              "tone": "neutral",
              "conversation_type": "chat"
            },
            "bio": {
              "name": "Phil Johnson",
              "age": 59,
              "about_me": "Retired teacher. Live in NYC."
            },
            "good_completions": [
              "I want a sandwich, but not right now.",
              "I'm not going to eat a sandwich.",
              "I'm allergic to that sandwich and won't eat it.",
              "I don't know what I want for lunch, but probably not a sandwich.",
              "Are you going to eat a sandwich right now?",
              "I can make a sandwich now for you if you'd like."
            ]
          }
        ]
      ''')

    test_cases = [TestCase(id=case['id'], utterance=case['utterance'], context=Context(
        **case['context']), bio=Bio(**case['bio']), good_completions=case['good_completions']) for case in test_cases_json]
    test_cases = test_cases[:1]  # DELETE ME

    prompt_obj = Prompt(1, prompt)
    test_results = test_prompt(prompt_obj, test_cases)
    test_results_dict = test_results.to_dict()
    return https_fn.Response(json.dumps(test_results_dict))
