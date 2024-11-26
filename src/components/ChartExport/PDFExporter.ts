import { jsPDF } from 'jspdf';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';

export class PDFExporter {
  private doc: jsPDF;
  private currentY: number = 20;
  private readonly margin = 20;
  private readonly lineHeight = 7;
  private readonly pageWidth: number;
  private readonly contentWidth: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.contentWidth = this.pageWidth - (2 * this.margin);
  }

  public async generate(patient: Patient): Promise<Blob> {
    try {
      // Set default font
      this.doc.setFont('helvetica');
      
      // Header
      this.doc.setFontSize(16);
      this.addTextSafely('診療記録', this.margin, this.currentY);
      this.currentY += 10;

      // Patient info
      this.doc.setFontSize(12);
      this.addTextSafely(`患者氏名: ${patient.lastName} ${patient.firstName}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
      
      this.addTextSafely(`フリガナ: ${patient.lastNameKana} ${patient.firstNameKana}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
      
      this.addTextSafely(`初診日: ${format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}`, this.margin, this.currentY);
      this.currentY += this.lineHeight * 2;

      // Chart entries
      if (patient.chartEntries && patient.chartEntries.length > 0) {
        this.doc.setFontSize(14);
        this.addTextSafely('診療記録一覧', this.margin, this.currentY);
        this.currentY += this.lineHeight * 1.5;

        this.doc.setFontSize(10);
        for (const entry of patient.chartEntries) {
          // Check page break
          if (this.currentY > this.doc.internal.pageSize.getHeight() - 30) {
            this.doc.addPage();
            this.currentY = this.margin;
          }

          // Date and treatment period
          const entryDate = new Date(entry.date);
          const firstVisitDate = new Date(patient.firstVisitDate);
          const weeks = differenceInWeeks(entryDate, firstVisitDate);
          const days = differenceInDays(entryDate, firstVisitDate) % 7;

          this.addTextSafely(
            `施術日: ${format(entryDate, 'yyyy年M月d日(E)', { locale: ja })}`,
            this.margin,
            this.currentY
          );
          this.currentY += this.lineHeight;

          this.addTextSafely(
            `初診からの期間: ${weeks}週${days}日`,
            this.margin,
            this.currentY
          );
          this.currentY += this.lineHeight;

          // Content
          this.addTextSafely('施術内容:', this.margin, this.currentY);
          this.currentY += this.lineHeight;

          const contentLines = this.splitTextToFitWidth(entry.content);
          for (const line of contentLines) {
            if (this.currentY > this.doc.internal.pageSize.getHeight() - 30) {
              this.doc.addPage();
              this.currentY = this.margin;
            }
            this.addTextSafely(line, this.margin + 5, this.currentY);
            this.currentY += this.lineHeight;
          }

          // Therapy methods
          if (entry.therapyMethods && entry.therapyMethods.length > 0) {
            if (this.currentY > this.doc.internal.pageSize.getHeight() - 30) {
              this.doc.addPage();
              this.currentY = this.margin;
            }
            this.addTextSafely(
              `実施した物療: ${entry.therapyMethods.join('、')}`,
              this.margin,
              this.currentY
            );
            this.currentY += this.lineHeight;
          }

          this.currentY += this.lineHeight * 1.5; // Add space between entries
        }
      }

      return this.doc.output('blob');
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('PDFの生成に失敗しました');
    }
  }

  private addTextSafely(text: string, x: number, y: number): void {
    try {
      const safeText = String(text || '');
      this.doc.text(safeText, x, y);
    } catch (error) {
      console.error('Error adding text to PDF:', error);
    }
  }

  private splitTextToFitWidth(text: string): string[] {
    const words = String(text || '').split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.doc.getTextWidth(testLine);

      if (testWidth > this.contentWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }
}