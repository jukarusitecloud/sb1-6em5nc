import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  Settings, 
  Activity,
  Bell,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'ダッシュボード',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/admin'
    },
    {
      title: 'ユーザー管理',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/users'
    },
    {
      title: 'セキュリティ',
      icon: <Shield className="h-5 w-5" />,
      path: '/admin/security'
    },
    {
      title: 'システム設定',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings'
    },
    {
      title: 'アクティビティログ',
      icon: <Activity className="h-5 w-5" />,
      path: '/admin/activity'
    },
    {
      title: '通知',
      icon: <Bell className="h-5 w-5" />,
      path: '/admin/notifications'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-mono-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-mono-900" />
          <span className="text-xl font-bold text-mono-900">管理パネル</span>
        </div>

        <nav className="space-y-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-mono-900 text-white'
                  : 'text-mono-600 hover:bg-mono-100'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 border-t border-mono-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
}