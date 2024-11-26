import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Activity, Edit2, Trash2, AlertCircle, Clock } from 'lucide-react';
import { usePatients } from '../../contexts/PatientContext';
import { useTherapySettings } from '../../contexts/TherapySettingsContext';
import PageTransition from '../PageTransition';
import EditChartDialog from './EditChartDialog';
import DeleteChartDialog from './DeleteChartDialog';
import { ChartEntry } from '../../contexts/PatientContext';

export default function PatientChartList() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPatient, editChartEntry, deleteChartEntry } = usePatients();
  const { therapyOptions } = useTherapySettings();
  const [editingEntry, setEditingEntry] = useState<ChartEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<ChartEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const patient = patientId ? getPatient(patientId) : undefined;

  // URLからエントリーIDを取得して自動的に編集モーダルを開く
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const entryId = searchParams.get('entry');
    if (entryId && patient) {
      const entry = patient.chartEntries.find(e => e.id === entryId);
      if (entry) {
        setEditingEntry(entry);
      }
    }
  }, [location.search, patient]);

  if (!patient) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>患者が見つかりません</span>
        </div>
      </div>
    );
  }

  const sortedEntries = useMemo(() => {
    return [...patient.chartEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [patient.chartEntries]);

  const calculateTreatmentPeriod = (date: string) => {
    const weeks = Math.floor(
      (new Date(date).getTime() - new Date(patient.firstVisitDate).getTime()) /
      (1000 * 60 * 60 * 24 * 7)
    );
    const days = Math.floor(
      (new Date(date).getTime() - new Date(patient.firstVisitDate).getTime()) /
      (1000 * 60 * 60 * 24)
    ) % 7;
    return `${weeks}w${days}d`;
  };

  const handleEditEntry = async (
    entryId: string,
    updates: { content: string; therapyMethods: string[]; nextAppointment?: string },
    reason: string
  ) => {
    try {
      setErrorMessage(null);
      await editChartEntry(patientId, entryId, updates, reason);
      setEditingEntry(null);
      navigate(`/chart-management/${patientId}`, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'カルテの修正に失敗しました');
      console.error('Failed to edit chart entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string, reason: string) => {
    try {
      setErrorMessage(null);
      await deleteChartEntry(patientId, entryId, reason);
      setDeletingEntry(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'カルテの削除に失敗しました');
      console.error('Failed to delete chart entry:', error);
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/chart-management')}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-mono-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-mono-900">
              {patient.lastName} {patient.firstName}
            </h1>
            <p className="text-mono-500">
              {patient.lastNameKana} {patient.firstNameKana}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {sortedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-mono-50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
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

                {!entry.isDeleted && (
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="記録を修正"
                      onClick={() => setEditingEntry(entry)}
                      className="p-2 text-mono-500 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="記録を削除"
                      onClick={() => setDeletingEntry(entry)}
                      className="p-2 text-mono-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="whitespace-pre-wrap text-mono-700 text-sm">
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
                          className="px-2 py-1 bg-white text-mono-600 rounded-full text-sm"
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

              {entry.modifiedAt && (
                <div className="mt-4 pt-4 border-t border-mono-100">
                  <p className="text-xs text-mono-500">
                    最終修正: {format(new Date(entry.modifiedAt), 'yyyy年M月d日 HH:mm', { locale: ja })}
                    {entry.modifiedReason && ` - ${entry.modifiedReason}`}
                  </p>
                </div>
              )}

              {entry.isDeleted && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">
                    この記録は削除されました
                    {entry.deleteReason && ` - ${entry.deleteReason}`}
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          {sortedEntries.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
              <p className="text-mono-500">カルテ記録はありません</p>
            </div>
          )}
        </div>

        {editingEntry && (
          <EditChartDialog
            isOpen={!!editingEntry}
            onClose={() => {
              setEditingEntry(null);
              navigate(`/chart-management/${patientId}`, { replace: true });
            }}
            onConfirm={(updates, reason) => 
              handleEditEntry(editingEntry.id, updates, reason)
            }
            defaultValues={{
              content: editingEntry.content,
              therapyMethods: editingEntry.therapyMethods || [],
              nextAppointment: editingEntry.nextAppointment
            }}
            date={format(new Date(editingEntry.date), 'yyyy年M月d日(E)', { locale: ja })}
            therapyOptions={therapyOptions}
          />
        )}

        {deletingEntry && (
          <DeleteChartDialog
            isOpen={!!deletingEntry}
            onClose={() => setDeletingEntry(null)}
            onConfirm={(reason) => 
              handleDeleteEntry(deletingEntry.id, reason)
            }
            date={format(new Date(deletingEntry.date), 'yyyy年M月d日(E)', { locale: ja })}
          />
        )}
      </div>
    </PageTransition>
  );
}