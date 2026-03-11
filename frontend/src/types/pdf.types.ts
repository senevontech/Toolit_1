export interface MergePDFOptions {
  files: File[];
}

export interface SplitPDFOptions {
  file: File;
  pageNumbers: number[];
}

export interface ProtectPDFOptions {
  file: File;
  password: string;
}

export interface RotatePDFOptions {
  file: File;
  rotation: 90 | 180 | 270;
}