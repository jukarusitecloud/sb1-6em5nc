import React from 'react';
import { Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const plans = [
  {
    name: 'ベーシック',
    price: '¥3,900',
    period: '月',
    features: [
      '最大50人の患者',
      '基本的な医療記録',
      '予約管理',
      'メールサポート'
    ],
    priceId: 'price_basic'
  },
  {
    name: 'プロフェッショナル',
    price: '¥7,900',
    period: '月',
    features: [
      '最大200人の患者',
      '高度な医療記録',
      '予約管理',
      '優先サポート',
      'カスタムレポート',
      'チーム連携'
    ],
    priceId: 'price_pro',
    popular: true
  },
  {
    name: 'エンタープライズ',
    price: '¥19,900',
    period: '月',
    features: [
      '無制限の患者',
      '完全な医療記録',
      '高度な予約管理',
      '24時間サポート',
      'カスタムレポート',
      'チーム連携',
      'API アクセス',
      'カスタム連携'
    ],
    priceId: 'price_enterprise'
  }
];

interface SubscriptionPlansProps {
  email: string;
}

export default function SubscriptionPlans({ email }: SubscriptionPlansProps) {
  const handleSubscribe = async (priceId: string) => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      console.log(`プラン ${priceId} に登録: ${email}`);
    } catch (error) {
      console.error('サブスクリプションに失敗しました:', error);
    }
  };

  return (
    <div className="space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative flex flex-col rounded-2xl border p-8 ${
            plan.popular ? 'border-indigo-600 shadow-md' : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                人気プラン
              </span>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
            <p className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
              <span className="ml-1 text-sm font-semibold text-gray-500">/{plan.period}</span>
            </p>
          </div>

          <ul className="mb-8 space-y-4 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <Check className="h-5 w-5 text-indigo-600 shrink-0" />
                <span className="ml-3 text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.priceId)}
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
              plan.popular
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {plan.name}プランに登録
          </button>
        </div>
      ))}
    </div>
  );
}