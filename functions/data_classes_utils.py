from dataclasses import fields, is_dataclass
import numpy as np
from typing import Any


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


def to_dict(obj: Any) -> dict:
    '''Converts an object to a dictionary, recursively converting any nested objects to dictionaries as well.'''
    if hasattr(obj, "to_dict"):
        return obj.to_dict()
    elif isinstance(obj, list):
        return [to_dict(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: to_dict(value) for key, value in obj.items()}
    else:
        return obj


def custom_asdict(obj: Any) -> dict:
    '''Converts a dataclass to a dictionary, recursively converting any nested dataclasses to dictionaries as well.'''
    if not is_dataclass(obj):
        return to_dict(obj)
    result = []
    for f in fields(obj):
        value = to_dict(getattr(obj, f.name))
        result.append((f.name, value))
    return dict(result)
