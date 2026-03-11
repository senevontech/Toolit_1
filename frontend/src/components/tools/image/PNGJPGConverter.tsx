"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  downloadFile,
  downloadAllFiles,
} from "@/lib/downloadUtils";

type FileItem = {
  file: File;
  preview: string;
  width: number;
  height: number;
};

export default function PNGJPGConverter() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [convertedFiles, setConvertedFiles] =
    useState<File[]>([]);
  const [format, setFormat] =
    useState<"image/jpeg" | "image/png">(
      "image/jpeg"
    );
  const [quality, setQuality] = useState(90);

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
              width: img.width,
              height: img.height,
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
    setConvertedFiles([]);
  };

  /* ==============================
     Convert All
  ============================== */
  const handleConvertAll = async () => {
    if (files.length === 0) return;

    const results: File[] = [];

    for (const item of files) {
      const img = new Image();
      img.src = item.preview;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas =
            document.createElement("canvas");
          const ctx =
            canvas.getContext("2d");

          canvas.width = item.width;
          canvas.height = item.height;

          ctx?.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const extension =
                  format === "image/jpeg"
                    ? ".jpg"
                    : ".png";

                const newFile = new File(
                  [blob],
                  item.file.name.replace(
                    /\.[^/.]+$/,
                    extension
                  ),
                  { type: format }
                );

                results.push(newFile);
              }
              resolve();
            },
            format,
            quality / 100
          );
        };
      });
    }

    setConvertedFiles(results);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">
        PNG / JPG Converter
      </h2>

      {/* Drag & Drop */}
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
                  className="h-32 object-contain mx-auto"
                  alt="preview"
                />

                <div className="text-center mt-3 text-sm">
                  <p className="break-all">
                    {item.file.name}
                  </p>
                  <p>
                    {item.width} x {item.height}
                  </p>
                  <p>
                    {formatSize(item.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="bg-gray-100 p-6 rounded-xl space-y-4">
            <div className="flex gap-4">
              <select
                value={format}
                onChange={(e) =>
                  setFormat(
                    e.target.value as
                      | "image/jpeg"
                      | "image/png"
                  )
                }
                className="border p-2 rounded"
              >
                <option value="image/jpeg">
                  Convert to JPG
                </option>
                <option value="image/png">
                  Convert to PNG
                </option>
              </select>

              {format === "image/jpeg" && (
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) =>
                    setQuality(
                      Number(e.target.value)
                    )
                  }
                />
              )}
            </div>

            <button
              onClick={handleConvertAll}
              className="bg-orange-500 text-white px-6 py-2 rounded"
            >
              Convert All
            </button>
          </div>
        </>
      )}

      {/* Results */}
      {convertedFiles.length > 0 && (
        <>
          <h3 className="text-xl font-semibold">
            Converted Results
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {convertedFiles.map((file, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 bg-white shadow"
              >
                <img
                  src={URL.createObjectURL(file)}
                  className="h-32 object-contain mx-auto"
                  alt="converted"
                />

                <div className="text-center mt-3 text-sm">
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

          {convertedFiles.length > 1 && (
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  downloadAllFiles(convertedFiles)
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