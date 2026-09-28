import React from 'react';
import { useBank } from '../../context/BankContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Copy, 
  Check, 
  PlusCircle
} from 'lucide-react';

export const CustomerOverview = ({ onNavigateTab, onOpenLoanModal }) => {
  const { currentUser, accounts = [], cards = [], transactions = [], setSelectedReceiptTx, addToast } = useBank();
  const [copiedId, setCopiedId] = React.useState(null);

  const userAccounts = accounts || [];
  const userCards = cards || [];
  const totalNetWorth = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const primaryAccNumber = userAccounts[0]?.accountNumber || '___';
  const userTransactions = (transactions || []).filter(t => 
    t.senderId === currentUser?.id || 
    t.recipientAccount?.includes(primaryAccNumber)
  ).slice(0, 5);

  const handleCopyAccount = (accNum) => {
    navigator.clipboard.writeText(accNum);
    setCopiedId(accNum);
    addToast(`Account #${accNum} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const dailySpent = currentUser?.dailySpent || 0;
  const dailyLimit = currentUser?.dailyLimit || 25000;
  const dailyProgress = Math.min(100, Math.round((dailySpent / dailyLimit) * 100));

  return (
    <div>
      {/* Top Banner Stats */}
      <div className="grid-cards">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(19, 27, 46, 0.9))', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className="card-header">
            <span className="card-title text-emerald">
              <Wallet size={20} /> Total Net Worth
            </span>
            <span className="badge badge-success">{currentUser?.tier || 'Standard'}</span>
          </div>
          <div className="stat-value">
            ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-trend up" style={{ marginTop: '0.5rem' }}>
            <TrendingUp size={14} /> Across {userAccounts.length} Liquid Accounts
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Send size={18} className="text-muted" /> Daily Transfer Limit
            </span>
            <span className="card-subtitle">{dailyProgress}% Used</span>
          </div>
          <div className="stat-value">
            ${(dailyLimit - dailySpent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${dailyProgress}%`, background: dailyProgress > 80 ? 'var(--accent-rose)' : 'var(--accent-emerald)', transition: 'width 0.4s ease' }} />
            </div>
            <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>Spent Today: ${dailySpent.toLocaleString()}</span>
              <span>Max Cap: ${dailyLimit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <CreditCard size={18} className="text-muted" /> Cards & Protection
            </span>
            <span className="badge badge-info">{userCards.length} Active Cards</span>
          </div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>
            {userCards.filter(c => !c.isFrozen).length} Unlocked / {userCards.length}
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }} onClick={() => onNavigateTab('cards')}>
              Manage Cards
            </button>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }} onClick={onOpenLoanModal}>
              <PlusCircle size={13} /> Apply for Credit
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Accounts List + Quick Transfer Bar */}
      <div className="grid-2col">
        {/* Left Column: Liquid Accounts */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Bank Accounts</h3>
            <button className="btn btn-primary" onClick={() => onNavigateTab('transfers')}>
              <Send size={16} /> Transfer Money Out
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userAccounts.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading accounts from ledger...
              </div>
            ) : (
              userAccounts.map(acc => (
                <div key={acc.id} className="card" style={{ padding: '1.25rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '12px', 
                        background: acc.type === 'Savings' ? 'rgba(245, 158, 11, 0.15)' : (acc.type === 'Investment' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                        color: acc.type === 'Savings' ? 'var(--accent-gold)' : (acc.type === 'Investment' ? 'var(--accent-purple)' : 'var(--accent-emerald)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {acc.type === 'Savings' ? <PiggyBank size={20} /> : <Wallet size={20} />}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '1rem' }}>{acc.name}</strong>
                          {acc.status === 'Frozen' ? (
                            <span className="badge badge-danger">FROZEN</span>
                          ) : (
                            <span className="badge badge-success">{acc.type}</span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                          <span className="font-mono">Account #{acc.accountNumber}</span>
                          <button 
                            onClick={() => handleCopyAccount(acc.accountNumber)} 
                            style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', padding: 0 }}
                            title="Copy Account Number"
                          >
                            {copiedId === acc.accountNumber ? <Check size={14} /> : <Copy size={13} />}
                          </button>
                          <span>Routing: {acc.routingNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {acc.apy && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                          ★ {acc.apy}% APY Interest
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => onNavigateTab('transfers')}>
                      Send Funds
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => onNavigateTab('history')}>
                      View Statements
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Transactions & Quick Payees */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Transactions</h3>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => onNavigateTab('history')}
            >
              See All →
            </button>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            {userTransactions.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No recent activity.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {userTransactions.map(tx => {
                  const isDebit = tx.senderId === currentUser?.id;

                  return (
                    <div 
                      key={tx.id} 
                      onClick={() => setSelectedReceiptTx(tx)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0.65rem 0.75rem', 
                        borderRadius: '10px', 
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        borderBottom: '1px solid var(--border-color)'
                      }}
                      className="tx-item-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '10px', 
                          background: isDebit ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: isDebit ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isDebit ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{tx.description}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(tx.date).toLocaleDateString()} • Ref: {tx.referenceNumber}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: 700, 
                          fontFamily: 'var(--font-mono)', 
                          color: isDebit ? 'var(--text-main)' : 'var(--accent-emerald)' 
                        }}>
                          {isDebit ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <span className={`badge ${tx.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
