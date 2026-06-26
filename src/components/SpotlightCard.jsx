import { useRef, useState } from 'react'

export default function SpotlightCard({
  children,
  className = '',
  style = {},
  spotlightColor = 'rgba(253,198,49,0.12)',
  borderColor = 'rgba(0,0,0,0.07)',
}) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 })

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 })
  }
  const onLeave = () => setPos((p) => ({ ...p, opacity: 0 }))

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        ...style,
      }}
    >
      {/* spotlight radial */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}
