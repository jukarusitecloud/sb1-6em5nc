import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, ChevronUp, ChevronDown, Maximize2, Minimize2, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TherapyOption } from '../../contexts/TherapySettingsContext';
import TemplateSelector from '../PatientChart/TemplateSelector';
import { useTreatmentTemplates } from '../../contexts/TreatmentTemplatesContext';

const editChartSchema = z.object({
  content: z.string().min(1, '施術内容を入力してください'),
  therapyMethods: z.array(z.string()),
  nextAppointment: z.string().optional(),
  editReason: z.string().min(10, '修正理由は10文字以上で入力してください'),
});

type EditChartFormData = z.infer<typeof editChartSchema>;

interface EditChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updates: { 
    content: string; 
    therapyMethods: string[];
    nextAppointment?: string;
  }, reason: string) => void;
  defaultValues: {
    content: string;
    therapyMethods: string[];
    nextAppointment?: string;
  };
  therapyOptions: TherapyOption[];
  date: string;
}

export default function EditChartDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultValues,
  therapyOptions,
  date
}: EditChartDialogProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { templates } = useTreatmentTemplates();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<EditChartFormData>({
    resolver: zodResolver(editChartSchema),
    defaultValues: {
      content: defaultValues.content,
      therapyMethods: defaultValues.therapyMethods,
      nextAppointment: defaultValues.nextAppointment,
      editReason: ''
    }
  });

  const handleClose = useCallback(() => {
    if (isDirty) {
      if (window.confirm('変更内容が保存されていません。編集を破棄してよろしいですか？')) {
        reset();
        onClose();
      }
    } else {
      onClose();
    }
  }, [isDirty, reset, onClose]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  const onSubmit = async (data: EditChartFormData) => {
    onConfirm(
      {
        content: data.content,
        therapyMethods: data.therapyMethods,
        nextAppointment: data.nextAppointment
      },
      data.editReason
    );
    reset();
  };

  const handleSelectAllTherapies = () => {
    setValue('therapyMethods', therapyOptions.map(option => option.id));
  };

  const handleDeselectAllTherapies = () => {
    setValue('therapyMethods', []);
  };

  const modalClasses = useMemo(() => {
    return isFullScreen
      ? 'fixed inset-0 bg-white overflow-y-auto'
      : 'bg-white rounded-xl w-full max-w-2xl my-4 max-h-[90vh] overflow-y-auto';
  }, [isFullScreen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-chart-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={modalClasses}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b border-mono-200 z-10">
          <div>
            <h2 id="edit-chart-title" className="text-xl font-bold text-mono-900">
              カルテ記録の修正
            </h2>
            <p className="text-sm text-mono-500">{date}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
              aria-label={isFullScreen ? '全画面表示を解除' : '全画面表示'}
            >
              {isFullScreen ? (
                <Minimize2 className="h-5 w-5 text-mono-600" />
              ) : (
                <Maximize2 className="h-5 w-5 text-mono-600" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
              aria-label="閉じる"
            >
              <X className="h-5 w-5 text-mono-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium mb-1">カルテ記録を修正する際の注意事項：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>修正内容は履歴として保存されます</li>
                <li>修正理由の入力が必須です</li>
                <li>重要な情報の削除や改ざんは避けてください</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-mono-700">
                  施術内容
                </label>
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200 transition-colors"
                >
                  定型文を{showTemplates ? '閉じる' : '挿入'}
                  {showTemplates ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="bg-mono-50 rounded-lg p-4">
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
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                {...register('content')}
                rows={6}
                className="mt-1 w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                aria-invalid={errors.content ? "true" : "false"}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div>
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                次回予約
              </label>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-mono-400" />
                <input
                  type="date"
                  {...register('nextAppointment')}
                  className="rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                修正理由 <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register('editReason')}
                rows={3}
                className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                placeholder="修正理由を具体的に入力してください"
                aria-invalid={errors.editReason ? "true" : "false"}
              />
              {errors.editReason && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.editReason.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 transition-colors"
              >
                <Save className="h-4 w-4" />
                修正を保存
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}