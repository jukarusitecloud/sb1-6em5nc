import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMemoryBarSettings } from '../../contexts/MemoryBarSettingsContext';
import { usePatients } from '../../contexts/PatientContext';

interface MemoryBarSettingsModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryBarSettingsModal({
  patientId,
  isOpen,
  onClose
}: MemoryBarSettingsModalProps) {
  const { memoryBars } = useMemoryBarSettings();
  const { patientMemoryBarSettings, updatePatientMemoryBars } = usePatients();

  const currentSettings = patientMemoryBarSettings.find(s => s.patientId === patientId);
  const enabledBars = currentSettings?.enabledBars || memoryBars.map(b => b.id);

  const handleToggleBar = (barId: string) => {
    const newEnabledBars = enabledBars.includes(barId)
      ? enabledBars.filter(id => id !== barId)
      : [...enabledBars, barId];
    updatePatientMemoryBars(patientId, newEnabledBars);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-mono-900">メモリバー表示設定</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-mono-600" />
              </button>
            </div>

            <div className="space-y-4">
              {memoryBars.map(bar => (
                <div
                  key={bar.id}
                  className="flex items-center justify-between p-4 bg-mono-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-mono-900">{bar.title}</h3>
                    <p className="text-sm text-mono-600">
                      範囲: {bar.min} 〜 {bar.max} (ステップ: {bar.step})
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={enabledBars.includes(bar.id)}
                      onChange={() => handleToggleBar(bar.id)}
                    />
                    <div className="w-11 h-6 bg-mono-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mono-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mono-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mono-900"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}