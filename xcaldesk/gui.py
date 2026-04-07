from __future__ import annotations
import tkinter as tk
from tkinter import filedialog, messagebox
from pathlib import Path

from .converters.xml_xcal import is_xml_xcal_file, xml_xcal_to_txt, txt_to_xml_xcal


def launch_gui() -> None:
    root = tk.Tk()
    root.title("XcalDesk")
    root.geometry("520x220")

    state: dict[str, Path | None] = {"src": None, "dst": None}

    def pick_src():
        p = filedialog.askopenfilename(title="Select source (.xcal or .txt)")
        if p:
            state["src"] = Path(p)
            src_var.set(p)

    def pick_dst():
        p = filedialog.asksaveasfilename(title="Select destination file")
        if p:
            state["dst"] = Path(p)
            dst_var.set(p)

    def do_xcal_to_txt():
        src = state.get("src")
        dst = state.get("dst")
        if not src or not dst:
            messagebox.showerror("Error", "Please choose both source and destination files.")
            return
        try:
            if is_xml_xcal_file(src):
                xml_xcal_to_txt(src, dst)
                messagebox.showinfo("Success", f"Converted to {dst}")
            else:
                messagebox.showerror("Unsupported format", "Non-XML .Xcal not supported yet. Please provide sample files to add a plugin.")
        except Exception as e:
            messagebox.showerror("Conversion failed", str(e))

    def do_txt_to_xcal():
        src = state.get("src")
        dst = state.get("dst")
        if not src or not dst:
            messagebox.showerror("Error", "Please choose both source and destination files.")
            return
        try:
            txt_to_xml_xcal(src, dst)
            messagebox.showinfo("Success", f"Converted to {dst}")
        except Exception as e:
            messagebox.showerror("Conversion failed", str(e))

    frm = tk.Frame(root, padx=12, pady=12)
    frm.pack(fill=tk.BOTH, expand=True)

    src_var = tk.StringVar()
    dst_var = tk.StringVar()

    tk.Label(frm, text="Source file (.xcal/.txt)").grid(row=0, column=0, sticky="w")
    tk.Entry(frm, textvariable=src_var, width=52).grid(row=1, column=0, sticky="ew")
    tk.Button(frm, text="Browse...", command=pick_src).grid(row=1, column=1)

    tk.Label(frm, text="Destination file").grid(row=2, column=0, sticky="w", pady=(8, 0))
    tk.Entry(frm, textvariable=dst_var, width=52).grid(row=3, column=0, sticky="ew")
    tk.Button(frm, text="Browse...", command=pick_dst).grid(row=3, column=1)

    btns = tk.Frame(frm)
    btns.grid(row=4, column=0, columnspan=2, pady=(12, 0))

    tk.Button(btns, text="Xcal → TXT", command=do_xcal_to_txt).pack(side=tk.LEFT, padx=6)
    tk.Button(btns, text="TXT → Xcal", command=do_txt_to_xcal).pack(side=tk.LEFT, padx=6)

    root.mainloop()
