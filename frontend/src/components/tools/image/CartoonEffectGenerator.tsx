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
        const source = new Uint8ClampedArray(data);
        const quantizeStep =
          colorMode === "bold" ? Math.max(16, 48 - Math.round(intensity / 4)) :
          colorMode === "soft" ? Math.max(20, 64 - Math.round(intensity / 5)) :
          Math.max(18, 56 - Math.round(intensity / 4.5));
        const edgeThreshold = 22 + Math.round((100 - intensity) / 4);
        const edgeStrength = colorMode === "soft" ? 42 : colorMode === "bold" ? 82 : 62;

        for (let y = 0; y < image.height; y += 1) {
          for (let x = 0; x < image.width; x += 1) {
            const index = (y * image.width + x) * 4;
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];

          data[index] = clampChannel(Math.round(red / quantizeStep) * quantizeStep);
          data[index + 1] = clampChannel(Math.round(green / quantizeStep) * quantizeStep);
          data[index + 2] = clampChannel(Math.round(blue / quantizeStep) * quantizeStep);

            const right = (y * image.width + Math.min(image.width - 1, x + 1)) * 4;
            const below = (Math.min(image.height - 1, y + 1) * image.width + x) * 4;
            const currentLum = source[index] * 0.299 + source[index + 1] * 0.587 + source[index + 2] * 0.114;
            const rightLum = source[right] * 0.299 + source[right + 1] * 0.587 + source[right + 2] * 0.114;
            const belowLum = source[below] * 0.299 + source[below + 1] * 0.587 + source[below + 2] * 0.114;
            const edge = Math.max(
              Math.abs(currentLum - rightLum),
              Math.abs(currentLum - belowLum)
            );

            if (edge > edgeThreshold) {
              data[index] = clampChannel(data[index] - edgeStrength);
              data[index + 1] = clampChannel(data[index + 1] - edgeStrength);
              data[index + 2] = clampChannel(data[index + 2] - edgeStrength);
            }
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
