import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Save, Edit2, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../PageTransition';
import { useReminderSettings } from '../../contexts/ReminderSettingsContext';

const reminderSchema = z.object({
  weeks: z.number().min(1, '週数は1以上を指定してください'),
  message: z.string().min(1, 'メッセージを入力してください'),
  isEnabled: z.boolean()
});

type ReminderFormData = z.infer<typeof reminderSchema>;

export default function ReminderSettings() {
  const { reminderSettings, addReminderSetting, updateReminderSetting, deleteReminderSetting } = useReminderSettings();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      weeks: 4,
      isEnabled: true
    }
  });

  const onSubmit = (data: ReminderFormData) => {
    addReminderSetting(data);
    reset();
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">リマインド設定</h1>

        <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-mono-900 mb-4">新規リマインドルール追加</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mono-700">経過週数</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  {...register('weeks', { valueAsNumber: true })}
                  className="block w-32 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                />
                <span className="text-mono-600">週</span>
              </div>
              {errors.weeks && (
                <p className="mt-1 text-sm text-red-600">{errors.weeks.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">メッセージ</label>
              <input
                type="text"
                {...register('message')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
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
            <h2 className="text-lg font-medium text-mono-900 mb-4">リマインドルール一覧</h2>
            <div className="space-y-4">
              {reminderSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between p-4 border border-mono-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-medium text-mono-900">{setting.weeks}週経過時</span>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={setting.isEnabled}
                          onChange={(e) => updateReminderSetting(setting.id, { isEnabled: e.target.checked })}
                          className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                        />
                        <span className="text-sm text-mono-700">有効</span>
                      </label>
                    </div>
                    <p className="text-sm text-mono-600">{setting.message}</p>
                  </div>
                  <button
                    onClick={() => deleteReminderSetting(setting.id)}
                    className="p-2 text-mono-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
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