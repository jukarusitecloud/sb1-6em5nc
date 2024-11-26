import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  Bell,
  Activity,
  LogOut,
  FileText,
  Download,
  Edit3,
  History,
  Shield,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: 'メイン',
      items: [
        {
          title: 'ダッシュボード',
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: '/'
        },
        ...(isAdmin() ? [{
          title: '管理パネル',
          icon: <Shield className="h-5 w-5" />,
          path: '/admin',
          className: 'text-purple-600 hover:bg-purple-50'
        }] : [])
      ]
    },
    {
      title: '患者情報',
      items: [
        {
          title: '現在の患者',
          icon: <Users className="h-5 w-5" />,
          path: '/active-patients'
        },
        {
          title: '新規登録',
          icon: <UserPlus className="h-5 w-5" />,
          path: '/new-registration'
        }
      ]
    },
    {
      title: 'カルテ管理',
      items: [
        {
          title: 'カルテ修正',
          icon: <Edit3 className="h-5 w-5" />,
          path: '/chart-management'
        },
        {
          title: '修正履歴',
          icon: <History className="h-5 w-5" />,
          path: '/chart-management/history'
        },
        {
          title: 'カルテ出力',
          icon: <Download className="h-5 w-5" />,
          path: '/chart-export'
        }
      ]
    },
    {
      title: '設定',
      items: [
        {
          title: '物理療法設定',
          icon: <Settings className="h-5 w-5" />,
          path: '/settings/therapy'
        },
        {
          title: '定型文設定',
          icon: <FileText className="h-5 w-5" />,
          path: '/settings/templates'
        },
        {
          title: 'リマインド設定',
          icon: <Bell className="h-5 w-5" />,
          path: '/settings/reminders'
        },
        {
          title: 'サブスクリプション',
          icon: <CreditCard className="h-5 w-5" />,
          path: '/subscription'
        }
      ]
    }
  ];

  return (
    <div className="h-screen w-64 bg-mono-100 text-mono-900 p-4 fixed left-0 top-0 overflow-y-auto border-r border-mono-200">
      <div className="flex items-center gap-2 mb-8">
        <Activity className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold text-mono-900">メディレコード</span>
      </div>
      
      <div className="space-y-6">
        {menuItems.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-2 text-xs font-semibold text-mono-500 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors text-sm
                    ${item.className || ''}
                    ${currentPath === item.path ? 'bg-mono-200 text-mono-900' : 'text-mono-600 hover:bg-mono-200 hover:text-mono-900'}`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 w-full px-4">
        <div className="pt-4 border-t border-mono-200 space-y-1">
          <Link
            to="/contact"
            className="flex items-center gap-2 text-sm text-mono-600 hover:text-mono-900 transition-colors w-full px-2 py-2"
          >
            <HelpCircle className="h-5 w-5" />
            <span>お問い合わせ</span>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-mono-600 hover:text-mono-900 transition-colors w-full px-2 py-2"
          >
            <LogOut className="h-5 w-5" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    </div>
  );
}