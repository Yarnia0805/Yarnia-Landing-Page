import { extend, useTick, useApplication } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import { drawWoolly } from './drawWoolly'
import { drawButterfly } from './drawButterfly'
import { WOLLY_X, getWoollyY } from './constants'

extend({ Container, Graphics })

export default function WoollyPlayer({ woollyBox }) {
  const { app } = useApplication()
  const legPhase = useRef(0)
  const wingPhase = useRef(0)
  const butterfly = useRef({ x: 0, y: 0, cycle: 0 })
  const [woollyY, setWoollyY] = useState(0)

  useTick((ticker) => {
    const dt = ticker.deltaTime
    legPhase.current += 0.08 * dt
    wingPhase.current += 0.06 * dt
    const wy = getWoollyY(app?.screen?.height ?? window.innerHeight)
    setWoollyY(wy)

    // Update collision box ref
    woollyBox.current = { x: WOLLY_X + 8, y: wy + 8, w: 32, h: 44 }

    // butterfly orbit around Woolly
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
