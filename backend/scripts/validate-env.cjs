const fs = require("node:fs");
const path = require("node:path");

const envPath = path.resolve(process.cwd(), ".env.example");

if (!fs.existsSync(envPath)) {
  throw new Error("backend/.env.example is missing.");
}

const requiredKeys = [
  "PORT",
  "MONGO_URI",
  "ALLOWED_ORIGINS",
  "RATE_LIMIT_MAX_REQUESTS",
  "RATE_LIMIT_WINDOW_MS",
  "REDIS_URL",
  "CONVERTER_WORKER_CONCURRENCY",
  "CONVERSION_OUTPUT_TTL_MS",
  "CONVERSION_JOB_ATTEMPTS",
  "CONVERSION_JOB_BACKOFF_MS",
  "CONVERSION_COMPLETED_JOB_RETENTION",
  "CONVERSION_FAILED_JOB_RETENTION",
];

const content = fs.readFileSync(envPath, "utf8");

for (const key of requiredKeys) {
  if (!content.includes(`${key}=`)) {
    throw new Error(`backend/.env.example is missing ${key}.`);
  }
}

console.log("Backend env validation passed.");
