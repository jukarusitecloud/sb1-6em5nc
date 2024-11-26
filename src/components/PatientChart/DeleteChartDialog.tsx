import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Lock } from 'lucide-react';

interface DeleteChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  date: string;
}

export default function DeleteChartDialog({
  isOpen,
  onClose,
  onConfirm,
  date
}: DeleteChartDialogProps) {
  const [step, setStep] = useState(1);
  const [deleteReason, setDeleteReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!deleteReason.trim()) {
      setError('削除理由を入力してください');
      return;
    }

    if (deleteReason.length < 10) {
      setError('削除理由は10文字以上で入力してください');
      return;
    }

    onConfirm(deleteReason);
    setStep(1);
    setDeleteReason('');
    setError('');
  };

  const handleClose = () => {
    setStep(1);
    setDeleteReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-bold">カルテ記録の削除</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">
                  {date}の診療記録を削除しようとしています。
                  この操作は取り消すことができません。
                </p>
              </div>

              <div className="flex items-center gap-2 text-mono-600">
                <Lock className="h-5 w-5" />
                <p className="text-sm">
                  カルテ記録の削除には正当な理由が必要です
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  削除を続行
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-2">
                  削除理由 <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => {
                    setDeleteReason(e.target.value);
                    setError('');
                  }}
                  rows={4}
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-red-400"
                  placeholder="削除理由を具体的に入力してください"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  削除を確定
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}