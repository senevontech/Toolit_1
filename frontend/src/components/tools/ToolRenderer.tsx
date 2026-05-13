"use client";

import { ComponentType } from "react";
import dynamic from "next/dynamic";

import ImageCompressor from "@/components/tools/image/ImageCompressor";
import BackgroundRemover from "@/components/tools/image/BackgroundRemover";
import CartoonEffectGenerator from "@/components/tools/image/CartoonEffectGenerator";
import ImageBackgroundBlur from "@/components/tools/image/ImageBackgroundBlur";
import ImageNoiseReduction from "@/components/tools/image/ImageNoiseReduction";
import ImageResizer from "@/components/tools/image/ImageResizer";
import ImageSharpenTool from "@/components/tools/image/ImageSharpenTool";
import PassportSizeImageGenerator from "@/components/tools/image/PassportSizeImageGenerator";
import PNGJPGConverter from "@/components/tools/image/PNGJPGConverter";
import SketchEffectGenerator from "@/components/tools/image/SketchEffectGenerator";
import WebPConverter from "@/components/tools/image/WebPConverter";
import WatermarkImage from "@/components/tools/image/WatermarkImage";
import MergePDF from "@/components/tools/pdf/MergePDF";
import SplitPDF from "@/components/tools/pdf/SplitPDF";
import RotatePDF from "@/components/tools/pdf/RotatePDF";
import PDFCompressor from "@/components/tools/pdf/PDFCompressor";
import AddWatermarkToPDF from "@/components/tools/pdf/AddWatermarkToPDF";
import RemovePagesFromPDF from "@/components/tools/pdf/RemovePagesFromPDF";
import AddPageNumbers from "@/components/tools/pdf/AddPageNumbers";
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
import ThumbnailDownloaderYouTube from "@/components/tools/video/ThumbnailDownloaderYouTube";
import VideoCompressor from "@/components/tools/video/VideoCompressor";
import VideoCutter from "@/components/tools/video/VideoCutter";
import VideoToMP3 from "@/components/tools/video/VideoToMP3";
import Base64Tool from "@/components/tools/dev/Base64Tool";
import CSSFormatter from "@/components/tools/dev/CSSFormatter";
import HTMLFormatter from "@/components/tools/dev/HTMLFormatter";
import JSFormatter from "@/components/tools/dev/JSFormatter";
import JWTDecoder from "@/components/tools/dev/JWTDecoder";
import JSONFormatter from "@/components/tools/dev/JSONFormatter";
import RegexTester from "@/components/tools/dev/RegexTester";
import QRGenerator from "@/components/tools/dev/QRGenerator";
import SQLFormatter from "@/components/tools/dev/SQLFormatter";
import TimestampConverter from "@/components/tools/dev/TimestampConverter";
import URLParser from "@/components/tools/dev/URLParser";
import KeywordDensityChecker from "@/components/tools/seo/KeywordDensityChecker";
import MetaTagGenerator from "@/components/tools/seo/MetaTagGenerator";
import OGGenerator from "@/components/tools/seo/OGGenerator";
import RobotsTxtGenerator from "@/components/tools/seo/RobotsTxtGenerator";
import SitemapGenerator from "@/components/tools/seo/SitemapGenerator";
import AgeCalculator from "@/components/tools/calculators/AgeCalculator";
import CGPAToPercentageCalculator from "@/components/tools/calculators/CGPAToPercentageCalculator";
import CompoundInterestCalculator from "@/components/tools/calculators/CompoundInterestCalculator";
import SIPCalculator from "@/components/tools/calculators/SIPCalculator";
import EMICalculator from "@/components/tools/calculators/EMICalculator";
import FDCalculator from "@/components/tools/calculators/FDCalculator";
import GSTCalculator from "@/components/tools/calculators/GSTCalculator";
import IncomeTaxCalculator from "@/components/tools/calculators/IncomeTaxCalculator";
import InflationCalculator from "@/components/tools/calculators/InflationCalculator";
import LoanEMIBreakdownCalculator from "@/components/tools/calculators/LoanEMIBreakdownCalculator";
import PercentageCalculator from "@/components/tools/calculators/PercentageCalculator";
import PercentageToCGPACalculator from "@/components/tools/calculators/PercentageToCGPACalculator";
import RDCalculator from "@/components/tools/calculators/RDCalculator";
import SalaryInHandCalculator from "@/components/tools/calculators/SalaryInHandCalculator";
import SimpleInterestCalculator from "@/components/tools/calculators/SimpleInterestCalculator";

const PDFToTXT = dynamic(() => import("@/components/tools/pdf/PDFToTXT"), {
  ssr: false,
});
const ExtractImagesFromPDF = dynamic(
  () => import("@/components/tools/pdf/ExtractImagesFromPDF"),
  {
    ssr: false,
  }
);
const PDFToImages = dynamic(() => import("@/components/tools/pdf/PDFToImages"), {
  ssr: false,
});

const toolComponents: Record<string, ComponentType> = {
  "age-calculator": AgeCalculator,
  "background-remover": BackgroundRemover,
  "base64-tool": Base64Tool,
  "cartoon-effect-generator": CartoonEffectGenerator,
  "cgpa-to-percentage-calculator": CGPAToPercentageCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
  "css-formatter": CSSFormatter,
  "emi-calculator": EMICalculator,
  "excel-to-pdf": ExcelToPDF,
  "fd-calculator": FDCalculator,
  "gst-calculator": GSTCalculator,
  "image-background-blur": ImageBackgroundBlur,
  "income-tax-calculator": IncomeTaxCalculator,
  "html-formatter": HTMLFormatter,
  "image-compressor": ImageCompressor,
  "image-noise-reduction": ImageNoiseReduction,
  "image-resizer": ImageResizer,
  "image-sharpen-tool": ImageSharpenTool,
  "inflation-calculator": InflationCalculator,
  "js-formatter": JSFormatter,
  "jwt-decoder": JWTDecoder,
  "json-formatter": JSONFormatter,
  "keyword-density-checker": KeywordDensityChecker,
  "loan-emi-breakdown-calculator": LoanEMIBreakdownCalculator,
  "merge-pdf": MergePDF,
  "meta-tag-generator": MetaTagGenerator,
  "og-generator": OGGenerator,
  "thumbnail-downloader-youtube": ThumbnailDownloaderYouTube,
  "pdf-compressor": PDFCompressor,
  "add-watermark-to-pdf": AddWatermarkToPDF,
  "remove-pages-from-pdf": RemovePagesFromPDF,
  "extract-images-from-pdf": ExtractImagesFromPDF,
  "pdf-to-images": PDFToImages,
  "add-page-numbers": AddPageNumbers,
  "pdf-to-excel": PDFToExcel,
  "pdf-to-powerpoint": PDFToPowerPoint,
  "pdf-to-txt": PDFToTXT,
  "pdf-to-word": PDFToWord,
  "percentage-calculator": PercentageCalculator,
  "passport-size-image-generator": PassportSizeImageGenerator,
  "png-jpg-converter": PNGJPGConverter,
  "percentage-to-cgpa-calculator": PercentageToCGPACalculator,
  "powerpoint-to-pdf": PowerPointToPDF,
  "protect-pdf": ProtectPDF,
  "qr-generator": QRGenerator,
  "rd-calculator": RDCalculator,
  "regex-tester": RegexTester,
  "robots-txt-generator": RobotsTxtGenerator,
  "rotate-pdf": RotatePDF,
  "salary-in-hand-calculator": SalaryInHandCalculator,
  "sip-calculator": SIPCalculator,
  "sketch-effect-generator": SketchEffectGenerator,
  "simple-interest-calculator": SimpleInterestCalculator,
  "split-pdf": SplitPDF,
  "sql-formatter": SQLFormatter,
  "sitemap-generator": SitemapGenerator,
  "timestamp-converter": TimestampConverter,
  "txt-to-pdf": TXTToPDF,
  "unlock-pdf": UnlockPDF,
  "url-parser": URLParser,
  "video-compressor": VideoCompressor,
  "video-cutter": VideoCutter,
  "video-to-mp3": VideoToMP3,
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
