import React, { createContext, useContext, useState } from 'react';

export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';

export const PLANS = {
  free: {
    name: 'フリープラン',
    price: 0,
    yearlyPrice: 0,
    features: [
      '患者基本情報管理',
      '電子カルテ作成（基本機能）',
      'データ保存容量：計500MBまで',
      'ユーザー数：管理者1人のみ',
      'オンラインFAQ、メールサポート'
    ]
  },
  starter: {
    name: 'スタートプラン',
    price: 1200,
    yearlyPrice: 12000,
    features: [
      '患者基本情報管理',
      '電子カルテ作成（基本機能）',
      'データ保存容量：7GBまで',
      'ユーザー数：管理者1人、スタッフ2人まで',
      'フルアクセス管理者機能',
      'オンラインFAQ、メールサポート'
    ]
  },
  pro: {
    name: 'プロプラン',
    price: 2980,
    yearlyPrice: 30000,
    features: [
      '患者基本情報管理',
      '電子カルテ作成（基本機能）',
      'データ保存容量：20GBまで',
      'ユーザー数：管理者1人、スタッフ5人まで',
      'フルアクセス管理者機能',
      'オンラインFAQ、メールサポート'
    ]
  },
  enterprise: {
    name: '大規模プラン',
    price: 6980,
    yearlyPrice: 70000,
    features: [
      '患者基本情報管理',
      '電子カルテ作成（基本機能）',
      'データ保存容量：制限なし',
      'ユーザー数：管理者1人、スタッフ制限なし',
      'フルアクセス管理者機能',
      'オンラインFAQ、メールサポート'
    ]
  }
} as const;

interface SubscriptionContextType {
  currentPlan: PlanType;
  isYearlyBilling: boolean;
  setYearlyBilling: (yearly: boolean) => void;
  upgradePlan: (planId: PlanType) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  isLoading: boolean;
  staffCount: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [isYearlyBilling, setYearlyBilling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staffCount, setStaffCount] = useState(0);

  const upgradePlan = async (planId: PlanType) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual plan upgrade logic with PAY.JP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPlan(planId);
    } catch (error) {
      console.error('Plan upgrade failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual subscription cancellation logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPlan('free');
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        isYearlyBilling,
        setYearlyBilling,
        upgradePlan,
        cancelSubscription,
        isLoading,
        staffCount
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}