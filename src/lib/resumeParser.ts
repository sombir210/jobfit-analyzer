import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import mammoth from "mammoth";

// ✅ correct worker setup for Vite + Vercel
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

export async function parseResume(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
    return extractTextFromDOCX(file);
  } else {
    throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
  }
}

export function getFileType(file: File): "pdf" | "docx" | "unknown" {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".pdf")) return "pdf";
  if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return "docx";
  return "unknown";
}
