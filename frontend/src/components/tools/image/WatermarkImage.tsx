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

const POSITIONS = [
  "Top Left",
  "Top Right",
  "Center",
  "Bottom Left",
  "Bottom Right",
];

export default function WatermarkImage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [watermarkedFiles, setWatermarkedFiles] =
    useState<File[]>([]);

  const [text, setText] = useState("Toolit");
  const [fontSize, setFontSize] = useState(40);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState("#ff0000");
  const [position, setPosition] =
    useState("Center");

  /* ==============================
     Format Size
  ============================== */
  const formatSize = (bytes: number) =>
    bytes < 1024
      ? bytes + " B"
      : (bytes / 1024).toFixed(2) + " KB";

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

  const { getRootProps, getInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: true,
      onDrop,
    });

  const removeFile = (name: string) => {
    setFiles((prev) =>
      prev.filter((item) => item.file.name !== name)
    );
    setWatermarkedFiles([]);
  };

  /* ==============================
     Position Calculator
  ============================== */
  const getPosition = (
    canvasWidth: number,
    canvasHeight: number,
    textWidth: number
  ) => {
    const padding = 20;

    switch (position) {
      case "Top Left":
        return {
          x: padding,
          y: fontSize + padding,
          align: "left",
        };
      case "Top Right":
        return {
          x: canvasWidth - padding,
          y: fontSize + padding,
          align: "right",
        };
      case "Bottom Left":
        return {
          x: padding,
          y: canvasHeight - padding,
          align: "left",
        };
      case "Bottom Right":
        return {
          x: canvasWidth - padding,
          y: canvasHeight - padding,
          align: "right",
        };
      default:
        return {
          x: canvasWidth / 2,
          y: canvasHeight / 2,
          align: "center",
        };
    }
  };

  /* ==============================
     Apply Watermark (Bulk)
  ============================== */
  const handleWatermarkAll = async () => {
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

          if (ctx) {
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = hexToRgba(
              color,
              opacity
            );

            const textMetrics =
              ctx.measureText(text);

            const pos = getPosition(
              canvas.width,
              canvas.height,
              textMetrics.width
            );

            ctx.textAlign =
              pos.align as CanvasTextAlign;

            ctx.fillText(
              text,
              pos.x,
              pos.y
            );
          }

          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                item.file.name,
                { type: "image/png" }
              );
              results.push(newFile);
            }
            resolve();
          }, "image/png");
        };
      });
    }

    setWatermarkedFiles(results);
  };

  const hexToRgba = (
    hex: string,
    alpha: number
  ) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">
        Watermark Image (Bulk)
      </h2>

      {/* Drag & Drop */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-10 text-center rounded-xl cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <p>
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
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="bg-gray-100 p-6 rounded-xl space-y-4">
            <input
              type="text"
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder="Watermark text"
              className="border p-2 rounded w-full"
            />

            <div>
              <label>
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={fontSize}
                onChange={(e) =>
                  setFontSize(
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label>
                Opacity: {opacity}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) =>
                  setOpacity(
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label>Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
              />
            </div>

            <select
              value={position}
              onChange={(e) =>
                setPosition(e.target.value)
              }
              className="border p-2 rounded w-full"
            >
              {POSITIONS.map((pos) => (
                <option key={pos}>
                  {pos}
                </option>
              ))}
            </select>

            <button
              onClick={handleWatermarkAll}
              className="bg-orange-500 text-white px-6 py-2 rounded"
            >
              Apply Watermark
            </button>
          </div>
        </>
      )}

      {/* Results */}
      {watermarkedFiles.length > 0 && (
        <>
          <h3 className="text-xl font-semibold">
            Watermarked Results
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {watermarkedFiles.map(
              (file, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-white shadow"
                >
                  <img
                    src={URL.createObjectURL(
                      file
                    )}
                    className="h-32 object-contain mx-auto"
                    alt="watermarked"
                  />

                  <button
                    onClick={() =>
                      downloadFile(file)
                    }
                    className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Download
                  </button>
                </div>
              )
            )}
          </div>

          {watermarkedFiles.length > 1 && (
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  downloadAllFiles(
                    watermarkedFiles
                  )
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