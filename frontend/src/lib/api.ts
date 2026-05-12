const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_URL =
  rawApiUrl && rawApiUrl.length > 0
    ? rawApiUrl.replace(/\/$/, "")
    : process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:5000"
      : "";

export function apiEndpoint(endpoint: string) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}${normalizedEndpoint}`;
}

export async function convertFile(
  endpoint: string,
  file: File,
  downloadName: string,
  fields: Record<string, string> = {}
) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const res = await fetch(apiEndpoint(endpoint), {
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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
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
