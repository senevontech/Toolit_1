import { useState } from "react";
import imageCompression from "browser-image-compression";

export const useImageCompression = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const compressImages = async (
    files: File[],
    quality: number
  ) => {
    setLoading(true);
    setProgress(0);

    try {
      const results: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const options = {
          maxSizeMB: 2,
          useWebWorker: true,
          initialQuality: quality / 100,
          onProgress: (p: number) => setProgress(p),
        };

        const compressed = await imageCompression(
          files[i],
          options
        );

        results.push(compressed);
      }

      return results;
    } catch (error) {
      console.error("Compression failed:", error);
      return [];
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return { compressImages, loading, progress };
};