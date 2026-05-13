import {
  BadRequestException,
  Body,
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
import { Request, Response } from 'express';
import * as fs from 'fs';
import { multerConfig } from '../config/multer.config';
import { ConverterService } from './converter.service';
import { ConversionQueueService } from './conversion-queue.service';
import {
  cleanupExpiredOutputs,
  type ConversionJobResult,
  type ConversionJobType,
} from './converter.jobs';

@Controller('converter')
export class ConverterController {
  constructor(
    private readonly queueService: ConversionQueueService,
    private readonly converterService: ConverterService,
  ) {}

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

  @Post('video-mp3')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async videoToMp3(
    @UploadedFile() file: Express.Multer.File,
    @Body('bitrate') bitrate: string,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.videoToMp3(file.path, bitrate);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename=converted.mp3',
    });

    res.send(result);
  }

  @Post('video-compress')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async videoCompress(
    @UploadedFile() file: Express.Multer.File,
    @Body('preset') preset: string,
    @Body('resolution') resolution: string,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.compressVideo(
      file.path,
      preset,
      resolution,
    );

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': 'attachment; filename=compressed.mp4',
    });

    res.send(result);
  }

  @Post('video-cut')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async videoCut(
    @UploadedFile() file: Express.Multer.File,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.cutVideo(
      file.path,
      startTime,
      endTime,
    );

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': 'attachment; filename=clip.mp4',
    });

    res.send(result);
  }

  @Post('pdf-protect')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfProtect(
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');
    if (!password) throw new BadRequestException('Password is required');

    const result = await this.converterService.pdfProtect(file.path, password);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=protected.pdf',
    });

    res.send(result);
  }

  @Post('pdf-unlock')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfUnlock(
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');
    if (!password) throw new BadRequestException('Password is required');

    const result = await this.converterService.pdfUnlock(file.path, password);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=unlocked.pdf',
    });

    res.send(result);
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
