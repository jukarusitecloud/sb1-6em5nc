import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight } from 'lucide-react';
import { useMemoryBarSettings } from '../../contexts/MemoryBarSettingsContext';
import { usePatients } from '../../contexts/PatientContext';

interface MemoryBarInputProps {
  patientId: string;
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  onOpenSettings: () => void;
}

export default function MemoryBarInput({ patientId, values, onChange, onOpenSettings }: MemoryBarInputProps) {
  const { memoryBars } = useMemoryBarSettings();
  const { patientMemoryBarSettings } = usePatients();

  const patientSettings = patientMemoryBarSettings.find(s => s.patientId === patientId);
  const enabledBars = patientSettings?.enabledBars || memoryBars.map(b => b.id);
  const visibleBars = memoryBars.filter(bar => enabledBars.includes(bar.id));

  if (visibleBars.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-mono-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-mono-900">メモリバー記録</h3>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-mono-600 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>表示設定</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleBars.map(bar => (
          <motion.div
            key={bar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-mono-700">{bar.title}</label>
              <span className="text-lg font-semibold text-mono-900">
                {values[bar.id] || 0}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={bar.min}
                max={bar.max}
                step={bar.step}
                value={values[bar.id] || 0}
                onChange={(e) => {
                  const newValues = {
                    ...values,
                    [bar.id]: parseFloat(e.target.value)
                  };
                  onChange(newValues);
                }}
                className="w-full h-2 bg-mono-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1f2937 0%, #1f2937 ${
                    ((values[bar.id] || 0) - bar.min) / (bar.max - bar.min) * 100
                  }%, #e5e7eb ${
                    ((values[bar.id] || 0) - bar.min) / (bar.max - bar.min) * 100
                  }%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-mono-500">{bar.min}</span>
                <span className="text-xs text-mono-500">{bar.max}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}