import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ActivePatients from './components/ActivePatients';
import NewPatientRegistration from './components/NewPatientRegistration';
import PatientChart from './components/PatientChart';
import ChartExport from './components/ChartExport';
import ChartManagement from './components/ChartManagement';
import PatientChartList from './components/ChartManagement/PatientChartList';
import ModificationHistory from './components/ChartManagement/ModificationHistory';
import NavigationBreadcrumb from './components/NavigationBreadcrumb';
import Auth from './components/Auth';
import EmailVerification from './components/Auth/EmailVerification';
import TherapySettings from './components/Settings/TherapySettings';
import TreatmentTemplates from './components/Settings/TreatmentTemplates';
import ReminderSettings from './components/Settings/ReminderSettings';
import AdminDashboard from './components/Admin/Dashboard';
import AdminSidebar from './components/Admin/Sidebar';
import UserManagement from './components/Auth/UserManagement';
import SecuritySettings from './components/Auth/SecuritySettings';
import PermissionsSettings from './components/Auth/PermissionsSettings';
import StaffManagement from './components/Admin/StaffManagement';
import StaffRegistration from './components/Admin/StaffRegistration';
import StaffEdit from './components/Admin/StaffEdit';
import Contact from './components/Contact';
import CoreAdmin from './components/CoreAdmin';
import CoreAdminLogin from './components/CoreAdmin/Login';
import CoreAdminGuard from './components/CoreAdmin/Guard';
import { useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AuthenticatedGuard from './components/Auth/AuthenticatedGuard';
import AdminGuard from './components/Auth/AdminGuard';
import PlanGuard from './components/Auth/PlanGuard';
import Subscription from './components/Subscription';
import SubscriptionSelection from './components/Subscription/SubscriptionSelection';

export default function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCoreAdminRoute = location.pathname.startsWith('/coreadmin');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mono-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mono-900"></div>
      </div>
    );
  }

  // メール認証ルート
  if (location.pathname === '/verify-email') {
    return <EmailVerification />;
  }

  if (isCoreAdminRoute) {
    if (location.pathname === '/coreadmin/login') {
      return <CoreAdminLogin />;
    }
    return (
      <CoreAdminGuard>
        <Routes location={location}>
          <Route path="/coreadmin/*" element={<CoreAdmin />} />
        </Routes>
      </CoreAdminGuard>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-mono-50">
      {isAdminRoute ? <AdminSidebar /> : <Sidebar />}
      <main className="ml-64 flex-1 flex flex-col">
        <NavigationBreadcrumb />
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* 基本ルート - フリープラン以上 */}
              <Route path="/" element={<AuthenticatedGuard><Dashboard /></AuthenticatedGuard>} />
              <Route path="/active-patients" element={<AuthenticatedGuard><ActivePatients /></AuthenticatedGuard>} />
              <Route path="/new-registration" element={<AuthenticatedGuard><NewPatientRegistration /></AuthenticatedGuard>} />
              <Route path="/chart-management" element={<AuthenticatedGuard><ChartManagement /></AuthenticatedGuard>} />
              <Route path="/settings/therapy" element={<AuthenticatedGuard><TherapySettings /></AuthenticatedGuard>} />
              <Route path="/contact" element={<AuthenticatedGuard><Contact /></AuthenticatedGuard>} />
              <Route path="/verify-email" element={<EmailVerification />} />
              
              {/* スタートプラン以上が必要なルート */}
              <Route path="/chart-management/history" element={
                <AuthenticatedGuard>
                  <PlanGuard requiredPlan="starter">
                    <ModificationHistory />
                  </PlanGuard>
                </AuthenticatedGuard>
              } />
              <Route path="/chart-export" element={
                <AuthenticatedGuard>
                  <PlanGuard requiredPlan="starter">
                    <ChartExport />
                  </PlanGuard>
                </AuthenticatedGuard>
              } />
              <Route path="/settings/templates" element={
                <AuthenticatedGuard>
                  <PlanGuard requiredPlan="starter">
                    <TreatmentTemplates />
                  </PlanGuard>
                </AuthenticatedGuard>
              } />
              <Route path="/settings/reminders" element={
                <AuthenticatedGuard>
                  <PlanGuard requiredPlan="starter">
                    <ReminderSettings />
                  </PlanGuard>
                </AuthenticatedGuard>
              } />

              {/* 管理者ルート - スタートプラン以上 */}
              <Route path="/admin" element={
                <AdminGuard>
                  <PlanGuard requiredPlan="starter">
                    <AdminDashboard />
                  </PlanGuard>
                </AdminGuard>
              } />
              <Route path="/admin/staff/new" element={
                <AdminGuard>
                  <PlanGuard requiredPlan="starter" staffLimit={2}>
                    <StaffRegistration />
                  </PlanGuard>
                </AdminGuard>
              } />
              <Route path="/admin/staff" element={
                <AdminGuard>
                  <PlanGuard requiredPlan="starter">
                    <StaffManagement />
                  </PlanGuard>
                </AdminGuard>
              } />
              <Route path="/admin/staff/edit/:staffId" element={
                <AdminGuard>
                  <PlanGuard requiredPlan="starter">
                    <StaffEdit />
                  </PlanGuard>
                </AdminGuard>
              } />
              <Route path="/admin/security" element={
                <AdminGuard>
                  <PlanGuard requiredPlan="starter">
                    <SecuritySettings />
                  </PlanGuard>
                </AdminGuard>
              } />
              <Route path="/admin/audit-logs" element={
                <AdminGuard>
                  <PlanGuard requiredPlan="starter">
                    <SecuritySettings />
                  </PlanGuard>
                </AdminGuard>
              } />

              {/* サブスクリプション関連 */}
              <Route path="/subscription" element={<AuthenticatedGuard><Subscription /></AuthenticatedGuard>} />
              <Route path="/subscription/select" element={<AuthenticatedGuard><SubscriptionSelection /></AuthenticatedGuard>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}