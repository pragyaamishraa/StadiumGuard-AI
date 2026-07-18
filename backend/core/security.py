"""
Lightweight input validation / sanitization helpers.

These are defensive utilities used across routers to make sure user-supplied
text is safe to log, store, and pass to the LLM (basic length limits and
control-character stripping — not a substitute for a WAF in production).
"""
import re

_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")

MAX_MESSAGE_LENGTH = 2000


def sanitize_text(value: str, max_length: int = MAX_MESSAGE_LENGTH) -> str:
    """Strip control characters and enforce a max length on free-text input."""
    if not isinstance(value, str):
        raise ValueError("Input must be a string")
    cleaned = _CONTROL_CHARS.sub("", value).strip()
    if not cleaned:
        raise ValueError("Input cannot be empty")
    return cleaned[:max_length]


def is_supported_language(code: str, supported: set[str]) -> bool:
    """Validate a language code against the set of supported languages."""
    return code in supported
