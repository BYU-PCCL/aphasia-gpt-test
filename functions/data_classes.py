from dataclasses import dataclass, asdict
import numpy as np


@dataclass
class Prompt:
    id: int
    prompt: str

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return asdict(self)


@dataclass
class Context:
    setting: str
    tone: str
    conversation_type: str

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return asdict(self)


@dataclass
class Bio:
    name: str
    age: int
    about_me: str

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return asdict(self)


@dataclass
class TestCase:
    id: int
    utterance: str
    context: Context
    bio: Bio
    good_completions: list[str]

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return asdict(self)


@dataclass
class CaseScore:
    test_case_id: int
    cosine_similarity_score: float

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return convert_np_float32s(asdict(self))


@dataclass
class TestResults:
    prompt_id: int
    openai_model: str
    embeddings_model: str
    temperature: float
    max_tokens: int
    num_responses: int
    scores: list[CaseScore]
    average_cosine_similarity_score: float

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return convert_np_float32s(asdict(self))


def convert_np_float32s(obj):
    '''Converts all numpy float32s to regular floats at any level of a dictionary or list.'''
    if isinstance(obj, dict):
        return {k: convert_np_float32s(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_np_float32s(v) for v in obj]
    elif isinstance(obj, np.float32):
        return float(obj)
    else:
        return obj
