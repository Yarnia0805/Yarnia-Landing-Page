import { useEffect, useRef, useCallback } from 'react'

export default function GridMotion({
  cols = 14,
  rows = 8,
  cellColor = 'rgba(253,198,49,0.06)',
  activeColor = 'rgba(253,198,49,0.18)',
  borderColor = 'rgba(255,255,255,0.05)',
  pulseSpeed = 2200,
  className = '',
}) {
  const containerRef = useRef(null)
  const cellsRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(null)
  const visibleRef = useRef(false)

  const getInfluence = useCallback((cellEl, mx, my) => {
    const rect = cellEl.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.hypot(cx - mx, cy - my)
    return Math.max(0, 1 - dist / 220)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    window.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave)

    const io = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting }, { threshold: 0 })
    io.observe(container)

    let startTime = performance.now()

    function tick(now) {
      animRef.current = requestAnimationFrame(tick)
      if (!visibleRef.current) return

      const elapsed = now - startTime
      const { x: mx, y: my } = mouseRef.current

      cellsRef.current.forEach((cell, idx) => {
        if (!cell) return
        const influence = getInfluence(cell, mx, my)
        const col = idx % cols
        const row = Math.floor(idx / cols)
        const wave = Math.sin((elapsed / pulseSpeed) * Math.PI * 2 - (col + row) * 0.35) * 0.5 + 0.5
        const total = Math.min(1, influence + wave * 0.08)

        cell.style.backgroundColor = total > 0.01
          ? `rgba(253,198,49,${(total * 0.22).toFixed(3)})`
          : cellColor
        cell.style.transform = influence > 0.1 ? `scale(${1 + influence * 0.04})` : 'scale(1)'
      })
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      io.disconnect()
    }
  }, [cols, rows, cellColor, getInfluence, pulseSpeed])

  const cells = Array.from({ length: cols * rows })

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: '100%',
          height: '100%',
        }}
      >
        {cells.map((_, i) => (
          <div
            key={i}
            ref={el => { cellsRef.current[i] = el }}
            style={{
              backgroundColor: cellColor,
              border: `1px solid ${borderColor}`,
              transition: 'background-color 0.15s ease, transform 0.2s ease',
              borderRadius: 2,
              willChange: 'background-color, transform',
            }}
          />
        ))}
      </div>
    </div>
  )
}
