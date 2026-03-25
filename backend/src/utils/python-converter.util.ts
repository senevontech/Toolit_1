import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// dist/scripts/convert_pdf.py
const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'convert_pdf.py');

function getPythonBin(): string {
  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Run Python conversion
 */
export async function convertPdfWithPython(
  mode: 'docx' | 'xlsx' | 'pptx' | 'protect' | 'unlock',
  inputFilePath: string,
  password?: string
): Promise<Buffer> {

  const ext = (mode === 'protect' || mode === 'unlock') ? 'pdf' : mode;

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

    console.log("Running Python:", args); // optional debug

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
        return reject(new Error('PDF conversion failed. ' + stderr));
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