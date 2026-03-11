import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { convertFile } from '../utils/libreoffice.util';

@Injectable()
export class ConverterService {

  async pdfToWord(filePath: string): Promise<Buffer> {
    return this.convert(filePath, '.docx');
  }

  async pdfToExcel(filePath: string): Promise<Buffer> {
    return this.convert(filePath, '.xlsx');
  }

  async excelToPdf(filePath: string): Promise<Buffer> {
    return this.convert(filePath, '.pdf');
  }

  async pdfToPpt(filePath: string): Promise<Buffer> {
    return this.convert(filePath, '.pptx');
  }

  async pptToPdf(filePath: string): Promise<Buffer> {
    return this.convert(filePath, '.pdf');
  }

  private async convert(filePath: string, ext: string): Promise<Buffer> {
    try {

      if (!fs.existsSync(filePath)) {
        throw new Error('Uploaded file not found');
      }

      const buffer = fs.readFileSync(filePath);

      const result = await convertFile(buffer, ext);

      return result;

    } catch (error) {

      console.error('Conversion failed:', error);

      throw new InternalServerErrorException('File conversion failed');
    }
  }

}