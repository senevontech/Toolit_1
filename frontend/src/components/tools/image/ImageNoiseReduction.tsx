"use client";

import { useState } from "react";
import ImageFieldNote from "./ImageFieldNote";
import ImageUploadToolShell from "./ImageUploadToolShell";
import {
  blurImageData,
  canvasToFile,
  createCanvas,
  loadImageFile,
  renameWithSuffix,
} from "@/lib/imageProcessing";

export default function ImageNoiseReduction() {
  const [noiseLevel, setNoiseLevel] = useState(35);
  const [detailRetention, setDetailRetention] = useState("balanced");

  return (
    <ImageUploadToolShell
      title="Image Noise Reduction"
      description="Clean up grainy or low-light photos by reducing digital noise while protecting important detail."
      actionLabel="Reduce Noise"
      settingsTitle="Noise Settings"
      note="This smooths noisy image data in the browser for quick cleanup on grainy shots and screenshots."
      resultTitle="Noise-reduced image"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const { canvas, context } = createCanvas(image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);

        const source = context.getImageData(0, 0, image.width, image.height);
        const baseRadius = Math.max(1, Math.round((noiseLevel / 100) * 4));
        const radius =
          detailRetention === "detail-priority" ? Math.max(1, baseRadius - 1) :
          detailRetention === "maximum-cleanup" ? baseRadius + 1 :
          baseRadius;

        const reduced = blurImageData(source, radius);
        context.putImageData(reduced, 0, 0);

        return {
          file: await canvasToFile(canvas, {
            fileName: renameWithSuffix(file.name, "noise-reduced", "png"),
          }),
          summary: `Noise reduction ${noiseLevel}% with ${detailRetention.replace("-", " ")} mode.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Noise Reduction Level" help="Choose how aggressively the grain should be cleaned.">
            <input
              type="range"
              min="0"
              max="100"
              value={noiseLevel}
              onChange={(event) => setNoiseLevel(Number(event.target.value))}
              className="w-full"
            />
          </ImageFieldNote>
          <ImageFieldNote label="Detail Retention" help="Preserve texture while cleaning the image.">
            <select
              className="input default:bg-transparent"
              value={detailRetention}
              onChange={(event) => setDetailRetention(event.target.value)}
            >
              <option value="balanced">Balanced</option>
              <option value="detail-priority">Detail priority</option>
              <option value="maximum-cleanup">Maximum cleanup</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
