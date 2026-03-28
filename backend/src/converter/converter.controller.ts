import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { ConversionQueueService } from './conversion-queue.service';
import {
  cleanupExpiredOutputs,
  type ConversionJobResult,
  type ConversionJobType,
} from './converter.jobs';

@Controller('converter')
export class ConverterController {
  constructor(private readonly queueService: ConversionQueueService) {}

  @Post('pdf-word')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfToWord(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('pdf-word', file, req.requestId);
  }

  @Post('pdf-excel')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfToExcel(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('pdf-excel', file, req.requestId);
  }

  @Post('excel-pdf')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async excelToPdf(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('excel-pdf', file, req.requestId);
  }

  @Post('pdf-ppt')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfToPpt(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('pdf-ppt', file, req.requestId);
  }

  @Post('ppt-pdf')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pptToPdf(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('ppt-pdf', file, req.requestId);
  }

  @Post('word-pdf')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async wordToPdf(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('word-pdf', file, req.requestId);
  }

  @Post('word-html')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async wordToHtml(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.enqueueConversion('word-html', file, req.requestId);
  }

  @Get('jobs/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    cleanupExpiredOutputs();

    const { job, status } = await this.queueService.getJobStatus(jobId);

    if (status === 'completed') {
      return {
        jobId,
        status,
        downloadUrl: `/converter/jobs/${jobId}/download`,
        completedAt: (job.returnvalue as ConversionJobResult | undefined)?.completedAt,
      };
    }

    if (status === 'failed') {
      return {
        jobId,
        status,
        error: job.failedReason || 'Conversion failed',
      };
    }

    return {
      jobId,
      status,
    };
  }

  @Get('jobs/:jobId/download')
  async downloadJobResult(
    @Param('jobId') jobId: string,
    @Res() res: Response,
  ) {
    cleanupExpiredOutputs();

    const { job, status } = await this.queueService.getJobStatus(jobId);
    if (status !== 'completed') {
      throw new BadRequestException(`Conversion job ${jobId} is not ready yet.`);
    }

    const result = job.returnvalue as ConversionJobResult | undefined;
    if (!result || !fs.existsSync(result.outputFilePath)) {
      throw new NotFoundException(`Conversion output for job ${jobId} is unavailable.`);
    }

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename=${result.downloadName}`,
    });

    const stream = fs.createReadStream(result.outputFilePath);
    stream.pipe(res);
  }

  private async enqueueConversion(
    jobType: ConversionJobType,
    file: Express.Multer.File,
    requestId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

    let jobId: string;

    try {
      jobId = await this.queueService.enqueue(
        jobType,
        file.path,
        file.originalname,
        requestId,
      );
    } catch (error) {
      fs.rmSync(file.path, { force: true });
      throw error;
    }

    return {
      jobId,
      requestId,
      status: 'queued',
    };
  }
}
