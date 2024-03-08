import datetime
import json
from dotenv import load_dotenv
import numpy as np
import torch
from angle_emb import AnglE
from openai import OpenAI
from data_classes import CaseScore, Prompt, Context, Bio, TestCase, TestResults

# Load the environment variables and set constants
load_dotenv()
openai_client = OpenAI()
OPENAI_MODEL = "gpt-3.5-turbo"
TEMPERATURE = 0.7
MAX_TOKENS = 50
NUM_RESPONSES = 4
EMBEDDING_MODEL_NAME = 'WhereIsAI/UAE-Large-V1'


def embed_texts(texts: list[str]) -> np.ndarray:
    # Check if the model exists
    try:
        angle = AnglE.from_pretrained(
            EMBEDDING_MODEL_NAME, pooling_strategy='cls')
    except Exception as e:
        raise ValueError(
            f"Failed to load the model '{EMBEDDING_MODEL_NAME}'. Error: {str(e)}")

    # Check if CUDA is available, if not use CPU
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    angle = angle.to(device)

    embeddings = angle.encode(texts, to_numpy=True)
    # np.save("./embs.npy", embeddings)  # TODO: Not sure what we want to do here
    return embeddings


def cosine_similarity(embed1: np.ndarray, embed2: np.ndarray) -> float:
    '''
        Compares two embedding vectors and returns the cosine similarity.
        Output range is from -1 to 1, where 1 means the vectors are identical.
    '''
    return np.dot(embed1, embed2) / (np.linalg.norm(embed1) * np.linalg.norm(embed2))


def get_gpt_completion(prompt: str) -> list[str]:
    '''Makes a request to the OpenAI API and returns the response'''
    chat_completion = openai_client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=OPENAI_MODEL,
        max_tokens=MAX_TOKENS,
        temperature=TEMPERATURE,
        n=NUM_RESPONSES
    )

    return [choice.message.content for choice in chat_completion.choices]


def test_prompt(prompt: Prompt, test_cases: list[TestCase]) -> TestResults:
    '''Executes each test case against the given prompt and prints the score'''
    scores: list[CaseScore] = []
    for test_case in test_cases:
        gpt_completions = get_gpt_completion(prompt.prompt.format(
            utterance=test_case.utterance,
            setting=test_case.context.setting,
            tone=test_case.context.tone,
            conversation_type=test_case.context.conversationType,
            name=test_case.bio.name,
            age=test_case.bio.age,
            about_me=test_case.bio.aboutMe
        ))
        print(f"Test case {test_case.id} against prompt {prompt.id}")
        print(f"GPT completions: {gpt_completions}")

        # Get the embeddings for the GPT responses and the good responses
        gpt_embeddings = embed_texts(gpt_completions)
        good_embeddings = embed_texts(test_case.goodCompletions)

        # Average the embeddings
        avg_gpt_embedding = np.mean(gpt_embeddings, axis=0)
        avg_good_embedding = np.mean(good_embeddings, axis=0)

        # Compare the embeddings and store the score
        cosine_similarity_score = cosine_similarity(
            avg_gpt_embedding, avg_good_embedding)
        scores.append(
            CaseScore(test_case.id, cosine_similarity_score))

    avg_cosine_similarity_score = np.mean(
        [score.cosine_similarity_score for score in scores])
    print(f"Average cosine similarity score: {avg_cosine_similarity_score}")

    return TestResults(
        prompt.id,
        OPENAI_MODEL,
        EMBEDDING_MODEL_NAME,
        TEMPERATURE,
        MAX_TOKENS,
        NUM_RESPONSES,
        scores,
        avg_cosine_similarity_score
    )
