export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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
    const message = await getErrorMessage(res);
    throw new Error(message || "Conversion failed");
  }

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = downloadName;
  a.click();
  URL.revokeObjectURL(url);
}

async function getErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = await res.json().catch(() => null);

    if (typeof payload?.message === "string") {
      return payload.message;
    }

    if (Array.isArray(payload?.message)) {
      return payload.message.join(", ");
    }
  }

  return res.text().catch(() => "");
}
