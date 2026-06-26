/* iPhone 15 Pro frame */
export function IPhoneFrame({ children, className = '' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: 280,
        borderRadius: 44,
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 40%, #111 100%)',
        padding: '10px 8px 14px',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.12),
          0 0 0 2px rgba(0,0,0,0.8),
          0 40px 80px rgba(0,0,0,0.5),
          0 0 60px rgba(0,0,0,0.3)
        `,
      }}
    >
      {/* Side buttons left */}
      <div className="absolute" style={{ left: -3, top: 88, width: 3, height: 32, background: '#2a2a2a', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 2px rgba(0,0,0,0.5)' }}/>
      <div className="absolute" style={{ left: -3, top: 132, width: 3, height: 32, background: '#2a2a2a', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 2px rgba(0,0,0,0.5)' }}/>
      <div className="absolute" style={{ left: -3, top: 172, width: 3, height: 32, background: '#2a2a2a', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 2px rgba(0,0,0,0.5)' }}/>
      {/* Side button right */}
      <div className="absolute" style={{ right: -3, top: 140, width: 3, height: 56, background: '#2a2a2a', borderRadius: '0 2px 2px 0', boxShadow: '1px 0 2px rgba(0,0,0,0.5)' }}/>

      {/* Screen bezel */}
      <div
        style={{
          borderRadius: 36,
          overflow: 'hidden',
          background: '#000',
          position: 'relative',
        }}
      >
        {/* Dynamic Island */}
        <div style={{ background: '#000', paddingTop: 10, paddingBottom: 4, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 100, height: 28, background: '#000', borderRadius: 20, border: '1px solid #1a1a1a', boxShadow: 'inset 0 0 8px rgba(255,255,255,0.03)' }}/>
        </div>
        {/* Content */}
        <div style={{ background: '#000' }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{ background: '#0a0a0a', paddingTop: 6, paddingBottom: 8, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 100, height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }}/>
        </div>
      </div>

      {/* Camera pill highlight */}
      <div className="absolute" style={{ top: 14, left: '50%', transform: 'translateX(-50%)', width: 100, height: 26, borderRadius: 16, background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)', pointerEvents: 'none' }}/>
    </div>
  )
}

/* MacBook browser frame */
export function MacBrowserFrame({ children, className = '', url = 'yarnia.vn/stories' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius: 14,
        background: 'linear-gradient(145deg, #2e2e2e 0%, #1c1c1c 100%)',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.1),
          0 0 0 1.5px rgba(0,0,0,0.7),
          0 40px 80px rgba(0,0,0,0.45),
          0 10px 30px rgba(0,0,0,0.25)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          height: 38,
          background: 'linear-gradient(to bottom, #3a3a3a, #2d2d2d)',
          borderBottom: '1px solid rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25)' }}/>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25)' }}/>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25)' }}/>
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            margin: '0 12px',
            height: 22,
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          {/* lock icon inline SVG */}
          <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
            <rect x="1" y="4" width="7" height="5.5" rx="1.2" fill="rgba(255,255,255,0.3)"/>
            <path d="M2.5 4V2.8C2.5 1.8 6.5 1.8 6.5 2.8V4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'system-ui', letterSpacing: '0.01em' }}>
            {url}
          </span>
        </div>

        {/* Tab indicators */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}/>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ overflow: 'hidden' }}>
        {children}
      </div>

      {/* Bottom bar glow */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }}/>
    </div>
  )
}

/* iPad frame */
export function IPadFrame({ children, className = '' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius: 22,
        background: 'linear-gradient(145deg, #2c2c2c 0%, #1a1a1a 100%)',
        padding: '14px 10px',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.1),
          0 0 0 2px rgba(0,0,0,0.6),
          0 40px 80px rgba(0,0,0,0.4)
        `,
      }}
    >
      {/* home button strip */}
      <div className="absolute" style={{ right: -1, top: '50%', transform: 'translateY(-50%)', width: 4, height: 48, background: '#222', borderRadius: '0 3px 3px 0' }}/>

      {/* Camera */}
      <div className="absolute" style={{ left: '50%', top: 6, transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}/>

      <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000' }}>
        {children}
      </div>
    </div>
  )
}
