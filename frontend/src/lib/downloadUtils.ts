/* =================================
   ✅ SINGLE FILE DOWNLOAD
================================= */
export const downloadFile = (
  file: Blob | File,
  filename?: string
) => {
  try {
    const blob =
      file instanceof Blob ? file : new Blob([file]);

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      filename ||
      (file instanceof File ? file.name : "download");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

/* =================================
   ✅ DOWNLOAD MULTIPLE FILES
   (Separate files — NOT ZIP)
================================= */
export const downloadAllFiles = (
  files: (Blob | File)[]
) => {
  if (!files || files.length === 0) return;

  files.forEach((file, index) => {
    setTimeout(() => {
      downloadFile(
        file,
        file instanceof File
          ? file.name
          : `file-${index + 1}`
      );
    }, index * 300); // small delay prevents browser blocking
  });
};