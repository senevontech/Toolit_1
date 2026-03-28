import { Module } from '@nestjs/common';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';
import { ConversionQueueService } from './conversion-queue.service';

@Module({
  controllers: [ConverterController],
  providers: [ConverterService, ConversionQueueService],
  exports: [ConverterService, ConversionQueueService],
})
export class ConverterModule {}
