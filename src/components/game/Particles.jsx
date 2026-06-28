import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'

extend({ Graphics })

/**
 * Particles system for collect effects & ambient particles.
 * - starBursts: short-lived particles that spray out from collect point
 * - leaves: ambient falling leaves
 */
export default function Particles({ collectEvents, width, height }) {
  const starBursts = useRef([]) // { x, y, vx, vy, life, maxLife, size, color }
  const leaves = useRef([])
  const [tick, setTick] = useState(0)
  let nextBurstId = 0

  // Spawn star burst when collectEvents has new entries
  if (collectEvents?.current?.length) {
    collectEvents.current.forEach((evt) => {
      if (evt.spawned) return
      evt.spawned = true
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5
        const speed = 1.5 + Math.random() * 2
        starBursts.current.push({
          id: nextBurstId++,
          x: evt.x,
          y: evt.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 30,
          maxLife: 30,
          size: 2 + Math.random() * 2,
          color: Math.random() > 0.5 ? '#FDC631' : '#FFFFFF',
        })
      }
    })
  }

  // Init ambient leaves
  if (leaves.current.length === 0 && width > 0) {
    leaves.current = Array.from({ length: 6 }, () => createLeaf(width, height))
  }

  useTick((ticker) => {
    const dt = ticker.deltaTime

    // Update star bursts
    starBursts.current.forEach((p) => {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += 0.05 * dt // gravity
      p.life -= 1 * dt
    })
    starBursts.current = starBursts.current.filter((p) => p.life > 0)

    // Update leaves
    leaves.current.forEach((l) => {
      l.x += l.vx * dt
      l.y += l.vy * dt
      l.vy += 0.01 * dt
      l.phase += 0.03 * dt
      l.rotation += l.rotSpeed * dt
      if (l.y > height + 20) {
        Object.assign(l, createLeaf(width, height))
        l.y = -20
      }
    })

    setTick((t) => t + 1)
  })

  const draw = useCallback((g) => {
    g.clear()

    // Star bursts
    starBursts.current.forEach((p) => {
      const alpha = p.life / p.maxLife
      g.setFillStyle({ color: `rgba(253, 198, 49, ${alpha})` })
      g.beginPath()
      g.circle(p.x, p.y, p.size * (0.5 + alpha * 0.5))
      g.fill()
    })

    // Leaves
    leaves.current.forEach((l) => {
      const sway = Math.sin(l.phase) * 4
      g.setFillStyle({ color: `rgba(50, 128, 69, ${l.alpha})` })
      g.beginPath()
      g.ellipse(l.x + sway, l.y, 5 * l.scale, 2.5 * l.scale)
      g.fill()
    })
  }, [tick, width, height])

  return <pixiGraphics draw={draw} />
}

function createLeaf(w, h) {
  return {
    x: Math.random() * w,
    y: -20 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.3 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
    rotation: 0,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    scale: 0.6 + Math.random() * 0.6,
    alpha: 0.15 + Math.random() * 0.15,
  }
}
