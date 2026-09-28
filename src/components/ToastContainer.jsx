import React from 'react';
import { useBank } from '../context/BankContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useBank();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success': return <CheckCircle2 className="text-emerald" size={20} />;
            case 'danger': return <AlertCircle className="text-rose" size={20} />;
            case 'warning': return <AlertTriangle className="text-gold" size={20} />;
            default: return <Info className="text-muted" size={20} />;
          }
        };

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {getIcon()}
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
