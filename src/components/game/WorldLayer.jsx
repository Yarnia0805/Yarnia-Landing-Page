import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import { drawWorld } from './drawWorld'
import { drawCloud } from './drawCloud'
import { drawSparkle } from './drawSparkle'
import { CLOUD_COUNT } from './constants'

extend({ Graphics })

const SPARKLE_COUNT = 10

export default function WorldLayer({ width, height, speedRef }) {
  const cameraX = useRef(0)
  const clouds = useRef(initClouds(width, height))
  const sparkles = useRef(initSparkles(width, height))
  const [tick, setTick] = useState(0)

  useTick((ticker) => {
    const dt = ticker.deltaTime
    const mult = speedRef?.current ?? 1
    cameraX.current += 0.8 * mult * dt

    clouds.current.forEach((c) => {
      c.x -= 0.3 * dt
      if (c.x < -80) {
        c.x = width + 40
        c.y = height * 0.08 + Math.random() * height * 0.25
      }
    })

    sparkles.current.forEach((s) => {
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.phase += 0.02 * dt
      if (s.y < -10) {
        s.y = height + 10
        s.x = Math.random() * width
      }
    })

    setTick((t) => t + 1)
  })

  const draw = useCallback((g) => {
    g.clear()
    drawWorld(g, width, height, cameraX.current)

    // sparkles
    sparkles.current.forEach((s) => {
      const alpha = (Math.sin(s.phase) * 0.5 + 0.5) * 0.35
      drawSparkle(g, s.x, s.y, s.size, alpha)
    })

    clouds.current.forEach((c) => drawCloud(g, c.x, c.y, c.scale))
  }, [width, height, tick])

  return <pixiGraphics draw={draw} />
}

function initClouds(w, h) {
  return Array.from({ length: CLOUD_COUNT }, (_, i) => ({
    x: (w / CLOUD_COUNT) * i + Math.random() * 80,
    y: h * 0.08 + Math.random() * h * 0.25,
    scale: 0.4 + Math.random() * 0.6,
  }))
}

function initSparkles(w, h) {
  return Array.from({ length: SPARKLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -0.1 - Math.random() * 0.15,
    size: 1 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
  }))
}
