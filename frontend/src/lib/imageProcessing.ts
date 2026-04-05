"use client";

type CanvasFileOptions = {
  fileName: string;
  type?: string;
  quality?: number;
};

export async function loadImageFile(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = "async";

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to load the selected image."));
      image.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  return { canvas, context };
}

export async function canvasToFile(
  canvas: HTMLCanvasElement,
  { fileName, type = "image/png", quality = 0.92 }: CanvasFileOptions
): Promise<File> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => {
        if (value) {
          resolve(value);
          return;
        }

        reject(new Error("Could not export the processed image."));
      },
      type,
      quality
    );
  });

  return new File([blob], fileName, { type });
}

export function renameWithSuffix(fileName: string, suffix: string, extension?: string) {
  const dotIndex = fileName.lastIndexOf(".");
  const baseName = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;
  const currentExtension = dotIndex >= 0 ? fileName.slice(dotIndex + 1) : "png";
  return `${baseName}-${suffix}.${extension || currentExtension}`;
}

export function applyConvolution(
  source: ImageData,
  kernel: number[],
  divisor = 1,
  offset = 0
) {
  const { width, height, data } = source;
  const output = new ImageData(width, height);
  const target = output.data;
  const side = Math.sqrt(kernel.length);
  const radius = Math.floor(side / 2);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      let red = 0;
      let green = 0;
      let blue = 0;

      for (let kernelY = 0; kernelY < side; kernelY += 1) {
        for (let kernelX = 0; kernelX < side; kernelX += 1) {
          const sampleX = Math.min(width - 1, Math.max(0, x + kernelX - radius));
          const sampleY = Math.min(height - 1, Math.max(0, y + kernelY - radius));
          const sampleIndex = (sampleY * width + sampleX) * 4;
          const weight = kernel[kernelY * side + kernelX];

          red += data[sampleIndex] * weight;
          green += data[sampleIndex + 1] * weight;
          blue += data[sampleIndex + 2] * weight;
        }
      }

      target[index] = clampChannel(red / divisor + offset);
      target[index + 1] = clampChannel(green / divisor + offset);
      target[index + 2] = clampChannel(blue / divisor + offset);
      target[index + 3] = data[index + 3];
    }
  }

  return output;
}

export function blurImageData(source: ImageData, radius: number) {
  if (radius <= 0) {
    return new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
  }

  const { width, height, data } = source;
  const output = new Uint8ClampedArray(data.length);
  const diameter = radius * 2 + 1;
  const area = diameter * diameter;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const sampleX = Math.min(width - 1, Math.max(0, x + offsetX));
          const sampleY = Math.min(height - 1, Math.max(0, y + offsetY));
          const sampleIndex = (sampleY * width + sampleX) * 4;

          red += data[sampleIndex];
          green += data[sampleIndex + 1];
          blue += data[sampleIndex + 2];
          alpha += data[sampleIndex + 3];
        }
      }

      const index = (y * width + x) * 4;
      output[index] = clampChannel(red / area);
      output[index + 1] = clampChannel(green / area);
      output[index + 2] = clampChannel(blue / area);
      output[index + 3] = clampChannel(alpha / area);
    }
  }

  return new ImageData(output, width, height);
}

export function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
