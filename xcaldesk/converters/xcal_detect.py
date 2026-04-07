from __future__ import annotations
from pathlib import Path


def sniff_file_header(path: Path, n: int = 2048) -> bytes:
    with open(path, "rb") as f:
        return f.read(n)
