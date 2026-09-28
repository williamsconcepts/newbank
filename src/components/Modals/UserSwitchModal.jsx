import React from 'react';
import { useBank } from '../../context/BankContext';
import { Users, X, Plus } from 'lucide-react';

export const UserSwitchModal = ({ isOpen, onClose, onOpenNewUser }) => {
  const { customers, currentUserId, switchUser } = useBank();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--status-info-bg)', color: 'var(--accent-blue)', padding: '8px', borderRadius: '10px' }}>
              <Users size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Select Persona</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Choose demo customer account to interact as</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {customers.map(cust => {
            const isSelected = cust.id === currentUserId;
            const totalBal = cust.accounts.reduce((sum, a) => sum + a.balance, 0);

            return (
              <div 
                key={cust.id}
                onClick={() => {
                  switchUser(cust.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-input)',
                  border: `1px solid ${isSelected ? 'var(--accent-emerald)' : 'var(--border-color)'}`,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img src={cust.avatar} alt={cust.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{cust.name}</strong>
                      {cust.status === 'Frozen' && (
                        <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Frozen</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {cust.tier} • {cust.accounts.length} Accounts
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    ${totalBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
                    Daily Limit: ${cust.dailyLimit.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={() => {
            onClose();
            onOpenNewUser();
          }}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus size={16} /> Open New Demo Customer Account
        </button>
      </div>
    </div>
  );
};
