import React from 'react';
import { useBank } from '../context/BankContext';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  LogOut 
} from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, adminOverview } = useBank();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const pendingCount = adminOverview ? adminOverview.pendingApprovalsCount : 0;

  return (
    <header className="navbar">
      <div className="navbar-content">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo" style={{ background: isAdmin ? 'linear-gradient(135deg, #dc2626, #f43f5e)' : 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">Apex Bank</span>
              <span className="brand-badge" style={{ 
                background: isAdmin ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isAdmin ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                borderColor: isAdmin ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'
              }}>
                {isAdmin ? 'Admin Portal' : 'Customer Client'}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Online Banking Gateway</p>
          </div>
        </div>

        {/* User Profile Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="persona-selector" style={{ cursor: 'default' }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-sm" style={{ borderColor: isAdmin ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
            ) : (
              <div className="user-avatar-sm" style={{ background: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <User size={16} />
              </div>
            )}

            <div className="user-info-sm">
              <span className="user-name-sm">{currentUser.name}</span>
              <span className="user-tier-sm" style={{ color: isAdmin ? 'var(--accent-rose)' : 'var(--accent-gold)' }}>
                {isAdmin ? 'Compliance Risk Officer' : currentUser.tier}
              </span>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            onClick={logout}
            title="Log out of session"
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </div>
    </header>
  );
};
