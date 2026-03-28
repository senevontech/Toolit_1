import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getRequestId } from './request-context';
import { logStructured, serializeError } from './structured-logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message = this.resolveMessage(exceptionResponse, exception);
    const requestId = getRequestId(request);

    logStructured(statusCode >= 500 ? 'error' : 'warn', 'http_exception', {
      requestId,
      method: request.method,
      path: request.originalUrl || request.url,
      statusCode,
      message,
      error: serializeError(exception),
    });

    response.status(statusCode).json({
      statusCode,
      message,
      path: request.originalUrl || request.url,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveMessage(exceptionResponse: unknown, exception: unknown) {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = exceptionResponse.message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(', ');
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
