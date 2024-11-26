import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Bell, Settings, Shield, Info, UserPlus, ClipboardEdit, Search, Database, AlertTriangle } from 'lucide-react';
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

  const mainActions = [
    {
      title: 'スタッフ管理',
      description: 'スタッフの登録・権限設定',
      icon: <UserPlus className="h-8 w-8" />,
      link: '/admin/staff',
      color: 'bg-purple-500'
    },
    {
      title: 'セキュリティ設定',
      description: 'システムのセキュリティ管理',
      icon: <Shield className="h-8 w-8" />,
      link: '/admin/security',
      color: 'bg-indigo-500'
    }
  ];

  const quickLinks = [
    {
      title: '患者一覧',
      description: '患者情報の確認',
      icon: <Search className="h-6 w-6" />,
      link: '/active-patients',
      color: 'bg-blue-500'
    },
    {
      title: 'カルテ記入',
      description: '診療記録の作成',
      icon: <ClipboardEdit className="h-6 w-6" />,
      link: '/new-registration',
      color: 'bg-green-500'
    },
    {
      title: 'データベース',
      description: 'バックアップと復元',
      icon: <Database className="h-6 w-6" />,
      link: '/admin/database',
      color: 'bg-purple-500'
    },
    {
      title: 'システム設定',
      description: '基本設定の管理',
      icon: <Settings className="h-6 w-6" />,
      link: '/admin/settings',
      color: 'bg-indigo-500'
    }
  ];

  const alerts = [
    {
      title: 'セキュリティ警告',
      message: '2要素認証が無効なスタッフが3名います',
      type: 'warning'
    },
    {
      title: 'システム通知',
      message: 'データベースのバックアップが完了しました',
      type: 'info'
    }
  ];

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
          <p className="mt-2 text-gray-600">
            システムの概要と主要な管理機能にアクセスできます
          </p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden text-white rounded-xl shadow-lg hover:scale-105 transform transition-transform duration-300 ${stat.color}`}
            >
              <Link to={stat.link} className="block p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    {stat.icon}
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <h3 className="font-medium">{stat.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* メインアクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mainActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`group relative text-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition-transform duration-300 ${action.color}`}
            >
              <Link to={action.link} className="block p-6">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mb-4">
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-white text-opacity-90">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* クイックリンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-all hover:shadow-md hover:scale-105 transform transition-transform duration-300"
            >
              <Link to={link.link} className="block">
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${link.color} bg-opacity-20 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                    <div className={`${link.color} text-white rounded-lg p-2`}>
                      {link.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* アラートとお知らせ */}
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-4 rounded-lg flex items-start gap-3 ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-blue-50 border border-blue-200'
              } hover:shadow-md hover:scale-105 transform transition-transform duration-300`}
            >
              <div className={`p-2 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {alert.type === 'warning' ? (
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                ) : (
                  <Info className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className={`font-medium ${
                  alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                }`}>
                  {alert.title}
                </h4>
                <p className={`text-sm ${
                  alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {alert.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
