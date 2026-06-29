import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import { drawRabbit } from './drawRabbit'
import { drawSquirrel, drawAcorn } from './drawSquirrel'
import { drawBird, drawPerch } from './drawBird'
import { drawFirefly } from './drawFirefly'
import { drawButterfly } from './drawButterfly'
import { getGroundY, WOLLY_X, TREE_DEPTHS } from './constants'
import { getTreeHeight } from './drawWorld'

extend({ Graphics })

/*
 * Creature layers (top to bottom):
 *   Canopy (treetop)   — canopy squirrels, perched birds
 *   Mid-air            — flying birds, butterflies
 *   Ground             — rabbits, ground birds
 *   Underbrush         — fireflies near ground
 */

function makeCanopySquirrels(w, h) {
  // Squirrels in treetops — attached to near oak trees
  const gy = getGroundY(h)
  const nearOak = TREE_DEPTHS.filter(d => d.type === 'oak' || d.type === 'bamboo')
  const count = 3
  return Array.from({ length: count }, (_, i) => {
    const spacing = w / count
    const treeX = i * spacing + spacing * 0.3 + Math.random() * spacing * 0.4
    const treeY = gy + getTreeHeight(3, 'oak') * 0.5 // mid-canopy
    return {
      type: 'canopySquirrel',
      x: treeX,
      y: treeY,
      s: 0.6 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      acornTimer: 100 + Math.floor(Math.random() * 140),
      acorns: [],
      treeAnchorX: treeX,
      swayPhase: Math.random() * Math.PI * 2,
    }
  })
}

function makeGroundSquirrels(w, h) {
  const gy = getGroundY(h)
  return Array.from({ length: 2 }, (_, i) => ({
    type: 'squirrel',
    x: w * 0.3 + i * w * 0.4,
    y: gy,
    s: 0.8 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2,
    acornTimer: 80 + Math.floor(Math.random() * 120),
    acorns: [],
  }))
}

function makeBirds(w, h) {
  const birds = []
  // High-flying birds (canopy level)
  for (let i = 0; i < 4; i++) {
    birds.push({
      type: 'bird',
      layer: 'high',
      flying: true,
      x: Math.random() * w,
      y: h * 0.08 + Math.random() * h * 0.10,
      s: 0.5 + Math.random() * 0.4,
      wingPhase: Math.random() * Math.PI * 2,
      vx: -0.4 - Math.random() * 0.5,
      vy: 0,
      perchTimer: 0,
    })
  }
  // Mid-altitude birds (among canopy)
  for (let i = 0; i < 3; i++) {
    birds.push({
      type: 'bird',
      layer: 'mid',
      flying: true,
      x: Math.random() * w,
      y: h * 0.18 + Math.random() * h * 0.10,
      s: 0.7 + Math.random() * 0.5,
      wingPhase: Math.random() * Math.PI * 2,
      vx: -0.3 - Math.random() * 0.4,
      vy: 0,
      perchTimer: 0,
    })
  }
  // Perched birds (in canopy)
  for (let i = 0; i < 3; i++) {
    birds.push({
      type: 'bird',
      layer: 'perched',
      flying: false,
      x: w * 0.15 + i * w * 0.3 + Math.random() * 30,
      y: h * 0.12 + Math.random() * h * 0.10,
      s: 0.7 + Math.random() * 0.4,
      wingPhase: 0,
      vx: 0,
      vy: 0,
      perchTimer: 100 + Math.floor(Math.random() * 200),
    })
  }
  return birds
}

function makeFireflies(w, h) {
  return Array.from({ length: 12 }, () => ({
    type: 'firefly',
    x: Math.random() * w,
    y: h * 0.35 + Math.random() * h * 0.40,
    s: 0.5 + Math.random() * 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.2,
    phase: Math.random() * Math.PI * 2,
    glowPhase: Math.random() * Math.PI * 2,
  }))
}

function makeButterflies(w, h) {
  const layers = [
    { yMin: 0.15, yMax: 0.25, count: 3 },  // canopy butterflies
    { yMin: 0.30, yMax: 0.45, count: 3 },  // mid-air butterflies
  ]
  const result = []
  layers.forEach((l) => {
    for (let i = 0; i < l.count; i++) {
      result.push({
        type: 'butterfly',
        x: Math.random() * w,
        y: h * l.yMin + Math.random() * h * (l.yMax - l.yMin),
        s: 0.7 + Math.random() * 0.6,
        wingPhase: Math.random() * Math.PI * 2,
        colorIdx: (result.length) % 5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        bobPhase: Math.random() * Math.PI * 2,
        centerX: Math.random() * w,
        centerY: h * l.yMin + Math.random() * h * (l.yMax - l.yMin),
      })
    }
  })
  return result
}

function makeRabbits(w, h) {
  const gy = getGroundY(h)
  return Array.from({ length: 2 }, (_, i) => ({
    type: 'rabbit',
    x: w * 0.2 + i * w * 0.35,
    y: gy,
    s: 0.8 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.3,
    dir: Math.random() > 0.5 ? 1 : -1,
    hopTimer: Math.floor(Math.random() * 120),
    hopping: false,
    hopPhase: 0,
    fleeTimer: 0,
  }))
}

function makeGroundBirds(w, h) {
  const gy = getGroundY(h)
  return Array.from({ length: 2 }, (_, i) => ({
    type: 'groundBird',
    x: w * 0.1 + i * w * 0.5 + Math.random() * 40,
    y: gy,
    s: 0.7 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2,
    hopTimer: Math.floor(Math.random() * 80),
    hopping: false,
    hopPhase: 0,
    fleeTimer: 0,
    dir: 1,
  }))
}

export default function ForestCreatures({ width, height, speedRef, woollyBox }) {
  const creatures = useRef(null)
  const cameraX = useRef(0)
  const [tick, setTick] = useState(0)

  if (!creatures.current) {
    creatures.current = [
      ...makeCanopySquirrels(width, height),
      ...makeGroundSquirrels(width, height),
      ...makeBirds(width, height),
      ...makeFireflies(width, height),
      ...makeButterflies(width, height),
      ...makeGroundBirds(width, height),
      ...makeRabbits(width, height),
    ]
  }

  useTick((ticker) => {
    const dt = ticker.deltaTime
    const mult = speedRef?.current ?? 1
    cameraX.current += 0.8 * mult * dt
    const creaturesArr = creatures.current

    for (let i = 0; i < creaturesArr.length; i++) {
      const c = creaturesArr[i]

      switch (c.type) {
        case 'canopySquirrel': {
          c.phase += 0.015 * dt
          c.swayPhase += 0.01 * dt
          // Gentle sway in tree
          c.x = c.treeAnchorX + Math.sin(c.swayPhase) * 3
          c.acornTimer -= dt
          if (c.acornTimer <= 0) {
            c.acornTimer = 120 + Math.floor(Math.random() * 160)
            c.acorns.push({
              x: c.x,
              y: c.y + 4,
              vy: -0.5,
              life: 80,
            })
          }
          for (let a = c.acorns.length - 1; a >= 0; a--) {
            const ac = c.acorns[a]
            ac.vy += 0.06 * dt
            ac.y += ac.vy * dt
            ac.x += 0.5 * dt
            ac.life -= dt
            if (ac.life <= 0 || ac.y > getGroundY(height)) {
              c.acorns.splice(a, 1)
            }
          }
          c.x -= 0.8 * mult * dt
          c.treeAnchorX -= 0.8 * mult * dt
          if (c.x < -40) { c.x = width + 40; c.treeAnchorX = width + 40 }
          break
        }
        case 'squirrel': {
          c.phase += 0.02 * dt
          c.acornTimer -= dt
          if (c.acornTimer <= 0) {
            c.acornTimer = 80 + Math.floor(Math.random() * 120)
            c.acorns.push({ x: c.x, y: c.y - 10, vy: -1, life: 60 })
          }
          for (let a = c.acorns.length - 1; a >= 0; a--) {
            const ac = c.acorns[a]
            ac.vy += 0.05 * dt
            ac.y += ac.vy * dt
            ac.life -= dt
            if (ac.life <= 0 || ac.y > c.y) c.acorns.splice(a, 1)
          }
          c.x -= 1.2 * mult * dt
          if (c.x < -40) c.x = width + 40
          break
        }
        case 'groundBird': {
          c.phase += 0.02 * dt
          const gbDist = Math.abs(c.x - WOLLY_X)
          if (gbDist < 150 && c.fleeTimer <= 0) {
            c.fleeTimer = 40 + Math.random() * 30
            c.dir = c.x < WOLLY_X ? -1 : 1
          }
          if (c.fleeTimer > 0) {
            c.fleeTimer -= dt
            c.x += c.dir * 3.5 * dt
            c.hopPhase += 0.2 * dt
          } else {
            c.hopTimer -= dt
            if (c.hopTimer <= 0) {
              c.hopping = !c.hopping
              c.hopTimer = c.hopping ? 15 + Math.random() * 15 : 50 + Math.random() * 60
              c.hopPhase = 0
            }
            if (c.hopping) {
              c.hopPhase += 0.15 * dt
              c.x += c.dir * 1.0 * dt
            }
          }
          c.x -= 0.8 * 0.5 * mult * dt
          if (c.x < -40) c.x = width + 40
          if (c.x > width + 40) c.x = -40
          break
        }
        case 'bird': {
          c.wingPhase += 0.08 * dt
          if (!c.flying && Math.abs(c.x - WOLLY_X) < 150) {
            c.flying = true
            c.perchTimer = 120 + Math.floor(Math.random() * 120)
            c.vx = c.layer === 'high' ? -0.5 - Math.random() * 0.7 : -0.3 - Math.random() * 0.5
          }
          if (c.flying) {
            c.x += c.vx * dt
            c.x -= 0.6 * (c.layer === 'high' ? 0.3 : 0.6) * mult * dt
            if (c.x < -40) {
              c.x = width + 40
              if (c.layer === 'high') c.y = height * 0.08 + Math.random() * height * 0.10
              else c.y = height * 0.18 + Math.random() * height * 0.10
            }
          } else {
            c.perchTimer -= dt
            if (c.perchTimer <= 0) {
              c.flying = true
              c.perchTimer = 180 + Math.floor(Math.random() * 240)
              c.vx = c.layer === 'high' ? -0.5 - Math.random() * 0.7 : -0.3 - Math.random() * 0.5
            }
            c.x -= 0.6 * mult * dt
            if (c.x < -40) { c.x = width + 40; c.flying = true }
          }
          break
        }
        case 'firefly': {
          c.x += c.vx * dt
          c.y += c.vy * dt
          c.phase += 0.01 * dt
          c.glowPhase += 0.03 * dt
          if (Math.random() < 0.02) c.vx += (Math.random() - 0.5) * 0.1
          if (Math.random() < 0.02) c.vy += (Math.random() - 0.5) * 0.1
          c.vx = Math.max(-0.5, Math.min(0.5, c.vx))
          c.vy = Math.max(-0.3, Math.min(0.3, c.vy))
          if (c.x < -20) c.x = width + 20
          if (c.x > width + 20) c.x = -20
          if (c.y < height * 0.3 || c.y > height * 0.8) c.vy *= -1
          c.x -= 0.8 * mult * dt
          break
        }
        case 'butterfly': {
          c.bobPhase += 0.03 * dt
          c.wingPhase += 0.06 * dt
          c.angle += 0.01 * dt
          c.x += Math.sin(c.angle) * 0.5 * dt + Math.cos(c.bobPhase * 0.7) * 0.3 * dt
          c.y += Math.cos(c.angle * 0.7) * 0.3 * dt + Math.sin(c.bobPhase * 0.5) * 0.2 * dt
          c.x -= 0.3 * mult * dt
          if (c.x < -30) { c.x = width + 30; c.y = height * 0.15 + Math.random() * height * 0.30 }
          if (c.x > width + 30) c.x = -30
          break
        }
        case 'rabbit': {
          c.phase += 0.02 * dt
          const rDist = Math.abs(c.x - WOLLY_X)
          if (rDist < 180 && c.fleeTimer <= 0) {
            c.fleeTimer = 60 + Math.random() * 40
            c.dir = c.x < WOLLY_X ? -1 : 1
          }
          if (c.fleeTimer > 0) {
            c.fleeTimer -= dt
            c.x += c.dir * 4 * dt
            c.hopPhase += 0.15 * dt
          } else {
            c.hopTimer -= dt
            if (c.hopTimer <= 0) {
              c.hopping = !c.hopping
              c.hopTimer = c.hopping ? 20 + Math.random() * 16 : 60 + Math.random() * 80
              if (c.hopping) { c.dir = Math.random() > 0.5 ? 1 : -1; c.hopPhase = 0 }
            }
            if (c.hopping) { c.hopPhase += 0.12 * dt; c.x += c.dir * 1.2 * dt }
          }
          c.x -= 0.8 * c.speed * mult * dt
          if (c.x < -40) c.x = width + 40
          if (c.x > width + 40) c.x = -40
          break
        }
      }
    }

    setTick((t) => t + 1)
  })

  const draw = useCallback((g) => {
    g.clear()
    const creaturesArr = creatures.current

    for (let i = 0; i < creaturesArr.length; i++) {
      const c = creaturesArr[i]

      switch (c.type) {
        case 'canopySquirrel':
          drawSquirrel(g, c.x, c.y, c.s, c.phase)
          for (const ac of c.acorns) drawAcorn(g, ac.x, ac.y, c.s)
          break
        case 'squirrel':
          drawSquirrel(g, c.x, c.y, c.s, c.phase)
          for (const ac of c.acorns) drawAcorn(g, ac.x, ac.y, c.s)
          break
        case 'groundBird':
        case 'bird':
          drawBird(g, c.x, c.y, c.s, c.wingPhase, !c.flying)
          break
        case 'firefly': {
          const glow = (Math.sin(c.glowPhase) * 0.5 + 0.5) * 0.8 + 0.2
          drawFirefly(g, c.x, c.y, c.s, glow)
          break
        }
        case 'butterfly':
          drawButterfly(g, c.x, c.y, c.wingPhase, c.colorIdx, c.s)
          break
        case 'rabbit':
          if (!c.hopping || c.hopPhase < 0.5) drawRabbit(g, c.x, c.y, c.s, c.phase)
          break
      }
    }
  }, [tick])

  return <pixiGraphics draw={draw} />
}
