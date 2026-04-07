from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from typing import List, Optional


@dataclass
class CaltermParam:
    name: str
    value: str
    units: str | None = None
    comment: str | None = None


@dataclass
class CaltermTable:
    x_name: str
    x_units: str | None
    y_name: str
    y_units: str | None
    points: List[tuple[float, float]]
    x_desc: str | None = None
    y_desc: str | None = None


@dataclass
class CaltermGroup:
    name: str
    description: str | None
    params: List[CaltermParam] = field(default_factory=list)
    tables: List[CaltermTable] = field(default_factory=list)


@dataclass
class CaltermSubfile:
    index: int
    groups: List[CaltermGroup] = field(default_factory=list)


@dataclass
class CaltermDoc:
    calterm_version: str | None = None
    product_id: str | None = None
    data_path: str | None = None
    config_path: str | None = None
    generated_at: str | None = None
    subfiles: List[CaltermSubfile] = field(default_factory=list)


HEADER_SEP = re.compile(r"^=+")
GROUP_LINE = re.compile(r"^GROUP:\s*(?P<name>[^-]+?)(?:\s*-+\s*(?P<desc>.*))?$")
SUBFILE_LINE = re.compile(r"^Subfile:\s*(?P<idx>\d+)\s*$")
X_AXIS_LINE = re.compile(r"^X:\s*(?P<name>[^()]+?)\s*\((?P<units>[^)]*)\)\s*-\s*(?P<desc>.*)$")
Y_AXIS_LINE = re.compile(r"^Y:\s*(?P<name>[^()]+?)\s*\((?P<units>[^)]*)\)\s*-\s*(?P<desc>.*)$")
COLUMN_HEADER = re.compile(r"^Name\s+Value\s+Units\s+Comment$")
DASH_SEP = re.compile(r"^-{5,}")


def is_calterm_txt(path: Path) -> bool:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            head = "\n".join([next(f) for _ in range(8)])
        return ("Calibration Document Report" in head) and ("Calterm Version" in head)
    except StopIteration:
        return False
    except Exception:
        return False


def parse_calterm_txt(path: Path) -> CaltermDoc:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        lines = [ln.rstrip("\n") for ln in f]

    i = 0
    n = len(lines)

    def next_line() -> str | None:
        nonlocal i
        if i >= n:
            return None
        s = lines[i]
        i += 1
        return s

    def peek_line() -> str | None:
        return lines[i] if i < n else None

    doc = CaltermDoc()

    # Parse header
    # Skip initial separator
    while (ln := next_line()) is not None:
        if "Calterm Version" in ln:
            # e.g. Calterm Version 5.7.0.022 (Woodpecker)
            doc.calterm_version = ln.strip().replace("Calterm Version", "").strip()
        elif ln.startswith("Selected Product ID:"):
            doc.product_id = ln.split(":", 1)[1].strip()
        elif ln.startswith("Data:"):
            doc.data_path = ln.split(":", 1)[1].strip()
        elif ln.startswith("Config:"):
            doc.config_path = ln.split(":", 1)[1].strip()
        elif ln.startswith("Report generated"):
            doc.generated_at = ln.strip()
        elif ln.startswith("Parameter Report"):
            break

    # Parse subfiles and groups
    cur_subfile: Optional[CaltermSubfile] = None
    cur_group: Optional[CaltermGroup] = None
    last_param: Optional[CaltermParam] = None

    while i < n:
        s = next_line()
        if s is None:
            break
        s_stripped = s.strip()
        if not s_stripped:
            continue

        # Subfile line
        m = SUBFILE_LINE.match(s_stripped)
        if m:
            cur_subfile = CaltermSubfile(index=int(m.group("idx")))
            doc.subfiles.append(cur_subfile)
            cur_group = None
            last_param = None
            continue

        # Group header
        m = GROUP_LINE.match(s_stripped)
        if m:
            name = m.group("name").strip()
            desc = (m.group("desc") or "").strip() or None
            cur_group = CaltermGroup(name=name, description=desc)
            if cur_subfile is None:
                cur_subfile = CaltermSubfile(index=-1)
                doc.subfiles.append(cur_subfile)
            cur_subfile.groups.append(cur_group)
            last_param = None
            # Skip the standard column headers if present
            while peek_line() is not None and (
                COLUMN_HEADER.match(peek_line().strip()) or DASH_SEP.match(peek_line().strip())
            ):
                next_line()
            continue

        # Table X/Y header
        m_x = X_AXIS_LINE.match(s_stripped)
        if m_x:
            # Read Y line next
            y_line = next_line() or ""
            m_y = Y_AXIS_LINE.match(y_line.strip())
            if not m_y:
                # Malformed; skip
                continue
            # Optional "X        Y" header line
            if peek_line() is not None and re.match(r"^\s*X\s+Y\s*$", peek_line().strip()):
                next_line()
            # Or column header like many spaces then X Y
            elif peek_line() is not None and re.match(r"^\s*X\s+Y$", peek_line().strip()):
                next_line()

            points: list[tuple[float, float]] = []
            while peek_line() is not None:
                pl = peek_line()
                if not pl.strip():
                    break
                if GROUP_LINE.match(pl.strip()) or SUBFILE_LINE.match(pl.strip()) or X_AXIS_LINE.match(pl.strip()):
                    break
                # Expect two columns numeric
                cols = re.split(r"\s+", pl.strip())
                if len(cols) >= 2:
                    try:
                        x = float(cols[0])
                        y = float(cols[1])
                        points.append((x, y))
                        next_line()
                        continue
                    except ValueError:
                        break
                else:
                    break
            table = CaltermTable(
                x_name=m_x.group("name").strip(),
                x_units=(m_x.group("units") or "").strip() or None,
                y_name=m_y.group("name").strip(),
                y_units=(m_y.group("units") or "").strip() or None,
                x_desc=(m_x.group("desc") or "").strip() or None,
                y_desc=(m_y.group("desc") or "").strip() or None,
                points=points,
            )
            if cur_group is None:
                cur_group = CaltermGroup(name="", description=None)
                if cur_subfile is None:
                    cur_subfile = CaltermSubfile(index=-1)
                    doc.subfiles.append(cur_subfile)
                cur_subfile.groups.append(cur_group)
            cur_group.tables.append(table)
            last_param = None
            continue

        # Parameter rows: often start with two spaces
        if s.startswith("  "):
            cols = re.split(r"\s{2,}", s.strip())
            if len(cols) >= 2:
                name = cols[0].strip()
                value = cols[1].strip()
                units = cols[2].strip() if len(cols) >= 3 else None
                comment = cols[3].strip() if len(cols) >= 4 else None
                param = CaltermParam(name=name, value=value, units=units or None, comment=comment or None)
                if cur_group is None:
                    cur_group = CaltermGroup(name="", description=None)
                    if cur_subfile is None:
                        cur_subfile = CaltermSubfile(index=-1)
                        doc.subfiles.append(cur_subfile)
                    cur_subfile.groups.append(cur_group)
                cur_group.params.append(param)
                last_param = param
                continue

        # Continuation lines for comments (no indent)
        if last_param is not None and not s.startswith("  ") and not GROUP_LINE.match(s_stripped) and not SUBFILE_LINE.match(s_stripped) and not HEADER_SEP.match(s_stripped):
            extra = s.strip()
            if extra:
                last_param.comment = ((last_param.comment + "\n" + extra) if last_param.comment else extra)
            continue

        # Skip any separators or unrecognized lines
        continue

    return doc


def calterm_txt_to_xml_xcal(src_txt: Path, dst_xcal: Path) -> None:
    doc = parse_calterm_txt(src_txt)

    root = ET.Element(
        "CaltermReport",
        {
            **({"calterm_version": doc.calterm_version} if doc.calterm_version else {}),
            **({"product_id": doc.product_id} if doc.product_id else {}),
        },
    )

    if doc.data_path:
        ET.SubElement(root, "Data").text = doc.data_path
    if doc.config_path:
        ET.SubElement(root, "Config").text = doc.config_path
    if doc.generated_at:
        ET.SubElement(root, "GeneratedAt").text = doc.generated_at

    for sf in doc.subfiles:
        sf_el = ET.SubElement(root, "Subfile", {"index": str(sf.index)})
        for grp in sf.groups:
            g_attrs = {"name": grp.name}
            if grp.description:
                g_attrs["description"] = grp.description
            g_el = ET.SubElement(sf_el, "Group", g_attrs)
            # Params
            for p in grp.params:
                attrs = {"name": p.name}
                if p.units:
                    attrs["units"] = p.units
                p_el = ET.SubElement(g_el, "Param", attrs)
                p_el.text = p.value
                if p.comment:
                    c_el = ET.SubElement(p_el, "Comment")
                    c_el.text = p.comment
            # Tables
            for t in grp.tables:
                t_attrs = {
                    "x_name": t.x_name,
                    "y_name": t.y_name,
                }
                if t.x_units:
                    t_attrs["x_units"] = t.x_units
                if t.y_units:
                    t_attrs["y_units"] = t.y_units
                t_el = ET.SubElement(g_el, "Table", t_attrs)
                if t.x_desc:
                    ET.SubElement(t_el, "XDesc").text = t.x_desc
                if t.y_desc:
                    ET.SubElement(t_el, "YDesc").text = t.y_desc
                for x, y in t.points:
                    ET.SubElement(t_el, "Point", {"x": f"{x}", "y": f"{y}"})

    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ", level=0)
    tree.write(dst_xcal, encoding="utf-8", xml_declaration=True)
