import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { PlanType, PLANS } from '../../contexts/SubscriptionContext';

interface PlanCardProps {
  planId: PlanType;
  isYearly: boolean;
  isCurrentPlan: boolean;
  onSelect: (planId: PlanType) => void;
  isPopular?: boolean;
}

export default function PlanCard({
  planId,
  isYearly,
  isCurrentPlan,
  onSelect,
  isPopular
}: PlanCardProps) {
  const plan = PLANS[planId];
  const price = isYearly ? plan.yearlyPrice : plan.price;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative flex flex-col p-6 bg-white rounded-2xl shadow-lg border-2 ${
        isPopular ? 'border-purple-500' : 'border-mono-200'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full shadow-md">
            <Star className="h-4 w-4" />
            人気プラン
          </span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-mono-900">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold tracking-tight text-mono-900">
            ¥{price.toLocaleString()}
          </span>
          <span className="text-mono-500">/{isYearly ? '年' : '月'}</span>
          {isYearly && price > 0 && (
            <p className="mt-1 text-sm text-green-600">
              年間契約で16%お得
            </p>
          )}
        </div>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-mono-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(planId)}
        disabled={isCurrentPlan}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          isCurrentPlan
            ? 'bg-mono-100 text-mono-400 cursor-not-allowed'
            : isPopular
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-mono-900 text-white hover:bg-mono-800'
        }`}
      >
        {isCurrentPlan ? '現在のプラン' : 'プランを選択'}
      </button>
    </motion.div>
  );
}