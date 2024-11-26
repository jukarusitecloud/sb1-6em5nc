import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
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

type PasswordChangeFormData = z.infer<typeof passwordSchema>;

interface PasswordStrengthIndicatorProps {
  password: string;
}

function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements = [
    { regex: /.{8,}/, label: '8文字以上' },
    { regex: /[A-Z]/, label: '大文字を含む' },
    { regex: /[a-z]/, label: '小文字を含む' },
    { regex: /[0-9]/, label: '数字を含む' },
    { regex: /[^A-Za-z0-9]/, label: '特殊文字を含む' }
  ];

  const strength = requirements.filter(req => req.regex.test(password)).length;
  const percentage = (strength / requirements.length) * 100;

  return (
    <div className="space-y-2">
      <div className="h-2 bg-mono-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            percentage <= 20 ? 'bg-red-500' :
            percentage <= 40 ? 'bg-orange-500' :
            percentage <= 60 ? 'bg-yellow-500' :
            percentage <= 80 ? 'bg-lime-500' :
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
          >
            {req.regex.test(password) ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-mono-400" />
            )}
            <span className={req.regex.test(password) ? 'text-green-600' : 'text-mono-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PasswordChange() {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'パスワードの変更に失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-mono-900 mb-6">
        パスワードの変更
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"
        >
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600"
        >
          <Check className="h-5 w-5" />
          <p className="text-sm">パスワードを変更しました</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-mono-700">
            現在のパスワード
          </label>
          <div className="mt-1 relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword')}
              className={`block w-full pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-offset-0 ${
                errors.currentPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-mono-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5 text-mono-400" />
              ) : (
                <Eye className="h-5 w-5 text-mono-400" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

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
          <div className="mt-2">
            <PasswordStrengthIndicator password={newPassword} />
          </div>
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
          {isLoading ? '変更中...' : 'パスワードを変更'}
        </button>
      </form>
    </div>
  );
}