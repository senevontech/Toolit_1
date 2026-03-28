type BackendEnv = {
  PORT?: string;
  MONGO_URI?: string;
  ALLOWED_ORIGINS?: string;
  CORS_ORIGIN?: string;
  FRONTEND_URL?: string;
  LIBREOFFICE_PATH?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;
  RATE_LIMIT_WINDOW_MS?: string;
  REDIS_URL?: string;
  CONVERTER_WORKER_CONCURRENCY?: string;
  CONVERSION_OUTPUT_TTL_MS?: string;
  CONVERSION_JOB_ATTEMPTS?: string;
  CONVERSION_JOB_BACKOFF_MS?: string;
  CONVERSION_COMPLETED_JOB_RETENTION?: string;
  CONVERSION_FAILED_JOB_RETENTION?: string;
};

function requireNumber(value: string | undefined, key: string, fallback: number) {
  if (value === undefined || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive number.`);
  }
  return parsed;
}

function validateOptionalUrlList(value: string | undefined, key: string) {
  if (!value) return;
  const urls = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  for (const url of urls) {
    try {
      new URL(url);
    } catch {
      throw new Error(`${key} contains an invalid URL: ${url}`);
    }
  }
}

export function validateBackendEnv(config: BackendEnv) {
  if (!config.MONGO_URI?.trim()) {
    throw new Error('MONGO_URI is required.');
  }

  requireNumber(config.PORT, 'PORT', 5000);
  requireNumber(config.RATE_LIMIT_MAX_REQUESTS, 'RATE_LIMIT_MAX_REQUESTS', 30);
  requireNumber(config.RATE_LIMIT_WINDOW_MS, 'RATE_LIMIT_WINDOW_MS', 60000);
  requireNumber(
    config.CONVERTER_WORKER_CONCURRENCY,
    'CONVERTER_WORKER_CONCURRENCY',
    2,
  );
  requireNumber(
    config.CONVERSION_OUTPUT_TTL_MS,
    'CONVERSION_OUTPUT_TTL_MS',
    60 * 60 * 1000,
  );
  requireNumber(
    config.CONVERSION_JOB_ATTEMPTS,
    'CONVERSION_JOB_ATTEMPTS',
    3,
  );
  requireNumber(
    config.CONVERSION_JOB_BACKOFF_MS,
    'CONVERSION_JOB_BACKOFF_MS',
    2000,
  );
  requireNumber(
    config.CONVERSION_COMPLETED_JOB_RETENTION,
    'CONVERSION_COMPLETED_JOB_RETENTION',
    500,
  );
  requireNumber(
    config.CONVERSION_FAILED_JOB_RETENTION,
    'CONVERSION_FAILED_JOB_RETENTION',
    500,
  );
  validateOptionalUrlList(config.ALLOWED_ORIGINS, 'ALLOWED_ORIGINS');
  validateOptionalUrlList(config.CORS_ORIGIN, 'CORS_ORIGIN');
  validateOptionalUrlList(config.FRONTEND_URL, 'FRONTEND_URL');
  validateOptionalUrlList(config.REDIS_URL, 'REDIS_URL');

  return config;
}
