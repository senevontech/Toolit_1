import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { NextFunction, Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { logStructured } from './common/structured-logger';

function resolveFrontendDistDir() {
  const candidates = [
    resolve(process.cwd(), '../frontend/dist'),
    resolve(process.cwd(), 'frontend/dist'),
    resolve(__dirname, '../../frontend/dist'),
    resolve(__dirname, '../../../frontend/dist'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, '');
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.disable('x-powered-by');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  const corsOrigins = (
    process.env.ALLOWED_ORIGINS ??
    process.env.CORS_ORIGIN ??
    process.env.FRONTEND_URL ??
    'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001'
  )
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const frontendDistDir = resolveFrontendDistDir();

  if (frontendDistDir) {
    app.useStaticAssets(frontendDistDir, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          return;
        }

        if (filePath.includes(`${join('_next', 'static')}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return;
        }

        res.setHeader('Cache-Control', 'public, max-age=3600');
      },
    });

    app
      .getHttpAdapter()
      .getInstance()
      .get(/.*/, (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
          return next();
        }

        if (req.path.startsWith('/converter') || req.path.startsWith('/api')) {
          return next();
        }

        if (req.path.includes('.')) {
          return res.status(404).end();
        }

        const normalizedPath = req.path === '/' ? '' : req.path.replace(/^\/+|\/+$/g, '');
        const routeHtmlPath = normalizedPath
          ? join(frontendDistDir, ...normalizedPath.split('/'), 'index.html')
          : join(frontendDistDir, 'index.html');

        if (existsSync(routeHtmlPath)) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          return res.sendFile(routeHtmlPath);
        }

        const notFoundPage = join(frontendDistDir, '404.html');
        if (existsSync(notFoundPage)) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          return res.status(404).sendFile(notFoundPage);
        }

        return res.status(404).end();
      });
  }

  const port = Number(process.env.PORT) || 5000;
  await app.listen(port, '0.0.0.0');

  logStructured('info', 'server_started', {
    port,
    bind: '0.0.0.0',
    allowedCorsOrigins: corsOrigins,
    frontendDistDir,
  });
}

bootstrap();
