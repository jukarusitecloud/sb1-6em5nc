import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Building, Briefcase, Check, AlertCircle } from 'lucide-react';
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
  role: z.enum(['staff', 'admin']),
  permissions: z.array(z.string()),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: '利用規約に同意する必要があります'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type StaffFormData = z.infer<typeof staffSchema>;

const permissions = [
  { id: 'chart:read', name: 'カルテ閲覧', description: '患者カルテの閲覧' },
  { id: 'chart:write', name: 'カルテ記入', description: '新規カルテの記入' },
  { id: 'chart:edit', name: 'カルテ修正', description: '既存カルテの修正' },
  { id: 'patient:register', name: '患者登録', description: '新規患者の登録' },
  { id: 'export:data', name: 'データ出力', description: 'カルテデータの出力' }
];

export default function StaffRegistration() {
  const { createStaffAccount } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: 'staff',
      permissions: ['chart:read'],
      termsAccepted: false
    }
  });

  const onSubmit = async (data: StaffFormData) => {
    try {
      setError(null);
      await createStaffAccount(data);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'スタッフの登録に失敗しました');
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border border-mono-200">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-mono-900 mb-2">
              登録が完了しました
            </h2>
            <p className="text-mono-600 mb-6">
              スタッフアカウントが正常に作成されました。
              登録したメールアドレスに確認メールを送信しました。
            </p>
            <button
              onClick={() => window.location.href = '/admin/staff'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
            >
              スタッフ一覧に戻る
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border border-mono-200">
        <h1 className="text-2xl font-bold text-mono-900 mb-6">
          新規スタッフ登録
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

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
                  className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
                  placeholder="staff@example.com"
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
                  className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
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
                  className="block w-full pl-10 pr-10 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
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
                  className="block w-full pl-10 pr-10 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
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
                  className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
                  placeholder="リハビリテーション科"
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
                  className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
                  placeholder="主任"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-2">
              権限
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissions.map(permission => (
                <label
                  key={permission.id}
                  className="relative flex items-start p-4 rounded-lg border border-mono-200"
                >
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      value={permission.id}
                      {...register('permissions')}
                      className="h-4 w-4 rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                    />
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium text-mono-900">
                      {permission.name}
                    </span>
                    <p className="text-xs text-mono-500">
                      {permission.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register('termsAccepted')}
              className="mt-1 h-4 w-4 rounded border-mono-300 text-mono-600 focus:ring-mono-500"
            />
            <label className="text-sm text-mono-600">
              <a href="/terms" className="text-blue-600 hover:text-blue-500">利用規約</a>
              と
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">プライバシーポリシー</a>
              に同意します
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50"
            >
              {isSubmitting ? '登録中...' : 'スタッフを登録'}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}