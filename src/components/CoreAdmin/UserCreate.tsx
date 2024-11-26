import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Building, Briefcase, Shield, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import PageTransition from '../PageTransition';

const userSchema = z.object({
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
  role: z.enum(['admin', 'staff']),
  permissions: z.array(z.string())
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

const PERMISSIONS = [
  { id: 'users:read', name: 'ユーザー閲覧', description: 'ユーザー情報の閲覧' },
  { id: 'users:write', name: 'ユーザー編集', description: 'ユーザー情報の編集' },
  { id: 'logs:read', name: 'ログ閲覧', description: 'システムログの閲覧' },
  { id: 'settings:read', name: '設定閲覧', description: 'システム設定の閲覧' },
  { id: 'settings:write', name: '設定編集', description: 'システム設定の編集' }
];

export default function UserCreate() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'staff',
      permissions: []
    }
  });

  const role = watch('role');

  const onSubmit = async (data: UserFormData) => {
    try {
      setError(null);
      // TODO: Implement user creation API call
      console.log('Creating user:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/coreadmin/users');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'ユーザーの作成に失敗しました');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/coreadmin/users')}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-mono-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-mono-900">新規ユーザー作成</h1>
            <p className="text-mono-500">新しいユーザーアカウントを作成します</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mono-700">
                  メールアドレス
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="email"
                    {...register('email')}
                    className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700">
                  氏名
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register('fullName')}
                    className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    placeholder="山田 太郎"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700">
                  パスワード
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="block w-full pl-10 pr-10 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="block w-full pl-10 pr-10 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                <div className="mt-1 relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register('department')}
                    className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    placeholder="システム管理部"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700">
                  役職
                </label>
                <div className="mt-1 relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register('position')}
                    className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    placeholder="主任"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                ユーザー種別
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('role')}
                    value="admin"
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-mono-700">管理者</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('role')}
                    value="staff"
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-mono-700">スタッフ</span>
                </label>
              </div>
            </div>

            {role === 'staff' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-mono-500" />
                  <h3 className="text-sm font-medium text-mono-700">権限設定</h3>
                </div>
                <div className="space-y-3">
                  {PERMISSIONS.map(permission => (
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
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => navigate('/coreadmin/users')}
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
                {isSubmitting ? '作成中...' : 'ユーザーを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}