import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, UserCheck } from 'lucide-react';

export const PendingApprovals = () => {
  const { pendingApprovals, approvePendingRequest, rejectPendingRequest } = useBank();
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalItemId, setRejectModalItemId] = useState(null);

  const pendingList = (pendingApprovals || []).filter(a => a.status === 'Pending');

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalItemId) return;
    rejectPendingRequest(rejectModalItemId, rejectReason || 'Compliance Policy Risk');
    setRejectModalItemId(null);
    setRejectReason('');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Risk & Compliance Approvals Queue</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Review high-value wire dispatches, credit line applications, and new account registrations.
          </p>
        </div>
      </div>

      {pendingList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <CheckCircle2 size={40} className="text-emerald" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Approvals Queue Clear</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            All high-value wire transfers and credit line applications have been cleared by compliance.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingList.map(item => (
            <div key={item.id} className="card" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
              <div className="flex-between" style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)', padding: '6px', borderRadius: '8px' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.05rem' }}>{item.type}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Submitted by <strong>{item.requestedBy}</strong> • {new Date(item.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-emerald" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Item Metadata */}
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {item.recipient && (
                  <div><span className="text-muted">Recipient / Beneficiary:</span> <strong>{item.recipient}</strong></div>
                )}
                {item.purpose && (
                  <div><span className="text-muted">Purpose / Reason:</span> <strong>{item.purpose}</strong></div>
                )}
                {item.proposedRate && (
                  <div><span className="text-muted">Proposed Credit Terms:</span> <strong>{item.proposedRate} ({item.termMonths} Months)</strong></div>
                )}
                <div><span className="text-muted">Risk Assessment:</span> <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{item.riskScore}</span></div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ color: 'var(--accent-rose)' }}
                  onClick={() => setRejectModalItemId(item.id)}
                >
                  <XCircle size={16} /> Decline Request
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={() => approvePendingRequest(item.id)}
                >
                  <CheckCircle2 size={16} /> Authorize & Release Funds
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalItemId && (
        <div className="modal-overlay" onClick={() => setRejectModalItemId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reject Request</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Please state the compliance rejection reason to notify the customer.
            </p>

            <form onSubmit={handleConfirmReject}>
              <div className="form-group">
                <label className="form-label">Rejection Reason</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. KYC document mismatch or risk threshold exceeded"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex-between">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectModalItemId(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
