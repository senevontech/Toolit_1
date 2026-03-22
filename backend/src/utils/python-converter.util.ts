import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// nest-cli.json copies src/scripts/*.py → dist/scripts/*.py during build/watch
// __dirname in dev/prod resolves to .../dist/utils, so go one level up to dist/scripts
const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'convert_pdf.py');

/**
 * Detect which python binary is available on the system.
 * Tries: python3 → python
 */
function getPythonBin(): string {
  // On Linux/Mac (Render server) it is always "python3"
  // On Windows it is usually "python"
  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Run the Python conversion script and return the result as a Buffer.
 *
 * @param mode   "docx" | "xlsx" | "pptx"
 * @param inputFilePath  Absolute path to the uploaded PDF
 */
export async function convertPdfWithPython(
  mode: 'docx' | 'xlsx' | 'pptx',
  inputFilePath: string,
): Promise<Buffer> {
  const ext = mode;
  const outputFilePath = path.join(
    os.tmpdir(),
    `converted_${Date.now()}.${ext}`,
  );

  return new Promise((resolve, reject) => {
    const py = spawn(getPythonBin(), [
      SCRIPT_PATH,
      mode,
      inputFilePath,
      outputFilePath,
    ]);

    let stderr = '';

    py.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    py.on('close', (code: number) => {
      // Clean up the uploaded input file
      if (fs.existsSync(inputFilePath)) {
        fs.unlinkSync(inputFilePath);
      }

      if (code !== 0) {
        // Clean up the output file if it was left behind
        if (fs.existsSync(outputFilePath)) {
          fs.unlinkSync(outputFilePath);
        }
        console.error('Python conversion error:', stderr);
        return reject(new Error('PDF conversion failed. ' + (stderr || '')));
      }

      if (!fs.existsSync(outputFilePath)) {
        return reject(new Error('Output file was not produced by the converter.'));
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
          `Could not launch Python. Make sure Python is installed. Details: ${err.message}`,
        ),
      );
    });
  });
}
