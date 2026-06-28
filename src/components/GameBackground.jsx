import { useState, useEffect, useRef } from 'react'
import { Application } from '@pixi/react'
import WorldLayer from './game/WorldLayer'
import WoollyPlayer from './game/WoollyPlayer'
import PropsManager from './game/PropsManager'
import HUD from './game/HUD'
import Particles from './game/Particles'

export default function GameBackground() {
  const wrapperRef = useRef(null)
  const [wrapperEl, setWrapperEl] = useState(null)
  const [size, setSize] = useState({ width: 1920, height: 1080 })
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const woollyBox = useRef({ x: -999, y: -999, w: 32, h: 44 })
  const collectEvents = useRef([])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    setWrapperEl(el)
    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleCollect = (value, x, y) => {
    collectEvents.current.push({ x, y, spawned: false })
    setXp((prev) => {
      const next = prev + value
      if (next >= 100) {
        setLevel((l) => l + 1)
        return next - 100
      }
      return next
    })
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {wrapperEl && (
        <Application
          backgroundAlpha={0}
          resizeTo={wrapperEl}
          antialias={true}
          resolution={1}
        >
          <WorldLayer width={size.width} height={size.height} />
          <PropsManager onCollect={handleCollect} woollyBox={woollyBox} width={size.width} height={size.height} />
          <WoollyPlayer woollyBox={woollyBox} />
          <Particles collectEvents={collectEvents} width={size.width} height={size.height} />
          <HUD xp={xp} level={level} width={size.width} height={size.height} />
        </Application>
      )}
    </div>
  )
}
