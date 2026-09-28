import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Zap, Wifi, CreditCard, Home, CheckCircle2 } from 'lucide-react';

export const BillPayments = () => {
  const { accounts = [], executeTransfer, addToast } = useBank();
  const [selectedCategory, setSelectedCategory] = useState('Electricity');
  const [payeeName, setPayeeName] = useState('City Power & Light');
  const [accountNumber, setAccountNumber] = useState('Bill Pay #883910');
  const [amount, setAmount] = useState('120.00');

  const userAccounts = accounts || [];
  const [sourceAccountId, setSourceAccountId] = useState(userAccounts[0]?.id || '');

  const categories = [
    { name: 'Electricity', icon: Zap, payee: 'City Power & Light', defaultAcc: 'Bill Pay #883910', defaultAmt: '120.00' },
    { name: 'Internet', icon: Wifi, payee: 'Comcast Broadband', defaultAcc: 'Acct #992104-88', defaultAmt: '89.99' },
    { name: 'Rent', icon: Home, payee: 'Evergreen Real Estate', defaultAcc: 'Lease #742-SPRING', defaultAmt: '1850.00' },
    { name: 'Credit Card', icon: CreditCard, payee: 'Apex Platinum Card Service', defaultAcc: 'Card #9102', defaultAmt: '350.00' }
  ];

  const handleSelectCat = (cat) => {
    setSelectedCategory(cat.name);
    setPayeeName(cat.payee);
    setAccountNumber(cat.defaultAcc);
    setAmount(cat.defaultAmt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await executeTransfer({
      senderAccountId: sourceAccountId || userAccounts[0]?.id,
      recipientAccount: accountNumber,
      recipientName: payeeName,
      amount,
      transferType: 'bill',
      referenceNote: `Utility Bill Payment: ${selectedCategory}`
    });

    if (res?.success) {
      addToast(`Paid $${parseFloat(amount).toFixed(2)} to ${payeeName}`, 'success');
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Bills & Utility Payments</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Pay municipal utilities, internet providers, credit cards, and property rent instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {categories.map(c => {
          const IconComponent = c.icon;
          const isSel = selectedCategory === c.name;

          return (
            <div 
              key={c.name}
              onClick={() => handleSelectCat(c)}
              style={{
                background: isSel ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                border: `1px solid ${isSel ? 'var(--accent-emerald)' : 'var(--border-color)'}`,
                borderRadius: '14px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-input)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem', color: isSel ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                <IconComponent size={20} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.name}</div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Pay {selectedCategory} Bill</h3>

        <div className="form-group">
          <label className="form-label">Select Source Account</label>
          <select 
            className="form-select"
            value={sourceAccountId || (userAccounts[0]?.id || '')}
            onChange={e => setSourceAccountId(e.target.value)}
          >
            {userAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — Balance: ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Biller Name</label>
            <input type="text" className="form-input" value={payeeName} onChange={e => setPayeeName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Biller Account #</label>
            <input type="text" className="form-input font-mono" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Amount ($)</label>
          <div className="amount-input-group">
            <span className="amount-prefix">$</span>
            <input type="number" className="form-input amount-input" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          <CheckCircle2 size={18} /> Confirm Utility Payment
        </button>
      </form>
    </div>
  );
};
