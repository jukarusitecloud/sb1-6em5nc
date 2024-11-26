import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Search, Calendar, Edit2, Trash2, AlertCircle, Filter } from 'lucide-react';
import { usePatients } from '../../contexts/PatientContext';
import PageTransition from '../PageTransition';

type LogType = 'edit' | 'delete' | 'all';

interface ModificationLog {
  patientName: string;
  patientNameKana: string;
  entryDate: string;
  modifiedAt: string;
  type: LogType;
  reason?: string;
  content: string;
  nextAppointment?: string;
}

export default function ModificationHistory() {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState<LogType>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allLogs = useMemo<ModificationLog[]>(() => {
    try {
      return patients.flatMap(patient => 
        patient.chartEntries
          .filter(entry => entry.modifiedAt || entry.isDeleted)
          .map(entry => ({
            patientName: `${patient.lastName} ${patient.firstName}`,
            patientNameKana: `${patient.lastNameKana} ${patient.firstNameKana}`,
            entryDate: entry.date,
            modifiedAt: entry.modifiedAt || entry.deletedAt || '',
            type: entry.isDeleted ? 'delete' : 'edit',
            reason: entry.deleteReason || entry.modifiedReason,
            content: entry.content,
            nextAppointment: entry.nextAppointment
          }))
      ).sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
    } catch (error) {
      setErrorMessage('履歴データの取得中にエラーが発生しました');
      console.error('Failed to process modification logs:', error);
      return [];
    }
  }, [patients]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        log.patientName.toLowerCase().includes(searchTermLower) ||
        log.patientNameKana.toLowerCase().includes(searchTermLower) ||
        log.reason?.toLowerCase().includes(searchTermLower) ||
        log.content.toLowerCase().includes(searchTermLower);
      const matchesType = logType === 'all' || log.type === logType;
      return matchesSearch && matchesType;
    });
  }, [allLogs, searchTerm, logType]);

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">修正・削除履歴</h1>
          <p className="mt-2 text-mono-500">
            カルテの修正・削除履歴を確認できます
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
            <input
              type="text"
              placeholder="患者名や修正内容で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLogType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                logType === 'all'
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setLogType('edit')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                logType === 'edit'
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              修正のみ
            </button>
            <button
              onClick={() => setLogType('delete')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                logType === 'delete'
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              削除のみ
            </button>
          </div>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={`${log.patientName}-${log.modifiedAt}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-mono-900">
                      {log.patientName}
                    </h3>
                    <p className="text-mono-500">{log.patientNameKana}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    log.type === 'delete'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {log.type === 'delete' ? '削除' : '修正'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-mono-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      対象記録: {format(new Date(log.entryDate), 'yyyy年M月d日', { locale: ja })}
                    </span>
                  </div>

                  <div className="text-sm text-mono-500">
                    変更日時: {format(new Date(log.modifiedAt), 'yyyy年M月d日 HH:mm', { locale: ja })}
                  </div>

                  {log.reason && (
                    <div className="p-4 bg-mono-50 rounded-lg">
                      <p className="text-sm text-mono-700">{log.reason}</p>
                    </div>
                  )}

                  {log.nextAppointment && (
                    <div className="text-sm text-mono-600">
                      次回予約: {format(new Date(log.nextAppointment), 'yyyy年M月d日(E)', { locale: ja })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
            <p className="text-mono-500">
              {searchTerm || logType !== 'all'
                ? '該当する履歴が見つかりません'
                : '修正・削除の履歴はありません'}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}