"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Download, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { downloadFile } from "@/lib/downloadUtils";

type ProcessedImageResult = {
  file: File;
  summary?: string;
};

type ImageUploadToolShellProps = {
  title: string;
  description: string;
  actionLabel: string;
  settingsTitle: string;
  settings: React.ReactNode;
  note: string;
  resultTitle?: string;
  processImage: (file: File) => Promise<ProcessedImageResult>;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageUploadToolShell({
  title,
  actionLabel,
  settingsTitle,
  settings,
  note,
  resultTitle = "Processed preview",
  processImage,
}: ImageUploadToolShellProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processed, setProcessed] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const processedPreviewUrl = useMemo(
    () => (processed ? URL.createObjectURL(processed.file) : null),
    [processed]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (processedPreviewUrl) {
        URL.revokeObjectURL(processedPreviewUrl);
      }
    };
  }, [processedPreviewUrl]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setProcessed(null);
    setError(null);
    event.target.value = "";
  };

  const handleProcess = async () => {
    if (!file) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processImage(file);
      setProcessed(result);
    } catch (processError) {
      const message =
        processError instanceof Error ? processError.message : "Image processing failed.";
      setError(message);
      setProcessed(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-container tool-shell tool-shell--image">
      <div className="space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <label className="upload-zone cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-300">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-100">
                    Upload an image
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Choose a JPG, PNG, WebP, or similar image to use with this tool.
                  </p>
                </div>
              </div>
            </label>

            {file && previewUrl ? (
              <div className="neu-inset-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <ImageIcon size={18} className="text-orange-300" />
                      <p className="truncate text-sm font-bold text-slate-100">
                        {file.name}
                      </p>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {file.type || "Image file"} · {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => {
                      setFile(null);
                      setProcessed(null);
                      setError(null);
                    }}
                  >
                    <X size={14} />
                    Remove
                  </button>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl bg-black/20 p-3">
                  <Image
                    src={previewUrl}
                    alt={`${title} preview`}
                    width={1200}
                    height={1200}
                    unoptimized
                    className="h-auto max-h-[28rem] w-full object-contain"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            <section className="neu-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                {settingsTitle}
              </h2>
              <div className="mt-4 space-y-4">{settings}</div>
            </section>

            <section className="neu-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                Action
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{note}</p>
              {error ? (
                <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              ) : null}
              <button
                type="button"
                className="btn mt-5"
                disabled={!file || isProcessing}
                onClick={handleProcess}
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
                {isProcessing ? "Processing..." : actionLabel}
              </button>
            </section>
          </div>
        </section>

        {processed && processedPreviewUrl ? (
          <section className="neu-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {resultTitle}
                </h2>
                {processed.summary ? (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {processed.summary}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="btn-outline"
                onClick={() => downloadFile(processed.file, processed.file.name)}
              >
                <Download size={14} />
                Download
              </button>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl bg-black/20 p-3">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Original
                </p>
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt={`${title} original preview`}
                    width={1200}
                    height={1200}
                    unoptimized
                    className="h-auto max-h-[24rem] w-full object-contain"
                  />
                ) : null}
              </div>

              <div className="overflow-hidden rounded-2xl bg-black/20 p-3">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Processed
                </p>
                <Image
                  src={processedPreviewUrl}
                  alt={`${title} processed preview`}
                  width={1200}
                  height={1200}
                  unoptimized
                  className="h-auto max-h-[24rem] w-full object-contain"
                />
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
