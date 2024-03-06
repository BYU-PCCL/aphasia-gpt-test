import json
from firebase_functions import firestore_fn, https_fn
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from data_classes import Bio, Prompt, TestCase, Context
from test_prompt import test_prompt

initialize_app()


@https_fn.on_call()
def testPrompt(req: https_fn.CallableRequest):
    """Take the prompt parameter and run the test cases against it."""
    prompt = req.data['prompt']
    if prompt is None:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                                  message="No prompt parameter provided")

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

    # test_cases = [TestCase(**test_case) for test_case in test_cases_json]
    test_cases = [TestCase(id=case['id'], utterance=case['utterance'], context=Context(
        **case['context']), bio=Bio(**case['bio']), good_completions=case['good_completions']) for case in test_cases_json]
    test_cases = test_cases[:1]  # TODO: DELETE ME

    # Prepare the
    print("test cases: ", test_cases)

    prompt_obj = Prompt(1, prompt)
    test_results = test_prompt(prompt_obj, test_cases)

    return test_results.to_dict()


@https_fn.on_call()
def addmessage(req: https_fn.CallableRequest):
    """Take the text parameter passed to this HTTP endpoint and insert it into
    a new document in the messages collection."""
    # Grab the text parameter.
    # original = req.args.get("text")
    data = req.data
    print("data: ", data)
    original = data['text']
    if original is None:
        raise https_fn.HttpsError(code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                                  message="No text parameter provided")

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection(
        "messages").add({"original": original})

    # Send back a message that we've successfully written the message
    # return https_fn.Response(f"Message with ID {doc_ref.id} added.")
    return {"message": f"Message with ID {doc_ref.id} added."}


@firestore_fn.on_document_created(document="messages/{pushId}")
def makeuppercase(event: firestore_fn.Event[firestore_fn.DocumentSnapshot | None]) -> None:
    """Listens for new documents to be added to /messages. If the document has
    an "original" field, creates an "uppercase" field containg the contents of
    "original" in upper case."""

    # Get the value of "original" if it exists.
    if event.data is None:
        return
    try:
        original = event.data.get("original")
    except KeyError:
        # No "original" field, so do nothing.
        return

    # Set the "uppercase" field.
    print(f"Uppercasing {event.params['pushId']}: {original}")
    upper = original.upper()
    event.data.reference.update({"uppercase": upper})
