import React from 'react';
import { FileText, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { TreatmentTemplate } from '../../contexts/TreatmentTemplatesContext';
import { TherapyOption } from '../../contexts/TherapySettingsContext';
import TemplateSelector from './TemplateSelector';

interface ChartFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isSubmitting: boolean;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  templates: TreatmentTemplate[];
  therapyOptions: TherapyOption[];
}

export default function ChartForm({
  register,
  errors,
  isSubmitting,
  watch,
  setValue,
  showTemplates,
  setShowTemplates,
  templates,
  therapyOptions
}: ChartFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-mono-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            <p className="mt-1 text-sm text-red-600">
              {errors.date.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-mono-500" />
            <h3 className="text-lg font-medium text-mono-700">施術内容</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
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

        <AnimatePresence>
          {showTemplates && templates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4 bg-mono-50 rounded-xl p-4 overflow-hidden"
            >
              <TemplateSelector
                templates={templates}
                onSelect={(content) => {
                  const currentContent = watch('content') || '';
                  const textarea = document.querySelector(
                    'textarea[name="content"]'
                  ) as HTMLTextAreaElement;
                  const cursorPosition =
                    textarea?.selectionStart ?? currentContent.length;

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
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          {...register('content')}
          rows={8}
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
          placeholder="施術内容を入力してください"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">
            {errors.content.message}
          </p>
        )}
      </div>

      {therapyOptions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-mono-700 mb-3">
            実施した物理療法
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {therapyOptions
              .filter(option => option.isEnabled)
              .map(option => (
                <label key={option.id} className="flex items-center space-x-2">
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

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? '保存中...' : 'カルテを保存'}
        </button>
      </div>
    </div>
  );
}