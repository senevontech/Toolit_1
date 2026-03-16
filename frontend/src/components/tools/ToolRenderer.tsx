"use client";

import { ComponentType } from "react";
import dynamic from "next/dynamic";

import ImageCompressor from "@/components/tools/image/ImageCompressor";
import ImageResizer from "@/components/tools/image/ImageResizer";
import PNGJPGConverter from "@/components/tools/image/PNGJPGConverter";
import WebPConverter from "@/components/tools/image/WebPConverter";
import WatermarkImage from "@/components/tools/image/WatermarkImage";
import MergePDF from "@/components/tools/pdf/MergePDF";
import SplitPDF from "@/components/tools/pdf/SplitPDF";
import RotatePDF from "@/components/tools/pdf/RotatePDF";
import ProtectPDF from "@/components/tools/pdf/ProtectPDF";
import UnlockPDF from "@/components/tools/pdf/UnlockPDF";
import PDFToWord from "@/components/tools/pdf/PDFToWord";
import WordToPDF from "@/components/tools/pdf/WordToPDF";
import PDFToExcel from "@/components/tools/pdf/PDFToExcel";
import ExcelToPDF from "@/components/tools/pdf/ExcelToPDF";
import PDFToPowerPoint from "@/components/tools/pdf/PDFToPowerPoint";
import PowerPointToPDF from "@/components/tools/pdf/PowerPointToPDF";
import TXTToPDF from "@/components/tools/pdf/TXTToPDF";
import WordToHTML from "@/components/tools/pdf/WordToHTML";
import Base64Tool from "@/components/tools/dev/Base64Tool";
import JSONFormatter from "@/components/tools/dev/JSONFormatter";
import QRGenerator from "@/components/tools/dev/QRGenerator";
import AgeCalculator from "@/components/tools/calculators/AgeCalculator";
import SIPCalculator from "@/components/tools/calculators/SIPCalculator";
import EMICalculator from "@/components/tools/calculators/EMICalculator";
import GSTCalculator from "@/components/tools/calculators/GSTCalculator";
import PercentageCalculator from "@/components/tools/calculators/PercentageCalculator";

const PDFToTXT = dynamic(() => import("@/components/tools/pdf/PDFToTXT"), {
  ssr: false,
});

const toolComponents: Record<string, ComponentType> = {
  "age-calculator": AgeCalculator,
  "base64-tool": Base64Tool,
  "emi-calculator": EMICalculator,
  "excel-to-pdf": ExcelToPDF,
  "gst-calculator": GSTCalculator,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "json-formatter": JSONFormatter,
  "merge-pdf": MergePDF,
  "pdf-to-excel": PDFToExcel,
  "pdf-to-powerpoint": PDFToPowerPoint,
  "pdf-to-txt": PDFToTXT,
  "pdf-to-word": PDFToWord,
  "percentage-calculator": PercentageCalculator,
  "png-jpg-converter": PNGJPGConverter,
  "powerpoint-to-pdf": PowerPointToPDF,
  "protect-pdf": ProtectPDF,
  "qr-generator": QRGenerator,
  "rotate-pdf": RotatePDF,
  "sip-calculator": SIPCalculator,
  "split-pdf": SplitPDF,
  "txt-to-pdf": TXTToPDF,
  "unlock-pdf": UnlockPDF,
  "watermark-image": WatermarkImage,
  "webp-converter": WebPConverter,
  "word-to-html": WordToHTML,
  "word-to-pdf": WordToPDF,
};

type ToolRendererProps = {
  slug: string;
};

export default function ToolRenderer({ slug }: ToolRendererProps) {
  const Component = toolComponents[slug];

  if (!Component) {
    return null;
  }

  return <Component />;
}
