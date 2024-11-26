import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CoreAdminDashboard from './Dashboard';
import AuditLogs from './AuditLogs';
import SecuritySettings from './SecuritySettings';
import DatabaseManagement from './DatabaseManagement';
import CoreAdminSidebar from './Sidebar';

export default function CoreAdmin() {
  return (
    <div className="flex min-h-screen bg-mono-50">
      <CoreAdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <Routes>
          <Route index element={<CoreAdminDashboard />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="database" element={<DatabaseManagement />} />
          <Route path="*" element={<Navigate to="/coreadmin" replace />} />
        </Routes>
      </main>
    </div>
  );
}