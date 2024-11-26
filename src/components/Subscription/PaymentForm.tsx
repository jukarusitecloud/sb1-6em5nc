import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock, AlertCircle, Check } from 'lucide-react';
import { PlanType, PLANS } from '../../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

declare const Payjp: any;

const paymentSchema = z.object({
  cardNumber: z.string().min(1, 'カード番号を入力してください'),
  expiry: z.string().min(1, '有効期限を入力してください'),
  cvc: z.string().min(3, 'セキュリティコードを入力してください').max(4)
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  planId: PlanType;
  isYearly: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({
  planId,
  isYearly,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const plan = PLANS[planId];

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema)
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setError(null);
      setIsProcessing(true);

      // PAY.JPの初期化
      const payjp = Payjp('pk_live_d58cb29e8aa1c15f20d99b74');

      // カード情報のトークン化
      const cardInfo = {
        number: data.cardNumber.replace(/\s/g, ''),
        cvc: data.cvc,
        exp_month: data.expiry.split('/')[0],
        exp_year: `20${data.expiry.split('/')[1]}`
      };

      const response = await payjp.createToken(cardInfo);

      if (response.error) {
        throw new Error(response.error.message);
      }

      setIsComplete(true);
      setTimeout(() => {
        onSuccess();
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'お支払い情報の処理中にエラーが発生しました'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-mono-900 mb-2">
          サブスクリプションの設定が完了しました
        </h3>
        <p className="text-mono-600">
          ダッシュボードに移動します...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-mono-900">お支払い情報</h2>
        <div className="mt-2 p-4 bg-mono-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-mono-600">プラン</span>
            <span className="font-medium text-mono-900">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mono-600">料金</span>
            <span className="font-medium text-mono-900">
              ¥{(isYearly ? plan.yearlyPrice : plan.price).toLocaleString()}/{isYearly ? '年' : '月'}
            </span>
          </div>
        </div>
      </div>

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
                e.target.value = e.target.value
                  .replace(/\s/g, '')
                  .replace(/(\d{4})/g, '$1 ')
                  .trim();
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
                  e.target.value = e.target.value
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '$1/$2')
                    .slice(0, 5);
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

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? '処理中...' : 'お支払いを確定'}
          </button>
        </div>
      </form>
    </div>
  );
}