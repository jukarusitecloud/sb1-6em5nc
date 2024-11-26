import React, { useState } from 'react';
import { useTreatmentReminders, ReminderRule } from '../../contexts/TreatmentRemindersContext';
import { Plus, X, Save, Edit2, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TreatmentReminders() {
  const { reminderRules, addRule, updateRule, deleteRule } = useTreatmentReminders();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [weeks, setWeeks] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    const weeksNum = parseInt(weeks);
    if (weeksNum > 0 && message.trim()) {
      addRule({
        weeks: weeksNum,
        message: message.trim(),
        active: true
      });
      setWeeks('');
      setMessage('');
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    const weeksNum = parseInt(weeks);
    if (weeksNum > 0 && message.trim()) {
      updateRule(id, {
        weeks: weeksNum,
        message: message.trim()
      });
      setEditingId(null);
      setWeeks('');
      setMessage('');
    }
  };

  const toggleActive = (rule: ReminderRule) => {
    updateRule(rule.id, { active: !rule.active });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mono-900">リマインド設定</h1>
        <p className="mt-2 text-mono-500">
          治療期間に応じたリマインドメッセージを設定できます。
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
          リマインドを追加
        </motion.button>

        <AnimatePresence mode="popLayout">
          {isAdding && (
            <ReminderForm
              weeks={weeks}
              message={message}
              onWeeksChange={setWeeks}
              onMessageChange={setMessage}
              onSubmit={handleAdd}
              onCancel={() => {
                setIsAdding(false);
                setWeeks('');
                setMessage('');
              }}
            />
          )}

          {reminderRules
            .sort((a, b) => a.weeks - b.weeks)
            .map((rule) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-xl shadow-sm border border-mono-200 p-6 ${
                  !rule.active ? 'opacity-50' : ''
                }`}
              >
                {editingId === rule.id ? (
                  <ReminderForm
                    weeks={weeks}
                    message={message}
                    onWeeksChange={setWeeks}
                    onMessageChange={setMessage}
                    onSubmit={() => handleUpdate(rule.id)}
                    onCancel={() => {
                      setEditingId(null);
                      setWeeks('');
                      setMessage('');
                    }}
                  />
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-mono-100 text-mono-700 rounded-full text-sm">
                          {rule.weeks}週経過時
                        </span>
                        <h3 className="text-lg font-medium text-mono-900">{rule.message}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(rule)}
                          className={`p-2 rounded-lg transition-colors ${
                            rule.active
                              ? 'text-mono-500 hover:text-mono-900 hover:bg-mono-100'
                              : 'text-mono-400 hover:text-mono-600 hover:bg-mono-100'
                          }`}
                        >
                          {rule.active ? (
                            <Bell className="h-4 w-4" />
                          ) : (
                            <BellOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(rule.id);
                            setWeeks(rule.weeks.toString());
                            setMessage(rule.message);
                          }}
                          className="p-2 text-mono-500 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-2 text-mono-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ReminderFormProps {
  weeks: string;
  message: string;
  onWeeksChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function ReminderForm({
  weeks,
  message,
  onWeeksChange,
  onMessageChange,
  onSubmit,
  onCancel
}: ReminderFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          経過週数
        </label>
        <input
          type="number"
          min="1"
          value={weeks}
          onChange={(e) => onWeeksChange(e.target.value)}
          placeholder="週数を入力"
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          メッセージ
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="リマインドメッセージを入力"
          className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
        />
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
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          保存
        </button>
      </div>
    </motion.div>
  );
}