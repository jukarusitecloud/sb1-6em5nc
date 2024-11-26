import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { useSubscription, PlanType, PLANS } from '../../contexts/SubscriptionContext';
import PlanCard from './PlanCard';
import UpgradeModal from './UpgradeModal';
import PageTransition from '../PageTransition';

export default function SubscriptionSelection() {
  const {
    currentPlan,
    isYearlyBilling,
    setYearlyBilling,
    isLoading
  } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-mono-900">
            プラン・料金
          </h1>
          <p className="mt-4 text-xl text-mono-600">
            規模や必要に応じて最適なプランをお選びください
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!isYearlyBilling ? 'text-mono-900' : 'text-mono-500'}`}>
              月払い
            </span>
            <Switch
              checked={isYearlyBilling}
              onChange={setYearlyBilling}
              className={`${
                isYearlyBilling ? 'bg-purple-600' : 'bg-mono-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  isYearlyBilling ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className={`text-sm ${isYearlyBilling ? 'text-mono-900' : 'text-mono-500'}`}>
              年払い
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              16%お得
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(Object.keys(PLANS) as PlanType[]).map((planId) => (
            <PlanCard
              key={planId}
              planId={planId}
              isYearly={isYearlyBilling}
              isCurrentPlan={currentPlan === planId}
              onSelect={setSelectedPlan}
              isPopular={planId === 'pro'}
            />
          ))}
        </div>

        <UpgradeModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          planId={selectedPlan || 'free'}
          isYearly={isYearlyBilling}
        />

        <div className="mt-12 text-center">
          <p className="text-mono-500">
            ご不明な点がございましたら、お気軽に
            <a href="/contact" className="text-purple-600 hover:text-purple-500">
              お問い合わせ
            </a>
            ください。
          </p>
        </div>
      </div>
    </PageTransition>
  );
}