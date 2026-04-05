"use client";

import { useState } from "react";
import ImageFieldNote from "./ImageFieldNote";
import ImageUploadToolShell from "./ImageUploadToolShell";
import {
  canvasToFile,
  createCanvas,
  loadImageFile,
  renameWithSuffix,
} from "@/lib/imageProcessing";

export default function ImageBackgroundBlur() {
  const [blurStrength, setBlurStrength] = useState(40);
  const [focusArea, setFocusArea] = useState("auto");

  return (
    <ImageUploadToolShell
      title="Image Background Blur"
      description="Upload a portrait or product image and prepare a softer blurred background effect around the subject."
      actionLabel="Blur Background"
      settingsTitle="Blur Settings"
      note="This creates a focused center area and softly blurs the surrounding image for a quick portrait-style depth effect."
      resultTitle="Blurred image"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const { canvas, context } = createCanvas(image.width, image.height);
        const blurAmount = Math.max(2, Math.round((blurStrength / 100) * 24));

        context.filter = `blur(${blurAmount}px)`;
        context.drawImage(image, 0, 0, image.width, image.height);
        context.filter = "none";

        context.save();

        const focusScale =
          focusArea === "portrait" ? { width: 0.48, height: 0.74 } :
          focusArea === "center" ? { width: 0.56, height: 0.62 } :
          { width: 0.52, height: 0.7 };

        context.beginPath();
        context.ellipse(
          image.width / 2,
          image.height / 2,
          (image.width * focusScale.width) / 2,
          (image.height * focusScale.height) / 2,
          0,
          0,
          Math.PI * 2
        );
        context.clip();
        context.drawImage(image, 0, 0, image.width, image.height);
        context.restore();

        const processedFile = await canvasToFile(canvas, {
          fileName: renameWithSuffix(file.name, "background-blur", "png"),
        });

        return {
          file: processedFile,
          summary: `Blur strength ${blurStrength}% with ${focusArea} focus applied.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Blur Strength" help="Control how soft the background should look.">
            <input
              type="range"
              min="0"
              max="100"
              value={blurStrength}
              onChange={(event) => setBlurStrength(Number(event.target.value))}
              className="w-full"
            />
          </ImageFieldNote>
          <ImageFieldNote label="Focus Area" help="Choose where the subject stays sharp.">
            <select
              className="input default:bg-transparent"
              value={focusArea}
              onChange={(event) => setFocusArea(event.target.value)}
            >
              <option value="auto">Auto subject focus</option>
              <option value="center">Center focus</option>
              <option value="portrait">Portrait focus</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
