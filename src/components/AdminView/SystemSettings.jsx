import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Settings, Percent, DollarSign, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export const SystemSettings = () => {
  const { systemConfig, setSystemConfig, applyMonthlyInterestBatch, resetData, addToast } = useBank();

  const [form, setForm] = useState({
    savingsApy: systemConfig.savingsApy.toString(),
    wireFee: systemConfig.wireFee.toString(),
    highValueThreshold: systemConfig.highValueThreshold.toString(),
    maxDailyLimitDefault: systemConfig.maxDailyLimitDefault.toString(),
    require2FAForTransfers: systemConfig.require2FAForTransfers
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSystemConfig({
      ...systemConfig,
      savingsApy: parseFloat(form.savingsApy) || 4.5,
      wireFee: parseFloat(form.wireFee) || 15.0,
      highValueThreshold: parseFloat(form.highValueThreshold) || 10000.0,
      maxDailyLimitDefault: parseFloat(form.maxDailyLimitDefault) || 25000.0,
      require2FAForTransfers: form.require2FAForTransfers
    });

    addToast('System compliance rules updated successfully!', 'success');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>System Configuration & Rates</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage global interest APY rates, wire fees, security 2FA policies, and compliance thresholds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Global Interest & Fee Rules</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Savings APY Rate (%)</label>
            <input 
              type="number" 
              className="form-input" 
              step="0.05"
              value={form.savingsApy}
              onChange={e => setForm({ ...form, savingsApy: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Outbound Wire Fee ($)</label>
            <input 
              type="number" 
              className="form-input" 
              step="1"
              value={form.wireFee}
              onChange={e => setForm({ ...form, wireFee: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">High-Value Approval Threshold ($)</label>
            <input 
              type="number" 
              className="form-input" 
              step="1000"
              value={form.highValueThreshold}
              onChange={e => setForm({ ...form, highValueThreshold: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Default Customer Daily Limit ($)</label>
            <input 
              type="number" 
              className="form-input" 
              step="5000"
              value={form.maxDailyLimitDefault}
              onChange={e => setForm({ ...form, maxDailyLimitDefault: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input 
              type="checkbox" 
              checked={form.require2FAForTransfers}
              onChange={e => setForm({ ...form, require2FAForTransfers: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)' }}
            />
            <span>Require 2FA Security Passcode for all outbound money transfers</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
          <CheckCircle2 size={16} /> Save System Rules
        </button>
      </form>

      {/* Batch Runner Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Automated Interest Ledger Batch</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Simulates monthly interest payout based on the active Savings APY ({systemConfig.savingsApy}%).
        </p>

        <div className="flex-between">
          <button className="btn btn-secondary" onClick={resetData}>
            <RotateCcw size={15} /> Reset Database
          </button>
          <button className="btn btn-primary" onClick={applyMonthlyInterestBatch}>
            <Percent size={15} /> Execute Monthly Interest Batch
          </button>
        </div>
      </div>
    </div>
  );
};
