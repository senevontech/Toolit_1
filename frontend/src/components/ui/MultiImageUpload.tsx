"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
  width?: number;
  height?: number;
}

interface Props {
  onFilesChange: (files: FileWithPreview[]) => void;
}

export default function MultiImageUpload({
  onFilesChange,
}: Props) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setFiles((prev) => [...prev, ...mappedFiles]);
  }, []);

  useEffect(() => {
    files.forEach((file) => {
      const img = new Image();
      img.src = file.preview;

      img.onload = () => {
        file.width = img.width;
        file.height = img.height;
        setFiles([...files]);
      };
    });

    onFilesChange(files);
  }, [files]);

  const removeFile = (name: string) => {
    const updated = files.filter(
      (file) => file.name !== name
    );
    setFiles(updated);
  };

  const { getRootProps, getInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: true,
      onDrop,
    });

  return (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag & Drop images here or click to upload
        </p>
      </div>

      {/* Preview Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {files.map((file) => (
          <div
            key={file.name}
            className="relative border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Remove Button */}
            <button
              onClick={() =>
                removeFile(file.name)
              }
              className="absolute top-2 right-2 bg-red-100 text-red-500 w-6 h-6 rounded-full flex items-center justify-center text-sm"
            >
              ✕
            </button>

            {/* Preview */}
            <img
              src={file.preview}
              className="h-32 object-contain mx-auto rounded"
            />

            {/* Details */}
            <div className="text-center mt-4 space-y-1 text-sm">
              <p className="font-medium break-all">
                {file.name}
              </p>

              <p className="text-gray-500">
                {file.width} × {file.height}
              </p>

              <p className="text-gray-500">
                {formatSize(file.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}