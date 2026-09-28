import React from 'react';
import { useBank } from '../../context/BankContext';
import { 
  Building2, 
  ShieldAlert, 
  Clock, 
  Percent, 
  Plus, 
  TrendingUp 
} from 'lucide-react';

export const AdminDashboard = ({ onNavigateTab, onOpenNewUser }) => {
  const { adminOverview, applyMonthlyInterestBatch } = useBank();

  const totalDeposits = adminOverview?.totalReserves || 0;
  const pendingCount = adminOverview?.pendingApprovalsCount || 0;
  const frozenCount = adminOverview?.frozenCount || 0;
  const savingsApy = adminOverview?.systemConfig?.savingsApy || 4.5;
  const pendingList = adminOverview?.pendingApprovals || [];
  const auditLogs = adminOverview?.auditLogs || [];

  return (
    <div>
      {/* Top Banner KPI Cards */}
      <div className="grid-cards">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(19, 27, 46, 0.9))', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          <div className="card-header">
            <span className="card-title" style={{ color: 'var(--accent-rose)' }}>
              <Building2 size={20} /> Total Managed Reserves
            </span>
            <span className="badge badge-success">Apex Ledger</span>
          </div>
          <div className="stat-value">
            ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-trend up" style={{ marginTop: '0.5rem' }}>
            <TrendingUp size={14} /> {adminOverview?.totalUsers || 0} Registered Customer Accounts
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Clock size={18} className="text-gold" /> Pending Approvals Queue
            </span>
            <span className="badge badge-warning">{pendingCount} Action Required</span>
          </div>
          <div className="stat-value">{pendingCount}</div>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => onNavigateTab('approvals')}>
              Review Compliance Queue →
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <ShieldAlert size={18} className="text-rose" /> Flagged & Frozen Accounts
            </span>
            <span className="badge badge-danger">{frozenCount} Frozen</span>
          </div>
          <div className="stat-value">{frozenCount}</div>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => onNavigateTab('accounts')}>
              Manage Accounts →
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Percent size={18} className="text-emerald" /> Savings APY Config
            </span>
            <span className="badge badge-info">{savingsApy}% APY</span>
          </div>
          <div className="stat-value">{savingsApy}%</div>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={applyMonthlyInterestBatch}>
              Run Monthly Interest Batch
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Admin */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <div className="flex-between">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Admin Executive Operations</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick management shortcuts for bank administration</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={onOpenNewUser}>
              <Plus size={16} /> Open Customer Account
            </button>
            <button className="btn btn-secondary" onClick={applyMonthlyInterestBatch}>
              <Percent size={16} /> Disburse Monthly Interest
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Pending Approvals Preview + Recent System Logs */}
      <div className="grid-2col">
        {/* Pending Approvals */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Flagged Wire & Loan Requests</h3>
            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => onNavigateTab('approvals')}>
              View All Queue
            </button>
          </div>

          {pendingList.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No pending approval items in queue.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingList.slice(0, 3).map(item => (
                <div key={item.id} style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{item.type}</strong>
                    <span className="badge badge-warning">{item.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Requested by <strong>{item.requestedBy}</strong> — Amount: <span className="font-mono text-emerald">${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log Preview */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent System Audit Logs</h3>
            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => onNavigateTab('logs')}>
              View Full Audit Trail
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <div className="flex-between" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  <span>{log.actor} • {new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="font-mono">{log.action}</span>
                </div>
                <div style={{ fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
