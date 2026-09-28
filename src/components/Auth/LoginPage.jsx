import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Building2, ShieldCheck, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';

export const LoginPage = ({ onSwitchToAdminLogin }) => {
  const { login, register, isLoading } = useBank();
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [email, setEmail] = useState('sarah@apexbank.com');
  const [password, setPassword] = useState('password123');

  // Register state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    initialDeposit: '5000'
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, 'customer');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    await register(regForm);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(circle at top, #1e293b 0%, #0b0f19 100%)'
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.85rem',
            boxShadow: '0 8px 24px var(--accent-emerald-glow)'
          }}>
            <Building2 size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Apex Global Bank</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            {isRegistering ? 'Register for Online Banking' : 'Customer Client Gateway'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@apexbank.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In to Account'} <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setIsRegistering(true)}
                >
                  New customer? Open an account →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Eleanor Vance"
                  value={regForm.name}
                  onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="eleanor@example.com"
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Create Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={regForm.password}
                  onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Opening Deposit ($)</label>
                <input 
                  type="number" 
                  className="form-input font-mono" 
                  placeholder="5000"
                  value={regForm.initialDeposit}
                  onChange={e => setRegForm({ ...regForm, initialDeposit: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Register & Open Bank Account'} <UserPlus size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setIsRegistering(false)}
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Separated Admin Portal Link at Bottom */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={onSwitchToAdminLogin}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent-rose)' }} /> Executive Staff Access Gateway →
          </button>
        </div>
      </div>
    </div>
  );
};
