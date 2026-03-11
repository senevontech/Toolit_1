export const API_URL = "http://localhost:5000";

export async function convertFile(
  endpoint: string,
  file: File,
  downloadName: string
) {

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: formData
  });

  if(!res.ok){
    throw new Error("Conversion failed");
  }

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = downloadName;
  a.click();
}