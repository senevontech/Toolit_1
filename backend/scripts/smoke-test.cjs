const assert = require("node:assert/strict");
const path = require("node:path");

const distRoot = path.resolve(process.cwd(), "dist");
const { HealthController } = require(path.join(distRoot, "health.controller.js"));
const { HealthService } = require(path.join(distRoot, "health.service.js"));
const { RateLimitMiddleware } = require(path.join(distRoot, "common", "rate-limit.middleware.js"));

const controller = new HealthController(
  new HealthService(
    { readyState: 1 },
    { getQueueMetrics: async () => ({ counts: {} }) },
  ),
);
const health = controller.getHealth();

assert.equal(health.status, "ok");
assert.equal(typeof health.uptimeSeconds, "number");
assert.equal(typeof health.timestamp, "string");

process.env.RATE_LIMIT_MAX_REQUESTS = "2";
process.env.RATE_LIMIT_WINDOW_MS = "60000";

const middleware = new RateLimitMiddleware();
const req = { ip: "127.0.0.1", socket: { remoteAddress: "127.0.0.1" } };
const headers = new Map();
const res = {
  setHeader(key, value) {
    headers.set(key, value);
  },
};

let lastError;
const next = (error) => {
  lastError = error;
};

middleware.use(req, res, next);
middleware.use(req, res, next);
middleware.use(req, res, next);

assert.ok(lastError instanceof Error);
assert.equal(lastError.message.includes("Too many requests"), true);
assert.equal(headers.has("Retry-After"), true);

console.log("Backend smoke tests passed.");
