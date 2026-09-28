import React, { createContext, useContext, useState, useEffect } from 'react';

const BankContext = createContext();

const API_BASE = 'http://localhost:5001/api';

export const BankProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('apex_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('apex_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [accounts, setAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Admin state
  const [adminOverview, setAdminOverview] = useState(null);
  const [adminAccountsList, setAdminAccountsList] = useState([]);
  
  const [toasts, setToasts] = useState([]);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('apex_token', token);
    } else {
      localStorage.removeItem('apex_token');
      localStorage.removeItem('apex_user');
    }
  }, [token]);

  // Toast Notification helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch Current Customer Data
  const fetchCustomerData = async () => {
    if (!token || (currentUser && currentUser.role === 'admin')) return;
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setAccounts(data.accounts || []);
        setCards(data.cards || []);
      }
    } catch (e) {
      console.error('Failed to fetch user data', e);
    }
  };

  // Fetch Transactions
  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    }
  };

  // Fetch Admin Overview
  const fetchAdminData = async () => {
    if (!token || !currentUser || currentUser.role !== 'admin') return;
    try {
      const resOverview = await fetch(`${API_BASE}/admin/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataOverview = await resOverview.json();
      if (resOverview.ok) {
        setAdminOverview(dataOverview);
      }

      const resAccs = await fetch(`${API_BASE}/admin/accounts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataAccs = await resAccs.json();
      if (resAccs.ok) {
        setAdminAccountsList(dataAccs || []);
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    }
  };

  useEffect(() => {
    if (token && currentUser) {
      if (currentUser.role === 'customer') {
        fetchCustomerData();
        fetchTransactions();
      } else if (currentUser.role === 'admin') {
        fetchAdminData();
        fetchTransactions();
      }
    }
  }, [token, currentUser?.role]);

  // LOGIN ACTION
  const login = async (email, password, requiredRole = null) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole })
      });
      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        addToast(data.error || 'Login failed', 'danger');
        return { success: false, error: data.error };
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('apex_user', JSON.stringify(data.user));
      addToast(`Welcome back, ${data.user.name}!`, 'success');

      return { success: true, user: data.user };
    } catch (e) {
      setIsLoading(false);
      addToast('Server connection error. Please try again.', 'danger');
      return { success: false, error: 'Connection error' };
    }
  };

  // REGISTER ACTION
  const register = async ({ name, email, password, phone, address, initialDeposit }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address, initialDeposit })
      });
      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        addToast(data.error || 'Registration failed', 'danger');
        return { success: false, error: data.error };
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('apex_user', JSON.stringify(data.user));
      addToast(`Account created successfully! Welcome ${data.user.name}`, 'success');

      return { success: true, user: data.user };
    } catch (e) {
      setIsLoading(false);
      addToast('Server connection error.', 'danger');
      return { success: false, error: 'Connection error' };
    }
  };

  // LOGOUT ACTION
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setAccounts([]);
    setCards([]);
    setTransactions([]);
    setAdminOverview(null);
    setAdminAccountsList([]);
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
    addToast('Logged out of session', 'info');
  };

  // ADMIN ACTION: CREATE NEW CUSTOMER ACCOUNT
  const createNewUserAccount = async ({ name, email, phone, address, accountType, initialBalance }) => {
    try {
      const res = await fetch(`${API_BASE}/admin/create-account`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name, email, phone, address, accountType, initialBalance })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
        fetchAdminData();
      } else {
        addToast(data.error || 'Failed to create account', 'danger');
      }
    } catch (e) {
      addToast('Error creating account', 'danger');
    }
  };

  // EXECUTE TRANSFER ACTION
  const executeTransfer = async ({ senderAccountId, recipientAccount, recipientName, amount, transferType, referenceNote }) => {
    try {
      const res = await fetch(`${API_BASE}/transfers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ senderAccountId, recipientAccount, recipientName, amount, transferType, referenceNote })
      });
      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || 'Transfer failed', 'danger');
        return { success: false, reason: data.error };
      }

      addToast(data.message, data.underReview ? 'warning' : 'success');
      fetchCustomerData();
      fetchTransactions();

      const newTx = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        recipientName,
        recipientAccount,
        referenceNumber: data.referenceNumber,
        status: data.underReview ? 'Under Review' : 'Completed',
        category: transferType === 'wire' ? 'Wire Transfer' : 'Transfer',
        fee: transferType === 'wire' ? 15.0 : 0
      };

      if (!data.underReview) {
        setSelectedReceiptTx(newTx);
      }

      return { success: true, underReview: data.underReview, transaction: newTx };
    } catch (e) {
      addToast('Transfer execution failed.', 'danger');
      return { success: false, reason: 'Error' };
    }
  };

  // CARD FREEZE TOGGLE
  const toggleCardFreeze = async (cardId) => {
    try {
      const res = await fetch(`${API_BASE}/cards/freeze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ cardId })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'info');
        fetchCustomerData();
      }
    } catch (e) {
      addToast('Failed to update card status.', 'danger');
    }
  };

  // APPLY FOR LOAN
  const applyForLoan = async ({ amount, purpose, durationMonths }) => {
    try {
      const res = await fetch(`${API_BASE}/loans/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount, purpose, durationMonths })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
      }
    } catch (e) {
      addToast('Loan application failed.', 'danger');
    }
  };

  // ADMIN ACTIONS
  const toggleUserFreeze = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/freeze-user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'warning');
        fetchAdminData();
      }
    } catch (e) {
      addToast('Admin action failed', 'danger');
    }
  };

  const adjustAccountBalance = async (accountId, newBalance, reason) => {
    try {
      const res = await fetch(`${API_BASE}/admin/adjust-balance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ accountId, newBalance, reason })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
        fetchAdminData();
      }
    } catch (e) {
      addToast('Balance adjustment failed', 'danger');
    }
  };

  const approvePendingRequest = async (approvalId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/approvals/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ approvalId })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
        fetchAdminData();
      }
    } catch (e) {
      addToast('Approval failed', 'danger');
    }
  };

  const rejectPendingRequest = async (approvalId, reason) => {
    try {
      const res = await fetch(`${API_BASE}/admin/approvals/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ approvalId, reason })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'warning');
        fetchAdminData();
      }
    } catch (e) {
      addToast('Rejection failed', 'danger');
    }
  };

  const applyMonthlyInterestBatch = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/interest/batch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
        fetchAdminData();
      }
    } catch (e) {
      addToast('Interest batch failed', 'danger');
    }
  };

  // Derived Admin Data properties
  const pendingApprovals = adminOverview?.pendingApprovals || [];
  const auditLogs = adminOverview?.auditLogs || [];
  const systemConfig = adminOverview?.systemConfig || { savingsApy: 4.5, wireFee: 15.0, highValueThreshold: 10000.0 };

  return (
    <BankContext.Provider value={{
      token,
      currentUser,
      currentCustomer: currentUser,
      accounts,
      cards,
      transactions,
      adminOverview,
      adminAccountsList,
      pendingApprovals,
      auditLogs,
      systemConfig,
      toasts,
      selectedReceiptTx,
      setSelectedReceiptTx,
      isLoading,
      login,
      register,
      logout,
      createNewUserAccount,
      executeTransfer,
      toggleCardFreeze,
      applyForLoan,
      toggleUserFreeze,
      adjustAccountBalance,
      approvePendingRequest,
      rejectPendingRequest,
      applyMonthlyInterestBatch,
      addToast,
      removeToast
    }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
