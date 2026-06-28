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
  const showLevelUp = useRef(0)
  const [tick, setTick] = useState(0)

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

    setTick((t) => t + 1)
  })

  const draw = useCallback((g) => {
    g.clear()
    const barY = XP_BAR_Y
    const fillWidth = Math.max(0, Math.min(displayXp.current, XP_BAR_WIDTH))

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
  }, [tick])

  return <pixiGraphics draw={draw} />
}
