import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users, 
  Shield,
  Settings,
  Activity,
  Bell,
  LogOut,
  FileText,
  Database,
  UserPlus,
  ClipboardEdit,
  Search,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'メイン',
      items: [
        {
          title: 'ダッシュボード',
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: '/admin',
          color: 'text-purple-600'
        }
      ]
    },
    {
      title: 'スタッフ管理',
      items: [
        {
          title: '新規スタッフ登録',
          icon: <UserPlus className="h-5 w-5" />,
          path: '/admin/staff/new',
          color: 'text-purple-600'
        },
        {
          title: 'スタッフ一覧',
          icon: <Users className="h-5 w-5" />,
          path: '/admin/staff',
          color: 'text-purple-600'
        }
      ]
    },
    {
      title: 'セキュリティ',
      items: [
        {
          title: 'セキュリティ設定',
          icon: <Shield className="h-5 w-5" />,
          path: '/admin/security',
          color: 'text-purple-600'
        },
        {
          title: '監査ログ',
          icon: <Activity className="h-5 w-5" />,
          path: '/admin/audit-logs',
          color: 'text-purple-600'
        }
      ]
    },
    {
      title: 'カルテ機能',
      items: [
        {
          title: '患者一覧',
          icon: <Search className="h-5 w-5" />,
          path: '/active-patients',
          color: 'text-blue-600'
        },
        {
          title: 'カルテ記入',
          icon: <ClipboardEdit className="h-5 w-5" />,
          path: '/new-registration',
          color: 'text-blue-600'
        }
      ]
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-mono-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold text-mono-900">管理パネル</span>
        </div>

        <nav className="space-y-6">
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
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                      location.pathname === item.path
                        ? 'bg-mono-900 text-white'
                        : `text-mono-600 hover:bg-mono-100 ${item.color}`
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 left-0 w-full px-6">
        <div className="pt-4 border-t border-mono-200 space-y-1">
          <Link
            to="/contact"
            className="flex items-center gap-2 text-sm text-mono-600 hover:text-mono-900 transition-colors w-full px-4 py-2"
          >
            <HelpCircle className="h-5 w-5" />
            <span>お問い合わせ</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full px-4 py-2 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    </div>
  );
}