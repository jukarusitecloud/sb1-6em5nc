import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, AlertCircle, Shield } from 'lucide-react';
import { User } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';

const editStaffSchema = z.object({
  fullName: z.string().min(1, '氏名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  department: z.string().optional(),
  position: z.string().optional(),
  permissions: z.array(z.string())
});

type EditStaffFormData = z.infer<typeof editStaffSchema>;

interface EditStaffDialogProps {
  staff: User;
  onClose: () => void;
}

const STAFF_PERMISSIONS = [
  { id: 'patient:read', name: '患者情報閲覧', description: '患者の基本情報の閲覧' },
  { id: 'patient:write', name: '患者情報編集', description: '患者情報の編集と新規登録' },
  { id: 'chart:read', name: 'カルテ閲覧', description: 'カルテ記録の閲覧' },
  { id: 'chart:write', name: 'カルテ記入', description: '新規カルテの記入' },
  { id: 'chart:edit', name: 'カルテ修正', description: '既存カルテの修正' }
];

export default function EditStaffDialog({ staff, onClose }: EditStaffDialogProps) {
  const { updateStaff } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EditStaffFormData>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      fullName: staff.fullName,
      email: staff.email,
      department: staff.department,
      position: staff.position,
      permissions: staff.permissions
    }
  });

  const onSubmit = async (data: EditStaffFormData) => {
    try {
      setError(null);
      await updateStaff(staff.id, data);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'スタッフ情報の更新に失敗しました');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b border-mono-200">
          <h2 className="text-xl font-bold text-mono-900">スタッフ情報の編集</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-mono-700">
                氏名
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">
                メールアドレス
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">
                部署
              </label>
              <input
                type="text"
                {...register('department')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">
                役職
              </label>
              <input
                type="text"
                {...register('position')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-mono-500" />
                <h3 className="text-sm font-medium text-mono-700">権限設定</h3>
              </div>
              <div className="space-y-3">
                {STAFF_PERMISSIONS.map(permission => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-3 p-3 bg-mono-50 rounded-lg hover:bg-mono-100 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={permission.id}
                      {...register('permissions')}
                      className="mt-1 rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-medium text-mono-900">
                        {permission.name}
                      </div>
                      <div className="text-sm text-mono-500">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
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
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}