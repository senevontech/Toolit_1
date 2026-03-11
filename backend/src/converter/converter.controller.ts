import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException
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

    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

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

    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

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

    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

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

    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

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

    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

    const result = await this.converterService.pptToPdf(file.path);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });

    res.send(result);
  }

}