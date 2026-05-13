"use client";

import { useState } from "react";
import ImageFieldNote from "./ImageFieldNote";
import ImageUploadToolShell from "./ImageUploadToolShell";
import {
  applyConvolution,
  canvasToFile,
  createCanvas,
  loadImageFile,
  renameWithSuffix,
} from "@/lib/imageProcessing";

export default function ImageSharpenTool() {
  const [amount, setAmount] = useState(45);
  const [edgeProtection, setEdgeProtection] = useState("balanced");

  return (
    <ImageUploadToolShell
      title="Image Sharpen Tool"
      description="Upload a soft image and tune sharpness to recover edge detail and improve perceived clarity."
      actionLabel="Sharpen Image"
      settingsTitle="Sharpen Settings"
      note="This uses a local sharpening pass in your browser to increase edge contrast and improve clarity."
      resultTitle="Sharpened image"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const { canvas, context } = createCanvas(image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const amountScale = amount / 100;
        const centerBoost =
          edgeProtection === "high-detail" ? 5 + amountScale * 3 :
          edgeProtection === "soft-edges" ? 4 + amountScale * 2 :
          4.5 + amountScale * 2.6;

        const sharpened = applyConvolution(
          imageData,
          [0, -1, 0, -1, centerBoost, -1, 0, -1, 0],
          Math.max(1, centerBoost - 4)
        );

        context.putImageData(sharpened, 0, 0);

        return {
          file: await canvasToFile(canvas, {
            fileName: renameWithSuffix(file.name, "sharpened", "png"),
          }),
          summary: `Sharpen amount ${amount}% with ${edgeProtection.replace("-", " ")} protection.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Sharpen Amount" help="Increase edge contrast for a crisper image.">
            <input
              type="range"
              min="0"
              max="100"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full"
            />
          </ImageFieldNote>
          <ImageFieldNote label="Edge Protection" help="Reduce halos and keep skin tones smoother.">
            <select
              className="input default:bg-transparent"
              value={edgeProtection}
              onChange={(event) => setEdgeProtection(event.target.value)}
            >
              <option value="balanced">Balanced</option>
              <option value="high-detail">High detail</option>
              <option value="soft-edges">Soft edges</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
