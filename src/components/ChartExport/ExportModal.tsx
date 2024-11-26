import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileSpreadsheet, FileJson, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';
import { PDFExporter } from './PDFExporter';
import { CSVExporter } from './CSVExporter';
import { JSONExporter } from './JSONExporter';
import { saveAs } from 'file-saver';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export default function ExportModal({ isOpen, onClose, patient }: ExportModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !patient) return null;

  const handleExport = async (exportFormat: 'pdf' | 'csv' | 'json') => {
    if (!patient.chartEntries?.length) {
      setError('出力可能な診療記録がありません');
      return;
    }

    try {
      setError(null);
      setLoading(`${exportFormat.toUpperCase()}形式で出力中...`);

      const currentDate = format(new Date(), 'yyyyMMdd', { locale: ja });
      const fileName = `診療記録_${patient.lastName}${patient.firstName}_${currentDate}`;

      switch (exportFormat) {
        case 'pdf': {
          console.log('Starting PDF export...');
          const pdfExporter = new PDFExporter();
          const pdfBlob = await pdfExporter.generate(patient);
          if (!pdfBlob) throw new Error('PDF生成に失敗しました');
          saveAs(pdfBlob, `${fileName}.pdf`);
          console.log('PDF export completed');
          break;
        }
        case 'csv': {
          console.log('Starting CSV export...');
          const csvContent = await CSVExporter.generate(patient);
          if (!csvContent) throw new Error('CSV生成に失敗しました');
          const csvBlob = new Blob([csvContent], { 
            type: 'text/csv;charset=utf-8'
          });
          saveAs(csvBlob, `${fileName}.csv`);
          console.log('CSV export completed');
          break;
        }
        case 'json': {
          console.log('Starting JSON export...');
          const jsonContent = await JSONExporter.generate(patient);
          if (!jsonContent) throw new Error('JSON生成に失敗しました');
          const jsonBlob = new Blob([jsonContent], { 
            type: 'application/json;charset=utf-8'
          });
          saveAs(jsonBlob, `${fileName}.json`);
          console.log('JSON export completed');
          break;
        }
      }

      onClose();
    } catch (error) {
      console.error(`[Export Error] Format: ${exportFormat}:`, error);
      setError(
        error instanceof Error 
          ? error.message 
          : '出力中に不明なエラーが発生しました'
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-mono-900">カルテ出力</h2>
            <p className="text-sm text-mono-500">
              {patient.lastName} {patient.firstName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm">{loading}</span>
          </div>
        )}

        <div className="space-y-3">
          <ExportButton
            icon={<FileText className="h-5 w-5" />}
            title="PDF形式"
            description="印刷用のPDF形式で出力"
            onClick={() => handleExport('pdf')}
            disabled={loading !== null || !patient.chartEntries?.length}
          />
          <ExportButton
            icon={<FileSpreadsheet className="h-5 w-5" />}
            title="CSV形式"
            description="表計算ソフト用のCSV形式で出力"
            onClick={() => handleExport('csv')}
            disabled={loading !== null || !patient.chartEntries?.length}
          />
          <ExportButton
            icon={<FileJson className="h-5 w-5" />}
            title="JSON形式"
            description="データ連携用のJSON形式で出力"
            onClick={() => handleExport('json')}
            disabled={loading !== null || !patient.chartEntries?.length}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ExportButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}

function ExportButton({ icon, title, description, onClick, disabled }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 flex items-start gap-3 rounded-lg transition-colors
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-mono-50' 
          : 'hover:bg-mono-50 active:bg-mono-100'
        }
      `}
    >
      <div className="text-mono-500">{icon}</div>
      <div className="text-left">
        <div className="font-medium text-mono-900">{title}</div>
        <div className="text-sm text-mono-500">{description}</div>
      </div>
    </button>
  );
}