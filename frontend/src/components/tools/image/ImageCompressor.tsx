"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Upload, X, Download, Archive } from "lucide-react";
import { downloadFile, downloadAllFiles } from "@/lib/downloadUtils";

type FileWithPreview = { file: File; preview: string };

const fmt = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
};

export default function ImageCompressor() {
  const [files, setFiles]               = useState<FileWithPreview[]>([]);
  const [compressed, setCompressed]     = useState<File[]>([]);
  const [targetSizeKB, setTargetSizeKB] = useState(300);
  const [loading, setLoading]           = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setFiles((prev) => [...prev, { file, preview: reader.result as string }]);
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop,
  });

  const remove = (name: string) => {
    setFiles((prev) => prev.filter((i) => i.file.name !== name));
    setCompressed([]);
  };

  const handleCompress = async () => {
    if (!files.length) return;
    setLoading(true);
    const results: File[] = [];
    const targetBytes = targetSizeKB * 1024;
    for (const item of files) {
      let min = 0.1, max = 1, out = item.file;
      for (let i = 0; i < 8; i++) {
        const q = (min + max) / 2;
        out = await imageCompression(item.file, { initialQuality: q, useWebWorker: true });
        if (out.size > targetBytes) max = q; else min = q;
      }
      results.push(out);
    }
    setCompressed(results);
    setLoading(false);
  };

  const saved = (orig: File, comp: File) =>
    (((orig.size - comp.size) / orig.size) * 100).toFixed(1);

  return (
    <div style={{ display: "grid", gap: "1.1rem" }}>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className="upload-zone"
        style={isDragActive ? {
          outlineColor: "var(--orange)",
          boxShadow: "inset 7px 7px 16px rgba(163,177,198,.6), inset -7px -7px 16px rgba(255,255,255,.9), 0 0 0 3px rgba(249,115,22,.2)",
        } : {}}
      >
        <input {...getInputProps()} />
        <Upload size={30} strokeWidth={1.8} style={{ color: "var(--orange)", opacity: .8 }} />
        <p style={{ fontWeight: 600, color: "#5c4f47", margin: 0, fontSize: "0.95rem" }}>
          {isDragActive ? "Drop images here…" : "Drag & drop images or tap to upload"}
        </p>
        <p style={{ fontSize: "0.78rem", color: "#a09080", margin: 0 }}>PNG · JPG · WEBP</p>
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
          {files.map((item) => (
            <div
              key={item.file.name}
              className="neu-inset-panel"
              style={{ padding: "0.7rem", position: "relative" }}
            >
              <button
                onClick={() => remove(item.file.name)}
                style={{
                  position: "absolute", top: "0.45rem", right: "0.45rem",
                  width: "1.6rem", height: "1.6rem", border: "none",
                  borderRadius: "50%", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(145deg,#ffe1d6,#efc1b0)",
                  color: "#9b3412",
                  boxShadow: "3px 3px 6px rgba(181,102,73,.2),-2px -2px 5px rgba(255,241,235,.7)",
                }}
              >
                <X size={11} />
              </button>
              <img
                src={item.preview} alt={item.file.name}
                style={{ width: "100%", height: "90px", objectFit: "contain", borderRadius: ".75rem" }}
              />
              <p style={{ margin: ".4rem 0 0", fontSize: ".72rem", color: "#7a6a60", textAlign: "center", fontWeight: 600, wordBreak: "break-all" }}>
                {item.file.name.length > 14 ? item.file.name.slice(0, 12) + "…" : item.file.name}
              </p>
              <p style={{ margin: ".1rem 0 0", fontSize: ".7rem", color: "#a09080", textAlign: "center" }}>
                {fmt(item.file.size)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {files.length > 0 && (
        <div className="neu-inset-panel" style={{ padding: "1rem", display: "grid", gap: ".8rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: ".85rem", color: "#5c4f47", marginBottom: ".35rem" }}>
              Target size (KB)
            </label>
            <input
              type="number"
              value={targetSizeKB}
              onChange={(e) => setTargetSizeKB(Number(e.target.value))}
              className="input"
            />
          </div>
          <button className="btn" onClick={handleCompress} disabled={loading}>
            {loading ? "Compressing…" : "Compress Images"}
          </button>
        </div>
      )}

      {/* Results */}
      {compressed.length > 0 && (
        <>
          <p style={{ margin: 0, fontWeight: 800, color: "#3f342e", fontSize: ".95rem" }}>
            Compressed Results
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: ".75rem" }}>
            {compressed.map((file, i) => (
              <div key={i} className="neu-inset-panel" style={{ padding: ".7rem", textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(file)} alt="compressed"
                  style={{ width: "100%", height: "90px", objectFit: "contain", borderRadius: ".75rem" }}
                />
                <p style={{ margin: ".4rem 0 0", fontSize: ".72rem", color: "#7a6a60", fontWeight: 600 }}>
                  {fmt(file.size)}
                </p>
                <p style={{ margin: ".1rem 0 0", fontSize: ".7rem", fontWeight: 700, color: "#2d8a5e" }}>
                  ↓ {saved(files[i].file, file)}% saved
                </p>
                <button
                  className="btn btn-sm"
                  onClick={() => downloadFile(file)}
                  style={{ width: "100%", marginTop: ".5rem" }}
                >
                  <Download size={12} /> Save
                </button>
              </div>
            ))}
          </div>
          {compressed.length > 1 && (
            <button className="btn" onClick={() => downloadAllFiles(compressed)}>
              <Archive size={14} /> Download All
            </button>
          )}
        </>
      )}

    </div>
  );
}
