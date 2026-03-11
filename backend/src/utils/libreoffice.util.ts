import * as libre from 'libreoffice-convert';
import { promisify } from 'util';

const libreConvert = promisify(libre.convert);

export async function convertFile(buffer: Buffer, ext: string): Promise<Buffer> {
  try {

    const converted = await libreConvert(buffer, ext, undefined) as Buffer;

    return converted;

  } catch (error) {

    console.error('LibreOffice conversion error:', error);
    throw new Error('Conversion failed');

  }
}