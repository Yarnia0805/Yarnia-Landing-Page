import { useEffect, useRef } from 'react'

const SHAPES = [
  { w: 120, h: 120, color: '#FDC631', fill: true, type: 'circle' },
  { w: 180, h: 180, color: '#FDC631', fill: false, type: 'square' },
  { w: 100, h: 100, color: '#DD3A34', fill: true, type: 'triangle' },
  { w: 140, h: 140, color: '#DD3A34', fill: false, type: 'diamond' },
  { w: 80, h: 80, color: '#328045', fill: true, type: 'circle' },
  { w: 160, h: 160, color: '#328045', fill: false, type: 'square' },
  { w: 90, h: 90, color: '#9273E4', fill: true, type: 'triangle' },
  { w: 200, h: 200, color: '#9273E4', fill: false, type: 'diamond' },
  { w: 70, h: 70, color: '#0648D7', fill: true, type: 'circle' },
  { w: 130, h: 130, color: '#0648D7', fill: false, type: 'square' },
  { w: 110, h: 110, color: '#F2763A', fill: true, type: 'triangle' },
  { w: 150, h: 150, color: '#F2763A', fill: false, type: 'diamond' },
]

// Place shapes across viewport sections
function layoutShapes(w, h) {
  const items = []
  const sections = 5 // how many viewport-height bands to fill
  for (let s = 0; s < sections; s++) {
    const sy = s * h
    const shapesInSection = SHAPES.slice(s * 3, s * 3 + 3)
    shapesInSection.forEach((shape, i) => {
      const pad = 40
      const sx = pad + Math.random() * (w - pad * 2 - shape.w)
      const syOff = pad + Math.random() * (h - pad * 2 - shape.h)
      items.push({
        ...shape,
        x: sx,
        y: sy + syOff,
        idx: items.length,
        floatAmp: 3 + Math.random() * 5,
        floatSpeed: 0.3 + Math.random() * 0.3,
        floatPhase: Math.random() * Math.PI * 2,
        rotateSpeed: Math.random() > 0.5 ? 0.1 : -0.1,
        rot: Math.random() * 360,
      })
    })
  }
  return items
}

function drawShape(ctx, shape, cx, cy, t) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((shape.rot + t * shape.rotateSpeed) * Math.PI / 180)

  const hw = shape.w / 2
  const hh = shape.h / 2

  if (shape.fill) {
    // Solid shape with slight transparency
    ctx.globalAlpha = 0.35
    ctx.fillStyle = shape.color
    drawPath(ctx, shape.type, hw, hh)
    ctx.fill()
  } else {
    // Hollow shape — thick outline only
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = shape.color
    ctx.lineWidth = 3
    drawPath(ctx, shape.type, hw, hh)
    ctx.stroke()
    // Inner accent dot
    ctx.globalAlpha = 0.2
    ctx.fillStyle = shape.color
    ctx.beginPath()
    ctx.arc(0, 0, Math.min(hw, hh) * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawPath(ctx, type, hw, hh) {
  switch (type) {
    case 'circle':
      ctx.beginPath()
      ctx.arc(0, 0, Math.min(hw, hh), 0, Math.PI * 2)
      break
    case 'square':
      ctx.beginPath()
      ctx.rect(-hw, -hh, hw * 2, hh * 2)
      break
    case 'triangle':
      ctx.beginPath()
      ctx.moveTo(0, -hh)
      ctx.lineTo(-hw, hh)
      ctx.lineTo(hw, hh)
      ctx.closePath()
      break
    case 'diamond':
      ctx.beginPath()
      ctx.moveTo(0, -hh)
      ctx.lineTo(hw, 0)
      ctx.lineTo(0, hh)
      ctx.lineTo(-hw, 0)
      ctx.closePath()
      break
  }
}

export default function PageDecorations() {
  const canvasRef = useRef(null)
  const shapesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      shapesRef.current = layoutShapes(w, h)
    }

    resize()
    window.addEventListener('resize', resize)

    let startTime = performance.now()

    function animate() {
      const t = (performance.now() - startTime) / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const shapes = shapesRef.current
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i]
        const floatY = Math.sin(t * s.floatSpeed + s.floatPhase) * s.floatAmp
        drawShape(ctx, s, s.x + s.w / 2, s.y + s.h / 2 + floatY, t)
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
