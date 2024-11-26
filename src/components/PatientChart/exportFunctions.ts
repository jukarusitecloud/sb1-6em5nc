import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient, ChartEntry } from '../../contexts/PatientContext';

export function exportToPDF(patient: Patient, chartEntries: ChartEntry[]) {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;

  // ヘッダー
  doc.setFontSize(16);
  doc.text('診療記録', 20, yPos);
  yPos += lineHeight * 2;

  // 患者情報
  doc.setFontSize(12);
  doc.text(`患者名: ${patient.lastName} ${patient.firstName}`, 20, yPos);
  yPos += lineHeight;
  doc.text(`カナ: ${patient.lastNameKana} ${patient.firstNameKana}`, 20, yPos);
  yPos += lineHeight;
  doc.text(`初診日: ${format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}`, 20, yPos);
  yPos += lineHeight * 2;

  // カルテ記録
  chartEntries.forEach((entry) => {
    // 新しいページが必要か確認
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.text(`日付: ${format(new Date(entry.date), 'yyyy年M月d日', { locale: ja })}`, 20, yPos);
    yPos += lineHeight;

    // 内容を複数行に分割
    const contentLines = doc.splitTextToSize(entry.content, 170);
    contentLines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += lineHeight;
    });

    // 療法情報
    if (entry.therapyMethods && entry.therapyMethods.length > 0) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`実施療法: ${entry.therapyMethods.join(', ')}`, 20, yPos);
      yPos += lineHeight;
    }

    yPos += lineHeight; // エントリー間のスペース
  });

  // ファイル名に患者名と日付を含める
  const fileName = `診療記録_${patient.lastName}${patient.firstName}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}

export function exportToCSV(patient: Patient, chartEntries: ChartEntry[]) {
  let csvContent = '\uFEFF'; // BOMを追加してExcelで文字化けを防ぐ
  
  // ヘッダー行
  csvContent += '日付,内容,実施療法\n';

  // データ行
  chartEntries.forEach((entry) => {
    const date = format(new Date(entry.date), 'yyyy/MM/dd', { locale: ja });
    const content = entry.content.replace(/"/g, '""'); // CSVでダブルクォートをエスケープ
    const therapies = entry.therapyMethods ? entry.therapyMethods.join(';') : '';

    csvContent += `"${date}","${content}","${therapies}"\n`;
  });

  const fileName = `診療記録_${patient.lastName}${patient.firstName}_${format(new Date(), 'yyyyMMdd')}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, fileName);
}

export function exportToJSON(patient: Patient, chartEntries: ChartEntry[]) {
  const data = {
    patient: {
      name: `${patient.lastName} ${patient.firstName}`,
      nameKana: `${patient.lastNameKana} ${patient.firstNameKana}`,
      firstVisitDate: patient.firstVisitDate,
    },
    chartEntries: chartEntries.map(entry => ({
      date: entry.date,
      content: entry.content,
      therapyMethods: entry.therapyMethods,
      memoryBarValues: entry.memoryBarValues
    }))
  };

  const fileName = `診療記録_${patient.lastName}${patient.firstName}_${format(new Date(), 'yyyyMMdd')}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, fileName);
}