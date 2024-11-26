import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthSelection from './AuthSelection';
import Login from './Login';
import AdminLogin from './AdminLogin';
import StaffLogin from './StaffLogin';
import Register from './Register';
import PasswordReset from './PasswordReset';
import TwoFactorSetup from './TwoFactorSetup';
import SecurityGuide from './SecurityGuide';

type AuthStep = 'selection' | 'login' | 'admin-login' | 'staff-login' | 'register' | 'reset' | '2fa-setup';

export default function Auth() {
  const [step, setStep] = useState<AuthStep>('selection');
  const [showSecurityGuide, setShowSecurityGuide] = useState(false);

  const handleRegisterSuccess = () => {
    setShowSecurityGuide(true);
    setStep('login');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'selection' && (
        <motion.div
          key="selection"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <AuthSelection
            onSelectLogin={() => setStep('login')}
            onSelectAdminLogin={() => setStep('admin-login')}
            onSelectStaffLogin={() => setStep('staff-login')}
            onSelectRegister={() => setStep('register')}
          />
        </motion.div>
      )}

      {step === 'admin-login' && (
        <motion.div
          key="admin-login"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <AdminLogin
              onResetPassword={() => setStep('reset')}
              onBack={() => setStep('selection')}
            />
          </div>
        </motion.div>
      )}

      {step === 'staff-login' && (
        <motion.div
          key="staff-login"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <StaffLogin
              onResetPassword={() => setStep('reset')}
              onBack={() => setStep('selection')}
            />
          </div>
        </motion.div>
      )}

      {step === 'register' && (
        <motion.div
          key="register"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Register
              onSuccess={handleRegisterSuccess}
              onBack={() => setStep('selection')}
            />
          </div>
        </motion.div>
      )}

      {step === 'reset' && (
        <motion.div
          key="reset"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <PasswordReset onBack={() => setStep('selection')} />
          </div>
        </motion.div>
      )}

      {step === '2fa-setup' && (
        <motion.div
          key="2fa-setup"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <TwoFactorSetup
              onComplete={() => setStep('selection')}
              onCancel={() => setStep('selection')}
            />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showSecurityGuide && (
          <SecurityGuide
            onClose={() => setShowSecurityGuide(false)}
            onEnable2FA={() => {
              setShowSecurityGuide(false);
              setStep('2fa-setup');
            }}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}