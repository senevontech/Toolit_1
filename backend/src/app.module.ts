import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RequestIdMiddleware } from './common/request-id.middleware';
import { RequestLoggingMiddleware } from './common/request-logging.middleware';
import { RateLimitMiddleware } from './common/rate-limit.middleware';
import { validateBackendEnv } from './config/env.validation';
import { ConverterModule } from './converter/converter.module';
import { DomainModule } from './domain/domain.module';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateBackendEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        onConnectionCreate: () => {
          console.log('MongoDB Atlas connected successfully');
        },
      }),
    }),
    ConverterModule,
    DomainModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, RequestLoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: 'converter/*', method: RequestMethod.ALL });
  }
}
