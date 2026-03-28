import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { Job, Queue, QueueEvents } from 'bullmq';
import { logStructured } from '../common/structured-logger';
import {
  CONVERSION_COMPLETED_JOB_RETENTION,
  CONVERSION_FAILED_JOB_RETENTION,
  CONVERSION_JOB_ATTEMPTS,
  CONVERSION_JOB_BACKOFF_MS,
  CONVERSION_QUEUE_NAME,
  createRedisConnection,
  type ConversionJobData,
  type ConversionJobResult,
  type ConversionJobType,
} from './converter.jobs';

type QueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

@Injectable()
export class ConversionQueueService implements OnModuleDestroy {
  private readonly connection = createRedisConnection();
  private readonly eventsConnection = createRedisConnection();
  private readonly queueEvents = new QueueEvents(CONVERSION_QUEUE_NAME, {
    connection: this.eventsConnection,
  });
  private readonly queue = new Queue<ConversionJobData, ConversionJobResult>(
    CONVERSION_QUEUE_NAME,
    {
      connection: this.connection,
      defaultJobOptions: {
        attempts: CONVERSION_JOB_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: CONVERSION_JOB_BACKOFF_MS,
        },
        removeOnFail: {
          count: CONVERSION_FAILED_JOB_RETENTION,
        },
        removeOnComplete: {
          count: CONVERSION_COMPLETED_JOB_RETENTION,
        },
      },
    },
  );

  constructor() {
    this.queueEvents.on('stalled', ({ jobId }) => {
      logStructured('warn', 'conversion_job_stalled', {
        jobId,
      });
    });
  }

  async enqueue(
    jobType: ConversionJobType,
    filePath: string,
    originalName: string,
    requestId?: string,
  ) {
    const job = await this.queue.add(jobType, {
      jobType,
      filePath,
      originalName,
      requestId,
    });

    return job.id?.toString() ?? '';
  }

  async getJob(jobId: string) {
    const job = await this.queue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Conversion job ${jobId} was not found.`);
    }

    return job;
  }

  async getJobStatus(jobId: string) {
    const job = await this.getJob(jobId);
    const state = await job.getState();

    return {
      job,
      status: this.mapStateToStatus(state),
    };
  }

  async getQueueMetrics() {
    const counts = await this.queue.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused',
    );

    return {
      counts,
      configuration: {
        attempts: CONVERSION_JOB_ATTEMPTS,
        backoffMs: CONVERSION_JOB_BACKOFF_MS,
        completedRetention: CONVERSION_COMPLETED_JOB_RETENTION,
        failedRetention: CONVERSION_FAILED_JOB_RETENTION,
      },
    };
  }

  async onModuleDestroy() {
    await this.queueEvents.close();
    await this.eventsConnection.quit();
    await this.queue.close();
    await this.connection.quit();
  }

  private mapStateToStatus(
    state: Awaited<ReturnType<Job['getState']>>,
  ): QueueStatus {
    if (state === 'completed') {
      return 'completed';
    }

    if (state === 'failed') {
      return 'failed';
    }

    if (state === 'active') {
      return 'processing';
    }

    return 'queued';
  }
}
