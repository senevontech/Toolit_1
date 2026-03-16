import * as fs from 'fs';
import * as libre from 'libreoffice-convert';
import { dirname } from 'path';

const DEFAULT_SOFFICE_BINARY_PATH =
  'C:\\Program Files\\LibreOffice\\program\\soffice.exe';

function getSofficeBinaryPaths(): string[] {
  const configuredPath =
    process.env.LIBREOFFICE_PATH ?? DEFAULT_SOFFICE_BINARY_PATH;
  const normalizedPath = configuredPath.replace(/\//g, '\\');
  const candidatePaths = [normalizedPath];

  if (/soffice\.exe$/i.test(normalizedPath)) {
    candidatePaths.unshift(normalizedPath.replace(/soffice\.exe$/i, 'soffice.com'));
  }

  return Array.from(
    new Set(candidatePaths.filter((candidatePath) => fs.existsSync(candidatePath))),
  );
}

const SOFFICE_BINARY_PATHS = getSofficeBinaryPaths();
const SOFFICE_WORKING_DIRECTORY =
  SOFFICE_BINARY_PATHS[0] ? dirname(SOFFICE_BINARY_PATHS[0]) : undefined;

export async function convertFile(
  buffer: Buffer,
  format: string,
  fileName: string,
): Promise<Buffer> {
  try {
    const convertOptions = {
      fileName,
      sofficeBinaryPaths: SOFFICE_BINARY_PATHS,
      execOptions: SOFFICE_WORKING_DIRECTORY
        ? { cwd: SOFFICE_WORKING_DIRECTORY }
        : {},
    } as Parameters<typeof libre.convertWithOptions>[3] & {
      execOptions?: { cwd?: string };
    };

    const converted = await new Promise<Buffer>((resolve, reject) => {
      libre.convertWithOptions(
        buffer,
        format,
        undefined,
        convertOptions,
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Conversion failed'));
            return;
          }

          resolve(result);
        },
      );
    });

    return converted;
  } catch (error) {
    console.error('LibreOffice conversion error:', error);
    throw new Error('Conversion failed');
  }
}
