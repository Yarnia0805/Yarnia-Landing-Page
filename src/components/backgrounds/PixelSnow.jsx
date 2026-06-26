import { useEffect, useRef } from 'react'

const COLORS = ['#FDC631', '#F279A6', '#9273E4', '#F2763A', '#0648D7']

export default function PixelSnow({
  density = 80,
  speed = 0.4,
  pixelSize = 3,
  opacity = 0.55,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w, h, particles
    let visible = false

    function resize() {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    }

    function createParticles() {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - h,
        vy: speed * (0.5 + Math.random() * 1.2),
        vx: (Math.random() - 0.5) * 0.3,
        size: pixelSize * (0.6 + Math.random() * 0.8),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.3 + Math.random() * 0.7,
        life: Math.random(),
      }))
    }

    function draw() {
      if (!visible) { animId = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.globalAlpha = p.opacity * opacity
        ctx.fillStyle = p.color
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
        p.x += p.vx
        p.y += p.vy
        p.life += 0.003
        p.x += Math.sin(p.life * 2.5) * 0.25
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; p.color = COLORS[Math.floor(Math.random() * COLORS.length)] }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
    io.observe(canvas)

    resize()
    createParticles()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      io.disconnect()
    }
  }, [density, speed, pixelSize, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
