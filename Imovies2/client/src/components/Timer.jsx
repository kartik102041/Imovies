import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Timer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateRemaining = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60 && timeLeft > 0;

  return (
    <div
      className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
      style={{
        background: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
        border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
        color: isUrgent ? '#f87171' : 'var(--amber-gold)',
        fontWeight: 700,
        fontSize: '0.88rem',
        animation: isUrgent ? 'pulse-locked 1s infinite' : 'none',
      }}
    >
      {isUrgent ? <AlertTriangle size={16} /> : <Clock size={16} />}
      <span>
        Hold Window: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
