import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { basename, extname } from 'path';
import { convertFile } from '../utils/libreoffice.util';

@Injectable()
export class ConverterService {
  async pdfToWord(filePath: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');
    this.rejectUnsupported(
      filePath,
      'PDF to Word is not supported by the current LibreOffice-based backend.',
    );
  }

  async pdfToExcel(filePath: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');
    this.rejectUnsupported(
      filePath,
      'PDF to Excel is not supported by the current LibreOffice-based backend.',
    );
  }

  async excelToPdf(filePath: string): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.xls', '.xlsx'],
      'Please upload an Excel file (.xls or .xlsx).',
    );
    return this.convert(filePath, 'pdf');
  }

  async pdfToPpt(filePath: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');
    this.rejectUnsupported(
      filePath,
      'PDF to PowerPoint is not supported by the current LibreOffice-based backend.',
    );
  }

  async pptToPdf(filePath: string): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.ppt', '.pptx'],
      'Please upload a PowerPoint file (.ppt or .pptx).',
    );
    return this.convert(filePath, 'pdf');
  }

  async wordToPdf(filePath: string): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.doc', '.docx'],
      'Please upload a Word file (.doc or .docx).',
    );
    return this.convert(filePath, 'pdf');
  }

  async wordToHtml(filePath: string): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.doc', '.docx'],
      'Please upload a Word file (.doc or .docx).',
    );
    return this.convert(filePath, 'html');
  }

  private async convert(filePath: string, format: string): Promise<Buffer> {
    try {

      if (!fs.existsSync(filePath)) {
        throw new Error('Uploaded file not found');
      }

      const buffer = fs.readFileSync(filePath);
      const sourceFileName = basename(filePath);

      const result = await convertFile(buffer, format, sourceFileName);

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Conversion failed:', error);
      throw new InternalServerErrorException('File conversion failed');
    } finally {
      this.removeUploadedFile(filePath);
    }
  }

  private ensureExtension(
    filePath: string,
    allowedExtensions: string[],
    message: string,
  ): void {
    const extension = extname(filePath).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      this.rejectUnsupported(filePath, message);
    }
  }

  private rejectUnsupported(filePath: string, message: string): never {
    this.removeUploadedFile(filePath);
    throw new BadRequestException(message);
  }

  private removeUploadedFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
