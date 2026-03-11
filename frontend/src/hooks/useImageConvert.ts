import { useState } from "react";

export const useImageConvert = () => {
  const [loading, setLoading] = useState(false);

  const convertImage = (
    file: File,
    format: string,
    quality = 0.9
  ): Promise<File> => {
    setLoading(true);

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Conversion failed");
              return;
            }

            resolve(
              new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ""),
                { type: format }
              )
            );
            setLoading(false);
          },
          format,
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  return { convertImage, loading };
};