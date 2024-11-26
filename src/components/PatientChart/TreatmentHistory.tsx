import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar, Activity, Clock, AlertCircle } from 'lucide-react';
import { ChartEntry } from '../../contexts/PatientContext';
import { useTherapySettings } from '../../contexts/TherapySettingsContext';

interface TreatmentHistoryProps {
  entries: ChartEntry[];
  firstVisitDate: string;
}

export default function TreatmentHistory({ entries, firstVisitDate }: TreatmentHistoryProps) {
  const { therapyOptions } = useTherapySettings();

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
        <p className="text-mono-500">カルテ記録はまだありません</p>
      </div>
    );
  }

  const calculateTreatmentPeriod = (date: string) => {
    const weeks = Math.floor(
      (new Date(date).getTime() - new Date(firstVisitDate).getTime()) /
      (1000 * 60 * 60 * 24 * 7)
    );
    const days = Math.floor(
      (new Date(date).getTime() - new Date(firstVisitDate).getTime()) /
      (1000 * 60 * 60 * 24)
    ) % 7;
    return `${weeks}w${days}d`;
  };

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedEntries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="h-5 w-5 text-mono-400" />
            <div>
              <div className="text-mono-900">
                {format(new Date(entry.date), 'yyyy年M月d日(E)', { locale: ja })}
              </div>
              <div className="text-sm text-mono-500">
                経過期間: {calculateTreatmentPeriod(entry.date)}
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-mono-700">
              {entry.content}
            </div>
          </div>

          {entry.therapyMethods && entry.therapyMethods.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-mono-500" />
                <h4 className="text-sm font-medium text-mono-700">実施した物理療法</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.therapyMethods.map(methodId => {
                  const method = therapyOptions.find(o => o.id === methodId);
                  return method ? (
                    <span
                      key={methodId}
                      className="px-2 py-1 bg-mono-100 text-mono-600 rounded-full text-sm"
                    >
                      {method.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {entry.nextAppointment && (
            <div className="mt-4 pt-4 border-t border-mono-100">
              <div className="flex items-center gap-2 text-mono-600">
                <Clock className="h-4 w-4" />
                <p className="text-sm">
                  次回予約: {format(new Date(entry.nextAppointment), 'yyyy年M月d日(E)', { locale: ja })}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}