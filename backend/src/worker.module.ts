import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateBackendEnv } from './config/env.validation';
import { ConverterModule } from './converter/converter.module';
import { ConversionWorkerService } from './converter/conversion-worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateBackendEnv,
    }),
    ConverterModule,
  ],
  providers: [ConversionWorkerService],
})
export class WorkerModule {}
