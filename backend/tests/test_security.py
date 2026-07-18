"""Unit tests for input sanitization helpers."""
import pytest

from backend.core.security import sanitize_text


def test_sanitize_text_strips_control_characters():
    result = sanitize_text("Hello\x00World")
    assert result == "HelloWorld"


def test_sanitize_text_truncates_long_input():
    result = sanitize_text("a" * 5000, max_length=10)
    assert len(result) == 10


def test_sanitize_text_rejects_empty_string():
    with pytest.raises(ValueError):
        sanitize_text("   ")


def test_sanitize_text_rejects_non_string():
    with pytest.raises(ValueError):
        sanitize_text(123)  # type: ignore[arg-type]
