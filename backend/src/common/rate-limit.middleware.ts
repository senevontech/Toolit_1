import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly store = new Map<string, RateLimitEntry>();
  private readonly limit = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 30);
  private readonly windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const current = this.store.get(key);

    if (!current || current.resetAt <= now) {
      this.store.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      this.cleanup(now);
      return next();
    }

    if (current.count >= this.limit) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000),
      );
      res.setHeader('Retry-After', retryAfterSeconds.toString());
      return next(
        new HttpException(
          `Too many requests. Retry in ${retryAfterSeconds} seconds.`,
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    }

    current.count += 1;
    this.store.set(key, current);
    return next();
  }

  private cleanup(now: number) {
    for (const [key, value] of this.store.entries()) {
      if (value.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }
}
