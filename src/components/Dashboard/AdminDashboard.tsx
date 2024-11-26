import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Bell, Settings, Shield, Info, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../PageTransition';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { staffList } = useAuth();

  const stats = [
    {
      title: 'スタッフ数',
      value: staffList.length.toString(),
      icon: <Users className="h-6 w-6" />,
      link: '/admin/staff',
      color: 'bg-blue-500'
    },
    {
      title: '本日のアクティビティ',
      value: '48',
      icon: <Activity className="h-6 w-6" />,
      link: '/admin/activity',
      color: 'bg-green-500'
    },
    {
      title: '未読の通知',
      value: '3',
      icon: <Bell className="h-6 w-6" />,
      link: '/admin/notifications',
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    {
      title: 'スタッフ管理',
      description: 'スタッフアカウントと権限を管理します',
      icon: <UserPlus className="h-8 w-8" />,
      link: '/admin/staff',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'セキュリティ設定',
      description: 'システムのセキュリティ設定を管理します',
      icon: <Shield className="h-8 w-8" />,
      link: '/admin/security',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'システム設定',
      description: 'システム全体の設定を管理します',
      icon: <Settings className="h-8 w-8" />,
      link: '/admin/settings',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">管理者ダッシュボード</h1>
          <p className="mt-2 text-mono-500">
            システムの概要と主要な管理機能にアクセスできます
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-mono-200 p-6 group hover:border-mono-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} bg-opacity-10 rounded-xl`}>
                  <div className={`${stat.color} text-white rounded-lg p-2`}>
                    {stat.icon}
                  </div>
                </div>
                <span className="text-3xl font-bold text-mono-900">{stat.value}</span>
              </div>
              <h3 className="text-mono-600 font-medium">{stat.title}</h3>
              <Link
                to={stat.link}
                className="absolute inset-0 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group relative bg-gradient-to-br text-white rounded-xl shadow-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${action.color.split(' ')[0]} 0%, ${
                  action.color.split(' ')[2]
                } 100%)`
              }}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative p-6">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mb-4">
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-white text-opacity-90">{action.description}</p>
                <Link
                  to={action.link}
                  className="absolute inset-0 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Info className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">管理者向けガイド</h3>
              <p className="text-white text-opacity-90 mb-4">
                システムの管理機能や設定について詳しく解説したガイドをご用意しています。
              </p>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                ガイドを表示
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}