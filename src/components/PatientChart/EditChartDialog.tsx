import React from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const editChartSchema = z.object({
  content: z.string().min(1, '施術内容を入力してください'),
  therapyMethods: z.array(z.string()),
  editReason: z.string().min(10, '修正理由は10文字以上で入力してください'),
});

type EditChartFormData = z.infer<typeof editChartSchema>;

interface EditChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updates: { content: string; therapyMethods: string[] }, reason: string) => void;
  defaultValues: {
    content: string;
    therapyMethods: string[];
  };
  therapyOptions: Array<{
    id: string;
    name: string;
  }>;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditChartFormData>({
    resolver: zodResolver(editChartSchema),
    defaultValues: {
      content: defaultValues.content,
      therapyMethods: defaultValues.therapyMethods,
      editReason: ''
    }
  });

  const onSubmit = (data: EditChartFormData) => {
    onConfirm(
      { content: data.content, therapyMethods: data.therapyMethods },
      data.editReason
    );
    reset();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-mono-900">カルテ記録の修正</h2>
            <p className="text-sm text-mono-500">{date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
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
            <label className="block text-sm font-medium text-mono-700 mb-2">
              施術内容
            </label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-2">
              実施した物理療法
            </label>
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
              修正理由 <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register('editReason')}
              rows={3}
              className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
              placeholder="修正理由を具体的に入力してください"
            />
            {errors.editReason && (
              <p className="mt-1 text-sm text-red-600">{errors.editReason.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              修正を保存
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}