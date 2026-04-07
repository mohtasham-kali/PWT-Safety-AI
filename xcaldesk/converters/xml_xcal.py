from __future__ import annotations
from pathlib import Path
import xml.etree.ElementTree as ET
from typing import Iterable


def is_xml_xcal_file(path: Path) -> bool:
    try:
        with open(path, "rb") as f:
            head = f.read(256)
        # Heuristic: XML preamble or starts with a '<'
        return head.lstrip().startswith(b"<?xml") or head.lstrip().startswith(b"<")
    except Exception:
        return False


def _flatten_element(elem: ET.Element, prefix: str = "") -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    # Attributes as key-value pairs
    for k, v in elem.attrib.items():
        key = f"{prefix}@{k}" if prefix else f"@{k}"
        rows.append((key, v))

    # Text
    text = (elem.text or "").strip()
    if text:
        key = f"{prefix}#text" if prefix else "#text"
        rows.append((key, text))

    # Children
    for child in list(elem):
        tag = child.tag
        child_prefix = f"{prefix}/{tag}" if prefix else tag
        rows.extend(_flatten_element(child, child_prefix))

    return rows


def xml_xcal_to_txt(src: Path, dst: Path) -> None:
    tree = ET.parse(src)
    root = tree.getroot()
    rows = _flatten_element(root)

    # Write as simple key=value lines
    with open(dst, "w", encoding="utf-8") as f:
        f.write("# XcalDesk flattened XML export\n")
        f.write("# Keys use XPath-like paths; attributes prefixed with '@', node text as '#text'\n")
        for key, val in rows:
            # Escape newlines
            safe_val = val.replace("\n", "\\n")
            f.write(f"{key} = {safe_val}\n")


def _ensure_path(root: ET.Element, path_parts: list[str]) -> ET.Element:
    cur = root
    for part in path_parts:
        # Skip empty parts (could happen if path starts with '/')
        if not part:
            continue
        node = cur.find(part)
        if node is None:
            node = ET.SubElement(cur, part)
        cur = node
    return cur


def txt_to_xml_xcal(src_txt: Path, dst_xcal: Path, base_xml: Path | None = None) -> None:
    if base_xml is not None:
        tree = ET.parse(base_xml)
        root = tree.getroot()
    else:
        root = ET.Element("Xcal")
        tree = ET.ElementTree(root)

    if not src_txt.exists():
        raise ValueError(f"Input not found: {src_txt}")

    with open(src_txt, "r", encoding="utf-8") as f:
        for line in f:
            s = line.strip()
            if not s or s.startswith("#"):
                continue
            if "=" not in s:
                raise ValueError(f"Invalid line (expected key = value): {line.rstrip()}")
            key, val = s.split("=", 1)
            key = key.strip()
            val = val.strip()
            val = val.replace("\\n", "\n")

            # Parse key
            # Support attribute '@attr' and text '#text'
            if key.endswith("#text"):
                path = key[:-6]
                parts = [p for p in path.split("/") if p]
                elem = _ensure_path(root, parts)
                elem.text = val
            elif "@" in key:
                # attribute
                if key.count("@") > 1:
                    raise ValueError(f"Invalid key with multiple attributes: {key}")
                path, attr = key.split("@", 1)
                parts = [p for p in path.split("/") if p]
                elem = _ensure_path(root, parts)
                elem.set(attr, val)
            else:
                # Treat key as path to a node's text
                parts = [p for p in key.split("/") if p]
                elem = _ensure_path(root, parts)
                elem.text = val

    # Pretty print (minimal)
    ET.indent(tree, space="  ", level=0)
    tree.write(dst_xcal, encoding="utf-8", xml_declaration=True)
