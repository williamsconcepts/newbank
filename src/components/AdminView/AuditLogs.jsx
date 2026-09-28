import React from 'react';
import { useBank } from '../../context/BankContext';
import { ShieldCheck, Terminal, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export const AuditLogs = () => {
  const { auditLogs } = useBank();

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Immutable System Audit Logs</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Cryptographically signed event log of all system actions, admin overrides, transfers, and security events.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor Persona</th>
                <th>Action Code</th>
                <th>Event Details</th>
                <th>IP Address</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {(auditLogs || []).map(log => {
                const getBadge = () => {
                  switch (log.severity) {
                    case 'danger': return <span className="badge badge-danger">High Risk</span>;
                    case 'warning': return <span className="badge badge-warning">Warning</span>;
                    case 'success': return <span className="badge badge-success">Success</span>;
                    default: return <span className="badge badge-info">Info</span>;
                  }
                };

                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.actor}</td>
                    <td className="font-mono text-emerald" style={{ fontSize: '0.82rem' }}>
                      {log.action}
                    </td>
                    <td style={{ fontSize: '0.88rem' }}>{log.details}</td>
                    <td className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {log.ipAddress}
                    </td>
                    <td>{getBadge()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
