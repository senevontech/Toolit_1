import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { basename, extname } from 'path';
import { convertFile } from '../utils/libreoffice.util';
import { convertPdfWithPython } from '../utils/python-converter.util';

@Injectable()
export class ConverterService {

  async pdfToWord(filePath: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');
    return convertPdfWithPython('docx', filePath);
  }

  async pdfToExcel(filePath: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');
    return convertPdfWithPython('xlsx', filePath);
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
    return convertPdfWithPython('pptx', filePath);
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

  // 🔐 PROTECT PDF
  async pdfProtect(filePath: string, password: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');

    if (!password) {
      this.rejectUnsupported(filePath, 'Password is required');
    }

    try {
      return await convertPdfWithPython('protect', filePath, password);
    } catch (error) {
      console.error('PDF protect failed:', error);
      throw new InternalServerErrorException('PDF protection failed');
    } finally {
      this.removeUploadedFile(filePath);
    }
  }

  // 🔓 UNLOCK PDF (🔥 THIS WAS MISSING)
  async pdfUnlock(filePath: string, password: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');

    if (!password) {
      this.rejectUnsupported(filePath, 'Password is required');
    }

    try {
      return await convertPdfWithPython('unlock', filePath, password);
    } catch (error) {
      console.error('PDF unlock failed:', error);
      throw new InternalServerErrorException('PDF unlock failed');
    } finally {
      this.removeUploadedFile(filePath);
    }
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