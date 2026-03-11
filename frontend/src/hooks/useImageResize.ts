import { useState } from "react";

export const useImageResize = () => {
  const [loading, setLoading] = useState(false);

  const resizeImage = (
    file: File,
    width: number,
    height: number
  ): Promise<File> => {
    setLoading(true);

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Resize failed");
              return;
            }

            resolve(
              new File([blob], file.name, {
                type: file.type,
              })
            );
            setLoading(false);
          },
          file.type,
          0.95
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  return { resizeImage, loading };
};