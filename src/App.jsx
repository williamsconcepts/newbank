import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { Header } from './components/Header';
import { SecurityHeader } from './components/SecurityHeader';
import { ToastContainer } from './components/ToastContainer';
import { LoginPage } from './components/Auth/LoginPage';
import { AdminLoginPage } from './components/Auth/AdminLoginPage';

// Customer Components
import { CustomerOverview } from './components/CustomerView/CustomerOverview';
import { TransferHub } from './components/CustomerView/TransferHub';
import { CardsManager } from './components/CustomerView/CardsManager';
import { BillPayments } from './components/CustomerView/BillPayments';
import { TransactionHistory } from './components/CustomerView/TransactionHistory';

// Admin Components
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { AccountManagement } from './components/AdminView/AccountManagement';
import { PendingApprovals } from './components/AdminView/PendingApprovals';
import { AuditLogs } from './components/AdminView/AuditLogs';
import { SystemSettings } from './components/AdminView/SystemSettings';

// Modals
import { NewAccountModal } from './components/Modals/NewAccountModal';
import { LoanRequestModal } from './components/Modals/LoanRequestModal';
import { ReceiptModal } from './components/Modals/ReceiptModal';

import { 
  LayoutDashboard, 
  Send, 
  CreditCard, 
  Receipt, 
  FileText, 
  ShieldCheck, 
  Users, 
  CheckSquare, 
  Sliders, 
  Landmark 
} from 'lucide-react';

const BankMainContent = () => {
  const { currentUser, token, adminOverview } = useBank();

  // Navigation State
  const [customerTab, setCustomerTab] = useState('overview');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('customer'); // 'customer' | 'admin'

  // Modal Controls
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

  // Unauthenticated view
  if (!token || !currentUser) {
    return (
      <>
        {authMode === 'admin' ? (
          <AdminLoginPage onBackToCustomerLogin={() => setAuthMode('customer')} />
        ) : (
          <LoginPage onSwitchToAdminLogin={() => setAuthMode('admin')} />
        )}
        <ToastContainer />
      </>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const pendingApprovalsCount = adminOverview ? adminOverview.pendingApprovalsCount : 0;

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <Header />

      {/* Security Status Header */}
      <SecurityHeader />

      {/* Main Container */}
      <main className="main-layout">
        {!isAdmin ? (
          /* CUSTOMER PORTAL VIEW ONLY */
          <div>
            <div className="tab-nav">
              <button 
                className={`tab-btn ${customerTab === 'overview' ? 'active' : ''}`}
                onClick={() => setCustomerTab('overview')}
              >
                <LayoutDashboard size={18} /> Overview
              </button>

              <button 
                className={`tab-btn ${customerTab === 'transfers' ? 'active' : ''}`}
                onClick={() => setCustomerTab('transfers')}
              >
                <Send size={18} /> Money Transfer Out
              </button>

              <button 
                className={`tab-btn ${customerTab === 'cards' ? 'active' : ''}`}
                onClick={() => setCustomerTab('cards')}
              >
                <CreditCard size={18} /> Cards & Controls
              </button>

              <button 
                className={`tab-btn ${customerTab === 'bills' ? 'active' : ''}`}
                onClick={() => setCustomerTab('bills')}
              >
                <Receipt size={18} /> Bills & Utility Pay
              </button>

              <button 
                className={`tab-btn ${customerTab === 'history' ? 'active' : ''}`}
                onClick={() => setCustomerTab('history')}
              >
                <FileText size={18} /> Statements & History
              </button>
            </div>

            {customerTab === 'overview' && (
              <CustomerOverview 
                onNavigateTab={(tab) => setCustomerTab(tab)} 
                onOpenLoanModal={() => setIsLoanModalOpen(true)}
              />
            )}
            {customerTab === 'transfers' && <TransferHub />}
            {customerTab === 'cards' && <CardsManager />}
            {customerTab === 'bills' && <BillPayments />}
            {customerTab === 'history' && <TransactionHistory />}
          </div>
        ) : (
          /* EXECUTIVE ADMIN PORTAL VIEW ONLY */
          <div>
            <div className="tab-nav">
              <button 
                className={`tab-btn admin-tab ${adminTab === 'dashboard' ? 'active admin-tab' : ''}`}
                onClick={() => setAdminTab('dashboard')}
              >
                <ShieldCheck size={18} /> Executive Dashboard
              </button>

              <button 
                className={`tab-btn admin-tab ${adminTab === 'accounts' ? 'active admin-tab' : ''}`}
                onClick={() => setAdminTab('accounts')}
              >
                <Users size={18} /> Customer Accounts
              </button>

              <button 
                className={`tab-btn admin-tab ${adminTab === 'approvals' ? 'active admin-tab' : ''}`}
                onClick={() => setAdminTab('approvals')}
              >
                <CheckSquare size={18} /> Risk Approvals Queue
                {pendingApprovalsCount > 0 && (
                  <span className="tab-badge">{pendingApprovalsCount}</span>
                )}
              </button>

              <button 
                className={`tab-btn admin-tab ${adminTab === 'logs' ? 'active admin-tab' : ''}`}
                onClick={() => setAdminTab('logs')}
              >
                <Landmark size={18} /> Audit Logs
              </button>

              <button 
                className={`tab-btn admin-tab ${adminTab === 'settings' ? 'active admin-tab' : ''}`}
                onClick={() => setAdminTab('settings')}
              >
                <Sliders size={18} /> Rates & Rules
              </button>
            </div>

            {adminTab === 'dashboard' && (
              <AdminDashboard 
                onNavigateTab={(tab) => setAdminTab(tab)} 
                onOpenNewUser={() => setIsNewUserModalOpen(true)}
              />
            )}
            {adminTab === 'accounts' && <AccountManagement />}
            {adminTab === 'approvals' && <PendingApprovals />}
            {adminTab === 'logs' && <AuditLogs />}
            {adminTab === 'settings' && <SystemSettings />}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <NewAccountModal 
        isOpen={isNewUserModalOpen} 
        onClose={() => setIsNewUserModalOpen(false)} 
      />

      <LoanRequestModal 
        isOpen={isLoanModalOpen} 
        onClose={() => setIsLoanModalOpen(false)} 
      />

      <ReceiptModal />

      {/* Global Toasts Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BankProvider>
      <BankMainContent />
    </BankProvider>
  );
}
