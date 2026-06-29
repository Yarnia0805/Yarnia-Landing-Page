import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import {
  PROP_SPAWN_INTERVAL, BOOK_WIDTH, BOOK_HEIGHT,
  STAR_RADIUS, SCROLL_SPEED_BASE,
} from './constants'
import { sfxCollect, sfxHit } from './sfx'

extend({ Graphics })

let nextId = 0
let patternIndex = 0
let patternPos = 0

/*
 * Two clear types:
 *   HIGH = must jump over (spike/log/gap) — red/coral, elevated
 *   LOW  = walk through (barrel/sign) — green/teal, ground level
 */
const HIGH = ['spike', 'log', 'gap']
const LOW = ['barrel', 'sign']

// Make random patterns guaranteeing the right feel
function genPattern() {
  const roll = Math.random()
  if (roll < 0.35) {
    // All LOW — free coins
    const count = 2 + Math.floor(Math.random() * 2)
    return Array.from({ length: count }, () => LOW[Math.floor(Math.random() * LOW.length)])
  }
  if (roll < 0.65) {
    // Mix: 1-2 LOW then 1 HIGH
    const lowCount = 1 + Math.floor(Math.random() * 2)
    const items = Array.from({ length: lowCount }, () => LOW[Math.floor(Math.random() * LOW.length)])
    items.push(HIGH[Math.floor(Math.random() * HIGH.length)])
    return items
  }
  // All HIGH — skill check
  const count = 2 + Math.floor(Math.random() * 2)
  return Array.from({ length: count }, () => HIGH[Math.floor(Math.random() * HIGH.length)])
}

function itemConfig(type) {
  switch (type) {
    case 'barrel':
      return { type: 'barrel', w: 18, h: 14, obstacle: false, xp: 10, lane: 'low' }
    case 'sign':
      return { type: 'sign', w: 16, h: 18, obstacle: false, xp: 15, lane: 'low' }
    case 'spike':
      return { type: 'spike', w: 14, h: 14, obstacle: true, xp: 0, lane: 'high' }
    case 'gap':
      return { type: 'gap', w: 30, h: 4, obstacle: true, xp: 0, lane: 'high' }
    case 'log':
      return { type: 'log', w: 22, h: 12, obstacle: true, xp: 0, lane: 'high' }
  }
}

function nextItem() {
  const pat = genPattern()
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
      const groundLine = height * 0.55
      props.current.push({
        id: nextId++,
        ...item,
        x: width + 20,
        // LOW = on ground, HIGH = above ground (jump needed)
        y: item.lane === 'low' ? groundLine - 4 : groundLine - 40,
        collected: false,
      })
    }

    const wBox = woollyBox.current
    props.current.forEach((p) => {
      if (p.collected) return
      p.x -= SCROLL_SPEED_BASE * 1.5 * dt * (speedRef?.current ?? 1)

      const pw = p.w
      const ph = p.h || 12
      if (
        p.x < wBox.x + wBox.w &&
        p.x + pw > wBox.x &&
        p.y < wBox.y + wBox.h &&
        p.y + ph > wBox.y
      ) {
        p.collected = true
        if (p.obstacle) {
          sfxHit()
          onCollect(-15, p.x + pw / 2, p.y + ph / 2)
        } else {
          sfxCollect()
          glowQueue.current.push({ x: p.x + pw / 2, y: p.y + ph / 2, alpha: 0.6 })
          onCollect(p.xp, p.x + pw / 2, p.y + ph / 2)
        }
      }
    })

    glowQueue.current.forEach((g) => { g.alpha -= 0.03 * dt })
    glowQueue.current = glowQueue.current.filter((g) => g.alpha > 0)
    props.current = props.current.filter((p) => p.x > -40)

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
        /* ===== LOW — walk through, green/teal, ground ===== */
        case 'barrel': {
          g.setFillStyle({ color: '#4A9C6F' })
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 4)
          g.fill()
          g.stroke()
          // Barrel band
          g.setStrokeStyle({ color: '#2D6B4A', width: 2 })
          g.beginPath()
          g.moveTo(p.x + 2, p.y + 4)
          g.lineTo(p.x + p.w - 2, p.y + 4)
          g.stroke()
          g.beginPath()
          g.moveTo(p.x + 2, p.y + p.h - 4)
          g.lineTo(p.x + p.w - 2, p.y + p.h - 4)
          g.stroke()
          // Label: "LOW"
          g.setFillStyle({ color: '#FFFFFF' })
          g.beginPath()
          g.roundRect(p.x + 4, p.y + 6, 10, 3, 1)
          g.fill()
          break
        }
        case 'sign': {
          g.setFillStyle({ color: '#3BC4A0' })
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 2)
          g.fill()
          g.stroke()
          // Post
          g.setStrokeStyle({ color: '#1A1A2E', width: 2 })
          g.beginPath()
          g.moveTo(p.x + p.w / 2, p.y + p.h)
          g.lineTo(p.x + p.w / 2, p.y + p.h + 8)
          g.stroke()
          // Label: "LOW"
          g.setFillStyle({ color: '#FFFFFF' })
          g.beginPath()
          g.roundRect(p.x + 3, p.y + 4, 10, 3, 1)
          g.fill()
          g.beginPath()
          g.roundRect(p.x + 3, p.y + 9, 7, 3, 1)
          g.fill()
          break
        }

        /* ===== HIGH — obstacle, jump needed, red ===== */
        case 'spike':
          g.setFillStyle({ color: '#DD3A34' })
          g.beginPath()
          g.moveTo(p.x, p.y + p.h)
          g.lineTo(p.x + p.w / 2, p.y)
          g.lineTo(p.x + p.w, p.y + p.h)
          g.closePath()
          g.fill()
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.moveTo(p.x, p.y + p.h)
          g.lineTo(p.x + p.w / 2, p.y)
          g.lineTo(p.x + p.w, p.y + p.h)
          g.closePath()
          g.stroke()
          // Label: "HIGH"
          g.setFillStyle({ color: '#FFFFFF' })
          g.beginPath()
          g.roundRect(p.x + 2, p.y + p.h + 2, 10, 3, 1)
          g.fill()
          break

        case 'log':
          g.setFillStyle({ color: '#C0392B' })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 3)
          g.fill()
          g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
          g.beginPath()
          g.roundRect(p.x, p.y, p.w, p.h, 3)
          g.stroke()
          g.setStrokeStyle({ color: 'rgba(26,26,46,0.2)', width: 1 })
          g.beginPath()
          g.moveTo(p.x + 4, p.y + 3)
          g.lineTo(p.x + p.w - 4, p.y + 3)
          g.stroke()
          g.beginPath()
          g.moveTo(p.x + 4, p.y + p.h - 3)
          g.lineTo(p.x + p.w - 4, p.y + p.h - 3)
          g.stroke()
          // Label: "HIGH"
          g.setFillStyle({ color: '#FFFFFF' })
          g.beginPath()
          g.roundRect(p.x + 2, p.y + p.h + 2, 10, 3, 1)
          g.fill()
          break

        case 'gap':
          g.setStrokeStyle({ color: 'rgba(221, 58, 52, 0.6)', width: 2 })
          g.beginPath()
          g.moveTo(p.x, p.y)
          g.lineTo(p.x + p.w, p.y + p.h)
          g.stroke()
          g.beginPath()
          g.moveTo(p.x + p.w, p.y)
          g.lineTo(p.x, p.y + p.h)
          g.stroke()
          // Label: "HIGH"
          g.setFillStyle({ color: '#DD3A34' })
          g.beginPath()
          g.roundRect(p.x + 8, p.y + p.h + 2, 10, 3, 1)
          g.fill()
          break
      }
    })
  }, [tick])

  return <pixiGraphics draw={draw} />
}
