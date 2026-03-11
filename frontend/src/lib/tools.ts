import React from "react";
import dynamic from "next/dynamic";

/* IMAGE TOOLS */
import ImageCompressor from "@/components/tools/image/ImageCompressor";
import ImageResizer from "@/components/tools/image/ImageResizer";
import PNGJPGConverter from "@/components/tools/image/PNGJPGConverter";
import WebPConverter from "@/components/tools/image/WebPConverter";
import WatermarkImage from "@/components/tools/image/WatermarkImage";

/* PDF / DOCUMENT TOOLS */
import MergePDF from "@/components/tools/pdf/MergePDF";
import SplitPDF from "@/components/tools/pdf/SplitPDF";
import RotatePDF from "@/components/tools/pdf/RotatePDF";
import ProtectPDF from "@/components/tools/pdf/ProtectPDF";
import UnlockPDF from "@/components/tools/pdf/UnlockPDF";

/* DOCUMENT CONVERTERS */
import PDFToWord from "@/components/tools/pdf/PDFToWord";
import WordToPDF from "@/components/tools/pdf/WordToPDF";
import PDFToExcel from "@/components/tools/pdf/PDFToExcel";
import ExcelToPDF from "@/components/tools/pdf/ExcelToPDF";
import PDFToPowerPoint from "@/components/tools/pdf/PDFToPowerPoint";
import PowerPointToPDF from "@/components/tools/pdf/PowerPointToPDF";

/* IMPORTANT: pdfjs-dist tool must disable SSR */
const PDFToTXT = dynamic(
  () => import("@/components/tools/pdf/PDFToTXT"),
  { ssr: false }
);

import TXTToPDF from "@/components/tools/pdf/TXTToPDF";
import WordToHTML from "@/components/tools/pdf/WordToHTML";

/* DEV TOOLS */
import Base64Tool from "@/components/tools/dev/Base64Tool";
import JSONFormatter from "@/components/tools/dev/JSONFormatter";
import QRGenerator from "@/components/tools/dev/QRGenerator";

/* CALCULATORS */
import AgeCalculator from "@/components/tools/calculators/AgeCalculator";
import SIPCalculator from "@/components/tools/calculators/SIPCalculator";
import EMICalculator from "@/components/tools/calculators/EMICalculator";
import GSTCalculator from "@/components/tools/calculators/GSTCalculator";
import PercentageCalculator from "@/components/tools/calculators/PercentageCalculator";

export type ToolType = {
  name: string;
  slug: string;
  description: string;
  category: string;
  component: React.ComponentType<any>;
};

export const tools: ToolType[] = [

/* IMAGE TOOLS */

{
name:"Image Compressor",
slug:"image-compressor",
description:"Reduce image file size without losing quality.",
category:"Image Tools",
component:ImageCompressor
},

{
name:"Image Resizer",
slug:"image-resizer",
description:"Resize image dimensions easily.",
category:"Image Tools",
component:ImageResizer
},

{
name:"PNG to JPG Converter",
slug:"png-jpg-converter",
description:"Convert PNG images to JPG format.",
category:"Image Tools",
component:PNGJPGConverter
},

{
name:"WebP Converter",
slug:"webp-converter",
description:"Convert images to WebP format.",
category:"Image Tools",
component:WebPConverter
},

{
name:"Watermark Image",
slug:"watermark-image",
description:"Add watermark to images.",
category:"Image Tools",
component:WatermarkImage
},

/* PDF TOOLS */

{
name:"Merge PDF",
slug:"merge-pdf",
description:"Combine multiple PDFs into one file.",
category:"Document Tools",
component:MergePDF
},

{
name:"Split PDF",
slug:"split-pdf",
description:"Split PDF into separate pages.",
category:"Document Tools",
component:SplitPDF
},

{
name:"Rotate PDF",
slug:"rotate-pdf",
description:"Rotate PDF pages.",
category:"Document Tools",
component:RotatePDF
},

{
name:"Protect PDF",
slug:"protect-pdf",
description:"Add password to PDF.",
category:"Document Tools",
component:ProtectPDF
},

{
name:"Unlock PDF",
slug:"unlock-pdf",
description:"Remove password from PDF.",
category:"Document Tools",
component:UnlockPDF
},

/* DOCUMENT CONVERTERS */

{
name:"PDF to Word",
slug:"pdf-to-word",
description:"Convert PDF files to editable Word documents.",
category:"Document Tools",
component:PDFToWord
},

{
name:"Word to PDF",
slug:"word-to-pdf",
description:"Convert Word documents into PDF format.",
category:"Document Tools",
component:WordToPDF
},

{
name:"PDF to Excel",
slug:"pdf-to-excel",
description:"Extract tables from PDF into Excel format.",
category:"Document Tools",
component:PDFToExcel
},

{
name:"Excel to PDF",
slug:"excel-to-pdf",
description:"Convert Excel spreadsheets into PDF files.",
category:"Document Tools",
component:ExcelToPDF
},

{
name:"PDF to PowerPoint",
slug:"pdf-to-powerpoint",
description:"Convert PDF files into PowerPoint slides.",
category:"Document Tools",
component:PDFToPowerPoint
},

{
name:"PowerPoint to PDF",
slug:"powerpoint-to-pdf",
description:"Convert PowerPoint presentations into PDF.",
category:"Document Tools",
component:PowerPointToPDF
},

{
name:"PDF to TXT",
slug:"pdf-to-txt",
description:"Extract text from PDF files.",
category:"Document Tools",
component:PDFToTXT
},

{
name:"TXT to PDF",
slug:"txt-to-pdf",
description:"Convert plain text files into PDF format.",
category:"Document Tools",
component:TXTToPDF
},

{
name:"Word to HTML",
slug:"word-to-html",
description:"Convert Word documents into HTML code.",
category:"Document Tools",
component:WordToHTML
},

/* DEV TOOLS */

{
name:"JSON Formatter",
slug:"json-formatter",
description:"Beautify and format JSON.",
category:"Developer Tools",
component:JSONFormatter
},

{
name:"QR Generator",
slug:"qr-generator",
description:"Generate QR code instantly.",
category:"Developer Tools",
component:QRGenerator
},

{
name:"Base64 Tool",
slug:"base64-tool",
description:"Encode and decode Base64.",
category:"Developer Tools",
component:Base64Tool
},

/* CALCULATORS */

{
name:"GST Calculator",
slug:"gst-calculator",
description:"Calculate GST easily.",
category:"Calculators",
component:GSTCalculator
},

{
name:"EMI Calculator",
slug:"emi-calculator",
description:"Calculate EMI quickly.",
category:"Calculators",
component:EMICalculator
},

{
name:"Age Calculator",
slug:"age-calculator",
description:"Calculate your age.",
category:"Calculators",
component:AgeCalculator
},

{
name:"Percentage Calculator",
slug:"percentage-calculator",
description:"Calculate percentage instantly.",
category:"Calculators",
component:PercentageCalculator
},

{
name:"SIP Calculator",
slug:"sip-calculator",
description:"Calculate SIP investment growth.",
category:"Calculators",
component:SIPCalculator
}

];

export const getToolBySlug = (slug:string)=>
tools.find((tool)=>tool.slug===slug);

export const categories=[
...new Set(tools.map((tool)=>tool.category))
];