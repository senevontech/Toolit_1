"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { downloadFile, downloadAllFiles } from "@/lib/downloadUtils";

type FileItem = {
  file: File;
  preview: string;
  originalWidth: number;
  originalHeight: number;
};

const PRESETS = [
  // ===== Instagram =====
  { label: "Instagram Post (1080x1080)", width: 1080, height: 1080 },
  { label: "Instagram Story (1080x1920)", width: 1080, height: 1920 },
  { label: "Instagram Reel Cover (1080x1920)", width: 1080, height: 1920 },
  { label: "Instagram Landscape (1080x566)", width: 1080, height: 566 },
  { label: "Instagram Portrait (1080x1350)", width: 1080, height: 1350 },

  // ===== YouTube =====
  { label: "YouTube Thumbnail (1280x720)", width: 1280, height: 720 },
  { label: "YouTube Channel Art (2560x1440)", width: 2560, height: 1440 },
  { label: "YouTube Shorts (1080x1920)", width: 1080, height: 1920 },

  // ===== Facebook =====
  { label: "Facebook Cover (820x312)", width: 820, height: 312 },
  { label: "Facebook Post (1200x630)", width: 1200, height: 630 },
  { label: "Facebook Story (1080x1920)", width: 1080, height: 1920 },

  // ===== Twitter / X =====
  { label: "Twitter Post (1200x675)", width: 1200, height: 675 },
  { label: "Twitter Header (1500x500)", width: 1500, height: 500 },

  // ===== LinkedIn =====
  { label: "LinkedIn Post (1200x627)", width: 1200, height: 627 },
  { label: "LinkedIn Banner (1584x396)", width: 1584, height: 396 },

  // ===== WhatsApp =====
  { label: "WhatsApp DP (640x640)", width: 640, height: 640 },
  { label: "WhatsApp Status (1080x1920)", width: 1080, height: 1920 },

  // ===== Website / Blog =====
  { label: "Blog Featured Image (1200x800)", width: 1200, height: 800 },
  { label: "Website Hero (1920x1080)", width: 1920, height: 1080 },
  { label: "Ecommerce Product (1000x1000)", width: 1000, height: 1000 },

  // ===== Standard Resolutions =====
  { label: "HD (1280x720)", width: 1280, height: 720 },
  { label: "Full HD (1920x1080)", width: 1920, height: 1080 },
  { label: "2K (2560x1440)", width: 2560, height: 1440 },
  { label: "4K (3840x2160)", width: 3840, height: 2160 },

  // ===== Print Sizes (Common) =====
  { label: "A4 (2480x3508)", width: 2480, height: 3508 },
  { label: "A5 (1748x2480)", width: 1748, height: 2480 },
];

export default function ImageResizer() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [resizedFiles, setResizedFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockRatio, setLockRatio] = useState(true);

  /* ==============================
     Format Size
  ============================== */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  /* ==============================
     Drag & Drop (Bulk)
  ============================== */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          setFiles((prev) => [
            ...prev,
            {
              file,
              preview: reader.result as string,
              originalWidth: img.width,
              originalHeight: img.height,
            },
          ]);
        };

        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop,
  });

  const removeFile = (name: string) => {
    setFiles((prev) =>
      prev.filter((item) => item.file.name !== name)
    );
    setResizedFiles([]);
  };

  /* ==============================
     Preset Handler
  ============================== */
  const applyPreset = (preset: {
    width: number;
    height: number;
  }) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setLockRatio(false);
  };

  /* ==============================
     Bulk Resize
  ============================== */
  const handleResizeAll = async () => {
    if (files.length === 0) return;

    const results: File[] = [];

    for (const item of files) {
      const img = new Image();
      img.src = item.preview;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                item.file.name,
                { type: item.file.type }
              );
              results.push(newFile);
            }
            resolve();
          }, item.file.type);
        };
      });
    }

    setResizedFiles(results);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">
        Image Resizer (Bulk + Presets)
      </h2>

      {/* Drag Drop */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-10 text-center rounded-xl cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag & Drop images here or click to upload
        </p>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {files.map((item) => (
              <div
                key={item.file.name}
                className="relative border rounded-xl p-4 bg-white shadow"
              >
                <button
                  onClick={() =>
                    removeFile(item.file.name)
                  }
                  className="absolute top-2 right-2 bg-red-100 text-red-500 w-6 h-6 rounded-full"
                >
                  ✕
                </button>

                <img
                  src={item.preview}
                  alt="preview"
                  className="h-32 object-contain mx-auto"
                />

                <div className="text-center mt-3 text-sm">
                  <p className="break-all">
                    {item.file.name}
                  </p>
                  <p>
                    {item.originalWidth} x{" "}
                    {item.originalHeight}
                  </p>
                  <p>
                    {formatSize(item.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Presets */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              Preset Sizes
            </h3>

            <div className="flex flex-wrap gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    applyPreset(preset)
                  }
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Size */}
          <div className="bg-gray-100 p-6 rounded-xl space-y-4">
            <div className="flex gap-4">
              <input
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(Number(e.target.value))
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(Number(e.target.value))
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              onClick={handleResizeAll}
              className="bg-orange-500 text-white px-6 py-2 rounded"
            >
              Resize All Images
            </button>
          </div>
        </>
      )}

      {/* Results */}
      {resizedFiles.length > 0 && (
        <>
          <h3 className="text-xl font-semibold">
            Resized Results
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {resizedFiles.map((file, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 bg-white shadow"
              >
                <img
                  src={URL.createObjectURL(file)}
                  className="h-32 object-contain mx-auto"
                  alt="resized"
                />

                <div className="text-center mt-3 text-sm">
                  <p>{width} x {height}</p>
                  <p>{formatSize(file.size)}</p>

                  <button
                    onClick={() =>
                      downloadFile(file)
                    }
                    className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {resizedFiles.length > 1 && (
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  downloadAllFiles(resizedFiles)
                }
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Download All
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}