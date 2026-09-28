import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { SAVED_PAYEES } from '../../data/initialState';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  Building, 
  Lock,
  RefreshCw
} from 'lucide-react';

export const TransferHub = () => {
  const { accounts = [], executeTransfer, systemConfig = {}, addToast } = useBank();

  const [transferType, setTransferType] = useState('p2p');
  const [step, setStep] = useState(1);

  const userAccounts = accounts || [];

  // Form State
  const [sourceAccountId, setSourceAccountId] = useState(userAccounts[0]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [referenceNote, setReferenceNote] = useState('');
  const [speed, setSpeed] = useState('standard');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp] = useState('849-210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPayeeId, setSelectedPayeeId] = useState('');

  const selectedSourceAccount = userAccounts.find(a => a.id === sourceAccountId) || userAccounts[0];
  const wireFee = systemConfig?.wireFee || 15.0;
  const highValueThreshold = systemConfig?.highValueThreshold || 10000.0;

  const handleSelectPayee = (payeeId) => {
    setSelectedPayeeId(payeeId);
    const payee = SAVED_PAYEES.find(p => p.id === payeeId);
    if (payee) {
      setRecipientName(payee.name);
      setRecipientAccount(payee.account);
    }
  };

  const calculatedFee = transferType === 'wire' ? wireFee : (speed === 'instant' ? 2.50 : 0);
  const totalAmountNeeded = (parseFloat(amount) || 0) + calculatedFee;

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!recipientName || !recipientAccount) {
      addToast('Please specify recipient name and account details.', 'danger');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      addToast('Please enter a valid transfer amount.', 'danger');
      return;
    }

    if (num > (selectedSourceAccount?.balance || 0)) {
      addToast(`Amount exceeds available account balance ($${selectedSourceAccount?.balance?.toLocaleString() || 0})`, 'danger');
      return;
    }

    setStep(3);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.trim() !== simulatedOtp.replace('-', '') && otpCode.trim() !== simulatedOtp) {
      addToast(`Invalid 2FA Verification Code. Try code: ${simulatedOtp}`, 'danger');
      return;
    }

    setIsSubmitting(true);

    const res = await executeTransfer({
      senderAccountId: sourceAccountId || userAccounts[0]?.id,
      recipientAccount,
      recipientName,
      amount,
      transferType,
      referenceNote,
      speed
    });

    setIsSubmitting(false);

    if (res?.success) {
      setStep(4);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAmount('');
    setRecipientName('');
    setRecipientAccount('');
    setReferenceNote('');
    setOtpCode('');
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Money Transfer & Wire Hub</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Execute instant peer-to-peer payments, internal account transfers, or domestic & international wire dispatches.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '0.75rem', 
        marginBottom: '1.75rem' 
      }}>
        <div 
          className={`card ${transferType === 'p2p' ? 'active' : ''}`}
          onClick={() => { setTransferType('p2p'); setStep(1); }}
          style={{ 
            padding: '1rem', 
            cursor: 'pointer', 
            borderColor: transferType === 'p2p' ? 'var(--accent-emerald)' : 'var(--border-color)',
            background: transferType === 'p2p' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Zap size={18} className="text-emerald" />
            <strong style={{ fontSize: '0.95rem' }}>Instant P2P</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To Apex customers ($0 fee)</p>
        </div>

        <div 
          className={`card ${transferType === 'internal' ? 'active' : ''}`}
          onClick={() => { setTransferType('internal'); setStep(1); }}
          style={{ 
            padding: '1rem', 
            cursor: 'pointer', 
            borderColor: transferType === 'internal' ? 'var(--accent-emerald)' : 'var(--border-color)',
            background: transferType === 'internal' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <RefreshCw size={18} className="text-emerald" />
            <strong style={{ fontSize: '0.95rem' }}>Internal Transfer</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Between your checking & savings</p>
        </div>

        <div 
          className={`card ${transferType === 'wire' ? 'active' : ''}`}
          onClick={() => { setTransferType('wire'); setStep(1); }}
          style={{ 
            padding: '1rem', 
            cursor: 'pointer', 
            borderColor: transferType === 'wire' ? 'var(--accent-emerald)' : 'var(--border-color)',
            background: transferType === 'wire' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Building size={18} className="text-emerald" />
            <strong style={{ fontSize: '0.95rem' }}>Wire Transfer</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>External bank wire (${wireFee})</p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: step >= 1 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 1 ? 'var(--accent-emerald)' : 'var(--bg-input)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
          Recipient
        </div>
        <div style={{ width: '40px', height: '2px', background: step >= 2 ? 'var(--accent-emerald)' : 'var(--border-color)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: step >= 2 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 2 ? 'var(--accent-emerald)' : 'var(--bg-input)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
          Amount & Options
        </div>
        <div style={{ width: '40px', height: '2px', background: step >= 3 ? 'var(--accent-emerald)' : 'var(--border-color)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: step >= 3 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 3 ? 'var(--accent-emerald)' : 'var(--bg-input)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>3</span>
          2FA Verification
        </div>
      </div>

      {/* STEP 1: Recipient Selection */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Step 1: Select Destination & Source Account</h3>

          <div className="form-group">
            <label className="form-label">Pay From Account</label>
            <select 
              className="form-select"
              value={sourceAccountId || (userAccounts[0]?.id || '')}
              onChange={e => setSourceAccountId(e.target.value)}
            >
              {userAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (#{acc.accountNumber}) — Available: ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Payee Select */}
          <div className="form-group">
            <label className="form-label">Quick Payee (Saved Recipients)</label>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {SAVED_PAYEES.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleSelectPayee(p.id)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    border: `1px solid ${selectedPayeeId === p.id ? 'var(--accent-emerald)' : 'var(--border-color)'}`,
                    background: selectedPayeeId === p.id ? 'var(--accent-emerald-glow)' : 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <strong>{p.name}</strong> ({p.bank})
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Beneficiary / Recipient Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. David Miller or Acme Corp"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account # or Routing / SWIFT</label>
              <input 
                type="text" 
                className="form-input font-mono" 
                placeholder="e.g. 883019284 or SWIFT: APEXUS33"
                value={recipientAccount}
                onChange={e => setRecipientAccount(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">
              Next: Enter Amount <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Amount & Speed */}
      {step === 2 && (
        <form onSubmit={handleNextStep2} className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Step 2: Transfer Amount & Speed</h3>

          <div className="form-group">
            <label className="form-label">Transfer Amount (USD)</label>
            <div className="amount-input-group">
              <span className="amount-prefix">$</span>
              <input 
                type="number" 
                className="form-input amount-input" 
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Available in {selectedSourceAccount?.name || 'Checking'}: ${selectedSourceAccount?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Memo / Reference Note</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Invoice #9021 or Monthly Consulting Fee"
              value={referenceNote}
              onChange={e => setReferenceNote(e.target.value)}
            />
          </div>

          {/* Fee Breakdown & Summary Box */}
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span className="text-muted">Subtotal Transfer Amount:</span>
              <span className="font-mono">${(parseFloat(amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span className="text-muted">Processing Fee ({transferType}):</span>
              <span className="font-mono">${calculatedFee.toFixed(2)}</span>
            </div>
            <div className="flex-between" style={{ fontSize: '0.95rem', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Total Account Deduction:</span>
              <span className="font-mono text-emerald">${totalAmountNeeded.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {parseFloat(amount) >= highValueThreshold && (
            <div style={{ background: 'var(--status-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--status-warning-text)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1.25rem' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>High Value Compliance Threshold ($10,000+):</strong> This transfer will be routed to the Bank Risk Officer for approval before dispatch.
              </div>
            </div>
          )}

          <div className="flex-between">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button type="submit" className="btn btn-primary">
              Proceed to Security Check <Lock size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: 2FA Verification */}
      {step === 3 && (
        <form onSubmit={handleFinalSubmit} className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Security & 2FA Verification</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Please enter the 6-digit One-Time Passcode (OTP) sent to your registered device.
            </p>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed var(--accent-emerald)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <span>Simulated OTP Code: </span>
            <strong className="font-mono text-emerald" style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}>{simulatedOtp}</strong>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ textAlign: 'center' }}>One-Time Security PIN</label>
            <input 
              type="text" 
              className="form-input font-mono" 
              style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.2em' }}
              placeholder="849210"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              maxLength={7}
              required
            />
          </div>

          <div className="flex-between" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              ← Edit Amount
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Authorizing...' : 'Authorize & Transfer Funds'} <CheckCircle2 size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Success View */}
      {step === 4 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--status-success-bg)', color: 'var(--status-success-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Transfer Submitted Successfully!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0.5rem auto 1.75rem auto' }}>
            Your transfer of <strong>${(parseFloat(amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> to <strong>{recipientName}</strong> has been processed.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={resetForm}>
              Make Another Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
