import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import {
  PROP_SPAWN_INTERVAL, BOOK_WIDTH, BOOK_HEIGHT,
  STAR_RADIUS, SCROLL_SPEED_BASE,
} from './constants'

extend({ Graphics })

let nextId = 0
let patternIndex = 0
let patternPos = 0

const PATTERNS = [
  ['book', 'star'],
  ['star', 'book'],
  ['book', 'star', 'book'],
  ['book', 'spike'],
  ['star', 'log'],
  ['book', 'gap'],
  ['star', 'spike'],
  ['spike', 'log'],
  ['gap', 'spike'],
  ['log', 'gap'],
  ['spike', 'gap', 'log'],
]

function itemConfig(type) {
  switch (type) {
    case 'book': return { type: 'book', w: BOOK_WIDTH, h: BOOK_HEIGHT, obstacle: false, xp: 10 }
    case 'star': return { type: 'star', w: STAR_RADIUS * 2, h: STAR_RADIUS * 2, obstacle: false, xp: 25 }
    case 'spike': return { type: 'spike', w: 14, h: 12, obstacle: true, xp: 0 }
    case 'gap': return { type: 'gap', w: 30, h: 0, obstacle: true, xp: 0 }
    case 'log': return { type: 'log', w: 20, h: 10, obstacle: true, xp: 0 }
  }
}

function nextItem() {
  const pat = PATTERNS[patternIndex % PATTERNS.length]
  const type = pat[patternPos % pat.length]
  patternPos++
  if (patternPos % pat.length === 0) patternIndex++
  return itemConfig(type)
}

export default function PropsManager({ onCollect, woollyBox, width, height, obstaclesRef, speedRef }) {
  const props = useRef([])
  const frameCount = useRef(-120)
  const glowQueue = useRef([])
  const [tick, setTick] = useState(0)

  useTick((ticker) => {
    const dt = ticker.deltaTime
    frameCount.current += 1

    if (frameCount.current > 0 && frameCount.current % 120 === 0) {
      const item = nextItem()
      props.current.push({
        id: nextId++,
        ...item,
        x: width + 20,
        y: item.type === 'gap' ? height * 0.55 : height * 0.42 + Math.random() * height * 0.10,
        collected: false,
      })
    }

    const wBox = woollyBox.current
    props.current.forEach((p) => {
      if (p.collected) return
      p.x -= SCROLL_SPEED_BASE * 1.5 * dt * (speedRef?.current ?? 1)

      const pw = p.w
      const ph = p.h
      if (
        p.x < wBox.x + wBox.w &&
        p.x + pw > wBox.x &&
        p.y < wBox.y + wBox.h &&
        p.y + ph > wBox.y
      ) {
        p.collected = true
        if (p.obstacle) {
          // Hit obstacle — lose XP
          onCollect(-15, p.x + pw / 2, p.y + ph / 2)
        } else {
          glowQueue.current.push({ x: p.x + pw / 2, y: p.y + ph / 2, alpha: 0.6 })
          onCollect(p.xp, p.x + pw / 2, p.y + ph / 2)
        }
      }
    })

    glowQueue.current.forEach((g) => { g.alpha -= 0.03 * dt })
    glowQueue.current = glowQueue.current.filter((g) => g.alpha > 0)
    props.current = props.current.filter((p) => p.x > -40)

    // Sync obstacles for auto-jump detection
    if (obstaclesRef) obstaclesRef.current = props.current

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

      switch (p.type) {
        case 'book':
          g.setFillStyle({ color: '#DD3A34' })
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 2)
          g.fill()
          g.stroke()
          g.setStrokeStyle({ color: '#1A1A2E', width: 1 })
          g.beginPath()
          g.moveTo(p.x + 3, p.y + 2)
          g.lineTo(p.x + 3, p.y + p.h - 2)
          g.stroke()
          break

        case 'star': {
          const cx = p.x + p.w / 2
          const cy = p.y + p.h / 2
          const r = p.w / 2
          g.setFillStyle({ color: '#FDC631' })
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.moveTo(cx, cy - r)
          for (let i = 1; i < 10; i++) {
            const angle = (i * Math.PI * 2) / 10 - Math.PI / 2
            const rr = i % 2 === 0 ? r : r * 0.4
            g.lineTo(cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr)
          }
          g.closePath()
          g.fill()
          g.stroke()
          break
        }

        case 'spike':
          // Red spike triangle
          g.setFillStyle({ color: '#DD3A34' })
          g.beginPath()
          g.moveTo(p.x, p.y)
          g.lineTo(p.x + p.w, p.y)
          g.lineTo(p.x + p.w / 2, p.y - p.h)
          g.closePath()
          g.fill()
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.moveTo(p.x, p.y)
          g.lineTo(p.x + p.w, p.y)
          g.lineTo(p.x + p.w / 2, p.y - p.h)
          g.closePath()
          g.stroke()
          break

        case 'gap':
          // Draw warning X marks
          g.setStrokeStyle({ color: 'rgba(221, 58, 52, 0.5)', width: 2 })
          g.beginPath()
          g.moveTo(p.x, p.y)
          g.lineTo(p.x + p.w, p.y - 20)
          g.stroke()
          g.beginPath()
          g.moveTo(p.x + p.w, p.y)
          g.lineTo(p.x, p.y - 20)
          g.stroke()
          break

        case 'log':
          // Horizontal log
          g.setFillStyle({ color: 'rgba(101, 67, 33, 0.6)' })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 3)
          g.fill()
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 3)
          g.stroke()
          // Grain lines
          g.setStrokeStyle({ color: 'rgba(26,26,46,0.2)', width: 0.5 })
          g.beginPath()
          g.moveTo(p.x + 4, p.y + 3)
          g.lineTo(p.x + p.w - 4, p.y + 3)
          g.stroke()
          g.beginPath()
          g.moveTo(p.x + 4, p.y + p.h - 3)
          g.lineTo(p.x + p.w - 4, p.y + p.h - 3)
          g.stroke()
          break
      }
    })
  }, [tick])

  return <pixiGraphics draw={draw} />
}
