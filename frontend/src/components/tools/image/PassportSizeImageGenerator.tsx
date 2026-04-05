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

export default function PassportSizeImageGenerator() {
  const [photoStandard, setPhotoStandard] = useState("35x45");
  const [sheetLayout, setSheetLayout] = useState("single");

  return (
    <ImageUploadToolShell
      title="Passport Size Image Generator"
      description="Prepare an uploaded portrait for passport-style dimensions, framing, and output layout."
      actionLabel="Generate Passport Photo"
      settingsTitle="Passport Settings"
      note="This crops the uploaded portrait into a passport-photo layout and exports a printable sheet if you need multiple copies."
      resultTitle="Passport photo sheet"
      processImage={async (file) => {
        const image = await loadImageFile(file);
        const standards = {
          "35x45": { width: 413, height: 531, label: "35mm x 45mm" },
          "2x2": { width: 600, height: 600, label: "2in x 2in" },
          custom: { width: 480, height: 600, label: "Custom passport layout" },
        } as const;
        const layouts = {
          single: { columns: 1, rows: 1 },
          four: { columns: 2, rows: 2 },
          eight: { columns: 2, rows: 4 },
        } as const;
        const standard = standards[photoStandard as keyof typeof standards];
        const layout = layouts[sheetLayout as keyof typeof layouts];
        const margin = 36;
        const gap = 20;
        const canvasWidth = standard.width * layout.columns + gap * (layout.columns - 1) + margin * 2;
        const canvasHeight = standard.height * layout.rows + gap * (layout.rows - 1) + margin * 2;
        const { canvas, context } = createCanvas(canvasWidth, canvasHeight);

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.max(standard.width / image.width, standard.height / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;

        for (let row = 0; row < layout.rows; row += 1) {
          for (let column = 0; column < layout.columns; column += 1) {
            const x = margin + column * (standard.width + gap);
            const y = margin + row * (standard.height + gap);

            context.save();
            context.beginPath();
            context.rect(x, y, standard.width, standard.height);
            context.clip();
            context.drawImage(
              image,
              x + (standard.width - drawWidth) / 2,
              y + (standard.height - drawHeight) / 2,
              drawWidth,
              drawHeight
            );
            context.restore();

            context.strokeStyle = "#d4d4d8";
            context.lineWidth = 2;
            context.strokeRect(x, y, standard.width, standard.height);
          }
        }

        return {
          file: await canvasToFile(canvas, {
            fileName: renameWithSuffix(file.name, "passport-sheet", "png"),
          }),
          summary: `${standard.label} layout exported as ${
            sheetLayout === "single" ? "a single photo" : `${sheetLayout}-photo sheet`
          }.`,
        };
      }}
      settings={
        <>
          <ImageFieldNote label="Photo Standard" help="Pick the output size that matches the document requirement.">
            <select
              className="input default:bg-transparent"
              value={photoStandard}
              onChange={(event) => setPhotoStandard(event.target.value)}
            >
              <option value="35x45">35mm x 45mm</option>
              <option value="2x2">2in x 2in</option>
              <option value="custom">Custom passport layout</option>
            </select>
          </ImageFieldNote>
          <ImageFieldNote label="Sheet Layout" help="Export one photo or a multi-photo printable sheet.">
            <select
              className="input default:bg-transparent"
              value={sheetLayout}
              onChange={(event) => setSheetLayout(event.target.value)}
            >
              <option value="single">Single photo</option>
              <option value="four">4-up sheet</option>
              <option value="eight">8-up sheet</option>
            </select>
          </ImageFieldNote>
        </>
      }
    />
  );
}
