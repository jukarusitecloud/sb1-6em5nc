import React from 'react';
import { Check, X } from 'lucide-react';
import { PlanType, PLANS } from '../../contexts/SubscriptionContext';

const FEATURES = [
  {
    name: '患 <boltAction type="file" filePath="src/components/Subscription/FeatureComparison.tsx">import React from 'react';
import { Check, X } from 'lucide-react';
import { PlanType, PLANS } from '../../contexts/SubscriptionContext';

const FEATURES = [
  {
    name: '患者基本情報管理',
    description: '患者の基本データの登録・閲覧',
    included: ['free', 'starter', 'pro', 'enterprise']
  },
  {
    name: '電子カルテ作成',
    description: 'カルテの作成・保存',
    included: ['free', 'starter', 'pro', 'enterprise']
  },
  {
    name: 'データ保存容量',
    description: '保存可能なデータ容量',
    values: {
      free: '500MB',
      starter: '7GB',
      pro: '20GB',
      enterprise: '無制限'
    }
  },
  {
    name: 'スタッフアカウント',
    description: '登録可能なスタッフ数',
    values: {
      free: '管理者1名のみ',
      starter: '2名まで',
      pro: '5名まで',
      enterprise: '無制限'
    }
  },
  {
    name: '管理者機能',
    description: 'システム管理機能へのアクセス',
    included: ['starter', 'pro', 'enterprise']
  },
  {
    name: 'メールサポート',
    description: 'メールによるサポート対応',
    values: {
      free: '基本対応',
      starter: '優先対応',
      pro: '最優先対応',
      enterprise: '専任担当者'
    }
  }
];

export default function FeatureComparison() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-mono-900 text-center mb-8">
        プラン機能比較
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-mono-200">
              <th className="py-4 px-6 text-left text-mono-500 font-medium">機能</th>
              {(Object.keys(PLANS) as PlanType[]).map((planId) => (
                <th key={planId} className="py-4 px-6 text-center">
                  <span className="block text-mono-900 font-bold">
                    {PLANS[planId].name}
                  </span>
                  <span className="block text-sm text-mono-500 mt-1">
                    ¥{PLANS[planId].price.toLocaleString()}/月
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature) => (
              <tr key={feature.name} className="border-b border-mono-200">
                <td className="py-4 px-6">
                  <div className="font-medium text-mono-900">{feature.name}</div>
                  <div className="text-sm text-mono-500">{feature.description}</div>
                </td>
                {(Object.keys(PLANS) as PlanType[]).map((planId) => (
                  <td key={planId} className="py-4 px-6 text-center">
                    {'values' in feature ? (
                      <span className="text-sm text-mono-700">
                        {feature.values[planId]}
                      </span>
                    ) : (
                      feature.included.includes(planId) ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-mono-300 mx-auto" />
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}