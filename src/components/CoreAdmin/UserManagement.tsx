import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Mail, Building, Briefcase, Edit2, Trash2, AlertCircle } from 'lucide-react';
import PageTransition from '../PageTransition';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: '山田 太郎',
    email: 'yamada@example.com',
    role: '管理者',
    department: '医療部',
    position: '部長',
    lastLogin: '2024-03-15 15:30',
    status: 'active'
  },
  {
    id: '2',
    name: '鈴木 花子',
    email: 'suzuki@example.com',
    role: 'スタッフ',
    department: 'リハビリ科',
    position: '主任',
    lastLogin: '2024-03-15 14:45',
    status: 'active'
  }
];

export default function UserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower) ||
      user.position?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mono-900">ユーザー管理</h1>
            <p className="mt-2 text-mono-500">
              システムユーザーの管理と権限設定を行います
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <UserPlus className="h-5 w-5" />
            新規ユーザー作成
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="ユーザーを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 pl-4 pr-4 py-2 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-mono-900">
                      {user.name}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-mono-500 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-mono-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-mono-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>

                {user.department && (
                  <div className="flex items-center gap-2 text-mono-600">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{user.department}</span>
                  </div>
                )}

                {user.position && (
                  <div className="flex items-center gap-2 text-mono-600">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">{user.position}</span>
                  </div>
                )}

                {user.lastLogin && (
                  <div className="mt-4 pt-4 border-t border-mono-100">
                    <p className="text-sm text-mono-500">
                      最終ログイン: {user.lastLogin}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
              <p className="text-mono-500">
                該当するユーザーが見つかりません
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}