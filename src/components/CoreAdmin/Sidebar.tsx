import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Activity,
  Settings,
  Database,
  Shield,
  LogOut
} from 'lucide-react';
import { useCoreAdmin } from '../../contexts/CoreAdminContext';

export default function CoreAdminSidebar() {
  const location = useLocation();
  const { logout } = useCoreAdmin();

  const menuItems = [
    {
      title: 'コアシステム',
      items: [
        {
          title: 'ダッシュボード',
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: '/coreadmin'
        }
      ]
    },
    {
      title: 'モニタリング',
      items: [
        {
          title: '監査ログ',
          icon: <Activity className="h-5 w-5" />,
          path: '/coreadmin/logs'
        },
        {
          title: 'セキュリティ設定',
          icon: <Shield className="h-5 w-5" />,
          path: '/coreadmin/security'
        },
        {
          title: 'データベース管理',
          icon: <Database className="h-5 w-5" />,
          path: '/coreadmin/database'
        }
      ]
    }
  ];

  return (
    <div className="h-screen w-64 bg-mono-900 text-white p-4 fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-purple-400" />
        <span className="text-xl font-bold">Core Admin</span>
      </div>
      
      <div className="space-y-6">
        {menuItems.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-2 text-xs font-semibold text-mono-400 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors text-sm
                    ${location.pathname === item.path ? 'bg-mono-800 text-purple-400' : 'text-mono-300 hover:bg-mono-800 hover:text-purple-400'}`}
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
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-mono-300 hover:text-white transition-colors w-full px-2 py-2"
        >
          <LogOut className="h-5 w-5" />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
}