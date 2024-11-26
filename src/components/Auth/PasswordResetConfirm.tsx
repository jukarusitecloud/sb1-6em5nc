import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const resetConfirmSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を含める必要があります')
    .regex(/[a-z]/, '小文字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります')
    .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type PasswordResetConfirmFormData = z.infer<typeof resetConfirmSchema>;

interface PasswordResetConfirmProps {
  token: string;
}

export default function PasswordResetConfirm({ token }: PasswordResetConfirmProps) {
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(resetConfirmSchema)
  });

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement password reset confirmation API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'パスワードのリセットに失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-mono-900 mb-2">
          パスワードを変更しました
        </h2>
        <p className="text-mono-600 mb-6">
          新しいパスワードでログインできます。
          まもなくログイン画面に移動します。
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 text-mono-600 hover:text-mono-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        ログイン画面に戻る
      </button>

      <h2 className="text-xl font-bold text-mono-900 mb-2">
        新しいパスワードを設定
      </h2>
      <p className="text-mono-600 mb-6">
        新しいパスワードを入力してください。
        セキュリティのため、強度の高いパスワードを設定することをお勧めします。
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-mono-700">
            新しいパスワード
          </label>
          <div className="mt-1 relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              className={`block w-full pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-offset-0 ${
                errors.newPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-mono-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5 text-mono-400" />
              ) : (
                <Eye className="h-5 w-5 text-mono-400" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-mono-700">
            新しいパスワード（確認）
          </label>
          <div className="mt-1 relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`block w-full pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-offset-0 ${
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-mono-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
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
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? '設定中...' : 'パスワードを設定'}
        </button>
      </form>
    </motion.div>
  );
}