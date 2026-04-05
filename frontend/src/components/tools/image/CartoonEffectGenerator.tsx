"use client";

import { useState } from "react";
import ImageFieldNote from "./ImageFieldNote";
import ImageUploadToolShell from "./ImageUploadToolShell";
import {
  canvasToFile,
  clampChannel,
  createCanvas,
  loadImageFile,
  renameWithSuffix,
} from "@/lib/imageProcessing";

export default function CartoonEffectGenerator() {
  const [intensity, setIntensity] = useState(55);
  const [colorMode, setColorMode] = useState("classic");

  return (
    <ImageUploadToolShell
      title="Cartoon Effect Generator"
      description="Turn a regular photo into a stylized cartoon-like image with cleaner edges and bold color blocks."
      actionLabel="Generate Cartoon Effect"
      settingsTitle="Cartoon Style"
      note="This simplifies colors and adds darkened edge lines to produce a cartoon-style look directly in your browser."
      resultTitle="Cartoon effect"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const { canvas, context } = createCanvas(image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        const quantizeStep =
          colorMode === "bold" ? Math.max(16, 48 - Math.round(intensity / 4)) :
          colorMode === "soft" ? Math.max(20, 64 - Math.round(intensity / 5)) :
          Math.max(18, 56 - Math.round(intensity / 4.5));
        const edgeThreshold = 28 + Math.round(intensity / 3);

        for (let index = 0; index < data.length; index += 4) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const average = (red + green + blue) / 3;
          const diff = Math.max(
            Math.abs(red - green),
            Math.abs(green - blue),
            Math.abs(blue - red)
          );

          data[index] = clampChannel(Math.round(red / quantizeStep) * quantizeStep);
          data[index + 1] = clampChannel(Math.round(green / quantizeStep) * quantizeStep);
          data[index + 2] = clampChannel(Math.round(blue / quantizeStep) * quantizeStep);

          if (diff < edgeThreshold && average < 170) {
            data[index] = clampChannel(data[index] - 40);
            data[index + 1] = clampChannel(data[index + 1] - 40);
            data[index + 2] = clampChannel(data[index + 2] - 40);
          }
        }

        context.putImageData(imageData, 0, 0);

        return {
          file: await canvasToFile(canvas, {
            fileName: renameWithSuffix(file.name, "cartoon", "png"),
          }),
          summary: `Cartoon intensity ${intensity}% with ${colorMode} color mode.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Style Intensity" help="Increase edge separation and color simplification.">
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
              className="w-full"
            />
          </ImageFieldNote>
          <ImageFieldNote label="Color Mode" help="Choose a softer or bolder illustrated look.">
            <select
              className="input default:bg-transparent"
              value={colorMode}
              onChange={(event) => setColorMode(event.target.value)}
            >
              <option value="classic">Classic cartoon</option>
              <option value="bold">Bold color</option>
              <option value="soft">Soft illustration</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
