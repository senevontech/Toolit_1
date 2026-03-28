import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Worker } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { ConverterService } from './converter.service';
import { logStructured, serializeError } from '../common/structured-logger';
import {
  cleanupExpiredOutputs,
  CONVERSION_OUTPUT_DIR,
  CONVERSION_QUEUE_NAME,
  createRedisConnection,
  ensureConversionOutputDir,
  getConversionJobMeta,
  type ConversionJobData,
  type ConversionJobResult,
} from './converter.jobs';

@Injectable()
export class ConversionWorkerService implements OnModuleDestroy {
  private readonly connection = createRedisConnection();
  private readonly concurrency = Number(
    process.env.CONVERTER_WORKER_CONCURRENCY ?? 2,
  );
  private readonly worker = new Worker<ConversionJobData, ConversionJobResult>(
    CONVERSION_QUEUE_NAME,
    async (job) => this.process(job.data),
    {
      connection: this.connection,
      concurrency: this.concurrency,
    },
  );

  constructor(private readonly converterService: ConverterService) {
    ensureConversionOutputDir();

    this.worker.on('completed', (job) => {
      logStructured('info', 'conversion_job_completed', {
        jobId: job.id?.toString() ?? null,
        jobType: job.name,
        requestId: job.data.requestId ?? null,
      });
    });

    this.worker.on('failed', (job, error) => {
      logStructured('error', 'conversion_job_failed', {
        jobId: job?.id?.toString() ?? null,
        jobType: job?.name ?? null,
        requestId: job?.data.requestId ?? null,
        error: serializeError(error),
      });
    });
  }

  async onModuleDestroy() {
    await this.worker.close();
    await this.connection.quit();
  }

  private async process(data: ConversionJobData): Promise<ConversionJobResult> {
    cleanupExpiredOutputs();

    const meta = getConversionJobMeta(data.jobType);
    const extension = path.extname(meta.downloadName);
    const outputFilePath = path.join(
      CONVERSION_OUTPUT_DIR,
      `${randomUUID()}${extension}`,
    );

    try {
      let buffer: Buffer;
      switch (data.jobType) {
        case 'pdf-word':
          buffer = await this.converterService.pdfToWord(data.filePath);
          break;
        case 'pdf-excel':
          buffer = await this.converterService.pdfToExcel(data.filePath);
          break;
        case 'excel-pdf':
          buffer = await this.converterService.excelToPdf(data.filePath);
          break;
        case 'pdf-ppt':
          buffer = await this.converterService.pdfToPpt(data.filePath);
          break;
        case 'ppt-pdf':
          buffer = await this.converterService.pptToPdf(data.filePath);
          break;
        case 'word-pdf':
          buffer = await this.converterService.wordToPdf(data.filePath);
          break;
        case 'word-html':
          buffer = await this.converterService.wordToHtml(data.filePath);
          break;
      }

      fs.writeFileSync(outputFilePath, buffer);

      return {
        contentType: meta.contentType,
        downloadName: meta.downloadName,
        outputFilePath,
        completedAt: new Date().toISOString(),
      };
    } finally {
      fs.rmSync(data.filePath, { force: true });
    }
  }
}
