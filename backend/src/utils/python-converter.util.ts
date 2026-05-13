import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function resolveScriptPath(): string {
  const candidates = [
    path.join(__dirname, '..', 'scripts', 'convert_pdf.py'),
    path.join(__dirname, '..', '..', 'src', 'scripts', 'convert_pdf.py'),
    path.join(process.cwd(), 'src', 'scripts', 'convert_pdf.py'),
    path.join(process.cwd(), 'dist', 'scripts', 'convert_pdf.py'),
  ];

  const scriptPath = candidates.find((candidate) => fs.existsSync(candidate));
  return scriptPath ?? candidates[0];
}

const SCRIPT_PATH = resolveScriptPath();

function getPythonBin(): string {
  return process.platform === 'win32' ? 'python' : 'python3';
}

export type PythonConversionMode =
  | 'docx'
  | 'xlsx'
  | 'pptx'
  | 'protect'
  | 'unlock'
  | 'excel_pdf'
  | 'ppt_pdf'
  | 'word_pdf'
  | 'word_html';

function getOutputExtension(mode: PythonConversionMode): string {
  if (mode === 'protect' || mode === 'unlock') return 'pdf';
  if (mode.endsWith('_pdf')) return 'pdf';
  if (mode === 'word_html') return 'html';
  return mode;
}

/**
 * Run the Python conversion engine.
 */
export async function convertWithPython(
  mode: PythonConversionMode,
  inputFilePath: string,
  password?: string
): Promise<Buffer> {

  const ext = getOutputExtension(mode);

  const outputFilePath = path.join(
    os.tmpdir(),
    `converted_${Date.now()}.${ext}`,
  );

  return new Promise((resolve, reject) => {

    const args = [
      SCRIPT_PATH,
      mode,
      inputFilePath,
      outputFilePath,
    ];

    // 🔥 support BOTH protect + unlock
    if ((mode === 'protect' || mode === 'unlock') && password) {
      args.push(password);
    }

    console.log('Running Python converter:', args);

    const py = spawn(getPythonBin(), args);

    let stderr = '';

    py.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    py.on('close', (code: number) => {

      // delete uploaded input file
      if (fs.existsSync(inputFilePath)) {
        fs.unlinkSync(inputFilePath);
      }

      if (code !== 0) {
        if (fs.existsSync(outputFilePath)) {
          fs.unlinkSync(outputFilePath);
        }
        console.error('Python conversion error:', stderr);
        return reject(new Error('File conversion failed. ' + stderr));
      }

      if (!fs.existsSync(outputFilePath)) {
        return reject(new Error('Output file not generated.'));
      }

      try {
        const buffer = fs.readFileSync(outputFilePath);
        fs.unlinkSync(outputFilePath);
        resolve(buffer);
      } catch (err) {
        reject(err);
      }
    });

    py.on('error', (err: Error) => {
      reject(
        new Error(
          `Python not found. Install Python. Details: ${err.message}`,
        ),
      );
    });
  });
}

export const convertPdfWithPython = convertWithPython;
