export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024)
    return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
};

export const calculateReduction = (
  original: number,
  compressed: number
) => {
  return (
    ((original - compressed) / original) * 100
  ).toFixed(1);
};