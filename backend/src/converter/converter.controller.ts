import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
  Body,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ConverterService } from './converter.service';
import { multerConfig } from '../config/multer.config';
import { Response } from 'express';

@Controller('converter')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post('pdf-word')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfToWord(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.pdfToWord(file.path);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=converted.docx',
    });

    res.send(result);
  }

  @Post('pdf-excel')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfToExcel(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.pdfToExcel(file.path);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=converted.xlsx',
    });

    res.send(result);
  }

  @Post('excel-pdf')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async excelToPdf(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.excelToPdf(file.path);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });

    res.send(result);
  }

  @Post('pdf-ppt')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfToPpt(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.pdfToPpt(file.path);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': 'attachment; filename=converted.pptx',
    });

    res.send(result);
  }

  @Post('ppt-pdf')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pptToPdf(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.pptToPdf(file.path);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });

    res.send(result);
  }

  @Post('word-pdf')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async wordToPdf(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.wordToPdf(file.path);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });

    res.send(result);
  }

  @Post('word-html')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async wordToHtml(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');

    const result = await this.converterService.wordToHtml(file.path);

    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'attachment; filename=converted.html',
    });

    res.send(result);
  }

  // 🔐 PROTECT PDF
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

    const result = await this.converterService.pdfProtect(
      file.path,
      password,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=protected.pdf',
    });

    res.send(result);
  }

  // 🔓 UNLOCK PDF (FINAL ADD)
  @Post('pdf-unlock')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async pdfUnlock(
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('File not uploaded');
    if (!password) throw new BadRequestException('Password is required');

    const result = await this.converterService.pdfUnlock(
      file.path,
      password,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=unlocked.pdf',
    });

    res.send(result);
  }
}
