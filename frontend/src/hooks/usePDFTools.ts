import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export const usePDFTools = () => {
  const [loading, setLoading] = useState(false);

  const mergePDFs = async (files: File[]) => {
    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        const copiedPages =
          await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );

        copiedPages.forEach((page) =>
          mergedPdf.addPage(page)
        );
      }

      const mergedBytes =
        await mergedPdf.save();

      return new File([mergedBytes], "merged.pdf", {
        type: "application/pdf",
      });
    } catch (error) {
      console.error("Merge failed:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mergePDFs, loading };
};