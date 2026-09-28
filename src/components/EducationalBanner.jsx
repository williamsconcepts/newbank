import React from 'react';
import { useBank } from '../context/BankContext';
import { ShieldAlert, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const EducationalBanner = () => {
  const { currentRole, resetData, systemConfig, auditLogs } = useBank();

  return (
    <div className="edu-banner">
      <div className="edu-content">
        <ShieldAlert className="edu-icon" size={18} />
        <div>
          <strong>Educational Sandbox Mode:</strong> Apex Global Financial is a simulated banking platform built for educational & workflow testing. 
          <span style={{ marginLeft: '6px', opacity: 0.8 }}>
            No real currency or live financial institutions are connected.
          </span>
        </div>
      </div>
      <div className="flex-gap-2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '6px' }}>
          <CheckCircle2 size={13} style={{ color: '#10b981' }} />
          <span>Rules: {systemConfig.savingsApy}% Savings APY | Wire Fee: ${systemConfig.wireFee}</span>
        </div>
        <button className="reset-btn" onClick={resetData} title="Reset all demo accounts & transactions to default">
          <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
