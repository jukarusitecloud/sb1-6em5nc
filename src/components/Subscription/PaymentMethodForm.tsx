import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock, AlertCircle } from 'lucide-react';

declare const Payjp: any;

const paymentMethodSchema = z.object({
  cardNumber: z.string().min(1, 'カード番号を入力してください'),
  expiry: z.string().min(1, '有効期限を入力してください'),
  cvc: z.string().min(3, 'セキュリティコードを入力してください').max(4)
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onSuccess: () => void;
}

export default function PaymentMethodForm({ onSuccess }: PaymentMethodFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema)
  });

  const onSubmit = async (data: PaymentMethodFormData) => {
    try {
      setError(null);
      setIsProcessing(true);

      Payjp.setPublicKey('pk_live_d58cb29e8aa1c15f20d99b74');
      const response = await Payjp.createToken({
        number: data.cardNumber.replace(/\s/g, ''),
        cvc: data.cvc,
        exp_month: data.expiry.split('/')[0],
        exp_year: `20${data.expiry.split('/')[1]}`
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // TODO: サーバーサイドで支払い方法を更新
      // const updateResponse = await fetch('/api/payment-method/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: response.id })
      // });

      // if (!updateResponse.ok) {
      //   throw new Error('支払い方法の更新に失敗しました');
      // }

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'カード情報の処理中にエラーが発生しました'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-mono-900 mb-6">
        お支払い方法の変更
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-mono-700">
            カード番号
          </label>
          <div className="mt-1 relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
            <input
              type="text"
              {...register('cardNumber')}
              onChange={(e) => {
                e.target.value = formatCardNumber(e.target.value);
              }}
              maxLength={19}
              placeholder="4242 4242 4242 4242"
              className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
            />
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mono-700">
              有効期限
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
              <input
                type="text"
                {...register('expiry')}
                onChange={(e) => {
                  e.target.value = formatExpiry(e.target.value);
                }}
                maxLength={5}
                placeholder="MM/YY"
                className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {errors.expiry && (
              <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              セキュリティコード
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
              <input
                type="text"
                {...register('cvc')}
                maxLength={4}
                placeholder="123"
                className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {errors.cvc && (
              <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isProcessing ? '処理中...' : 'カード情報を更新'}
        </button>
      </form>
    </div>
  );
}