import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../contexts/PatientContext';
import { useTherapySettings } from '../contexts/TherapySettingsContext';
import { useTreatmentTemplates } from '../contexts/TreatmentTemplatesContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Save, ArrowLeft, Clock, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import PageTransition from './PageTransition';
import TemplateSelector from './PatientChart/TemplateSelector';
import TreatmentHistory from './PatientChart/TreatmentHistory';

const chartEntrySchema = z.object({
  date: z.string().min(1, '施術日は必須です'),
  content: z.string().min(1, '施術内容は必須です'),
  therapyMethods: z.array(z.string()).optional(),
  nextAppointment: z.string().optional(),
});

type ChartEntryFormData = z.infer<typeof chartEntrySchema>;

export default function PatientChart() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, addChartEntry } = usePatients();
  const { templates } = useTreatmentTemplates();
  const { therapyOptions } = useTherapySettings();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>患者が見つかりません。患者IDを確認してください。</span>
        </div>
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChartEntryFormData>({
    resolver: zodResolver(chartEntrySchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      therapyMethods: [],
    },
  });

  const handleSelectAllTherapies = () => {
    setValue('therapyMethods', therapyOptions.map(option => option.id));
  };

  const handleDeselectAllTherapies = () => {
    setValue('therapyMethods', []);
  };

  const onSubmit = async (data: ChartEntryFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await addChartEntry(patientId, {
        ...data,
        createdAt: new Date().toISOString(),
      });
      navigate('/active-patients');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'カルテの保存に失敗しました。再試行してください。');
      console.error('カルテの保存に失敗しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/active-patients')}
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
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 text-mono-600 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <Clock className="h-5 w-5" />
            <span>{showHistory ? '新規記録' : '履歴を表示'}</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {showHistory ? (
          <TreatmentHistory
            entries={patient.chartEntries}
            firstVisitDate={patient.firstVisitDate}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-mono-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-mono-700">
                    施術日
                  </label>
                  <input
                    type="date"
                    {...register('date')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-mono-700">
                    施術内容
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    定型文を{showTemplates ? '閉じる' : '挿入'}
                    {showTemplates ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {showTemplates && (
                  <div className="mb-4 p-4 bg-mono-50 rounded-lg">
                    <TemplateSelector
                      templates={templates}
                      onSelect={(content) => {
                        const currentContent = watch('content') || '';
                        const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
                        const cursorPosition = textarea?.selectionStart ?? currentContent.length;
                        
                        const newContent = 
                          currentContent.slice(0, cursorPosition) + 
                          content + 
                          currentContent.slice(cursorPosition);
                        
                        setValue('content', newContent, { shouldValidate: true });
                        setShowTemplates(false);

                        setTimeout(() => {
                          textarea?.focus();
                          const newPosition = cursorPosition + content.length;
                          textarea?.setSelectionRange(newPosition, newPosition);
                        }, 0);
                      }}
                    />
                  </div>
                )}

                <textarea
                  {...register('content')}
                  rows={6}
                  className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  placeholder="施術内容を入力してください"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              {therapyOptions.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-mono-700">
                      実施した物理療法
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllTherapies}
                        className="px-3 py-1.5 text-sm bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200 transition-colors"
                      >
                        すべて選択
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllTherapies}
                        className="px-3 py-1.5 text-sm bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200 transition-colors"
                      >
                        すべて解除
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {therapyOptions.map(option => (
                      <label key={option.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={option.id}
                          {...register('therapyMethods')}
                          className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                        />
                        <span className="text-sm text-mono-700">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-mono-700">
                  次回予約
                </label>
                <input
                  type="date"
                  {...register('nextAppointment')}
                  className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? '保存中...' : 'カルテを保存'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </PageTransition>
  );
}