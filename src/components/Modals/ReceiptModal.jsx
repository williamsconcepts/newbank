import React from 'react';
import { useBank } from '../../context/BankContext';
import { CheckCircle2, ShieldCheck, Printer, X, Clock } from 'lucide-react';

export const ReceiptModal = () => {
  const { selectedReceiptTx, setSelectedReceiptTx } = useBank();

  if (!selectedReceiptTx) return null;

  const tx = selectedReceiptTx;
  const isSuccess = tx.status === 'Completed';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedReceiptTx(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} className="text-emerald" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Transaction Receipt</h3>
          </div>
          <button 
            onClick={() => setSelectedReceiptTx(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Receipt Container */}
        <div style={{ 
          background: 'var(--bg-input)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          marginBottom: '1.5rem' 
        }}>
          {/* Top Status */}
          <div style={{ textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)', marginBottom: '1.25rem' }}>
            <div style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              background: isSuccess ? 'var(--status-success-bg)' : 'var(--status-warning-bg)', 
              color: isSuccess ? 'var(--status-success-text)' : 'var(--status-warning-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto'
            }}>
              {isSuccess ? <CheckCircle2 size={30} /> : <Clock size={30} />}
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment Amount</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '0.2rem 0' }}>
              ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            
            <div className={`badge ${isSuccess ? 'badge-success' : 'badge-warning'}`}>
              {tx.status}
            </div>
          </div>

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
            <div className="flex-between">
              <span className="text-muted">Reference ID</span>
              <span className="font-mono" style={{ fontWeight: 600 }}>{tx.referenceNumber}</span>
            </div>

            <div className="flex-between">
              <span className="text-muted">Date & Time</span>
              <span>{new Date(tx.date).toLocaleString()}</span>
            </div>

            <div className="flex-between">
              <span className="text-muted">Payment Category</span>
              <span>{tx.category || 'Money Transfer'}</span>
            </div>

            <div className="flex-between">
              <span className="text-muted">Recipient Name</span>
              <span style={{ fontWeight: 600 }}>{tx.recipientName}</span>
            </div>

            <div className="flex-between">
              <span className="text-muted">Destination Account</span>
              <span className="font-mono">{tx.recipientAccount}</span>
            </div>

            <div className="flex-between">
              <span className="text-muted">Transfer Fee</span>
              <span>${(tx.fee || 0).toFixed(2)}</span>
            </div>

            <div className="flex-between" style={{ paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', fontWeight: 700 }}>
              <span>Total Debited</span>
              <span className="font-mono" style={{ color: 'var(--accent-emerald)' }}>
                ${(tx.amount + (tx.fee || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print PDF
          </button>
          <button className="btn btn-primary" onClick={() => setSelectedReceiptTx(null)}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
