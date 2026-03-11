import { ComponentType } from "react";

export type ToolCategory =
  | "Image Tools"
  | "Document Tools"
  | "Developer Tools"
  | "Calculators";

export interface Tool {
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  component: ComponentType<any>;
  icon?: string;
  isPremium?: boolean;
}