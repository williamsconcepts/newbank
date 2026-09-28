import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { UserPlus, X, DollarSign, Building } from 'lucide-react';

export const NewAccountModal = ({ isOpen, onClose }) => {
  const { createNewUserAccount } = useBank();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    accountType: 'Checking',
    initialBalance: '5000'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    createNewUserAccount(formData);
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      accountType: 'Checking',
      initialBalance: '5000'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--status-success-bg)', color: 'var(--accent-emerald)', padding: '8px', borderRadius: '10px' }}>
              <UserPlus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Register New Customer</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Issue new bank profile & initial deposit</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Customer Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Alexander Wright"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="alex@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="+1 (555) 392-0011"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Account Category</label>
              <select 
                className="form-select"
                value={formData.accountType}
                onChange={e => setFormData({ ...formData, accountType: e.target.value })}
              >
                <option value="Checking">Checking Account</option>
                <option value="Savings">High-Yield Savings</option>
                <option value="Investment">Investment Vault</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Opening Deposit ($)</label>
              <div className="amount-input-group">
                <span className="amount-prefix" style={{ fontSize: '1rem' }}>$</span>
                <input 
                  type="number" 
                  className="form-input amount-input" 
                  style={{ fontSize: '1rem' }}
                  placeholder="5000"
                  value={formData.initialBalance}
                  onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="100 Financial Boulevard, Suite 500"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} /> Open Customer Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
