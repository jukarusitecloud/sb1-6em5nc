import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useMemoryBarSettings } from '../../contexts/MemoryBarSettingsContext';
import PageTransition from '../PageTransition';

const memoryBarSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  min: z.number().min(0, '最小値は0以上を指定してください'),
  max: z.number().min(1, '最大値は1以上を指定してください'),
  step: z.number().min(0.1, 'ステップは0.1以上を指定してください'),
  defaultValue: z.number(),
  isEnabled: z.boolean()
}).refine(data => data.max > data.min, {
  message: '最大値は最小値より大きい値を指定してください',
  path: ['max']
}).refine(data => data.defaultValue >= data.min && data.defaultValue <= data.max, {
  message: 'デフォルト値は最小値と最大値の間で指定してください',
  path: ['defaultValue']
});

type MemoryBarFormData = z.infer<typeof memoryBarSchema>;

export default function MemoryBarSettings() {
  const { memoryBars, addMemoryBar, updateMemoryBar, deleteMemoryBar } = useMemoryBarSettings();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemoryBarFormData>({
    resolver: zodResolver(memoryBarSchema),
    defaultValues: {
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 5,
      isEnabled: true
    }
  });

  const onSubmit = (data: MemoryBarFormData) => {
    addMemoryBar(data);
    reset();
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">メモリバー設定</h1>

        <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-mono-900 mb-4">新規メモリバー追加</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mono-700">タイトル</label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700">最小値</label>
                <input
                  type="number"
                  {...register('min', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
                {errors.min && (
                  <p className="mt-1 text-sm text-red-600">{errors.min.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700">最大値</label>
                <input
                  type="number"
                  {...register('max', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
                {errors.max && (
                  <p className="mt-1 text-sm text-red-600">{errors.max.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700">ステップ</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('step', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
                {errors.step && (
                  <p className="mt-1 text-sm text-red-600">{errors.step.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700">デフォルト値</label>
                <input
                  type="number"
                  {...register('defaultValue', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
                {errors.defaultValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.defaultValue.message}</p>
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
            <h2 className="text-lg font-medium text-mono-900 mb-4">メモリバー一覧</h2>
            <div className="space-y-4">
              {memoryBars.map((bar) => (
                <div
                  key={bar.id}
                  className="flex items-start justify-between p-4 border border-mono-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-medium text-mono-900">{bar.title}</span>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bar.isEnabled}
                          onChange={(e) => updateMemoryBar(bar.id, { isEnabled: e.target.checked })}
                          className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                        />
                        <span className="text-sm text-mono-700">有効</span>
                      </label>
                    </div>
                    <p className="text-sm text-mono-600">
                      範囲: {bar.min} 〜 {bar.max} (ステップ: {bar.step})
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMemoryBar(bar.id)}
                    className="p-2 text-mono-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}