import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient } from '../../contexts/PatientContext';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { jsPDF } from 'jspdf';

interface ExportButtonProps {
  patient: Patient;
}

export default function ExportButton({ patient }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      setIsExporting(true);
      const fileName = `診療記録_${patient.lastName}${patient.firstName}_${format}_${format(new Date(), 'yyyyMMdd')}`;

      switch (format) {
        case 'pdf':
          await exportToPDF(patient, `${fileName}.pdf`);
          break;
        case 'csv':
          await exportToCSV(patient, `${fileName}.csv`);
          break;
        case 'json':
          await exportToJSON(patient, `${fileName}.json`);
          break;
      }
      setShowMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(true)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 transition-colors disabled:opacity-50"
      >
        <Download className="h-5 w-5" />
        <span className="hidden sm:inline">カルテを出力</span>
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-mono-100">
                <h3 className="font-medium text-mono-900">出力形式を選択</h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-1 hover:bg-mono-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-mono-500" />
                </button>
              </div>
              <div className="p-2">
                <ExportOption
                  icon={<FileText className="h-5 w-5" />}
                  title="PDF形式"
                  description="印刷用のPDF形式で出力"
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                />
                <ExportOption
                  icon={<FileSpreadsheet className="h-5 w-5" />}
                  title="CSV形式"
                  description="表計算ソフト用のCSV形式で出力"
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                />
                <ExportOption
                  icon={<FileJson className="h-5 w-5" />}
                  title="JSON形式"
                  description="データ連携用のJSON形式で出力"
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ExportOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}

function ExportOption({ icon, title, description, onClick, disabled }: ExportOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full p-3 flex items-start gap-3 hover:bg-mono-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <div className="text-mono-500">{icon}</div>
      <div className="text-left">
        <div className="font-medium text-mono-900">{title}</div>
        <div className="text-sm text-mono-500">{description}</div>
      </div>
    </button>
  );
}

// Export functions
async function exportToPDF(patient: Patient, fileName: string) {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(16);
  doc.text('診療記録', 20, yPos);
  yPos += 10;

  // Patient info
  doc.setFontSize(12);
  doc.text(`患者名: ${patient.lastName} ${patient.firstName}`, 20, yPos);
  yPos += 7;
  doc.text(`カナ: ${patient.lastNameKana} ${patient.firstNameKana}`, 20, yPos);
  yPos += 7;
  doc.text(`初診日: ${format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}`, 20, yPos);
  yPos += 10;

  // Chart entries
  if (patient.chartEntries && patient.chartEntries.length > 0) {
    patient.chartEntries.forEach(entry => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(10);
      doc.text(`日付: ${format(new Date(entry.date), 'yyyy年M月d日', { locale: ja })}`, 20, yPos);
      yPos += 7;

      const contentLines = doc.splitTextToSize(entry.content, 170);
      contentLines.forEach((line: string) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 7;
      });

      yPos += 7;
    });
  }

  doc.save(fileName);
}

async function exportToCSV(patient: Patient, fileName: string) {
  let csvContent = '\uFEFF'; // BOM for Excel
  csvContent += '日付,内容\n';

  if (patient.chartEntries && patient.chartEntries.length > 0) {
    patient.chartEntries.forEach(entry => {
      const date = format(new Date(entry.date), 'yyyy/MM/dd', { locale: ja });
      const content = entry.content.replace(/"/g, '""'); // Escape quotes
      csvContent += `"${date}","${content}"\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, fileName);
}

async function exportToJSON(patient: Patient, fileName: string) {
  const data = {
    patient: {
      name: `${patient.lastName} ${patient.firstName}`,
      nameKana: `${patient.lastNameKana} ${patient.firstNameKana}`,
      firstVisitDate: patient.firstVisitDate,
    },
    chartEntries: patient.chartEntries || []
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, fileName);
}