import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import {
  PROP_SPAWN_INTERVAL, BOOK_WIDTH, BOOK_HEIGHT,
  STAR_RADIUS, SCROLL_SPEED_BASE,
} from './constants'

extend({ Graphics })

let nextId = 0

export default function PropsManager({ onCollect, woollyBox, width, height }) {
  const props = useRef([])
  const frameCount = useRef(0)
  const glowQueue = useRef([])
  const [tick, setTick] = useState(0)

  useTick((ticker) => {
    const dt = ticker.deltaTime
    frameCount.current += 1

    if (frameCount.current % PROP_SPAWN_INTERVAL === 0) {
      const type = Math.random() > 0.6 ? 'star' : 'book'
      props.current.push({
        id: nextId++,
        type,
        x: width + 20,
        y: height * 0.42 + Math.random() * height * 0.10,
        collected: false,
      })
    }

    const wBox = woollyBox.current
    props.current.forEach((p) => {
      if (p.collected) return
      p.x -= SCROLL_SPEED_BASE * 1.5 * dt

      const pw = p.type === 'book' ? BOOK_WIDTH : STAR_RADIUS * 2
      const ph = p.type === 'book' ? BOOK_HEIGHT : STAR_RADIUS * 2
      if (
        p.x < wBox.x + wBox.w &&
        p.x + pw > wBox.x &&
        p.y < wBox.y + wBox.h &&
        p.y + ph > wBox.y
      ) {
        p.collected = true
        glowQueue.current.push({ x: p.x + pw / 2, y: p.y + ph / 2, alpha: 0.6 })
        onCollect(p.type === 'star' ? 25 : 10, p.x + pw / 2, p.y + ph / 2)
      }
    })

    glowQueue.current.forEach((g) => { g.alpha -= 0.03 * dt })
    glowQueue.current = glowQueue.current.filter((g) => g.alpha > 0)
    props.current = props.current.filter((p) => p.x > -40)

    setTick((t) => t + 1)
  })

  const draw = useCallback((g) => {
    g.clear()

    glowQueue.current.forEach((gl) => {
      if (gl.alpha <= 0) return
      g.setFillStyle({ color: `rgba(253, 198, 49, ${gl.alpha})` })
      g.beginPath()
      g.circle(gl.x, gl.y, 14)
      g.fill()
    })

    props.current.forEach((p) => {
      if (p.collected) return

      if (p.type === 'book') {
        g.setFillStyle({ color: '#DD3A34' })
        g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
        g.beginPath()
        g.roundRect(p.x, p.y, BOOK_WIDTH, BOOK_HEIGHT, 2)
        g.fill()
        g.stroke()

        g.setStrokeStyle({ color: '#1A1A2E', width: 1 })
        g.beginPath()
        g.moveTo(p.x + 3, p.y + 2)
        g.lineTo(p.x + 3, p.y + BOOK_HEIGHT - 2)
        g.stroke()
      } else {
        const cx = p.x + STAR_RADIUS
        const cy = p.y + STAR_RADIUS
        g.setFillStyle({ color: '#FDC631' })
        g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
        g.beginPath()
        g.moveTo(cx, cy - STAR_RADIUS)
        for (let i = 1; i < 10; i++) {
          const angle = (i * Math.PI * 2) / 10 - Math.PI / 2
          const r = i % 2 === 0 ? STAR_RADIUS : STAR_RADIUS * 0.4
          g.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
        }
        g.closePath()
        g.fill()
        g.stroke()
      }
    })
  }, [tick])

  return <pixiGraphics draw={draw} />
}
