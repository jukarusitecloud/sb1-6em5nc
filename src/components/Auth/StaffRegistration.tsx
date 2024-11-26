import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Building, Briefcase, Shield, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../PageTransition';

const staffSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を含める必要があります')
    .regex(/[a-z]/, '小文字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります')
    .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, '氏名は必須です'),
  department: z.string().optional(),
  position: z.string().optional(),
  permissions: z.array(z.string()),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type StaffFormData = z.infer<typeof staffSchema>;

const STAFF_PERMISSIONS = [
  { id: 'patient:read', name: '患者情報閲覧', description: '患者の基本情報の閲覧' },
  { id: 'patient:write', name: '患者情報編集', description: '患者情報の編集と新規登録' },
  { id: 'chart:read', name: 'カルテ閲覧', description: 'カルテ記録の閲覧' },
  { id: 'chart:write', name: 'カルテ記入', description: '新規カルテの記入' },
  { id: 'chart:edit', name: 'カルテ修正', description: '既存カルテの修正' }
];

export default function StaffRegistration() {
  const { createStaffAccount } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      permissions: ['patient:read', 'chart:read']
    }
  });

  const onSubmit = async (data: StaffFormData) => {
    try {
      setError(null);
      await createStaffAccount(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'スタッフの登録に失敗しました');
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-6">新規スタッフ登録</h1>

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
              placeholder="山田 太郎"
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
              placeholder="staff@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              パスワード
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="block w-full pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-mono-400" />
                ) : (
                  <Eye className="h-5 w-5 text-mono-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              パスワード（確認）
            </label>
            <div className="mt-1 relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="block w-full pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-mono-400" />
                ) : (
                  <Eye className="h-5 w-5 text-mono-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
              placeholder="リハビリテーション科"
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
              placeholder="主任"
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
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? '登録中...' : 'スタッフを登録'}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}