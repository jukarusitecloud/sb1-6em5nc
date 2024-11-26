import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthenticatedGuardProps {
  children: React.ReactNode;
}

export default function AuthenticatedGuard({ children }: AuthenticatedGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mono-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mono-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}