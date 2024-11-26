import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const registrationSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を含める必要があります')
    .regex(/[a-z]/, '小文字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります')
    .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, '氏名は必須です'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: '利用規約に同意する必要があります'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function RegistrationForm({ onSuccess, onBack }: RegistrationFormProps) {
  const { register: registerUser, checkPasswordStrength } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      termsAccepted: false
    }
  });

  const password = watch('password', '');
  const strength = password ? checkPasswordStrength(password) : { score: 0, feedback: [] };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setError(null);
      await registerUser(data.email, data.password, data.fullName, data.termsAccepted);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : '登録に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="text-mono-600 hover:text-mono-900"
      >
        ← ログイン画面に戻る
      </button>

      <h2 className="text-2xl font-bold text-mono-900">新規会員登録</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-mono-700">
          氏名
        </label>
        <div className="mt-1 relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
          <input
            {...register('fullName')}
            type="text"
            placeholder="山田 太郎"
            className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mono-700">
          メールアドレス
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mono-700">
          パスワード
        </label>
        <div className="mt-1 relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
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
        {password && (
          <div className="mt-2">
            <div className="h-2 bg-mono-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength.score <= 1 ? 'bg-red-500' :
                  strength.score === 2 ? 'bg-yellow-500' :
                  strength.score === 3 ? 'bg-green-500' :
                  'bg-green-600'
                }`}
                style={{ width: `${(strength.score + 1) * 20}%` }}
              />
            </div>
            {strength.feedback.length > 0 && (
              <ul className="mt-2 space-y-1">
                {strength.feedback.map((feedback, index) => (
                  <li key={index} className="text-sm text-mono-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {feedback}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mono-700">
          パスワード（確認）
        </label>
        <div className="mt-1 relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-mono-900 hover:bg-mono-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500 disabled:opacity-50"
      >
        {isSubmitting ? '登録中...' : 'アカウントを作成'}
      </button>
    </form>
  );
}