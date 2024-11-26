import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useSubscription, PLANS } from '../../contexts/SubscriptionContext';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface SubscriptionStatusProps {
  nextBillingDate?: string;
  cardLast4?: string;
}

export default function SubscriptionStatus({
  nextBillingDate,
  cardLast4
}: SubscriptionStatusProps) {
  const { currentPlan, isYearlyBilling, cancelSubscription, isLoading } = useSubscription();
  const plan = PLANS[currentPlan];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6">
      <h2 className="text-xl font-bold text-mono-900 mb-6">
        現在のプラン
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-mono-50 rounded-lg">
          <div>
            <h3 className="font-medium text-mono-900">{plan.name}</h3>
            <p className="text-sm text-mono-500">
              {isYearlyBilling ? '年払い' : '月払い'}
            </p>
          </div>
          <span className="text-lg font-bold text-mono-900">
            ¥{(isYearlyBilling ? plan.yearlyPrice : plan.price).toLocaleString()}/
            {isYearlyBilling ? '年' : '月'}
          </span>
        </div>

        {nextBillingDate && (
          <div className="flex items-center gap-3 p-4 border border-mono-200 rounded-lg">
            <Calendar className="h-5 w-5 text-mono-400" />
            <div>
              <p className="text-sm font-medium text-mono-900">次回の請求日</p>
              <p className="text-sm text-mono-500">
                {format(new Date(nextBillingDate), 'yyyy年M月d日', { locale: ja })}
              </p>
            </div>
          </div>
        )}

        {cardLast4 && (
          <div className="flex items-center gap-3 p-4 border border-mono-200 rounded-lg">
            <CreditCard className="h-5 w-5 text-mono-400" />
            <div>
              <p className="text-sm font-medium text-mono-900">お支払い方法</p>
              <p className="text-sm text-mono-500">
                クレジットカード（末尾{cardLast4}）
              </p>
            </div>
          </div>
        )}

        {currentPlan !== 'free' && (
          <div className="pt-6 border-t border-mono-200">
            <button
              onClick={async () => {
                if (window.confirm('サブスクリプションをキャンセルしてよろしいですか？\nキャンセル後はフリープランとなります。')) {
                  try {
                    await cancelSubscription();
                  } catch (error) {
                    console.error('Subscription cancellation failed:', error);
                  }
                }
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              <AlertCircle className="h-4 w-4" />
              サブスクリプションをキャンセル
            </button>
          </div>
        )}
      </div>
    </div>
  );
}