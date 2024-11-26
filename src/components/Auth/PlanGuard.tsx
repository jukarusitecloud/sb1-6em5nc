import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { AlertCircle, CreditCard } from 'lucide-react';

interface PlanGuardProps {
  children: React.ReactNode;
  requiredPlan: 'free' | 'starter' | 'pro' | 'enterprise';
  staffLimit?: number;
}

export default function PlanGuard({ children, requiredPlan, staffLimit }: PlanGuardProps) {
  const { currentPlan, staffCount } = useSubscription();

  const planLevels = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3
  };

  const currentPlanLevel = planLevels[currentPlan];
  const requiredPlanLevel = planLevels[requiredPlan];

  if (currentPlanLevel < requiredPlanLevel) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-mono-200 p-6">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-lg font-bold">プランのアップグレードが必要です</h2>
          </div>
          
          <p className="text-mono-600 mb-6">
            この機能を利用するには{requiredPlan === 'starter' ? 'スタート' : 
              requiredPlan === 'pro' ? 'プロ' : '大規模'}プラン以上へのアップグレードが必要です。
          </p>

          <a 
            href="/subscription" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
          >
            <CreditCard className="h-5 w-5" />
            プランを確認する
          </a>
        </div>
      </div>
    );
  }

  if (staffLimit && staffCount > staffLimit) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-mono-200 p-6">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-lg font-bold">スタッフ数の上限に達しています</h2>
          </div>
          
          <p className="text-mono-600 mb-6">
            現在のプランでは最大{staffLimit}名までのスタッフ登録が可能です。
            より多くのスタッフを登録するには、上位プランへのアップグレードが必要です。
          </p>

          <a 
            href="/subscription" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
          >
            <CreditCard className="h-5 w-5" />
            プランを確認する
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}