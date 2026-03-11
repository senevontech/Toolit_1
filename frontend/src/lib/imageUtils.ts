export const resizeImage = (
  file: File,
  width: number,
  height: number
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob)
          resolve(
            new File([blob], file.name, {
              type: file.type,
            })
          );
      }, file.type);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const convertImageFormat = (
  file: File,
  format: string,
  quality = 0.9
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob)
            resolve(
              new File([blob], file.name, {
                type: format,
              })
            );
        },
        format,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};