import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Search, Download, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const TransactionHistory = () => {
  const { currentCustomer, transactions, setSelectedReceiptTx, addToast } = useBank();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const customerTxs = transactions.filter(t => 
    t.senderId === currentCustomer.id || 
    t.recipientAccount.includes(currentCustomer.accounts[0]?.accountNumber || '___')
  );

  const filteredTxs = customerTxs.filter(tx => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = filterCategory === 'All' || tx.category === filterCategory;

    return matchesSearch && matchesCat;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Status', 'Reference'];
    const rows = filteredTxs.map(t => [
      t.id,
      new Date(t.date).toISOString(),
      t.type,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.status,
      t.referenceNumber
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `statement_${currentCustomer.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Account Statement CSV downloaded!', 'success');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Account Statements & History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Audit trail of all debits, deposits, wire dispatches, and monthly interest credits.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} /> Export Statement CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by keyword, recipient, or reference ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select 
            className="form-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Transfer">Transfers</option>
            <option value="P2P">P2P Payments</option>
            <option value="Savings">Internal Savings</option>
            <option value="Income">Payroll / Income</option>
            <option value="Utilities">Utilities & Bills</option>
            <option value="Interest">Interest Earned</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTxs.map(tx => {
                  const isDebit = tx.senderId === currentCustomer.id;

                  return (
                    <tr key={tx.id}>
                      <td>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: isDebit ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: isDebit ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isDebit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{tx.description}</div>
                        <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tx.referenceNumber}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.date).toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{tx.category || 'General'}</span>
                      </td>
                      <td className="font-mono" style={{ fontWeight: 700, color: isDebit ? 'var(--text-main)' : 'var(--accent-emerald)' }}>
                        {isDebit ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${tx.status === 'Completed' ? 'badge-success' : (tx.status === 'Under Review' ? 'badge-warning' : 'badge-danger')}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => setSelectedReceiptTx(tx)}
                        >
                          <FileText size={13} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
