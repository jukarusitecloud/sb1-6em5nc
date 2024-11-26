import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileJson, FileSpreadsheet, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  if (!isOpen) return null;

  const exportOptions = [
    {
      value: 'pdf',
      label: 'PDF形式',
      description: '印刷用のPDF形式で出力します',
      icon: <FileText className="h-5 w-5" />
    },
    {
      value: 'csv',
      label: 'CSV形式',
      description: 'Excel等で開ける表形式で出力します',
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
    {
      value: 'json',
      label: 'JSON形式',
      description: 'データ連携用のJSON形式で出力します',
      icon: <FileJson className="h-5 w-5" />
    }
  ];

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
          <h2 className="text-xl font-bold text-mono-900">診療記録を出力</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        <div className="space-y-3">
          {exportOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onExport(option.value)}
              className="w-full p-4 bg-mono-50 hover:bg-mono-100 rounded-xl transition-colors flex items-start gap-4"
            >
              <div className="text-mono-600">{option.icon}</div>
              <div className="text-left">
                <div className="font-medium text-mono-900">{option.label}</div>
                <div className="text-sm text-mono-600">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}