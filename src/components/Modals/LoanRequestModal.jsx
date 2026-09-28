import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Landmark, X, CheckCircle2 } from 'lucide-react';

export const LoanRequestModal = ({ isOpen, onClose }) => {
  const { applyForLoan } = useBank();
  const [amount, setAmount] = useState('10000');
  const [purpose, setPurpose] = useState('Home Renovation & Energy Upgrade');
  const [durationMonths, setDurationMonths] = useState(24);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const interestRate = 0.064; // 6.4% APR
  const estimatedMonthly = numAmount > 0 ? ((numAmount * (1 + interestRate)) / durationMonths).toFixed(2) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    applyForLoan({ amount, purpose, durationMonths });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)', padding: '8px', borderRadius: '10px' }}>
              <Landmark size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Apply for Credit / Loan</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Low fixed APR rates with instant decision queue</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Desired Loan Amount ($)</label>
            <div className="amount-input-group">
              <span className="amount-prefix">$</span>
              <input 
                type="number" 
                className="form-input amount-input" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="10000"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Repayment Duration</label>
            <select 
              className="form-select"
              value={durationMonths}
              onChange={e => setDurationMonths(parseInt(e.target.value))}
            >
              <option value={12}>12 Months (1 Year)</option>
              <option value={24}>24 Months (2 Years)</option>
              <option value={36}>36 Months (3 Years)</option>
              <option value={60}>60 Months (5 Years)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Loan Purpose</label>
            <input 
              type="text" 
              className="form-input" 
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="e.g. Debt Consolidation or Business Equipment"
              required
            />
          </div>

          {/* Calculator Output Card */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <div className="flex-between" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Interest Rate</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>6.4% Fixed APR</span>
            </div>
            <div className="flex-between" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Estimated Monthly:</span>
              <span className="font-mono text-emerald">${parseFloat(estimatedMonthly).toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Submit Loan Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
