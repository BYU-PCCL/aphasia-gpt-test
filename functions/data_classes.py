from dataclasses import dataclass, asdict
from data_classes_utils import convert_np_float32s, custom_asdict


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
    conversationType: str

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return custom_asdict(self)


@dataclass
class Bio:
    name: str
    age: int
    aboutMe: str

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return custom_asdict(self)


@dataclass
class TestCase:
    id: str
    dateCreatedUtc: float  # Unix timestamp
    dateUpdatedUtc: float  # Unix timestamp
    utterance: str
    context: Context
    bio: Bio
    goodCompletions: list[str]

    def to_dict(self):
        '''Converts the dataclass to a dictionary for serialization'''
        return custom_asdict(self)


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
