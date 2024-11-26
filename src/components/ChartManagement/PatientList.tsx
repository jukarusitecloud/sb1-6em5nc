import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';

interface PatientListProps {
  patients: Patient[];
}

export default function PatientList({ patients }: PatientListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient, index) => {
        const latestEntry = patient.chartEntries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        return (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/chart-management/${patient.id}`)}
            className="bg-white rounded-xl shadow-sm p-6 border border-mono-200 hover:border-mono-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-mono-900">
                  {patient.lastName} {patient.firstName}
                </h3>
                <p className="text-mono-500">
                  {patient.lastNameKana} {patient.firstNameKana}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-mono-400" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-mono-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  記録件数: {patient.chartEntries.length}件
                </span>
              </div>

              {latestEntry && (
                <div className="text-sm text-mono-500">
                  最終更新: {format(new Date(latestEntry.date), 'yyyy年M月d日', { locale: ja })}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}