import { extend, useTick, useApplication } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useCallback, useRef, useState, useEffect } from 'react'
import { drawWoolly } from './drawWoolly'
import { drawButterfly } from './drawButterfly'
import { WOLLY_X, getWoollyY } from './constants'

extend({ Container, Graphics })

const KEYS = { left: false, right: false, up: false, jump: false }

export default function WoollyPlayer({ woollyBox, obstaclesRef, onSpeedChange, dead }) {
  const { app } = useApplication()
  const legPhase = useRef(0)
  const wingPhase = useRef(0)
  const butterfly = useRef({ x: 0, y: 0, cycle: 0 })
  const [woollyY, setWoollyY] = useState(0)
  const vy = useRef(0)
  const jumping = useRef(false)
  const groundY = useRef(0)
  const autoEnabled = useRef(true)
  const jumpBuffer = useRef(0)

  // Reset auto on dead/restart
  useEffect(() => {
    if (dead) autoEnabled.current = false
  }, [dead])

  useEffect(() => {
    const onDown = (e) => {
      switch (e.code) {
        case 'ArrowLeft': KEYS.left = true; e.preventDefault(); break
        case 'ArrowRight': KEYS.right = true; e.preventDefault(); break
        case 'ArrowUp': KEYS.up = true; e.preventDefault(); break
        case 'Space':
        case 'Enter':
          e.preventDefault()
          if (!KEYS.jump) {
            KEYS.jump = true
            autoEnabled.current = false
            if (!jumping.current) { vy.current = -7; jumping.current = true }
          }
          break
      }
    }
    const onUp = (e) => {
      switch (e.code) {
        case 'ArrowLeft': KEYS.left = false; break
        case 'ArrowRight': KEYS.right = false; break
        case 'ArrowUp': KEYS.up = false; break
        case 'Space':
        case 'Enter': KEYS.jump = false; break
      }
    }
    const onTap = () => {
      autoEnabled.current = false
      if (!jumping.current) { vy.current = -7; jumping.current = true }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('click', onTap)
    window.addEventListener('touchstart', onTap, { passive: false })
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('click', onTap)
      window.removeEventListener('touchstart', onTap)
    }
  }, [])

  useTick((ticker) => {
    const dt = ticker.deltaTime

    // Freeze everything when dead
    if (dead) {
      if (onSpeedChange) onSpeedChange(0)
      return
    }

    groundY.current = getWoollyY(app?.screen?.height ?? window.innerHeight)

    let speedMult = 1
    if (KEYS.right) speedMult = 10.0
    if (KEYS.left) speedMult = 0.1
    if (onSpeedChange) onSpeedChange(speedMult)

    if (KEYS.up && !jumping.current) {
      autoEnabled.current = false
      vy.current = -7
      jumping.current = true
    }

    // Auto-play
    if (autoEnabled.current && obstaclesRef?.current) {
      // Scan all obstacles ahead
      let nearest = null
      let nearestDist = Infinity
      for (const obs of obstaclesRef.current) {
        if (obs.collected) continue
        const dist = obs.x - WOLLY_X
        if (dist > -10 && dist < nearestDist) {
          nearestDist = dist
          nearest = obs
        }
      }

      if (nearest) {
        // Steady speed ~1.3-1.5 for consistent gameplay
        const autoSpeed = nearestDist > 300 ? 1.5 : 1.3
        onSpeedChange(autoSpeed)

        // Precise jump timing
        if (!jumping.current) {
          const isObstacle = nearest.type === 'spike' || nearest.type === 'log' || nearest.type === 'gap'
          // LOW obstacles (spike/log/gap on ground) need jump
          // HIGH items (book/star floating above) do NOT need jump
          if (isObstacle) {
            if (nearestDist > 25 && nearestDist < 80) {
              vy.current = -7.5
              jumping.current = true
              jumpBuffer.current = 5
            }
          }
        }
      } else {
        onSpeedChange(1.2)
      }
    }

    // Decrement jump buffer
    if (jumpBuffer.current > 0) jumpBuffer.current -= dt

    vy.current += 0.35 * dt
    const nextY = woollyY + vy.current * dt
    if (nextY >= groundY.current) {
      setWoollyY(groundY.current)
      vy.current = 0
      jumping.current = false
    } else {
      setWoollyY(nextY)
    }

    legPhase.current = jumping.current ? 0 : legPhase.current + 0.08 * dt
    wingPhase.current += 0.06 * dt

    const wy = woollyY
    woollyBox.current = { x: WOLLY_X + 8, y: wy + 10, w: 32, h: 40 }

    butterfly.current.cycle += 0.025 * dt
    butterfly.current.x = WOLLY_X + 22 + Math.sin(butterfly.current.cycle * 0.6) * 18
    butterfly.current.y = wy - 10 + Math.sin(butterfly.current.cycle) * 12
  })

  const draw = useCallback((g) => {
    g.clear()
    drawButterfly(g, butterfly.current.x, butterfly.current.y, wingPhase.current)
    drawWoolly(g, WOLLY_X, woollyY, Math.sin(legPhase.current))
  }, [woollyY])

  return <pixiGraphics draw={draw} />
}
