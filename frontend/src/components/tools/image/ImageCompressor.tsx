"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import {
  downloadFile,
  downloadAllFiles,
} from "@/lib/downloadUtils";

type FileWithPreview = {
  file: File;
  preview: string; // base64 string
};

export default function ImageCompressor() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [targetSizeKB, setTargetSizeKB] = useState(300);
  const [loading, setLoading] = useState(false);

  /* ==============================
     Format File Size
  ============================== */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  /* ==============================
     Drag & Drop (FileReader Preview)
  ============================== */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
          },
        ]);
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

  // Clear old compression results
  setCompressedFiles([]);
};

  /* ==============================
     Binary Search Compression
  ============================== */
  const handleCompress = async () => {
    if (files.length === 0) return;

    setLoading(true);

    const results: File[] = [];
    const targetBytes = targetSizeKB * 1024;

    for (const item of files) {
      let min = 0.1;
      let max = 1;
      let compressed = item.file;

      for (let i = 0; i < 8; i++) {
        const quality = (min + max) / 2;

        compressed = await imageCompression(item.file, {
          initialQuality: quality,
          useWebWorker: true,
        });

        if (compressed.size > targetBytes) {
          max = quality;
        } else {
          min = quality;
        }
      }

      results.push(compressed);
    }

    setCompressedFiles(results);
    setLoading(false);
  };

  const reductionPercent = (
    original: File,
    compressed: File
  ) => {
    return (
      ((original.size - compressed.size) /
        original.size) *
      100
    ).toFixed(1);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">
        Image Compressor
      </h2>

      {/* Drag & Drop */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-10 text-center rounded-xl cursor-pointer hover:bg-gray-50 transition"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag & Drop images here or click to upload
        </p>
      </div>

      {/* Uploaded Preview */}
      {files.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {files.map((item) => (
              <div
                key={item.file.name}
                className="relative border rounded-xl p-4 bg-white shadow-sm"
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
                  alt={item.file.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "contain",
                  }}
                />

                <div className="text-center mt-4 text-sm">
                  <p className="font-medium break-all">
                    {item.file.name}
                  </p>
                  <p className="text-gray-500">
                    Original:{" "}
                    {formatSize(item.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Target Size */}
          <div className="bg-gray-100 p-6 rounded-xl space-y-6">
            <div>
              <label className="block font-medium mb-2">
                Target Size (KB)
              </label>
              <input
                type="number"
                value={targetSizeKB}
                onChange={(e) =>
                  setTargetSizeKB(
                    Number(e.target.value)
                  )
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              onClick={handleCompress}
              className="bg-orange-500 text-white px-6 py-2 rounded"
            >
              {loading
                ? "Compressing..."
                : "Compress to Target Size"}
            </button>
          </div>
        </>
      )}

      {/* Results */}
      {compressedFiles.length > 0 && (
        <>
          <h3 className="text-xl font-semibold">
            Compressed Results
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {compressedFiles.map((file, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 bg-white shadow-sm"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="compressed"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "contain",
                  }}
                />

                <div className="text-center mt-4 text-sm space-y-1">
                  <p className="text-gray-500">
                    New Size: {formatSize(file.size)}
                  </p>

                  <p className="text-green-600 font-medium">
                    Reduced:{" "}
                    {reductionPercent(
                      files[index].file,
                      file
                    )}
                    %
                  </p>

                  <button
                    onClick={() =>
                      downloadFile(file)
                    }
                    className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {compressedFiles.length > 1 && (
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  downloadAllFiles(compressedFiles)
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