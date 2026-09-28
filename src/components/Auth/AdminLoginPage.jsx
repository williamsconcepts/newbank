import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminLoginPage = ({ onBackToCustomerLogin }) => {
  const { login, isLoading } = useBank();
  const [email, setEmail] = useState('admin@apexbank.com');
  const [password, setPassword] = useState('admin123');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, 'admin');
  };

  const fillAdmin = () => {
    setEmail('admin@apexbank.com');
    setPassword('admin123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(circle at top, #311218 0%, #0b0f19 100%)'
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #dc2626, #f43f5e)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.85rem',
            boxShadow: '0 8px 24px rgba(244, 63, 94, 0.3)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Apex Executive Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Risk Management & Compliance Gateway
          </p>
        </div>

        {/* Auth Card */}
        <div className="card" style={{ padding: '2rem', borderColor: 'rgba(244, 63, 94, 0.4)' }}>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Executive Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@apexbank.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Security Key</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In to Executive Portal'} <ArrowRight size={16} />
            </button>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <button 
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                onClick={fillAdmin}
              >
                Auto-fill Admin Credentials (`admin@apexbank.com`)
              </button>
            </div>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={onBackToCustomerLogin}
          >
            <ArrowLeft size={15} /> Return to Customer Sign-In
          </button>
        </div>
      </div>
    </div>
  );
};
