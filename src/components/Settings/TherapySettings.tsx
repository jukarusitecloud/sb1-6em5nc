import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTherapySettings } from '../../contexts/TherapySettingsContext';
import PageTransition from '../PageTransition';

const therapyOptionSchema = z.object({
  name: z.string().min(1, '療法名を入力してください'),
  category: z.string().min(1, 'カテゴリーを入力してください'),
  isEnabled: z.boolean()
});

type TherapyOptionFormData = z.infer<typeof therapyOptionSchema>;

export default function TherapySettings() {
  const { therapyOptions, addTherapyOption, updateTherapyOption, deleteTherapyOption } = useTherapySettings();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TherapyOptionFormData>({
    resolver: zodResolver(therapyOptionSchema),
    defaultValues: {
      isEnabled: true
    }
  });

  const onSubmit = (data: TherapyOptionFormData) => {
    addTherapyOption(data);
    reset();
  };

  const categories = Array.from(new Set(therapyOptions.map(option => option.category)));

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">物理療法設定</h1>

        <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-mono-900 mb-4">新規療法追加</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mono-700">療法名</label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                placeholder="超音波療法"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">カテゴリー</label>
              <input
                type="text"
                {...register('category')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                placeholder="物理療法"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isEnabled')}
                  className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                />
                <span className="text-sm text-mono-700">有効にする</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
              >
                <Plus className="h-4 w-4" />
                追加
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-mono-200">
          <div className="p-6">
            <h2 className="text-lg font-medium text-mono-900 mb-4">療法一覧</h2>
            {categories.map(category => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-medium text-mono-700 mb-3">{category}</h3>
                <div className="space-y-3">
                  {therapyOptions
                    .filter(option => option.category === category)
                    .map(option => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between p-3 border border-mono-200 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={option.isEnabled}
                              onChange={(e) => updateTherapyOption(option.id, { isEnabled: e.target.checked })}
                              className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                            />
                            <span className="text-sm text-mono-900">{option.name}</span>
                          </label>
                        </div>
                        <button
                          onClick={() => deleteTherapyOption(option.id)}
                          className="p-2 text-mono-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}