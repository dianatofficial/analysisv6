
import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Triggers the browser's native print dialog.
   * Combined with @media print CSS in index.html, this produces high-fidelity PDFs
   * that correctly handle Persian RTL text and fonts.
   */
  exportToPdf(): void {
    window.print();
  }

  /**
   * Generates a .docx file client-side.
   */
  async exportToWord(title: string, content: string, metadata: Record<string, string>): Promise<void> {
    try {
      // Clean up markdown syntax for Word (simple replacements)
      const cleanContent = content
        .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
        .replace(/#(.*?)\n/g, "$1\n") // Headers
        .replace(/\n/g, "\n\n"); // Spacing

      const lines = cleanContent.split('\n').filter(line => line.trim() !== '');
      
      const docChildren = [
        new Paragraph({
          text: "گزارش استراتژیک سامانه دیدبان",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          bidirectional: true,
        }),
        new Paragraph({
          text: `موضوع: ${title}`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
        }),
        new Paragraph({
          text: `تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}`,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
        }),
        new Paragraph({
          text: "--------------------------------------------------",
          alignment: AlignmentType.CENTER,
        }),
      ];

      // Add metadata fields
      Object.keys(metadata).forEach(key => {
        if(metadata[key] && typeof metadata[key] === 'string') {
           docChildren.push(new Paragraph({
             children: [
               new TextRun({ text: `${key}: `, bold: true, rightToLeft: true }),
               new TextRun({ text: metadata[key], rightToLeft: true })
             ],
             alignment: AlignmentType.RIGHT,
             bidirectional: true
           }));
        }
      });

      docChildren.push(new Paragraph({ text: "", spacing: { after: 400 } }));

      // Add main content paragraphs
      lines.forEach(line => {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.trim(),
                font: "Tahoma", // Standard font fallback
                size: 24, // 12pt
                rightToLeft: true,
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            bidirectional: true,
            spacing: { after: 200 }
          })
        );
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren,
        }],
      });

      // Pack and download
      const blob = await Packer.toBlob(doc);
      this.saveFile(blob, `Didban_Report_${Date.now()}.docx`);

    } catch (error) {
      console.error('Error generating Word doc:', error);
      alert('خطا در تولید فایل ورد.');
    }
  }

  private saveFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
