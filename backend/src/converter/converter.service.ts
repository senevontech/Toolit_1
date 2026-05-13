import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import { spawn } from 'child_process';
import { extname, join } from 'path';
import { convertWithPython } from '../utils/python-converter.util';

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
    return convertWithPython('docx', filePath);
  }

  async pdfToExcel(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.pdf'],
      allowedMimeTypes: ['application/pdf'],
      message: 'Please upload a valid PDF file.',
    });
    return convertWithPython('xlsx', filePath);
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
    return convertWithPython('excel_pdf', filePath);
  }

  async pdfToPpt(filePath: string): Promise<Buffer> {
    await this.validateUploadedFile(filePath, {
      allowedExtensions: ['.pdf'],
      allowedMimeTypes: ['application/pdf'],
      message: 'Please upload a valid PDF file.',
    });
    return convertWithPython('pptx', filePath);
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
    return convertWithPython('ppt_pdf', filePath);
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
    return convertWithPython('word_pdf', filePath);
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
    return convertWithPython('word_html', filePath);
  }

  async videoToMp3(filePath: string, bitrate = '192k'): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.mp4', '.mov', '.m4v', '.webm', '.mkv', '.avi'],
      'Please upload a video file.',
    );

    const safeBitrate = ['128k', '192k', '256k', '320k'].includes(bitrate)
      ? bitrate
      : '192k';
    return this.convertWithFfmpeg(filePath, 'mp3', [
      '-vn',
      '-acodec',
      'libmp3lame',
      '-b:a',
      safeBitrate,
    ]);
  }

  async compressVideo(
    filePath: string,
    preset = 'balanced',
    resolution = 'original',
  ): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.mp4', '.mov', '.m4v', '.webm', '.mkv', '.avi'],
      'Please upload a video file.',
    );

    const crfByPreset: Record<string, string> = {
      balanced: '25',
      smaller: '30',
      maximum: '34',
    };
    const scaleByResolution: Record<string, string | null> = {
      original: null,
      '1080p': 'scale=-2:1080',
      '720p': 'scale=-2:720',
      '480p': 'scale=-2:480',
    };

    const args = [
      '-vcodec',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      crfByPreset[preset] ?? crfByPreset.balanced,
      '-acodec',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
    ];
    const scale = scaleByResolution[resolution] ?? null;
    if (scale) {
      args.unshift('-vf', scale);
    }

    return this.convertWithFfmpeg(filePath, 'mp4', args);
  }

  async cutVideo(
    filePath: string,
    startTime: string,
    endTime: string,
  ): Promise<Buffer> {
    this.ensureExtension(
      filePath,
      ['.mp4', '.mov', '.m4v', '.webm', '.mkv', '.avi'],
      'Please upload a video file.',
    );

    if (!this.isValidTime(startTime) || !this.isValidTime(endTime)) {
      this.rejectUnsupported(filePath, 'Start and end time are required.');
    }

    return this.convertWithFfmpeg(filePath, 'mp4', [
      '-ss',
      startTime,
      '-to',
      endTime,
      '-vcodec',
      'libx264',
      '-acodec',
      'aac',
      '-movflags',
      '+faststart',
    ]);
  }

  // 🔐 PROTECT PDF
  async pdfProtect(filePath: string, password: string): Promise<Buffer> {
    this.ensureExtension(filePath, ['.pdf'], 'Please upload a PDF file.');

    if (!password) {
      this.rejectUnsupported(filePath, 'Password is required');
    }

    try {
      return await convertWithPython('protect', filePath, password);
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
      return await convertWithPython('unlock', filePath, password);
    } catch (error) {
      console.error('PDF unlock failed:', error);
      throw new InternalServerErrorException('PDF unlock failed');
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

  private convertWithFfmpeg(
    inputFilePath: string,
    outputExtension: string,
    args: string[],
  ): Promise<Buffer> {
    const outputFilePath = join(
      os.tmpdir(),
      `converted_${Date.now()}_${Math.round(Math.random() * 1e9)}.${outputExtension}`,
    );

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-i',
        inputFilePath,
        ...args,
        outputFilePath,
      ]);

      let stderr = '';
      ffmpeg.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      ffmpeg.on('error', (error: Error) => {
        this.removeUploadedFile(inputFilePath);
        reject(
          new InternalServerErrorException(
            `FFmpeg is not installed or not available in PATH. ${error.message}`,
          ),
        );
      });

      ffmpeg.on('close', (code: number) => {
        this.removeUploadedFile(inputFilePath);

        if (code !== 0) {
          this.removeUploadedFile(outputFilePath);
          reject(
            new InternalServerErrorException(
              `Video conversion failed. ${stderr || 'FFmpeg returned an error.'}`,
            ),
          );
          return;
        }

        if (!fs.existsSync(outputFilePath)) {
          reject(new InternalServerErrorException('Output file not generated.'));
          return;
        }

        try {
          const buffer = fs.readFileSync(outputFilePath);
          this.removeUploadedFile(outputFilePath);
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private isValidTime(value: string): boolean {
    return /^\d+(\.\d+)?$/.test(value) || /^\d{1,2}:\d{2}(:\d{2})?(\.\d+)?$/.test(value);
  }
}
