# Kế hoạch: Dynamic Game Background (Yarnia) — PixiJS Edition

## 1. Tổng quan

Thay thế background tĩnh bằng **game side-scrolling 2D** dùng **PixiJS v8** render WebGL. Nhân vật: **Woolly W1 (Classic)** — cừu fluffy khăn vàng + cuộn len.

Phong cách: storybook pastel, nét mềm. Chạy dưới mọi sections.

---

## 2. Công nghệ

| Layer | Công nghệ | Version | Lý do |
|-------|-----------|---------|-------|
| Render engine | **PixiJS** | `pixi.js@^8.6.6` | WebGL 2D renderer, GPU tăng tốc, particle system, filter built-in |
| React bridge | **@pixi/react** | `^8.0.5` | PixiJS scene trong JSX, React 19 support |
| Animation loop | PixiJS **Ticker** | built-in | Auto RAF, deltaTime, pause khi tab ẩn |
| Particle | PixiJS **ParticleContainer** | built-in | 100+ object performance |
| Filter | PixiJS **BlurFilter, GlowFilter** | built-in | XP glow, book collect hiệu ứng |
| Graphics | PixiJS **Graphics** | built-in | Vẽ shape Woolly + terrain |
| Sprite | PixiJS **Sprite** | built-in | Cho texture nếu sau này có sprite sheet |

**Không dùng thêm:** Raw Canvas (bỏ), Kaplay (game engine nặng), Lottie (animation tĩnh).

---

## 3. Kiến trúc React + PixiJS

```
App.jsx
└── <div className="min-h-screen">
    ├── <GameBackground />           ← fixed, zIndex:0, pointer-events:none
    │   └── <Application>           ← @pixi/react, resizeTo: window
    │       ├── <World />           ← sky gradient, hills, ground (Graphics)
    │       ├── <PropsManager />    ← books, stars spawn (ParticleContainer)
    │       ├── <WoollyPlayer />    ← nhân vật (Graphics + ticker)
    │       └── <HUD />             ← XP bar, level text (Graphics)
    └── <div style={{ zIndex: 1 }}>
        ├── <Hero />
        ├── <Stats />
        └── ...
```

---

## 4. @pixi/react v8 API Pattern

```jsx
import { Application, extend, useTick, useApplication } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'

extend({ Container, Graphics })

function GameBackground() {
  return (
    <Application
      backgroundAlpha={0}            // transparent nền
      resizeTo={something}           // full viewport
      antialias={true}
      resolution={window.devicePixelRatio || 1}
    >
      <WoollyPlayer />
    </Application>
  )
}

function WoollyPlayer() {
  const { app } = useApplication()
  const draw = useCallback((g) => {
    g.clear()
    g.setFillStyle({ color: '#F4F3ED' })
    // ... vẽ Woolly paths
  }, [])

  useTick((ticker) => {
    // game loop mỗi frame — update position, collision
    playerX += 1.2 * ticker.deltaTime
  })

  return <pixiGraphics draw={draw} />
}
```

---

## 5. Cấu trúc thư mục

```
src/components/
├── backgrounds/              ← Background cũ (giữ nguyên)
│   ├── PixelSnow.jsx
│   ├── GridMotion.jsx
│   └── FaultyTerminal.jsx
│
├── game/                     ← PixiJS game engine (mới)
│   ├── constants.js          ← Brand colors, kích thước Woolly
│   ├── drawWoolly.js         ← Hàm vẽ Woolly W1 (Graphics paths)
│   ├── drawWorld.js          ← Hàm vẽ sky gradient, hills, ground
│   ├── drawCloud.js          ← Hàm vẽ mây
│   ├── PropsManager.jsx       ← Book + stars spawn (ParticleContainer)
│   ├── WoollyPlayer.jsx       ← Nhân vật (useTick, draw, animation states)
│   ├── WorldLayer.jsx         ← Scene background (pixiGraphics)
│   └── HUD.jsx               ← XP bar + level text
│
├── GameBackground.jsx        ← Container Application (cùng cấp Hero/Stats...)
├── Hero.jsx
├── Stats.jsx
└── ...
```

**Khác biệt với plan cũ:**
- Không `engine.js` — PixiJS Ticker handle loop tự động
- Không `player.js` — tách thành `WoollyPlayer.jsx` (component React + useTick)
- Thêm `drawWoolly.js`, `drawWorld.js`, `drawCloud.js` — pure function draw
- `PropsManager.jsx` — React component quản lý particle lifecycle

---

## 6. Game Loop (PixiJS Ticker)

```js
// WoollyPlayer.jsx
useTick((ticker) => {
  const dt = ticker.deltaTime  // normalized delta (~1 = 60fps)

  // Camera
  cameraX += 0.8 * dt

  // Woolly animation frame
  runFrame = (runFrame + runSpeed * dt) % 4

  // Collision với nearest prop
  checkPickup()

  // Update HUD
  xpBar.targetWidth = (xp / maxXP) * XP_BAR_WIDTH
})
```

PixiJS tự động:
- RAF loop (không cần requestAnimationFrame)
- Pause khi tab ẩn (Page Visibility)
- Delta time smoothing

---

## 7. Dữ liệu nhân vật (từ SVG W1)

Woolly W1 gồm các shape Canvas:
- **Body**: path bezier fluffy (màu `#F4F3ED`, stroke `#1A1A2E`)
- **Face**: ellipse (`#EDE9DC`)
- **Ears**: 2 paths rounded (`#F279A6` inner)
- **Eyes**: arc curves happy squint
- **Nose**: ellipse nhỏ (`#C4785A`)
- **Smile**: arc curve
- **Legs**: 2 rounded rects
- **Scarf**: thick stroke (`#FDC631`)
- **Yarn ball**: circle (`#FDC631`) + lines
- **Arm**: thick stroke bezier

**Animation leg run:** Chân xoay theo sin wave → nhấc lên/xuống.

---

## 8. Các Phase

### Phase 1: PixiJS Scene + Woolly (MVP)
- [ ] Cài `pixi.js@^8` + `@pixi/react`
- [ ] `GameBackground.jsx` — Application transparent full viewport
- [ ] `constants.js` — brand colors
- [ ] `drawWoolly.js` — vẽ Woolly W1 standing
- [ ] `drawWorld.js` — sky gradient, 2 hills, ground line
- [ ] `WoollyPlayer.jsx` — ticker + leg animation + camera scroll
- [ ] `WorldLayer.jsx` — drawWorld gắn vào Application
- [ ] App.jsx — replace background fixed

### Phase 2: Props + HUD
- [ ] `drawCloud.js` — mây trôi parallax
- [ ] `PropsManager.jsx` — sách spawn, di chuyển, collision
- [ ] `HUD.jsx` — XP bar
- [ ] Collect animation (glow + scale)
- [ ] Level text

### Phase 3: Polish
- [ ] Particle (bướm, lá, sao) — ParticleContainer
- [ ] Glow filter khi collect
- [ ] Level up animation
- [ ] Auto restart terrain pattern

---

## 9. Cài đặt

```bash
npm install pixi.js@^8 @pixi/react
```

Không cần cấu hình thêm — Vite build PixiJS bundle OK.

---

## 10. Performance

| Metric | PixiJS (WebGL) | Raw Canvas |
|--------|----------------|------------|
| Bundle | ~450 KB gzip | 0 KB |
| Particle 100+ | ✅ ParticleContainer | Phải tự optimize |
| Glow filter | ✅ Built-in BlurFilter | Phải canvas hacks |
| Retina | ✅ `resolution` prop | Phải thủ công |
| Sprite sheet | ✅ Native | Phải tự decode |
| Tab hidden | ✅ Auto pause | Phải tự check |
| Mobile GPU | ✅ WebGL | CPU fallback |

PixiJS nặng hơn nhưng **WebGL GPU acceleration** + built-in filter/particle bù lại.

---

## 11. Phase 1 — Foundation (MVP Scene)

Mục tiêu: PixiJS Application chạy ngầm dưới landing page, Woolly đứng + chạy tại chỗ + terrain cuộn.

### 11.1 Cài đặt

```bash
npm install pixi.js@^8 @pixi/react
```

Check: `package.json` có `pixi.js` và `@pixi/react`.

### 11.2 src/components/game/constants.js (file mới)

Export tất cả constants:

```js
// Brand colors
export const WOLLY_BODY = '#F4F3ED'
export const WOLLY_FACE = '#EDE9DC'
export const WOLLY_EAR_INNER = '#F279A6'
export const WOLLY_NOSE = '#C4785A'
export const WOLLY_SCARF = '#FDC631'
export const WOLLY_YARN = '#FDC631'
export const TEXT_DARK = '#1A1A2E'

// Sizing
export const WOLLY_WIDTH = 64
export const WOLLY_HEIGHT = 80

// Y position — ground at 75% viewport height
export const getGroundY = (height) => height * 0.75
export const getWoollyY = (height) => getGroundY(height) - WOLLY_HEIGHT

// Woolly screen X (fixed, camera scrolls terrain instead)
export const WOLLY_X = 60

// Terrain
export const SKY_TOP = '#C9E8F7'
export const SKY_BOTTOM = '#F4F3ED'
export const HILL_COLORS = ['rgba(146,115,228,0.12)', 'rgba(50,128,69,0.08)']
export const GROUND_LINE = '#1A1A2E'
export const GROUND_LINE_Y = 4

// Scroll speed (pixels per tick)
export const SCROLL_SPEED_BASE = 0.8

// Props
export const PROP_SPAWN_INTERVAL = 120 // frames between spawns
export const BOOK_WIDTH = 14
export const BOOK_HEIGHT = 18
export const STAR_RADIUS = 8

// HUD
export const XP_BAR_WIDTH = 200
export const XP_BAR_HEIGHT = 12
export const XP_BAR_X = 20
export const XP_BAR_Y = 20
export const MAX_XP = 100

// Cloud
export const CLOUD_COUNT = 4
export const CLOUD_SPEED_MULTIPLIER = 0.15
```

### 11.3 src/components/game/drawWoolly.js (file mới)

Pure function vẽ Woolly W1 từ SVG paths sang PixiJS Graphics calls:

```js
import { TEXT_DARK, WOLLY_BODY, WOLLY_FACE, WOLLY_EAR_INNER,
         WOLLY_NOSE, WOLLY_SCARF, WOLLY_YARN } from './constants'

export function drawWoolly(g, x, y, legSin) {
  g.clear()

  // === BODY ===
  g.setFillStyle({ color: WOLLY_BODY })
  g.setStrokeStyle({ color: TEXT_DARK, width: 2 })
  g.moveTo(x + 12, y + 20)
  g.bezierCurveTo(x + 10, y + 40, x + 15, y + 60, x + 32, y + 60)
  g.bezierCurveTo(x + 49, y + 60, x + 54, y + 40, x + 52, y + 20)
  g.fill()
  g.stroke()

  // === FACE ===
  g.setFillStyle({ color: WOLLY_FACE })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.ellipse(x + 32, y + 28, 16, 14)
  g.fill()
  g.stroke()

  // === EARS ===
  // Left ear
  g.setFillStyle({ color: WOLLY_FACE })
  g.ellipse(x + 18, y + 18, 6, 8)
  g.fill()
  g.stroke()
  g.setFillStyle({ color: WOLLY_EAR_INNER })
  g.ellipse(x + 18, y + 19, 3, 4)
  g.fill()

  // Right ear
  g.setFillStyle({ color: WOLLY_FACE })
  g.ellipse(x + 46, y + 18, 6, 8)
  g.fill()
  g.stroke()
  g.setFillStyle({ color: WOLLY_EAR_INNER })
  g.ellipse(x + 46, y + 19, 3, 4)
  g.fill()

  // === EYES (happy squint ^ ^) ===
  g.setStrokeStyle({ color: TEXT_DARK, width: 2 })
  g.moveTo(x + 24, y + 27)
  g.lineTo(x + 27, y + 24)
  g.lineTo(x + 30, y + 27)
  g.stroke()
  g.moveTo(x + 34, y + 27)
  g.lineTo(x + 37, y + 24)
  g.lineTo(x + 40, y + 27)
  g.stroke()

  // === NOSE ===
  g.setFillStyle({ color: WOLLY_NOSE })
  g.ellipse(x + 32, y + 32, 3, 2)
  g.fill()

  // === SMILE ===
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.arc(x + 32, y + 36, 5, 0.2, Math.PI - 0.2)
  g.stroke()

  // === SCARF ===
  g.setFillStyle({ color: WOLLY_SCARF })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.roundRect(x + 14, y + 42, 36, 6, 2)
  g.fill()
  g.stroke()
  // Scarf tails
  g.moveTo(x + 18, y + 48)
  g.lineTo(x + 16, y + 56)
  g.moveTo(x + 24, y + 48)
  g.lineTo(x + 22, y + 54)
  g.stroke()

  // === YARN BALL ===
  g.setFillStyle({ color: WOLLY_YARN })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.circle(x + 44, y + 52, 6)
  g.fill()
  g.stroke()
  // Yarn cross lines
  g.moveTo(x + 40, y + 50)
  g.lineTo(x + 48, y + 54)
  g.moveTo(x + 42, y + 54)
  g.lineTo(x + 46, y + 48)
  g.stroke()

  // === ARM ===
  g.setStrokeStyle({ color: TEXT_DARK, width: 3 })
  g.moveTo(x + 8, y + 44)
  g.bezierCurveTo(x + 4, y + 48, x + 0, y + 52, x - 2, y + 54)
  g.stroke()

  // === LEGS ===
  const legSwing = legSin * 15 // degrees
  const rad = legSwing * Math.PI / 180

  // Left leg
  g.setFillStyle({ color: TEXT_DARK })
  const lx1 = x + 18, ly1 = y + 56
  const lcx = lx1 + 4, lcy = ly1 + 6
  const rotLx = (lx1 - lcx) * Math.cos(rad) - (ly1 - lcy) * Math.sin(rad) + lcx
  const rotLy = (lx1 - lcx) * Math.sin(rad) + (ly1 - lcy) * Math.cos(rad) + lcy
  g.roundRect(rotLx, rotLy, 8, 12, 3)
  g.fill()

  // Right leg
  const negRad = -legSin * 15 * Math.PI / 180
  const rx1 = x + 38, ry1 = y + 56
  const rcx = rx1 + 4, rcy = ry1 + 6
  const rotRx = (rx1 - rcx) * Math.cos(negRad) - (ry1 - rcy) * Math.sin(negRad) + rcx
  const rotRy = (rx1 - rcx) * Math.sin(negRad) + (ry1 - rcy) * Math.cos(negRad) + rcy
  g.roundRect(rotRx, rotRy, 8, 12, 3)
  g.fill()
}
```

### 11.4 src/components/game/drawWorld.js (file mới)

```js
import { SKY_TOP, SKY_BOTTOM, HILL_COLORS, GROUND_LINE,
         GROUND_LINE_Y, getGroundY } from './constants'

export function drawWorld(g, width, height, cameraX) {
  g.clear()
  const groundY = getGroundY(height)

  // === SKY GRADIENT ===
  // Top portion
  g.setFillStyle({ color: SKY_TOP })
  g.rect(0, 0, width, groundY)
  g.fill()
  // Bottom portion (lighter)
  g.setFillStyle({ color: SKY_BOTTOM })
  g.rect(0, groundY * 0.6, width, groundY * 0.4)
  g.fill()

  // === HILLS ===
  const hillOffset1 = (cameraX * 0.3) % (width * 2)
  const hillOffset2 = (cameraX * 0.5) % (width * 2)

  // Hill 1
  g.setFillStyle({ color: HILL_COLORS[0] })
  g.moveTo(-hillOffset1, groundY)
  g.bezierCurveTo(width * 0.2 - hillOffset1, groundY - 120,
                   width * 0.4 - hillOffset1, groundY - 100,
                   width * 0.6 - hillOffset1, groundY)
  g.lineTo(width * 0.6 - hillOffset1, groundY)
  g.closePath()
  g.fill()

  // Hill 1 (second copy for seamless loop)
  g.moveTo(width * 0.6 - hillOffset1, groundY)
  g.bezierCurveTo(width * 0.8 - hillOffset1, groundY - 120,
                   width * 1.0 - hillOffset1, groundY - 100,
                   width * 1.2 - hillOffset1, groundY)
  g.lineTo(width * 1.2 - hillOffset1, groundY)
  g.closePath()
  g.fill()

  // Hill 2
  g.setFillStyle({ color: HILL_COLORS[1] })
  g.moveTo(width * 0.3 - hillOffset2, groundY)
  g.bezierCurveTo(width * 0.5 - hillOffset2, groundY - 80,
                   width * 0.7 - hillOffset2, groundY - 60,
                   width * 0.9 - hillOffset2, groundY)
  g.lineTo(width * 0.9 - hillOffset2, groundY)
  g.closePath()
  g.fill()

  // Hill 2 (second copy)
  g.moveTo(width * 0.9 - hillOffset2, groundY)
  g.bezierCurveTo(width * 1.1 - hillOffset2, groundY - 80,
                   width * 1.3 - hillOffset2, groundY - 60,
                   width * 1.5 - hillOffset2, groundY)
  g.lineTo(width * 1.5 - hillOffset2, groundY)
  g.closePath()
  g.fill()

  // === GROUND LINE ===
  g.setFillStyle({ color: GROUND_LINE })
  g.rect(0, groundY, width, GROUND_LINE_Y)
  g.fill()
}
```

### 11.5 src/components/game/drawCloud.js (file mới)

```js
import { TEXT_DARK } from './constants'

export function drawCloud(g, x, y, scale = 1) {
  g.setFillStyle({ color: 'rgba(255, 255, 255, 0.5)' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.5 })
  g.ellipse(x, y, 30 * scale, 12 * scale)
  g.fill()
  g.stroke()
  g.ellipse(x + 20 * scale, y - 6 * scale, 20 * scale, 10 * scale)
  g.fill()
  g.stroke()
  g.ellipse(x - 18 * scale, y - 4 * scale, 18 * scale, 9 * scale)
  g.fill()
  g.stroke()
  g.ellipse(x + 8 * scale, y - 10 * scale, 14 * scale, 8 * scale)
  g.fill()
  g.stroke()
}
```

### 11.6 src/components/game/WoollyPlayer.jsx (file mới)

```jsx
import { extend, useTick, useApplication } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import { drawWoolly } from './drawWoolly'
import { WOLLY_X, getGroundY, getWoollyY } from './constants'

extend({ Container, Graphics })

export default function WoollyPlayer({ onCollect }) {
  const { app } = useApplication()
  const legPhase = useRef(0)
  const [woollyY, setWoollyY] = useState(() => getWoollyY(app.screen.height))

  useTick((ticker) => {
    const dt = ticker.deltaTime
    legPhase.current += 0.08 * dt
    setWoollyY(getWoollyY(app.screen.height))
  })

  const draw = useCallback((g) => {
    g.clear()
    drawWoolly(g, WOLLY_X, woollyY, Math.sin(legPhase.current))
  }, [woollyY])

  return <pixiGraphics draw={draw} />
}
```

### 11.7 src/components/game/WorldLayer.jsx (file mới)

```jsx
import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback, useRef } from 'react'
import { drawWorld } from './drawWorld'
import { drawCloud } from './drawCloud'
import { CLOUD_COUNT, CLOUD_SPEED_MULTIPLIER } from './constants'

extend({ Graphics })

export default function WorldLayer({ width, height }) {
  const cameraX = useRef(0)
  const clouds = useRef(
    Array.from({ length: CLOUD_COUNT }, (_, i) => ({
      x: (width / CLOUD_COUNT) * i + Math.random() * 100,
      y: 40 + Math.random() * (height * 0.35),
      scale: 0.6 + Math.random() * 0.8,
    }))
  )

  useTick((ticker) => {
    const dt = ticker.deltaTime
    cameraX.current += 0.8 * dt
    // Move clouds
    clouds.current.forEach((c) => {
      c.x -= 0.3 * dt
      if (c.x < -80) {
        c.x = width + 40
        c.y = 40 + Math.random() * (height * 0.35)
      }
    })
  })

  const drawWorldFn = useCallback((g) => {
    g.clear()
    drawWorld(g, width, height, cameraX.current)
    // Draw clouds
    clouds.current.forEach((c) => {
      drawCloud(g, c.x, c.y, c.scale)
    })
  }, [width, height])

  return <pixiGraphics draw={drawWorldFn} />
}
```

### 11.8 src/components/GameBackground.jsx (file mới)

```jsx
import { useState, useEffect } from 'react'
import { Application } from '@pixi/react'
import WorldLayer from './game/WorldLayer'
import WoollyPlayer from './game/WoollyPlayer'

export default function GameBackground() {
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))

  useEffect(() => {
    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Application
        backgroundAlpha={0}
        resizeTo={window}
        antialias={true}
        resolution={Math.min(window.devicePixelRatio || 1, 2)}
      >
        <WorldLayer width={size.width} height={size.height} />
        <WoollyPlayer />
      </Application>
    </div>
  )
}
```

### 11.9 Sửa src/App.jsx

Replace background div với GameBackground:

```jsx
import GameBackground from './components/GameBackground'

// Trong return:
// Xóa dòng:
// <div style={{ position: 'fixed', inset: 0, zIndex: 0, ...}} />
// Thay bằng:
<GameBackground />
```

### 11.10 Kiểm tra Phase 1

- [ ] `npm run dev` không lỗi import/lỗi WebGL
- [ ] Canvas transparent background
- [ ] Woolly xuất hiện bên trái, leg chuyển động
- [ ] Terrain (sky gradient + hills + ground line) cuộn trái
- [ ] Scroll page — Woolly + terrain fixed background
- [ ] Resize window — canvas tự adjust

### 11.11 Phase 1 mở rộng — Background details

Sau khi MVP chạy, thêm các chi tiết làm background sống động hơn, vẫn giữ trong Phase 1 vì không phụ thuộc vào Props/HUD.

#### 11.11.1 Grass blades nhấp nhô

Thêm hàng grass nhỏ dọc ground line. Không cần file mới — thêm vào `drawWorld.js`:

```js
// drawWorld.js — sau GROUND LINE
// ── GRASS BLADES ──
g.setStrokeStyle({ color: TEXT_DARK, width: 1 })
for (let i = 0; i < width; i += 18) {
  const bladeX = (i - (cameraX * 0.6) % 18 + width) % width
  const sway = Math.sin(i * 0.3 + cameraX * 0.02) * 2
  g.beginPath()
  g.moveTo(bladeX, groundY)
  g.lineTo(bladeX + sway, groundY - 6 - Math.sin(i * 0.5) * 2)
  g.stroke()
}
```

**Kết quả:** Hàng cỏ dao động theo gió khi camera scroll.

#### 11.11.2 Distant trees / bushes (silhouette)

Vài bụi cây nhỏ ở xa, parallax chậm. Thêm vào `drawWorld.js`:

```js
// ── TREES / BUSHES (silhouette, far background) ──
drawBush(g, width * 0.1 - (cameraX * 0.1) % (width * 0.8), groundY, 1)
drawBush(g, width * 0.4 - (cameraX * 0.1) % (width * 0.8), groundY, 1.2)
drawBush(g, width * 0.7 - (cameraX * 0.1) % (width * 0.8), groundY, 0.8)
drawBush(g, width * 0.95 - (cameraX * 0.1) % (width * 0.8), groundY, 1.1)

function drawBush(g, x, groundY, scale) {
  g.setFillStyle({ color: 'rgba(26,26,46,0.06)' })
  g.circle(x, groundY - 12 * scale, 10 * scale)
  g.fill()
  g.circle(x + 8 * scale, groundY - 10 * scale, 8 * scale)
  g.fill()
  g.circle(x - 6 * scale, groundY - 8 * scale, 6 * scale)
  g.fill()
}
```

**Kết quả:** Bụi cây xa tĩnh lặng, parallax chậm, chiều sâu.

#### 11.11.3 Small flowers / dots trên ground

Thêm chấm màu nhỏ rải rác trên ground, sinh động:

```js
// drawWorld.js — trước GROUND LINE
// ── FLOWER DOTS ──
const flowerPositions = [
  { x: 0.15, color: '#F279A6' },
  { x: 0.35, color: '#FDC631' },
  { x: 0.55, color: '#F279A6' },
  { x: 0.75, color: '#9273E4' },
  { x: 0.9,  color: '#FDC631' },
]
flowerPositions.forEach((f) => {
  const fx = (f.x * width - (cameraX * 0.7) % width + width) % width
  g.setFillStyle({ color: f.color })
  g.circle(fx, groundY - 2, 2)
  g.fill()
})
```

**Kết quả:** Chấm hoa nhỏ màu pastel nhấp nhô trên ground.

#### 11.11.4 Butterfly ambient

Một con bướm bay quanh Woolly. File mới: `drawButterfly.js`

```js
// drawButterfly.js
import { TEXT_DARK } from './constants'

export function drawButterfly(g, x, y, wingPhase) {
  const wing = Math.sin(wingPhase) * 0.5 + 0.5 // 0..1
  g.setFillStyle({ color: '#F279A6' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.8 })
  // left wing
  g.ellipse(x - 4, y, 4 * (0.3 + wing * 0.7), 3)
  g.fill()
  g.stroke()
  // right wing
  g.ellipse(x + 4, y, 4 * (0.3 + wing * 0.7), 3)
  g.fill()
  g.stroke()
  // body
  g.setFillStyle({ color: TEXT_DARK })
  g.ellipse(x, y, 1.5, 3)
  g.fill()
}
```

Trong `WoollyPlayer.jsx` hoặc WorldLayer, thêm butterfly state:
```js
const butterfly = useRef({
  x: WOLLY_X + 20,
  y: 0,
  phase: 0,
  angle: 0,
})

useTick((ticker) => {
  const dt = ticker.deltaTime
  // Bướm bay vòng quanh Woolly
  butterfly.current.phase += 0.05 * dt
  butterfly.current.x += Math.sin(butterfly.current.phase * 0.5) * 0.5
  butterfly.current.y = woollyY - 15 + Math.sin(butterfly.current.phase) * 10
})
```

#### 11.11.5 Sparkle / dust particles nhẹ

Ambient sparkle nhỏ bay lơ lửng trong không khí. File mới: `drawSparkle.js`

```js
// drawSparkle.js
export function drawSparkle(g, x, y, size, alpha) {
  g.setFillStyle({ color: `rgba(253, 198, 49, ${alpha})` })
  g.circle(x, y, size)
  g.fill()
}
```

Quản lý trong WorldLayer — mảng 8-10 particles ngẫu nhiên:
- Vị trí random trong viewport
- Di chuyển chậm lên trên + drift ngang
- Khi ra khỏi màn hình → reset về bottom
- Alpha fade in/out theo sin

```js
const sparkles = useRef(
  Array.from({ length: 10 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: -0.1 - Math.random() * 0.2,
    size: 1 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
  }))
)

// Trong useTick:
sparkles.current.forEach((s) => {
  s.x += s.vx * dt
  s.y += s.vy * dt
  s.phase += 0.02 * dt
  if (s.y < -10) { s.y = height + 10; s.x = Math.random() * width }
})
```

Vẽ trong draw callback:
```js
sparkles.current.forEach((s) => {
  const alpha = (Math.sin(s.phase) * 0.5 + 0.5) * 0.4
  g.setFillStyle({ color: `rgba(253, 198, 49, ${alpha})` })
  g.circle(s.x, s.y, s.size)
  g.fill()
})
```

#### 11.11.6 Bookshelf / story elements trong background (optional xa)

Vài cuốn sách dựng đứng ở xa như silhouette, parallax chậm:

```js
// drawWorld.js
function drawBookshelfSilhouette(g, x, groundY, scale) {
  g.setFillStyle({ color: 'rgba(26,26,46,0.05)' })
  // 3 cuốn sách đứng cạnh nhau
  g.roundRect(x, groundY - 20 * scale, 5 * scale, 20 * scale, 1)
  g.fill()
  g.roundRect(x + 6 * scale, groundY - 16 * scale, 4 * scale, 16 * scale, 1)
  g.fill()
  g.roundRect(x + 11 * scale, groundY - 22 * scale, 5 * scale, 22 * scale, 1)
  g.fill()
}
```

Vị trí: rải rác 2-3 chỗ ở xa, parallax `cameraX * 0.05`.

#### 11.11.7 Tổng kết Phase 1 mở rộng

| Tính năng | File sửa | Dòng | Mức độ |
|-----------|----------|------|--------|
| Grass blades | drawWorld.js | ~10 dòng | Dễ |
| Bushes | drawWorld.js | ~15 dòng | Dễ |
| Flower dots | drawWorld.js | ~12 dòng | Dễ |
| Butterfly | drawButterfly.js (mới) + WoollyPlayer.jsx | ~20 + ~10 dòng | Trung bình |
| Sparkle dust | drawSparkle.js (mới) + WorldLayer.jsx | ~10 + ~20 dòng | Trung bình |
| Bookshelf silhouette | drawWorld.js | ~12 dòng | Dễ |

**Luật:** Tất cả chỉ dùng `Graphics` API — không cần Sprite, không cần texture, không cần file ảnh.

---

## 12. Phase 2 — Props + HUD

### 12.1 src/components/game/PropsManager.jsx (file mới)

Quản lý collectible books + stars:

```jsx
import { extend, useTick } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useCallback, useRef, useState } from 'react'
import { PROP_SPAWN_INTERVAL, BOOK_WIDTH, BOOK_HEIGHT,
         STAR_RADIUS, SCROLL_SPEED_BASE } from './constants'
import { useApplication } from '@pixi/react'

extend({ Container, Graphics })

let nextId = 0

export default function PropsManager({ onCollect }) {
  const { app } = useApplication()
  const [props, setProps] = useState([])
  const frameCount = useRef(0)

  useTick((ticker) => {
    const dt = ticker.deltaTime
    frameCount.current += 1

    setProps((prev) => {
      let next = [...prev]

      // Spawn
      if (frameCount.current % PROP_SPAWN_INTERVAL === 0) {
        const type = Math.random() > 0.6 ? 'star' : 'book'
        next.push({
          id: nextId++,
          type,
          x: app.screen.width + 20,
          y: app.screen.height * 0.6 + Math.random() * app.screen.height * 0.12,
          collected: false,
          scale: 1,
          glowAlpha: 0,
        })
      }

      // Move + cleanup
      next = next
        .map((p) => ({ ...p, x: p.x - SCROLL_SPEED_BASE * 1.5 * dt }))
        .filter((p) => p.x > -40)

      return next
    })
  })

  const draw = useCallback((g) => {
    g.clear()
    props.forEach((p) => {
      if (p.collected) return

      if (p.type === 'book') {
        // Book body
        g.setFillStyle({ color: '#DD3A34' })
        g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
        g.roundRect(p.x, p.y, BOOK_WIDTH, BOOK_HEIGHT, 2)
        g.fill()
        g.stroke()
        // Spine
        g.setStrokeStyle({ color: '#1A1A2E', width: 1 })
        g.moveTo(p.x + 3, p.y + 2)
        g.lineTo(p.x + 3, p.y + BOOK_HEIGHT - 2)
        g.stroke()
        // Glow
        if (p.glowAlpha > 0) {
          g.setFillStyle({ color: `rgba(253, 198, 49, ${p.glowAlpha})` })
          g.circle(p.x + BOOK_WIDTH / 2, p.y + BOOK_HEIGHT / 2, 14)
          g.fill()
        }
      } else {
        // Star
        const cx = p.x + STAR_RADIUS
        const cy = p.y + STAR_RADIUS
        g.setFillStyle({ color: '#FDC631' })
        g.setStrokeStyle({ color: '#1A1A2E', width: 1.5 })
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
  }, [props])

  return <pixiGraphics draw={draw} />
}
```

### 12.2 src/components/game/HUD.jsx (file mới)

```jsx
import { extend, useTick } from '@pixi/react'
import { Graphics, Text, TextStyle } from 'pixi.js'
import { useCallback, useRef } from 'react'
import { XP_BAR_WIDTH, XP_BAR_HEIGHT, XP_BAR_X, XP_BAR_Y, TEXT_DARK, MAX_XP } from './constants'

extend({ Graphics })

export default function HUD({ xp, level }) {
  const displayXp = useRef(0)

  useTick(() => {
    // Smooth lerp
    displayXp.current += (xp - displayXp.current) * 0.1
  })

  const draw = useCallback((g) => {
    g.clear()
    const barY = XP_BAR_Y
    const fillWidth = (displayXp.current / MAX_XP) * XP_BAR_WIDTH

    // Background bar
    g.setFillStyle({ color: 'rgba(26,26,46,0.1)' })
    g.roundRect(XP_BAR_X, barY, XP_BAR_WIDTH, XP_BAR_HEIGHT, 6)
    g.fill()

    // Fill bar
    g.setFillStyle({ color: '#FDC631' })
    g.roundRect(XP_BAR_X, barY, fillWidth, XP_BAR_HEIGHT, 6)
    g.fill()

    // Border
    g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
    g.roundRect(XP_BAR_X, barY, XP_BAR_WIDTH, XP_BAR_HEIGHT, 6)
    g.stroke()
  }, [xp])

  return (
    <>
      <pixiGraphics draw={draw} />
      {/* Level text — PixiJS Text nếu cần, hoặc React overlay */}
    </>
  )
}
```

### 12.3 Cập nhật GameBackground.jsx

```jsx
import { useState, useEffect } from 'react'
import { Application } from '@pixi/react'
import WorldLayer from './game/WorldLayer'
import WoollyPlayer from './game/WoollyPlayer'
import PropsManager from './game/PropsManager'
import HUD from './game/HUD'

export default function GameBackground() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleCollect = (value) => {
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Application
        backgroundAlpha={0}
        resizeTo={window}
        antialias={true}
        resolution={Math.min(window.devicePixelRatio || 1, 2)}
      >
        <WorldLayer width={size.width} height={size.height} />
        <PropsManager onCollect={handleCollect} />
        <WoollyPlayer />
        <HUD xp={xp} level={level} />
      </Application>
    </div>
  )
}
```

### 12.4 Cập nhật WoollyPlayer.jsx

Thêm collision detection:

```jsx
useTick((ticker) => {
  const dt = ticker.deltaTime
  legPhase.current += 0.08 * dt
  setWoollyY(getWoollyY(app.screen.height))

  // Collision check với props (truyền qua context hoặc props)
  const woollyBox = {
    x: WOLLY_X + 10,
    y: woollyY + 10,
    w: 44,
    h: 50,
  }
  // onCollect prop callback khi collision
})
```

### 12.5 Kiểm tra Phase 2

- [ ] Cloud trôi parallax phía trên
- [ ] Book + star spawn từ bên phải, di chuyển trái
- [ ] Collect book → XP tăng
- [ ] XP bar fill mượt (lerp animation)
- [ ] Level up khi XP đầy → reset XP + tăng level

---

## 13. Phase 3 — Polish

### 13.1 Particle system

```jsx
// src/components/game/Particles.jsx (file mới)
import { extend, useTick } from '@pixi/react'
import { ParticleContainer, Graphics } from 'pixi.js'
import { useCallback, useRef } from 'react'

extend({ ParticleContainer, Graphics })
```

**Particle types**:
- **Butterfly**: 2-3 con quanh Woolly, path zigzag sin
- **Leaf**: từ trên rơi xuống, xoay nhẹ, spawn random
- **Star burst**: 20 star particles từ center tỏa ra khi collect

Dùng `ParticleContainer` với `tint`, `scale`, `position` properties enabled.

### 13.2 Glow collect animation

Khi book/star collected:
- Tạo Graphics circle fill vàng alpha 0.6
- Apply `BlurFilter` (radius 8)
- Scale từ 1 → 2, alpha 0.6 → 0 trong 20 frames
- Remove khỏi scene khi fade xong

```jsx
import { BlurFilter } from 'pixi.js'
```

### 13.3 Level up animation

- Flash white overlay (alpha 0.3 → 0 trong 500ms)
- "LEVEL UP!" text ở center screen, scale 0 → 1.2 → 1, fade out sau 1s
- 20 star particles burst từ center

### 13.4 Seamless terrain loop

- `cameraX % (width * 2)` để terrain lặp vô hạn
- 2 bộ hill pattern nối đuôi (đã implement trong drawWorld)
- Reset cloud position khi ra khỏi màn hình

### 13.5 Performance

- `resolution` clamp max 2
- `ParticleContainer` properties tối ưu: chỉ enable cần thiết
- `useMemo` cho draw callbacks khi dimensions không đổi
- IntersectionObserver tắt PixiJS khi game background không visible

---

## 14. Tổng quan timeline

| Phase | Files mới | Files sửa | Nội dung |
|-------|-----------|-----------|----------|
| 1 | 7 | 2 | Install, constants, draw functions, PixiJS components, App integration |
| 2 | 3 | 2 | PropsManager, HUD, cloud parallax, collision detection |
| 3 | 1 | 4 | Particles, glow filter, level-up animation, seamless loop, perf |

## 15. Kiến trúc data flow

```
GameBackground (state: xp, level, size)
  ├── WorldLayer (cameraX, clouds — internal refs)
  ├── PropsManager (props array — internal state)
  │     └── onCollect → GameBackground.handleCollect → setXp, setLevel
  ├── WoollyPlayer (legPhase, woollyY — internal ref/state)
  └── HUD (xp, level — props từ GameBackground)
```

Components giao tiếp qua props (xuôi) và callbacks (ngược). Không dùng context/store cho game state — giữ local trong GameBackground.

---

## 16. Phase R — Forest Depth Expansion

Mục tiêu: Biến game background thành khu rừng sâu nhiều tầng với hệ sinh thái sinh vật đa dạng.

### Phase R1 — Rừng sâu (depth + environment)

Mở rộng WorldLayer với nhiều chiều sâu thị giác và địa hình sinh động.

| Task | File | Mô tả |
|------|------|-------|
| Background mountain layers | drawWorld.js | 2-3 dãy núi xa với parallax chậm (0.05–0.15), màu pastel tím/xanh |
| Mid-ground tree variety | drawWorld.js | Thêm pine (tam giác), oak (tròn), bamboo (thẳng) — mỗi loại hàm draw riêng |
| Foreground bushes/ferns | drawWorld.js | Bụi dương xỉ gần camera, parallax nhanh (0.6), stroke mảnh |
| Undulating ground | drawWorld.js | Ground line không phẳng — sin wave nhẹ, đồi lượn sóng |
| Mist/fog layer | WorldLayer.jsx | Lớp sương mờ ở depth mid, alpha 0.1–0.3, cuộn chậm |
| Light rays (sun shafts) | drawWorld.js | Tia nắng xuyên tán lá, gradient vàng nhạt alpha thấp |
| Depth-sorted rendering | WorldLayer.jsx | Đảm bảo thứ tự vẽ: núi xa → cây mid → sương → ground → foreground → grass |

### Phase R2 — Sinh vật đa dạng

Thêm các sinh vật rừng hoạt động độc lập, mỗi loài có AI đơn giản.

#### R2.1 — Rabbit (thỏ)

File: `drawRabbit.js` (mới) + WorldLayer.jsx

```
- Body: ellipse trắng/xám, tai dài, mắt tròn
- Hoạt động: ngồi → nhảy 2-3 bước → dừng → lặp lại
- Phản ứng: bỏ chạy khi Woolly đến gần (< 150px)
- Parallax: mid-ground, tốc độ 0.3
```

#### R2.2 — Squirrel (sóc)

File: `drawSquirrel.js` (mới) + WorldLayer.jsx

```
- Body: ellipse nâu cam, đuôi lớn cong, tay nhỏ
- Hoạt động: leo cây → dừng → ném quả (acorn) xuống → chạy tiếp
- Acorn: vật nhỏ rơi từ cây, không gây damage, chỉ ambient
- Parallax: mid-ground, gắn với cây
```

#### R2.3 — Birds (chim)

File: `drawBird.js` (mới) + WorldLayer.jsx

```
- Body: ellipse nhỏ, cánh vỗ (wingPhase), đuôi
- Hoạt động: bay ngang bầu trời (5-8 con), đàn V formation
- Đậu cành: thỉnh thoảng đỗ trên cây, cất cánh khi Woolly gần
- Parallax: sky layer, tốc độ 0.1–0.2
```

#### R2.4 — Fireflies (đom đóm)

File: `drawFirefly.js` (mới) + WorldLayer.jsx hoặc Particles.jsx

```
- Body: chấm tròn nhỏ, phát sáng vàng/lục nhạt
- Hoạt động: bay random, alpha nhấp nháy sin wave
- Spawn: 8-12 con, xuất hiện ở tầng thấp (gần ground/bụi cây)
- Parallax: foreground, tốc độ 0.5
```

#### R2.5 — Butterflies màu sắc (nâng cấp)

Sửa `drawButterfly.js`:

```
- Nhiều màu: hồng, xanh, vàng, tím (random khi spawn)
- Kích thước đa dạng: 0.6–1.4 scale
- Số lượng: 3-5 con thay vì 1
- Pattern bay: zigzag + vòng tròn, không trùng nhau
```

### Phase R3 — Hệ sinh thái + tương tác

| Task | File | Mô tả |
|------|------|-------|
| Sinh vật phản ứng | WorldLayer.jsx | Khi Woolly đến gần (±200px), thỏ bỏ chạy, chim cất cánh, sóc leo cao hơn |
| Collectible mới | PropsManager.jsx | Acorn, berry, feather — mỗi loại XP khác nhau, visual riêng |
| Forest ambient SFX | sfx.js | Tiếng chim hót (oscillator frequency sweep), gió thổi (noise filter), dế kêu (square wave thấp) |
| Day/night cycle | WorldLayer.jsx | Sky gradient chuyển màu chậm (5-7 phút/cycle), đom đóm chỉ xuất hiện khi tối |
| Weather (mưa nhẹ) | WorldLayer.jsx | Hạt mưa thẳng đứng, alpha thấp, âm thanh mưa |

### Tổng quan Phase R

| Phase | Files mới | Files sửa | Task count |
|-------|-----------|-----------|------------|
| R1 | 0 | 2 | 7 (drawWorld.js + WorldLayer.jsx) |
| R2 | 5 | 2 | 5 loài sinh vật |
| R3 | 0 | 4 | 5 tính năng |
