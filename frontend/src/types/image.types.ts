export interface ImageCompressionOptions {
  quality: number;        // 0 - 100
  maxSizeMB?: number;
}

export interface ImageResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export interface ImageConvertOptions {
  format: string;         // "image/jpeg", "image/png", etc.
  quality?: number;
}

export interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  position?:
    | "top-left"
    | "top-right"
    | "center"
    | "bottom-left"
    | "bottom-right";
}