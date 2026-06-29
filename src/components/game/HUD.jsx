import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import {
  XP_BAR_WIDTH, XP_BAR_HEIGHT, XP_BAR_X, XP_BAR_Y,
  TEXT_DARK, MAX_XP,
} from './constants'

extend({ Graphics })

export default function HUD({ xp, level, width, height }) {
  const displayXp = useRef(0)
  const prevXp = useRef(xp)
  const prevLevel = useRef(level)
  const showLevelUp = useRef(0)
  const burst = useRef([])
  const [soundOn, setSoundOn] = useState(false)
  const [tick, setTick] = useState(0)

  if (level > prevLevel.current) {
    showLevelUp.current = 90
    const cx = width / 2
    const cy = height * 0.4
    burst.current = Array.from({ length: 14 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 3
      return { x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1, life: 50, maxLife: 50, size: 1.5 + Math.random() * 3 }
    })
  }
  prevLevel.current = level
  if (xp < prevXp.current) {
    showLevelUp.current = 90
  }
  prevXp.current = xp

    useTick((ticker) => {
    const dt = ticker.deltaTime
    displayXp.current += ((xp / MAX_XP) * XP_BAR_WIDTH - displayXp.current) * 0.1 * dt

    if (showLevelUp.current > 0) {
      showLevelUp.current -= dt
    }

    burst.current.forEach((p) => {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += 0.08 * dt
      p.life -= 1 * dt
    })
    burst.current = burst.current.filter((p) => p.life > 0)

    setTick((t) => t + 1)
  })

  const draw = useCallback((g) => {
    g.clear()
    const barY = XP_BAR_Y
    const fillWidth = Math.max(0, Math.min(displayXp.current, XP_BAR_WIDTH))

    // Tutorial
    const tutX = 12
    const tutY = height - 110
    g.setFillStyle({ color: 'rgba(26,26,46,0.08)' })
    g.beginPath()
    g.roundRect(tutX, tutY, 130, 100, 8)
    g.fill()
    g.setStrokeStyle({ color: TEXT_DARK, width: 1 })
    g.beginPath()
    g.roundRect(tutX, tutY, 130, 100, 8)
    g.stroke()

    // Arrow icons
    const keySize = 20
    const gap = 6
    const baseX = tutX + 12
    const baseY = tutY + 12

    // ←
    g.setFillStyle({ color: 'rgba(26,26,46,0.7)' })
    g.beginPath()
    g.roundRect(baseX, baseY, keySize, keySize, 4)
    g.fill()
    g.setFillStyle({ color: '#FFFFFF' })
    g.beginPath()
    g.moveTo(baseX + 5, baseY + 10)
    g.lineTo(baseX + 15, baseY + 3)
    g.lineTo(baseX + 15, baseY + 17)
    g.closePath()
    g.fill()

    // →
    g.setFillStyle({ color: 'rgba(26,26,46,0.7)' })
    g.beginPath()
    g.roundRect(baseX + keySize + gap, baseY, keySize, keySize, 4)
    g.fill()
    g.setFillStyle({ color: '#FFFFFF' })
    g.beginPath()
    g.moveTo(baseX + keySize + gap + 15, baseY + 10)
    g.lineTo(baseX + keySize + gap + 5, baseY + 3)
    g.lineTo(baseX + keySize + gap + 5, baseY + 17)
    g.closePath()
    g.fill()

    // ↑
    g.setFillStyle({ color: 'rgba(26,26,46,0.7)' })
    g.beginPath()
    g.roundRect(baseX + (keySize + gap) * 2, baseY, keySize, keySize, 4)
    g.fill()
    g.setFillStyle({ color: '#FFFFFF' })
    g.beginPath()
    g.moveTo(baseX + (keySize + gap) * 2 + 10, baseY + 3)
    g.lineTo(baseX + (keySize + gap) * 2 + 3, baseY + 13)
    g.lineTo(baseX + (keySize + gap) * 2 + 17, baseY + 13)
    g.closePath()
    g.fill()

    // Labels
    g.setFillStyle({ color: 'rgba(26,26,46,0.5)' })
    g.beginPath()
    g.roundRect(tutX + 12, baseY + keySize + 6, 66, 16, 4)
    g.fill()
    g.setFillStyle({ color: '#FFFFFF', fontFamily: 'Arial', fontSize: 9, fontWeight: 'bold' })
    g.beginPath()
    // Text via simple rect blocks for "MOVE"
    g.setFillStyle({ color: '#FFFFFF' })
    g.beginPath()
    g.roundRect(tutX + 15, baseY + keySize + 8, 12, 4, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 27, baseY + keySize + 8, 4, 4, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 33, baseY + keySize + 8, 9, 4, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 44, baseY + keySize + 8, 5, 4, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 50, baseY + keySize + 8, 4, 4, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 55, baseY + keySize + 8, 10, 4, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 15, baseY + keySize + 14, 14, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 30, baseY + keySize + 14, 14, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 45, baseY + keySize + 14, 14, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 60, baseY + keySize + 14, 5, 3, 1)
    g.fill()

    // Collect hearts label
    g.setFillStyle({ color: 'rgba(26,26,46,0.5)' })
    g.beginPath()
    g.roundRect(tutX + 12, baseY + keySize + 24, 106, 14, 4)
    g.fill()
    g.setFillStyle({ color: '#FFFFFF' })
    g.beginPath()
    g.roundRect(tutX + 16, baseY + keySize + 27, 5, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 22, baseY + keySize + 27, 12, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 35, baseY + keySize + 27, 15, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 51, baseY + keySize + 27, 5, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 57, baseY + keySize + 27, 10, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 68, baseY + keySize + 27, 12, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 81, baseY + keySize + 27, 14, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 96, baseY + keySize + 27, 14, 3, 1)
    g.fill()
    g.beginPath()
    g.roundRect(tutX + 111, baseY + keySize + 27, 5, 3, 1)
    g.fill()

    g.setFillStyle({ color: 'rgba(26,26,46,0.12)' })
    g.beginPath()
    g.roundRect(XP_BAR_X, barY, XP_BAR_WIDTH, XP_BAR_HEIGHT, 6)
    g.fill()

    g.setFillStyle({ color: '#FDC631' })
    g.beginPath()
    g.roundRect(XP_BAR_X, barY, fillWidth, XP_BAR_HEIGHT, 6)
    g.fill()

    g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
    g.beginPath()
    g.roundRect(XP_BAR_X, barY, XP_BAR_WIDTH, XP_BAR_HEIGHT, 6)
    g.stroke()

    if (showLevelUp.current > 0) {
      const t = showLevelUp.current
      const flashAlpha = Math.min(t / 90, 0.3)
      g.setFillStyle({ color: `rgba(253, 198, 49, ${flashAlpha})` })
      g.rect(0, 0, width, height)
      g.fill()

      // "LEVEL UP!" block display
      const cx = width / 2
      const cy = height * 0.4
      const progress = 1 - t / 90
      const textAlpha = Math.min(t / 15, 1) * Math.min(t / 40, 1)

      const blockW = 10
      const blockH = 16
      const gap = 4
      const totalW = blockW * 8 + gap * 7
      const startX = cx - totalW / 2

      for (let i = 0; i < 8; i++) {
        const bx = startX + i * (blockW + gap)
        const by = cy - blockH / 2
        const brightness = Math.sin(i * 1.2 + t * 0.1) * 0.2 + 0.8
        g.setFillStyle({ color: `rgba(253, 198, 49, ${textAlpha * brightness})` })
        g.beginPath()
        g.roundRect(bx, by, blockW, blockH, 3)
        g.fill()
        g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
        g.beginPath()
        g.roundRect(bx, by, blockW, blockH, 3)
        g.stroke()
      }
    }

    // Level up burst particles
    burst.current.forEach((p) => {
      const alpha = p.life / p.maxLife
      g.setFillStyle({ color: `rgba(253, 198, 49, ${alpha})` })
      g.beginPath()
      g.circle(p.x, p.y, p.size * (0.3 + alpha * 0.7))
      g.fill()
    })
  }, [tick])

  return <pixiGraphics draw={draw} />
}





