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

export default function BackgroundRemover() {
  const [edgeHandling, setEdgeHandling] = useState("balanced");
  const [exportFormat, setExportFormat] = useState("png");

  return (
    <ImageUploadToolShell
      title="Background Remover"
      description="Upload a portrait, product, or graphic image and prepare it for transparent-background extraction."
      actionLabel="Remove Background"
      settingsTitle="Removal Settings"
      note="This uses a quick automatic cutout based on the outer background color. It works best on simple or plain backgrounds."
      resultTitle="Background removed"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const { canvas, context } = createCanvas(image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        const threshold =
          edgeHandling === "hair-detail" ? 40 :
          edgeHandling === "product-edges" ? 26 :
          32;

        const samples = [
          0,
          (image.width - 1) * 4,
          ((image.height - 1) * image.width) * 4,
          ((image.height * image.width) - 1) * 4,
        ];

        const background = samples.reduce(
          (accumulator, sampleIndex) => {
            accumulator.red += data[sampleIndex];
            accumulator.green += data[sampleIndex + 1];
            accumulator.blue += data[sampleIndex + 2];
            return accumulator;
          },
          { red: 0, green: 0, blue: 0 }
        );

        const targetRed = background.red / samples.length;
        const targetGreen = background.green / samples.length;
        const targetBlue = background.blue / samples.length;

        for (let index = 0; index < data.length; index += 4) {
          const distance = Math.sqrt(
            (data[index] - targetRed) ** 2 +
              (data[index + 1] - targetGreen) ** 2 +
              (data[index + 2] - targetBlue) ** 2
          );

          if (distance < threshold) {
            if (exportFormat === "png") {
              data[index + 3] = 0;
            } else {
              data[index] = 255;
              data[index + 1] = 255;
              data[index + 2] = 255;
              data[index + 3] = 255;
            }
          } else if (edgeHandling === "hair-detail") {
            data[index + 3] = clampChannel(data[index + 3] + 10);
          }
        }

        context.putImageData(imageData, 0, 0);

        const type = exportFormat === "png" ? "image/png" : "image/jpeg";
        const extension = exportFormat === "png" ? "png" : "jpg";

        return {
          file: await canvasToFile(canvas, {
            fileName: renameWithSuffix(file.name, "cutout", extension),
            type,
            quality: 0.92,
          }),
          summary: `Automatic cutout created with ${edgeHandling.replace("-", " ")} edge handling.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Edge Handling" help="Choose how fine the cutout edges should be cleaned.">
            <select
              className="input default:bg-transparent"
              value={edgeHandling}
              onChange={(event) => setEdgeHandling(event.target.value)}
            >
              <option value="balanced">Balanced</option>
              <option value="hair-detail">Hair detail</option>
              <option value="product-edges">Product edges</option>
            </select>
          </ImageFieldNote>
          <ImageFieldNote label="Export Format" help="Transparent backgrounds usually work best as PNG.">
            <select
              className="input default:bg-transparent"
              value={exportFormat}
              onChange={(event) => setExportFormat(event.target.value)}
            >
              <option value="png">PNG transparent</option>
              <option value="jpg">White background JPG</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
