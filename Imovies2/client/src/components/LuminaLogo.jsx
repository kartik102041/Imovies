import React from 'react';

const LuminaLogo = ({ size = 'md', showTagline = false }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const iconDimension = isLarge ? 42 : isSmall ? 28 : 34;
  const mainFontSize = isLarge ? '1.75rem' : isSmall ? '1.2rem' : '1.45rem';

  return (
    <div className="d-flex align-items-center gap-2 select-none">
      <div
        className="lumina-logo-badge d-flex align-items-center justify-content-center position-relative"
        style={{
          width: iconDimension,
          height: iconDimension,
          borderRadius: isSmall ? 8 : 10,
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
          flexShrink: 0,
        }}
      >
        <svg
          width={iconDimension * 0.62}
          height={iconDimension * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cinema screen prism & lens icon */}
          <path
            d="M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V14.5C20 15.8807 18.8807 17 17.5 17H6.5C5.11929 17 4 15.8807 4 14.5V6.5Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon
            points="10,8 16,11 10,14"
            fill="#ffffff"
          />
          <path
            d="M8 20L16 20"
            stroke="#d1fae5"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="18.5" r="1.5" fill="#34d399" />
        </svg>
      </div>

      <div className="d-flex flex-column leading-none">
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: mainFontSize,
            fontWeight: 800,
            letterSpacing: '-0.4px',
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: '#ffffff' }}>LUMINA</span>
          <span style={{ color: 'var(--emerald-primary)', marginLeft: '4px' }}>SCREENS</span>
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: '0.68rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginTop: '2px',
            }}
          >
            Precision Cinema
          </span>
        )}
      </div>
    </div>
  );
};

export default LuminaLogo;
