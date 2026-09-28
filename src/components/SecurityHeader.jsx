import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const SecurityHeader = () => {
  return (
    <div className="edu-banner" style={{ background: 'rgba(19, 27, 46, 0.95)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="edu-content">
        <ShieldCheck size={16} className="text-emerald" />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-main)' }}>Apex Global Financial Ledger:</strong> 256-bit Encrypted Session • Fedwire Routing #021000021 • SQLite Ledger
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
        <CheckCircle2 size={14} />
        <span>System Operational</span>
      </div>
    </div>
  );
};
