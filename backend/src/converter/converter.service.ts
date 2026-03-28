import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { basename, extname } from 'path';
import { convertFile } from '../utils/libreoffice.util';
import { convertPdfWithPython } from '../utils/python-converter.util';

type ValidationOptions = {
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  allowLegacyCfb?: boolean;
  message: string;
};

@Injectable()
export class ConverterService {
  async pdfToWord(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.pdf'],
      allowedMimeTypes: ['application/pdf'],
      message: 'Please upload a valid PDF file.',
    });
    return convertPdfWithPython('docx', filePath);
  }

  async pdfToExcel(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.pdf'],
      allowedMimeTypes: ['application/pdf'],
      message: 'Please upload a valid PDF file.',
    });
    return convertPdfWithPython('xlsx', filePath);
  }

  async excelToPdf(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.xls', '.xlsx'],
      allowedMimeTypes: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      allowLegacyCfb: true,
      message: 'Please upload a valid Excel file (.xls or .xlsx).',
    });
    return this.convert(filePath, 'pdf');
  }

  async pdfToPpt(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.pdf'],
      allowedMimeTypes: ['application/pdf'],
      message: 'Please upload a valid PDF file.',
    });
    return convertPdfWithPython('pptx', filePath);
  }

  async pptToPdf(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.ppt', '.pptx'],
      allowedMimeTypes: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
      allowLegacyCfb: true,
      message: 'Please upload a valid PowerPoint file (.ppt or .pptx).',
    });
    return this.convert(filePath, 'pdf');
  }

  async wordToPdf(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.doc', '.docx'],
      allowedMimeTypes: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      allowLegacyCfb: true,
      message: 'Please upload a valid Word file (.doc or .docx).',
    });
    return this.convert(filePath, 'pdf');
  }

  async wordToHtml(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.doc', '.docx'],
      allowedMimeTypes: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      allowLegacyCfb: true,
      message: 'Please upload a valid Word file (.doc or .docx).',
    });
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

  private ensureExtension(filePath: string, allowedExtensions: string[], message: string): void {
    const extension = extname(filePath).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      this.rejectUnsupported(filePath, message);
    }
  }

  private async validateUploadedFile(
    filePath: string,
    options: ValidationOptions,
  ): Promise<void> {
    this.ensureExtension(filePath, options.allowedExtensions, options.message);

    const buffer = fs.readFileSync(filePath);
    const detectedType = await this.detectFileType(buffer);

    if (!detectedType) {
      return;
    }

    if (options.allowedMimeTypes.includes(detectedType.mime)) {
      return;
    }

    if (options.allowLegacyCfb && detectedType.mime === 'application/x-cfb') {
      return;
    }

    this.rejectUnsupported(filePath, options.message);
  }

  private async detectFileType(
    buffer: Buffer,
  ): Promise<{ mime: string; ext?: string } | null> {
    const { fileTypeFromBuffer } = await import('file-type');
    return fileTypeFromBuffer(buffer);
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
