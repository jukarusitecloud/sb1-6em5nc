import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'staff';
  permissions: string[];
  isActive: boolean;
  department?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  loginAsStaff: (email: string, password: string) => Promise<void>;
  registerAdmin: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  staffList: User[];
  createStaffAccount: (data: any) => Promise<void>;
  toggleStaffActive: (staffId: string) => Promise<void>;
  updateStaff: (staffId: string, data: Partial<User>) => Promise<void>;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// デモ用の管理者アカウント
const MOCK_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  fullName: '管理者',
  role: 'admin',
  permissions: ['*'],
  isActive: true
};

// デモ用のスタッフアカウント
const MOCK_STAFF_ACCOUNTS: User[] = [
  {
    id: 'staff-1',
    email: 'staff1@example.com',
    fullName: '山田 太郎',
    role: 'staff',
    permissions: [
      'patient:read',
      'patient:write',
      'chart:read',
      'chart:write',
      'chart:edit'
    ],
    isActive: true,
    department: 'リハビリテーション科',
    position: '主任'
  },
  {
    id: 'staff-2',
    email: 'staff2@example.com',
    fullName: '鈴木 花子',
    role: 'staff',
    permissions: [
      'patient:read',
      'chart:read',
      'chart:write'
    ],
    isActive: false,
    department: 'リハビリテーション科',
    position: 'スタッフ'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [staffList, setStaffList] = useState<User[]>(MOCK_STAFF_ACCOUNTS);
  const navigate = useNavigate();

  const loginAsAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === MOCK_ADMIN.email && password === 'admin123') {
        setUser(MOCK_ADMIN);
        navigate('/admin');
      } else {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      throw new Error('ログインに失敗しました。認証情報を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsStaff = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const staffAccount = staffList.find(staff => 
        staff.email === email && staff.isActive
      );
      
      if (staffAccount) {
        setUser(staffAccount);
        navigate('/');
      } else {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (error) {
      console.error('Staff login failed:', error);
      throw new Error('ログインに失敗しました。認証情報を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAdmin: User = {
        id: 'admin-' + Date.now(),
        email,
        fullName,
        role: 'admin',
        permissions: ['*'],
        isActive: true
      };
      
      setUser(newAdmin);
      navigate('/admin');
    } catch (error) {
      console.error('Admin registration failed:', error);
      throw new Error('管理者登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const createStaffAccount = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStaff: User = {
        id: 'staff-' + Date.now(),
        email: data.email,
        fullName: data.fullName,
        role: 'staff',
        permissions: data.permissions,
        isActive: true,
        department: data.department,
        position: data.position
      };
      
      setStaffList(prev => [...prev, newStaff]);
      navigate('/admin/staff');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStaffActive = async (staffId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setStaffList(prev => prev.map(staff => 
        staff.id === staffId
          ? { ...staff, isActive: !staff.isActive }
          : staff
      ));
    } catch (error) {
      console.error('Failed to toggle staff status:', error);
      throw new Error('スタッフの状態を更新できませんでした');
    }
  };

  const updateStaff = async (staffId: string, data: Partial<User>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setStaffList(prev => prev.map(staff =>
        staff.id === staffId
          ? { ...staff, ...data }
          : staff
      ));
    } catch (error) {
      console.error('Failed to update staff:', error);
      throw new Error('スタッフ情報の更新に失敗しました');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      loginAsAdmin,
      loginAsStaff,
      registerAdmin,
      logout,
      staffList,
      createStaffAccount,
      toggleStaffActive,
      updateStaff,
      isAdmin,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}