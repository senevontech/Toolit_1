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

export default function SketchEffectGenerator() {
  const [lineStrength, setLineStrength] = useState(50);
  const [sketchMode, setSketchMode] = useState("pencil");

  return (
    <ImageUploadToolShell
      title="Sketch Effect Generator"
      description="Convert a photo into a pencil-style or line-art sketch for creative edits and profile visuals."
      actionLabel="Generate Sketch Effect"
      settingsTitle="Sketch Style"
      note="This transforms the image into a pencil-like sketch with controllable contrast and line density."
      resultTitle="Sketch effect"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const { canvas, context } = createCanvas(image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        const strengthScale = lineStrength / 100;

        for (let index = 0; index < data.length; index += 4) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const gray = red * 0.299 + green * 0.587 + blue * 0.114;

          let output = 255 - gray * (1 + strengthScale * 0.8);

          if (sketchMode === "charcoal") {
            output = 255 - gray * (1.2 + strengthScale);
          } else if (sketchMode === "outline") {
            output = gray < 120 + lineStrength / 3 ? 20 : 255;
          }

          const channel = clampChannel(output);
          data[index] = channel;
          data[index + 1] = channel;
          data[index + 2] = channel;
        }

        context.putImageData(imageData, 0, 0);

        return {
          file: await canvasToFile(canvas, {
            fileName: renameWithSuffix(file.name, "sketch", "png"),
          }),
          summary: `Sketch mode ${sketchMode} with line strength ${lineStrength}%.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Line Strength" help="Control how dark and visible the sketch lines become.">
            <input
              type="range"
              min="0"
              max="100"
              value={lineStrength}
              onChange={(event) => setLineStrength(Number(event.target.value))}
              className="w-full"
            />
          </ImageFieldNote>
          <ImageFieldNote label="Sketch Mode" help="Choose a lighter or more dramatic pencil look.">
            <select
              className="input default:bg-transparent"
              value={sketchMode}
              onChange={(event) => setSketchMode(event.target.value)}
            >
              <option value="pencil">Pencil sketch</option>
              <option value="charcoal">Charcoal sketch</option>
              <option value="outline">Outline only</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
