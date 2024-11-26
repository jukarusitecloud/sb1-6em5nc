import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';
import PageTransition from '../PageTransition';

const PERMISSIONS_LIST = [
  {
    id: 'patient:read',
    name: '患者情報閲覧',
    description: '患者の基本情報と診療記録の閲覧',
    key: 'patient:read'
  },
  {
    id: 'patient:write',
    name: '患者情報編集',
    description: '患者の基本情報の編集と新規登録',
    key: 'patient:write'
  },
  {
    id: 'chart:read',
    name: 'カルテ閲覧',
    description: '診療記録の閲覧',
    key: 'chart:read'
  },
  {
    id: 'chart:write',
    name: 'カルテ記入',
    description: '新規診療記録の作成',
    key: 'chart:write'
  },
  {
    id: 'chart:edit',
    name: 'カルテ修正',
    description: '既存の診療記録の修正',
    key: 'chart:edit'
  }
];

export default function PermissionsSettings() {
  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">アクセス権限設定</h1>
          <p className="mt-2 text-mono-500">
            システムで利用可能な権限の一覧と説明を確認できます
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="text-sm text-purple-700">
              <p className="font-medium mb-1">権限について</p>
              <ul className="list-disc list-inside space-y-1">
                <li>各権限は特定の機能へのアクセスを制御します</li>
                <li>管理者は全ての権限を持ちます</li>
                <li>一般メンバーは個別に権限を割り当てる必要があります</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {PERMISSIONS_LIST.map((permission, index) => (
            <motion.div
              key={permission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-mono-900 mb-1">
                    {permission.name}
                  </h3>
                  <p className="text-mono-600">{permission.description}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-purple-100 rounded-full">
                    <code className="text-sm text-purple-600">{permission.key}</code>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}