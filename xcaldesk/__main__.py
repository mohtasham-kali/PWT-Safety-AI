import argparse
import sys
from pathlib import Path

from .gui import launch_gui
from .converters.xml_xcal import (
    xml_xcal_to_txt,
    txt_to_xml_xcal,
    is_xml_xcal_file,
)
from .config import load_config


def cmd_xcal_to_txt(src: Path, dst: Path) -> int:
    # Automatic detection: if XML, convert directly; otherwise, error with guidance.
    if is_xml_xcal_file(src):
        xml_xcal_to_txt(src, dst)
        return 0

    # Placeholder for future: integrate Calterm CLI or other formats
    sys.stderr.write(
        f"Unsupported .Xcal format for {src}. If this is a Calterm TXT-compatible export, please share sample files so we can add a plugin.\n"
    )
    return 2


def cmd_txt_to_xcal(src: Path, dst: Path, base_xcal: Path | None) -> int:
    # If the destination should be XML-based, reconstruct from flattened text
    try:
        txt_to_xml_xcal(src, dst, base_xml=base_xcal)
        return 0
    except ValueError as e:
        sys.stderr.write(str(e) + "\n")
        return 2


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="xcaldesk", description="Convert .Xcal <-> .txt and launch GUI.")
    sub = p.add_subparsers(dest="cmd", required=True)

    gui_p = sub.add_parser("gui", help="Launch desktop GUI")

    conv_p = sub.add_parser("convert", help="Convert files")
    conv_sub = conv_p.add_subparsers(dest="conv_cmd", required=True)

    x2t = conv_sub.add_parser("xcal-to-txt", help="Convert .Xcal to .txt")
    x2t.add_argument("src", type=Path)
    x2t.add_argument("dst", type=Path)

    t2x = conv_sub.add_parser("txt-to-xcal", help="Convert .txt to .Xcal")
    t2x.add_argument("src", type=Path)
    t2x.add_argument("dst", type=Path)
    t2x.add_argument("--base-xcal", type=Path, default=None, help="Optional base XML .Xcal to use as a template")

    return p


def main(argv: list[str] | None = None) -> int:
    _ = load_config()  # Currently unused placeholder for future options
    parser = build_parser()
    ns = parser.parse_args(argv)

    if ns.cmd == "gui":
        launch_gui()
        return 0

    if ns.cmd == "convert":
        if ns.conv_cmd == "xcal-to-txt":
            return cmd_xcal_to_txt(ns.src, ns.dst)
        elif ns.conv_cmd == "txt-to-xcal":
            return cmd_txt_to_xcal(ns.src, ns.dst, ns.base_xcal)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
