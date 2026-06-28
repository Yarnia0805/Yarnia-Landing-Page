import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [gameOver, setGameOver] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const woollyBox = useRef({ x: -999, y: -999, w: 32, h: 44 })
  const obstaclesRef = useRef([])
  const collectEvents = useRef([])
  const speedRef = useRef(1)
  const deadRef = useRef(false)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    setWrapperEl(el)
    const update = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!wrapperEl) return
    const timer = setInterval(() => {
      const c = wrapperEl.querySelector('canvas')
      if (c) {
        c.style.width = '100%'
        c.style.height = '100%'
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [wrapperEl])

  const handleCollect = useCallback((value, x, y) => {
    if (deadRef.current) return
    collectEvents.current.push({ x, y, spawned: false })
    setXp((prev) => {
      if (value < 0 && prev <= 0) {
        deadRef.current = true
        speedRef.current = 0
        setGameOver(true)
        return 0
      }
      const next = Math.max(0, prev + value)
      if (next >= 100) {
        setLevel((l) => l + 1)
        return next - 100
      }
      return next
    })
  }, [])

  const handleRestart = () => {
    deadRef.current = false
    speedRef.current = 1
    obstaclesRef.current = []
    collectEvents.current = []
    woollyBox.current = { x: -999, y: -999, w: 32, h: 44 }
    setGameOver(false)
    setXp(0)
    setLevel(1)
    setGameKey((k) => k + 1)
  }

  useEffect(() => {
    if (!gameOver) return
    const t = setTimeout(handleRestart, 1500)
    return () => clearTimeout(t)
  }, [gameOver])

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
          key={gameKey}
          backgroundAlpha={0}
          resizeTo={wrapperEl}
          antialias={true}
          resolution={1}
        >
          <WorldLayer width={size.width} height={size.height} speedRef={speedRef} />
          <PropsManager onCollect={handleCollect} woollyBox={woollyBox} width={size.width} height={size.height} obstaclesRef={obstaclesRef} speedRef={speedRef} />
          <WoollyPlayer woollyBox={woollyBox} obstaclesRef={obstaclesRef} onSpeedChange={(v) => { speedRef.current = v }} dead={gameOver} />
          <Particles collectEvents={collectEvents} width={size.width} height={size.height} />
          <HUD xp={xp} level={level} width={size.width} height={size.height} />
        </Application>
      )}
      {gameOver && (
        <div
          onClick={handleRestart}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'auto',
            color: '#1A1A2E',
          }}
        >
          <div
            style={{
              fontSize: Math.min(size.width, size.height) * 0.1,
              fontWeight: 900,
              color: '#DD3A34',
              textShadow: '2px 2px 0 #FDC631, -2px -2px 0 #FDC631, 2px -2px 0 #FDC631, -2px 2px 0 #FDC631',
              marginBottom: 20,
            }}
          >
            GAME OVER
          </div>
        </div>
      )}
    </div>
  )
}
