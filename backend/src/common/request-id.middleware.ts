import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { REQUEST_ID_HEADER } from './request-context';

function normalizeRequestId(value: string | string[] | undefined) {
  if (!value) {
    return null;
  }

  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw.trim();

  if (!trimmed || trimmed.length > 128) {
    return null;
  }

  return trimmed;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId =
      normalizeRequestId(req.headers[REQUEST_ID_HEADER]) ?? randomUUID();

    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  }
}
