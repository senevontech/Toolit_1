"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Film, Upload, X } from "lucide-react";

type VideoUploadShellProps = {
  title: string;
  description: string;
  accept?: string;
  ctaLabel: string;
  configTitle: string;
  configFields: React.ReactNode;
  processingNote: string;
  onProcess: (file: File) => Promise<void>;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VideoUploadShell({
  title,
  description,
  accept = "video/*",
  ctaLabel,
  configTitle,
  configFields,
  processingNote,
  onProcess,
}: VideoUploadShellProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    event.target.value = "";
  };

  const clearFile = () => setFile(null);

  const handleProcess = async () => {
    if (!file || loading) return;

    setLoading(true);
    setMessage("");

    try {
      await onProcess(file);
      setMessage("Done. Your download should start automatically.");
    } catch (error: any) {
      setMessage(error?.message || "Video processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="space-y-8">
        <div>
          <p className="tool-subtitle uppercase tracking-[0.18em]">Video Tool</p>
          <h2 className="tool-title mt-3">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            {description}
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <label className="upload-zone cursor-pointer">
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={onFileChange}
              />

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-300">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-100">
                    Upload a video file
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Click to choose a file and prepare it for {title.toLowerCase()}.
                  </p>
                </div>
              </div>
            </label>

            {file ? (
              <div className="neu-inset-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <Film size={18} className="text-orange-300" />
                      <p className="truncate text-sm font-bold text-slate-100">
                        {file.name}
                      </p>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {file.type || "Video file"} · {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button type="button" className="btn-outline btn-sm" onClick={clearFile}>
                    <X size={14} />
                    Remove
                  </button>
                </div>

                {previewUrl ? (
                  <video
                    key={previewUrl}
                    controls
                    className="mt-4 w-full rounded-2xl bg-black"
                    src={previewUrl}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            <section className="neu-card p-6">
              <h3 className="text-lg font-bold text-slate-100">{configTitle}</h3>
              <div className="mt-4 space-y-4">{configFields}</div>
            </section>

            <section className="neu-card p-6">
              <h3 className="text-lg font-bold text-slate-100">Action</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {processingNote}
              </p>
              <button
                type="button"
                className="btn mt-5"
                disabled={!file || loading}
                onClick={handleProcess}
              >
                {loading ? "Processing..." : ctaLabel}
              </button>
              {message ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>
              ) : null}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
