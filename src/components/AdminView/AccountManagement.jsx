import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Snowflake, Edit3, CheckCircle2 } from 'lucide-react';

export const AccountManagement = () => {
  const { adminAccountsList, toggleUserFreeze, adjustAccountBalance } = useBank();
  const [searchQuery, setSearchQuery] = useState('');

  // Balance Edit Modal state
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newBalVal, setNewBalVal] = useState('');
  const [adjReason, setAdjReason] = useState('Compliance Ledger Adjustment');

  const filteredCustomers = (adminAccountsList || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.accounts.some(a => a.accountNumber.includes(searchQuery))
  );

  const handleOpenAdjModal = (acc, ownerName) => {
    setSelectedAccount({ ...acc, ownerName });
    setNewBalVal(acc.balance.toString());
  };

  const handleSaveBalance = (e) => {
    e.preventDefault();
    if (!selectedAccount) return;
    adjustAccountBalance(selectedAccount.id, newBalVal, adjReason);
    setSelectedAccount(null);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Customer Account Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Admin portal to freeze accounts, perform credit/debit adjustments, and manage risk limits.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search by customer name, email, or account #..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredCustomers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No customer accounts found.</p>
        ) : (
          filteredCustomers.map(cust => {
            const totalCustBalance = cust.accounts.reduce((sum, a) => sum + a.balance, 0);

            return (
              <div key={cust.id} className="card" style={{ padding: '1.25rem' }}>
                <div className="flex-between" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={cust.avatar} alt={cust.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1.1rem' }}>{cust.name}</strong>
                        <span className="badge badge-info">{cust.tier}</span>
                        {cust.status === 'Frozen' && (
                          <span className="badge badge-danger">FROZEN PROFILE</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {cust.email} • {cust.phone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        ${totalCustBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Daily Limit: ${cust.dailyLimit.toLocaleString()}
                      </div>
                    </div>

                    <button 
                      className={`btn ${cust.status === 'Frozen' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => toggleUserFreeze(cust.id)}
                    >
                      <Snowflake size={14} /> {cust.status === 'Frozen' ? 'Unfreeze Profile' : 'Freeze Profile'}
                    </button>
                  </div>
                </div>

                {/* Customer Accounts Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {cust.accounts.map(acc => (
                    <div 
                      key={acc.id}
                      style={{ 
                        background: 'var(--bg-input)', 
                        padding: '0.85rem 1rem', 
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{acc.name}</strong>
                        {acc.status === 'Frozen' ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>FROZEN</span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{acc.type}</span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Acc #{acc.accountNumber} • Routing: {acc.routingNumber}
                      </div>

                      <div className="flex-between">
                        <div className="font-mono text-emerald" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                          ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            onClick={() => handleOpenAdjModal(acc, cust.name)}
                            title="Manually adjust balance"
                          >
                            <Edit3 size={12} /> Balance
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Balance Adjustment Modal */}
      {selectedAccount && (
        <div className="modal-overlay" onClick={() => setSelectedAccount(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Admin Balance Adjustment
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Adjusting ledger balance for {selectedAccount.ownerName} ({selectedAccount.name} #{selectedAccount.accountNumber})
            </p>

            <form onSubmit={handleSaveBalance}>
              <div className="form-group">
                <label className="form-label">New Ledger Balance ($)</label>
                <div className="amount-input-group">
                  <span className="amount-prefix">$</span>
                  <input 
                    type="number" 
                    className="form-input amount-input" 
                    value={newBalVal}
                    onChange={e => setNewBalVal(e.target.value)}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mandatory Audit Justification / Reason</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={adjReason}
                  onChange={e => setAdjReason(e.target.value)}
                  placeholder="e.g. Returned Wire Refund or Dispute Correction"
                  required
                />
              </div>

              <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedAccount(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Ledger Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
