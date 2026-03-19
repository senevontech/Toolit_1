"use client";

import { useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, ArrowUp, ArrowDown, X, Download } from "lucide-react";
import { downloadFile } from "@/lib/downloadUtils";

const isPDF = (f: File) =>
  f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

export default function MergePDF() {
  const [files, setFiles]           = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const label = useMemo(() => {
    if (!files.length) return "No PDFs selected yet";
    return files.length === 1 ? "1 PDF ready" : `${files.length} PDFs ready`;
  }, [files.length]);

  const add = (incoming: FileList | File[]) => {
    const picked = Array.from(incoming).filter(isPDF);
    if (!picked.length) { setError("Please choose valid PDF files."); return; }
    setError(null);
    setFiles((prev) => {
      const next = [...prev];
      for (const f of picked) {
        if (!next.some((e) => e.name === f.name && e.size === f.size)) next.push(f);
      }
      return next;
    });
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) add(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    add(e.dataTransfer.files);
  };

  const move = (i: number, dir: number) =>
    setFiles((prev) => {
      const next = [...prev], t = i + dir;
      if (t < 0 || t >= next.length) return prev;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });

  const remove = (i: number) => setFiles((prev) => prev.filter((_, j) => j !== i));

  const merge = async () => {
    if (files.length < 2) { setError("Upload at least 2 PDFs to merge."); return; }
    setLoading(true); setError(null);
    try {
      const out = await PDFDocument.create();
      for (const file of files) {
        const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await out.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      downloadFile(new File([new Uint8Array(await out.save())], "merged.pdf", { type: "application/pdf" }));
    } catch {
      setError("Could not merge these PDFs. Try standard PDF files without password protection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1.1rem" }}>

      {/* Drop zone */}
      <div
        className="upload-zone"
        style={dragActive ? {
          outlineColor: "var(--orange)",
          boxShadow: "inset 7px 7px 16px rgba(163,177,198,.6),inset -7px -7px 16px rgba(255,255,255,.9),0 0 0 3px rgba(249,115,22,.2)",
        } : {}}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
      >
        <Upload size={30} strokeWidth={1.8} style={{ color: "var(--orange)", opacity: .8 }} />
        <p style={{ fontWeight: 600, color: "#5c4f47", margin: 0, fontSize: ".95rem" }}>
          {dragActive ? "Drop PDFs here…" : "Drag & drop PDF files or tap below"}
        </p>
        <p style={{ fontSize: ".78rem", color: "#a09080", margin: 0 }}>{label}</p>
        <input
          type="file" accept=".pdf,application/pdf" multiple onChange={onInput}
          style={{
            padding: ".55rem 1rem", borderRadius: ".85rem", border: "none",
            background: "linear-gradient(145deg,#f3f3f3,#ded8d1)",
            boxShadow: "5px 5px 10px rgba(148,148,148,.16),-4px -4px 8px rgba(255,255,255,.76)",
            color: "#5c4f47", fontSize: ".83rem", cursor: "pointer",
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: ".75rem 1rem", borderRadius: ".9rem",
          background: "linear-gradient(145deg,#ffe1d6,#efc1b0)",
          boxShadow: "5px 5px 10px rgba(181,102,73,.16),-4px -4px 8px rgba(255,241,235,.72)",
          color: "#9b3412", fontSize: ".87rem", fontWeight: 600,
        }}>
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: "grid", gap: ".6rem" }}>
          {files.map((file, i) => (
            <div
              key={`${file.name}-${file.lastModified}-${i}`}
              className="neu-inset-panel"
              style={{ padding: ".75rem 1rem", display: "flex", alignItems: "center", gap: ".75rem" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: ".87rem", color: "#4e433d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {file.name}
                </p>
                <p style={{ margin: ".1rem 0 0", fontSize: ".72rem", color: "#a09080" }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div style={{ display: "flex", gap: ".4rem", flexShrink: 0 }}>
                {[
                  { icon: <ArrowUp size={13} />, fn: () => move(i, -1), label: "Move up",   danger: false },
                  { icon: <ArrowDown size={13} />, fn: () => move(i, 1),  label: "Move down", danger: false },
                  { icon: <X size={13} />,          fn: () => remove(i),  label: "Remove",    danger: true  },
                ].map(({ icon, fn, label: lbl, danger }) => (
                  <button
                    key={lbl}
                    type="button"
                    aria-label={lbl}
                    onClick={fn}
                    style={{
                      width: "2rem", height: "2rem", border: "none", borderRadius: ".6rem",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      background: danger
                        ? "linear-gradient(145deg,#ffe1d6,#efc1b0)"
                        : "linear-gradient(145deg,#f3f3f3,#ded8d1)",
                      color: danger ? "#9b3412" : "#7a6a60",
                      boxShadow: "4px 4px 8px rgba(148,148,148,.14),-3px -3px 6px rgba(255,255,255,.78)",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn" type="button" onClick={merge} disabled={loading}>
        <Download size={15} />
        {loading ? "Merging…" : "Merge PDFs"}
      </button>

    </div>
  );
}
