from typing import Any


def strip_id(document: dict[str, Any]) -> dict[str, Any]:
    document.pop("_id", None)
    return document
