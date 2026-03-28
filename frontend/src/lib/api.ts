import { getPublicApiUrl } from "@/lib/env";

export const API_URL = getPublicApiUrl();
const JOB_POLL_INTERVAL_MS = 1200;
const JOB_TIMEOUT_MS = 3 * 60 * 1000;

type ConversionJobStatus =
  | { jobId: string; status: "queued" | "processing" }
  | { jobId: string; status: "completed"; downloadUrl: string; completedAt?: string }
  | { jobId: string; status: "failed"; error?: string };

export async function convertFile(
  endpoint: string,
  file: File,
  downloadName: string
) {
  if (!API_URL) {
    throw new Error(
      "Frontend is missing NEXT_PUBLIC_API_URL. Set it before deploying."
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const message = await getErrorMessage(res);
    throw new Error(message || "Conversion failed");
  }

  const payload = (await res.json()) as { jobId?: string; status?: string };
  if (!payload.jobId) {
    throw new Error("Conversion queue did not return a job id.");
  }

  const status = await waitForJob(payload.jobId);
  if (status.status === "failed") {
    throw new Error(status.error || "Conversion failed");
  }

  if (status.status !== "completed") {
    throw new Error("Conversion did not complete successfully.");
  }

  const blob = await downloadJobResult(status.downloadUrl);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = downloadName;
  a.click();
  URL.revokeObjectURL(url);
}

async function waitForJob(jobId: string): Promise<ConversionJobStatus> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < JOB_TIMEOUT_MS) {
    const res = await fetch(`${API_URL}/converter/jobs/${jobId}`, {
      method: "GET"
    });

    if (!res.ok) {
      const message = await getErrorMessage(res);
      throw new Error(message || "Failed to read conversion job status");
    }

    const payload = (await res.json()) as ConversionJobStatus;

    if (payload.status === "completed" || payload.status === "failed") {
      return payload;
    }

    await delay(JOB_POLL_INTERVAL_MS);
  }

  throw new Error("Conversion timed out. Please try again.");
}

async function downloadJobResult(downloadUrl: string) {
  const absoluteUrl = downloadUrl.startsWith("http")
    ? downloadUrl
    : `${API_URL}${downloadUrl}`;

  const res = await fetch(absoluteUrl, {
    method: "GET"
  });

  if (!res.ok) {
    const message = await getErrorMessage(res);
    throw new Error(message || "Failed to download converted file");
  }

  return res.blob();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
