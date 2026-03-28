import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { createRedisConnection } from './converter/converter.jobs';
import { ConversionQueueService } from './converter/conversion-queue.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly queueService: ConversionQueueService,
  ) {}

  async getReadiness() {
    const mongoReady = this.mongoConnection.readyState === 1;
    const redis = await this.checkRedis();
    const queue = await this.getQueueReadiness(redis.status === 'up');

    return {
      status:
        mongoReady && redis.status === 'up' && queue.status === 'up'
          ? 'ok'
          : 'degraded',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      services: {
        mongo: {
          status: mongoReady ? 'up' : 'down',
        },
        redis,
        queue,
      },
    };
  }

  private async checkRedis() {
    const redis = createRedisConnection();

    try {
      const result = await Promise.race([
        redis.ping(),
        new Promise<'timeout'>((resolve) => {
          setTimeout(() => resolve('timeout'), 1500);
        }),
      ]);

      return {
        status: result === 'PONG' ? 'up' : 'down',
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Redis ping failed',
      };
    } finally {
      try {
        await redis.quit();
      } catch {
        redis.disconnect();
      }
    }
  }

  private async getQueueReadiness(redisReady: boolean) {
    if (!redisReady) {
      return {
        status: 'down',
      };
    }

    try {
      const metrics = await this.queueService.getQueueMetrics();

      return {
        status: 'up',
        ...metrics,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Queue metrics failed',
      };
    }
  }
}
