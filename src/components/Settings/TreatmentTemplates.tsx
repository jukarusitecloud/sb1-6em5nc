import React, { useState, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Save, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTreatmentTemplates } from '../../contexts/TreatmentTemplatesContext';
import PageTransition from '../PageTransition';

const templateSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  content: z.string().min(1, '内容を入力してください'),
  category: z.string().optional()
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function TreatmentTemplates() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTreatmentTemplates();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema)
  });

  const onSubmit = (data: TemplateFormData) => {
    if (editingId) {
      updateTemplate(editingId, data);
      setEditingId(null);
    } else {
      addTemplate(data);
      setIsAdding(false);
    }
    reset();
  };

  const categories = Array.from(new Set(templates.map(t => t.category || '基本')));

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">定型文設定</h1>
          <p className="mt-2 text-mono-500">
            カルテ記入時に使用する定型文を管理できます。
          </p>
        </div>

        <div className="space-y-6">
          <motion.button
            onClick={() => setIsAdding(true)}
            className={`w-full p-4 rounded-xl border-2 border-dashed border-mono-200 text-mono-500 hover:border-mono-300 hover:text-mono-600 transition-colors ${
              isAdding ? 'hidden' : 'flex'
            } items-center justify-center gap-2`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="h-5 w-5" />
            定型文を追加
          </motion.button>

          <AnimatePresence mode="popLayout">
            {isAdding && (
              <TemplateForm
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                onCancel={() => {
                  setIsAdding(false);
                  reset();
                }}
              />
            )}

            {categories.map(category => (
              <div key={category} className="space-y-4">
                <h2 className="text-lg font-medium text-mono-900">{category}</h2>
                {templates
                  .filter(t => (t.category || '基本') === category)
                  .map(template => (
                    <motion.div
                      key={template.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
                    >
                      {editingId === template.id ? (
                        <TemplateForm
                          onSubmit={handleSubmit(onSubmit)}
                          register={register}
                          errors={errors}
                          onCancel={() => {
                            setEditingId(null);
                            reset();
                          }}
                          defaultValues={template}
                        />
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-mono-900">
                              {template.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(template.id);
                                  reset(template);
                                }}
                                className="p-2 text-mono-500 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteTemplate(template.id)}
                                className="p-2 text-mono-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <pre className="whitespace-pre-wrap text-mono-600 text-sm font-sans">
                            {template.content}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

interface TemplateFormProps {
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: any;
  onCancel: () => void;
  defaultValues?: {
    title: string;
    content: string;
    category?: string;
  };
}

const TemplateForm = forwardRef<HTMLFormElement, TemplateFormProps>(
  ({ onSubmit, register, errors, onCancel, defaultValues }, ref) => {
    return (
      <motion.form
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              {...register('title')}
              defaultValue={defaultValues?.title}
              className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
              placeholder="例：通常施術"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              カテゴリー
            </label>
            <input
              type="text"
              {...register('category')}
              defaultValue={defaultValues?.category}
              className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
              placeholder="例：基本"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              内容
            </label>
            <textarea
              {...register('content')}
              defaultValue={defaultValues?.content}
              rows={6}
              className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
              placeholder="定型文の内容を入力してください"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              保存
            </button>
          </div>
        </div>
      </motion.form>
    );
  }
);

TemplateForm.displayName = 'TemplateForm';