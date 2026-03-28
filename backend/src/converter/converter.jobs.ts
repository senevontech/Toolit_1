import * as fs from 'fs';
import IORedis from 'ioredis';
import * as path from 'path';

export const CONVERSION_JOB_TYPES = [
  'pdf-word',
  'pdf-excel',
  'excel-pdf',
  'pdf-ppt',
  'ppt-pdf',
  'word-pdf',
  'word-html',
] as const;

export type ConversionJobType = (typeof CONVERSION_JOB_TYPES)[number];

export type ConversionJobData = {
  jobType: ConversionJobType;
  filePath: string;
  originalName: string;
  requestId?: string;
};

export type ConversionJobResult = {
  contentType: string;
  downloadName: string;
  outputFilePath: string;
  completedAt: string;
};

export const CONVERSION_QUEUE_NAME = 'conversion-jobs';
export const CONVERSION_OUTPUT_DIR = path.resolve(process.cwd(), 'outputs');
export const CONVERSION_OUTPUT_TTL_MS = Number(
  process.env.CONVERSION_OUTPUT_TTL_MS ?? 60 * 60 * 1000,
);
export const CONVERSION_JOB_ATTEMPTS = Number(
  process.env.CONVERSION_JOB_ATTEMPTS ?? 3,
);
export const CONVERSION_JOB_BACKOFF_MS = Number(
  process.env.CONVERSION_JOB_BACKOFF_MS ?? 2000,
);
export const CONVERSION_COMPLETED_JOB_RETENTION = Number(
  process.env.CONVERSION_COMPLETED_JOB_RETENTION ?? 500,
);
export const CONVERSION_FAILED_JOB_RETENTION = Number(
  process.env.CONVERSION_FAILED_JOB_RETENTION ?? 500,
);

export function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL?.trim() || 'redis://127.0.0.1:6379';
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });
}

export function ensureConversionOutputDir() {
  if (!fs.existsSync(CONVERSION_OUTPUT_DIR)) {
    fs.mkdirSync(CONVERSION_OUTPUT_DIR, { recursive: true });
  }
}

export function cleanupExpiredOutputs() {
  ensureConversionOutputDir();
  const now = Date.now();

  for (const entry of fs.readdirSync(CONVERSION_OUTPUT_DIR)) {
    const filePath = path.join(CONVERSION_OUTPUT_DIR, entry);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > CONVERSION_OUTPUT_TTL_MS) {
      fs.rmSync(filePath, { force: true });
    }
  }
}

export function isConversionJobType(value: string): value is ConversionJobType {
  return CONVERSION_JOB_TYPES.includes(value as ConversionJobType);
}

export function getConversionJobMeta(jobType: ConversionJobType) {
  switch (jobType) {
    case 'pdf-word':
      return {
        contentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        downloadName: 'converted.docx',
      };
    case 'pdf-excel':
      return {
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        downloadName: 'converted.xlsx',
      };
    case 'excel-pdf':
    case 'ppt-pdf':
    case 'word-pdf':
      return {
        contentType: 'application/pdf',
        downloadName: 'converted.pdf',
      };
    case 'pdf-ppt':
      return {
        contentType:
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        downloadName: 'converted.pptx',
      };
    case 'word-html':
      return {
        contentType: 'text/html; charset=utf-8',
        downloadName: 'converted.html',
      };
  }
}
