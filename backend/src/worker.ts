import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { logStructured, serializeError } from './common/structured-logger';

async function bootstrapWorker() {
  await NestFactory.createApplicationContext(WorkerModule);
  logStructured('info', 'conversion_worker_started', {});
}

bootstrapWorker().catch((error) => {
  logStructured('error', 'conversion_worker_boot_failed', {
    error: serializeError(error),
  });
  process.exit(1);
});
