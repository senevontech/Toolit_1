export interface FileWithPreview extends File {
  preview?: string;
}

export interface ToolUsage {
  slug: string;
  usageCount: number;
  lastUsed: number;
}