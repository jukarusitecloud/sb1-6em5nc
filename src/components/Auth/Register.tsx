import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, ArrowLeft } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('メールアドレスが無効です'),
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

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAccepted: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/register/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          termsAccepted: data.termsAccepted
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || '登録に失敗しました');
      }

      if (responseData.success) {
        setIsEmailSent(true);
      } else {
        throw new Error(responseData.message || '登録処理中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : '登録に失敗しました');
    }
  };

  if (isEmailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-mono-900">
          認証メールを送信しました
        </h3>
        <p className="text-sm text-mono-600">
          入力いただいたメールアドレスに認証リンクを送信しました。
          メール内のリンクをクリックして、登録を完了してください。
        </p>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            メールが届かない場合は、迷惑メールフォルダをご確認いただくか、
            しばらく待ってから再度お試しください。
          </p>
        </div>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          ログイン画面に戻る
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-mono-600 hover:text-mono-900"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
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
          メールアドレス
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
          <input
            type="email"
            {...register('email')}
            className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
            placeholder="your@email.com"
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

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('termsAccepted')}
          className="h-4 w-4 rounded border-mono-300 text-mono-600 focus:ring-mono-500"
        />
        <label className="ml-2 block text-sm text-mono-600">
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