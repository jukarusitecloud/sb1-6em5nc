import React from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface EntryFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
}

export default function EntryForm({
  register,
  errors,
  showTemplates,
  setShowTemplates
}: EntryFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-mono-700">施術日</label>
        <input
          type="date"
          {...register('date')}
          className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-mono-500" />
            <h3 className="text-lg font-medium text-mono-700">主訴</h3>
          </div>
        </div>
        <textarea
          {...register('chiefComplaints')}
          rows={2}
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
          placeholder="患者様の主訴を入力してください"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-mono-500" />
            <h3 className="text-lg font-medium text-mono-700">所見</h3>
          </div>
        </div>
        <textarea
          {...register('observations')}
          rows={4}
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
          placeholder="診察所見を入力してください"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-mono-500" />
            <h3 className="text-lg font-medium text-mono-700">施術内容</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <FileText className="h-5 w-5" />
            定型文を{showTemplates ? '閉じる' : '挿入'}
            {showTemplates ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
        <textarea
          {...register('content')}
          rows={6}
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
          placeholder="施術内容を入力してください"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-mono-500" />
          <h3 className="text-lg font-medium text-mono-700">治療計画</h3>
        </div>
        <textarea
          {...register('plan')}
          rows={4}
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
          placeholder="今後の治療計画を入力してください"
        />
      </div>
    </div>
  );
}