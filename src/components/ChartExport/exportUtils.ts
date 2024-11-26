import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';

export async function exportToPDF(patient: Patient, fileName: string) {
  if (!patient) {
    throw new Error('患者データが見つかりません');
  }

  try {
    const doc = new jsPDF();
    let yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (2 * margin);

    // ヘッダー情報
    doc.setFontSize(16);
    doc.text('診療記録', margin, yPos);
    yPos += 10;

    // 患者基本情報
    doc.setFontSize(12);
    const basicInfo = [
      `患者ID: ${patient.id}`,
      `氏名: ${patient.lastName} ${patient.firstName}`,
      `カナ: ${patient.lastNameKana} ${patient.firstNameKana}`,
      `生年月日: ${format(new Date(patient.dateOfBirth), 'yyyy年M月d日', { locale: ja })}`,
      `初診日: ${format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}`
    ];

    basicInfo.forEach(info => {
      if (yPos > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(info, margin, yPos);
      yPos += 8;
    });

    // 診療記録
    if (patient.chartEntries && patient.chartEntries.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.text('診療記録一覧', margin, yPos);
      yPos += 10;

      patient.chartEntries
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach(entry => {
          if (yPos > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
          }

          // 日付
          doc.setFontSize(12);
          doc.text(
            format(new Date(entry.date), 'yyyy年M月d日(E)', { locale: ja }),
            margin,
            yPos
          );
          yPos += 8;

          // 内容
          doc.setFontSize(10);
          const contentLines = doc.splitTextToSize(entry.content, contentWidth);
          contentLines.forEach(line => {
            if (yPos > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(line, margin, yPos);
            yPos += 6;
          });

          // 療法情報
          if (entry.therapyMethods && entry.therapyMethods.length > 0) {
            if (yPos > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(
              `実施療法: ${entry.therapyMethods.join(', ')}`,
              margin,
              yPos
            );
            yPos += 8;
          }

          yPos += 5;
        });
    }

    // Save as blob and download
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, fileName);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('PDF出力に失敗しました');
  }
}

export function exportToCSV(patient: Patient, fileName: string) {
  if (!patient) {
    throw new Error('患者データが見つかりません');
  }

  try {
    let csvContent = '\ufeff'; // BOM for Excel
    
    // ヘッダー
    csvContent += '診療日,内容,実施療法\n';

    // データ行
    if (patient.chartEntries && patient.chartEntries.length > 0) {
      patient.chartEntries
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach(entry => {
          const date = format(new Date(entry.date), 'yyyy/MM/dd', { locale: ja });
          const content = entry.content.replace(/"/g, '""'); // CSVでダブルクォートをエスケープ
          const therapies = entry.therapyMethods ? entry.therapyMethods.join(';') : '';

          csvContent += `"${date}","${content}","${therapies}"\n`;
        });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('CSV export failed:', error);
    throw new Error('CSV出力に失敗しました');
  }
}

export function exportToJSON(patient: Patient, fileName: string) {
  if (!patient) {
    throw new Error('患者データが見つかりません');
  }

  try {
    const data = {
      patient: {
        id: patient.id,
        name: {
          last: patient.lastName,
          first: patient.firstName,
          lastKana: patient.lastNameKana,
          firstKana: patient.firstNameKana
        },
        dateOfBirth: patient.dateOfBirth,
        firstVisitDate: patient.firstVisitDate
      },
      chartEntries: patient.chartEntries
        ? patient.chartEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => ({
              date: entry.date,
              content: entry.content,
              therapyMethods: entry.therapyMethods
            }))
        : []
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('JSON export failed:', error);
    throw new Error('JSON出力に失敗しました');
  }
}