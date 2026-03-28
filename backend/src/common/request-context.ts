import { Request } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export function getRequestId(req: Request) {
  return req.requestId ?? null;
}
