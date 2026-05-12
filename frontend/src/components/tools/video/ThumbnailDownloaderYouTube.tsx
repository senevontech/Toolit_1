"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Download, ExternalLink, Image as ImageIcon, Search } from "lucide-react";
import { downloadFile } from "@/lib/downloadUtils";

type ThumbnailOption = {
  key: string;
  label: string;
  path: string;
};

const THUMBNAIL_OPTIONS: ThumbnailOption[] = [
  { key: "maxres", label: "Max Resolution", path: "maxresdefault.jpg" },
  { key: "standard", label: "Standard", path: "sddefault.jpg" },
  { key: "High", label: "High Quality", path: "hqdefault.jpg" },
  { key: "medium", label: "Medium Quality", path: "mqdefault.jpg" },
  { key: "default", label: "Default", path: "default.jpg" },
];

function extractYouTubeVideoId(value: string) {
  const input = value.trim();
  if (!input) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);

    if (url.hostname.includes("youtu.be")) {
      const candidate = url.pathname.split("/").filter(Boolean)[0];
      return candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
    }

    if (url.hostname.includes("youtube.com")) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && /^[a-zA-Z0-9_-]{11}$/.test(fromQuery)) {
        return fromQuery;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const embedded = segments.at(-1);
      return embedded && /^[a-zA-Z0-9_-]{11}$/.test(embedded) ? embedded : null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function ThumbnailDownloaderYouTube() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const videoId = useMemo(() => extractYouTubeVideoId(submitted), [submitted]);
  const thumbnails = useMemo(
    () =>
      videoId
        ? THUMBNAIL_OPTIONS.map((option) => ({
            ...option,
            url: `https://img.youtube.com/vi/${videoId}/${option.path}`,
          }))
        : [],
    [videoId]
  );

  const hasInput = submitted.trim().length > 0;
  const hasError = hasInput && !videoId;

  const downloadThumbnail = async (url: string, label: string) => {
    setDownloadError("");

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not fetch thumbnail.");
      const blob = await response.blob();
      downloadFile(
        new File([blob], `${videoId}-${label.toLowerCase().replace(/\s+/g, "-")}.jpg`, {
          type: blob.type || "image/jpeg",
        })
      );
    } catch {
      setDownloadError("Could not download this thumbnail directly. Use Open, then save the image from the browser.");
    }
  };

  return (
    <div className="tool-container">
      <div className="space-y-8">
        <div>
          <p className="tool-subtitle uppercase tracking-[0.18em]">Video Tool</p>
          <h2 className="tool-title mt-3">Thumbnail Downloader (YouTube)</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Paste a YouTube video URL or video ID to instantly preview common
            thumbnail sizes and open or download them.
          </p>
        </div>

        <section className="neu-card p-6 md:p-7">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-slate-100">
                YouTube URL or Video ID
              </span>
              <input
                className="input"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </label>

            <div className="flex items-end">
              <button
                type="button"
                className="btn"
                onClick={() => setSubmitted(input)}
              >
                <Search size={16} />
                Get thumbnails
              </button>
            </div>
          </div>

          {hasError ? (
            <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              Enter a valid YouTube link or an 11-character video ID.
            </div>
          ) : null}

          {videoId ? (
            <div className="mt-4 rounded-2xl bg-orange-500/10 px-4 py-3 text-sm font-medium text-orange-200">
              Video ID detected: <span className="font-bold">{videoId}</span>
            </div>
          ) : null}

          {downloadError ? (
            <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {downloadError}
            </div>
          ) : null}
        </section>

        {videoId ? (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <ImageIcon size={18} className="text-orange-300" />
              <h3 className="text-lg font-bold text-slate-100">Available Thumbnails</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {thumbnails.map((thumbnail) => (
                <article key={thumbnail.key} className="neu-card overflow-hidden p-4">
                  <div className="overflow-hidden rounded-2xl bg-black/20">
                    <Image
                      src={thumbnail.url}
                      alt={`${thumbnail.label} YouTube thumbnail`}
                      width={1280}
                      height={720}
                      unoptimized
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <div className="mt-4">
                    <h4 className="text-base font-bold text-slate-100">{thumbnail.label}</h4>
                    <p className="mt-2 break-all text-xs leading-6 text-slate-400">
                      {thumbnail.url}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={thumbnail.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline"
                    >
                      <ExternalLink size={15} />
                      Open
                    </a>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => downloadThumbnail(thumbnail.url, thumbnail.label)}
                    >
                      <Download size={15} />
                      Download
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
