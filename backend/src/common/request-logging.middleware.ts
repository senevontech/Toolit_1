import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getRequestId } from './request-context';
import { logStructured } from './structured-logger';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = process.hrtime.bigint();

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const statusCode = res.statusCode;

      logStructured(statusCode >= 500 ? 'error' : 'info', 'http_request', {
        requestId: getRequestId(req),
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        ip: req.ip || req.socket.remoteAddress || null,
        userAgent: req.get('user-agent') ?? null,
      });
    });

    next();
  }
}
