import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { CreditCard, Snowflake, Lock, Eye, EyeOff, Globe, Wifi, ShieldCheck, Sliders } from 'lucide-react';

export const CardsManager = () => {
  const { cards = [], toggleCardFreeze, updateCardLimit } = useBank();
  const [showCvv, setShowCvv] = useState({});
  const [editingLimitCardId, setEditingLimitCardId] = useState(null);
  const [newLimitVal, setNewLimitVal] = useState('');

  const toggleShowCvv = (cardId) => {
    setShowCvv(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleSaveLimit = (cardId) => {
    if (updateCardLimit) updateCardLimit(cardId, newLimitVal);
    setEditingLimitCardId(null);
  };

  const userCards = cards || [];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Digital & Physical Cards</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage security controls, lock cards, reveal credentials, and update limits in real time.
          </p>
        </div>
      </div>

      {userCards.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No active cards linked to your account profile.
        </div>
      ) : (
        <div className="grid-cards">
          {userCards.map(card => {
            const isRevealed = showCvv[card.id];

            return (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Virtual Metallic Card Visual */}
                <div className={`debit-card ${card.color || 'gradient-blue'} ${card.isFrozen ? 'is-frozen' : ''}`}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>{card.type}</span>
                    <div className="card-chip" />
                  </div>

                  <div className="card-number-display">
                    {(card.cardNumber || '4000000000000000').replace(/(.{4})/g, '$1 ').trim()}
                  </div>

                  <div className="card-footer-info">
                    <div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>CARDHOLDER</div>
                      <div className="card-holder-name">{card.cardHolder}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>EXPIRES</div>
                      <div className="card-exp">{card.expiry}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>CVV</div>
                      <div className="card-exp">{isRevealed ? card.cvv : '•••'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Controls Panel */}
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* Freeze Toggle */}
                    <div className="flex-between">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Snowflake size={18} className={card.isFrozen ? 'text-rose' : 'text-muted'} />
                        <div>
                          <strong style={{ fontSize: '0.88rem' }}>Freeze Card</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Block all transactions</div>
                        </div>
                      </div>

                      <button 
                        className={`btn ${card.isFrozen ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                        onClick={() => toggleCardFreeze(card.id)}
                      >
                        {card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                      </button>
                    </div>

                    {/* Show CVV / Details */}
                    <div className="flex-between" style={{ paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>CVV & Credentials</span>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        onClick={() => toggleShowCvv(card.id)}
                      >
                        {isRevealed ? 'Hide' : 'Reveal CVV'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
