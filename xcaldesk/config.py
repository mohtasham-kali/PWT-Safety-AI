from __future__ import annotations
from pathlib import Path
import json
import os

CONFIG_DIR = Path(os.path.expanduser("~/.config/xcaldesk"))
CONFIG_FILE = CONFIG_DIR / "config.json"


def load_config() -> dict:
    try:
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return {}
