import {
  SKY_TOP, SKY_BOTTOM, DEPTH_LAYERS, TREE_DEPTHS,
  GROUND_COLOR, GROUND_LINE_COLOR, GROUND_LINE_Y, getGroundY,
  MIST_LAYERS, RAY_COUNT, RAY_ALPHA,
} from './constants'

// Deterministic "random" per tree index — stable across frames
function treeScale(i, min, max) {
  const t = ((i * 7919 + 6271) % 10000) / 10000 // prime hash → 0..1
  return min + t * (max - min)
}

export function drawWorld(g, width, height, cameraX) {
  const groundY = getGroundY(height)

  // ── SKY GRADIENT ──
  const gradTop = Math.min(height * 0.5, groundY * 0.6)
  g.setFillStyle({ color: SKY_TOP })
  g.rect(0, 0, width, gradTop)
  g.fill()
  g.setFillStyle({ color: SKY_BOTTOM })
  g.rect(0, gradTop, width, groundY - gradTop)
  g.fill()

  // ── DEPTH MOUNTAIN LAYERS (back to front) ──
  DEPTH_LAYERS.forEach((layer) => {
    const off = (cameraX * layer.speed) % (width * 2)
    g.setFillStyle({ color: layer.color })
    drawMountain(g, -off, groundY, width, layer.peak, layer.spread)
    drawMountain(g, width - off, groundY, width, layer.peak, layer.spread)
  })

  // ── MIST LAYERS (behind most trees) ──
  MIST_LAYERS.forEach((layer) => {
    const ox = (cameraX * layer.speed) % width
    g.setFillStyle({ color: `rgba(244,243,237,${layer.alpha})` })
    const my = groundY * layer.y
    g.rect(-ox, my, width + 40, height * layer.h)
    g.fill()
    g.rect(width - ox, my, width + 40, height * layer.h)
    g.fill()
  })

  // ── TREES (depth-grouped by type) ──
  TREE_DEPTHS.forEach((td) => {
    const spacing = width / td.count
    const off = (cameraX * td.speed) % spacing
    for (let i = 0; i < td.count; i++) {
      const tx = wrapX(i * spacing - off, width)
      const s = treeScale(i, td.scale[0], td.scale[1])
      drawTree(g, tx, groundY, s, td.opacity, td.type)
    }
  })

  // ── SUN RAYS (behind ground, in front of trees) ──
  const ro = (cameraX * 0.008) % (width * 2)
  for (let i = 0; i < RAY_COUNT; i++) {
    const rx = (i * width / RAY_COUNT - ro + width * 2) % (width * 2) - width * 0.3
    drawLightRay(g, rx, height * 0.15, width * 0.25, height * 0.5, RAY_ALPHA)
  }

  // ── GROUND ──
  drawGround(g, width, height, groundY, cameraX)

  // ── GROUND LINE ──
  g.setFillStyle({ color: GROUND_LINE_COLOR })
  g.rect(0, groundY, width, GROUND_LINE_Y)
  g.fill()

  // ── GRASS PATCH (dense tufts below ground line) ──
  const gpOff = (cameraX * 0.45) % (width * 0.2)
  const grassColors = ['#328045', '#5DBB63', '#4A9E5E', '#6BCF7A', '#3BC4A0']
  for (let i = 0; i < 50; i++) {
    const gx = wrapX((i * width / 50) - gpOff, width)
    const gh = 14 + Math.sin(i * 2.4) * 6
    const ci = i % grassColors.length
    g.setFillStyle({ color: grassColors[ci], alpha: 0.7 })
    g.beginPath()
    g.moveTo(gx, groundY + GROUND_LINE_Y)
    g.lineTo(gx - 1.5, groundY + GROUND_LINE_Y + gh)
    g.lineTo(gx + 1.5, groundY + GROUND_LINE_Y + gh)
    g.closePath()
    g.fill()
    // Dark outline for visibility
    g.setStrokeStyle({ color: '#1A1A2E', width: 0.3, alpha: 0.3 })
    g.beginPath()
    g.moveTo(gx, groundY + GROUND_LINE_Y)
    g.lineTo(gx - 1.5, groundY + GROUND_LINE_Y + gh)
    g.lineTo(gx + 1.5, groundY + GROUND_LINE_Y + gh)
    g.closePath()
    g.stroke()
  }

  // ── FOREGROUND FERNS ──
  const fo = (cameraX * 0.50) % (width * 0.35)
  for (let i = 0; i < 6; i++) {
    const fx = wrapX((i * width * 0.18) - fo, width)
    drawFern(g, fx, groundY, treeScale(i, 0.8, 1.4))
  }

  // ── GRASS ──
  g.setStrokeStyle({ color: GROUND_LINE_COLOR, width: 0.7 })
  const gs = 12
  const go = (cameraX * 0.50) % gs
  for (let i = 0; i < width + gs; i += gs) {
    const bx = wrapX(i - go, width)
    const sway = Math.sin(i * 0.5 + cameraX * 0.03) * 1.5
    const gh2 = 4 + Math.sin(i * 0.7) * 2
    g.beginPath()
    g.moveTo(bx, groundY)
    g.lineTo(bx + sway, groundY - gh2)
    g.stroke()
  }

  // ── FLOWERS ──
  const flOff = (cameraX * 0.55) % width
  const flowerColors = ['#F279A6', '#FDC631', '#9273E4', '#3BC4A0']
  for (let i = 0; i < 12; i++) {
    const fx = wrapX((width / 12) * i - flOff, width)
    g.setFillStyle({ color: flowerColors[i % 4] })
    g.beginPath()
    g.circle(fx, groundY - 2 + Math.sin(i * 1.2) * 2, treeScale(i, 1.5, 3.0))
    g.fill()
  }

  // ── MUSHROOMS ──
  const mo = (cameraX * 0.48) % (width * 0.5)
  drawMushroom(g, wrapX(width * 0.08 - mo, width), groundY, 1.1)
  drawMushroom(g, wrapX(width * 0.28 - mo, width), groundY, 0.8)
  drawMushroom(g, wrapX(width * 0.45 - mo, width), groundY, 1.3)
  drawMushroom(g, wrapX(width * 0.65 - mo, width), groundY, 0.9)
  drawMushroom(g, wrapX(width * 0.85 - mo, width), groundY, 1.0)

  // ── ROCKS ──
  const rkOff = (cameraX * 0.52) % (width * 0.6)
  drawRock(g, wrapX(width * 0.15 - rkOff, width), groundY, 1.1)
  drawRock(g, wrapX(width * 0.38 - rkOff, width), groundY, 0.9)
  drawRock(g, wrapX(width * 0.55 - rkOff, width), groundY, 1.2)
  drawRock(g, wrapX(width * 0.72 - rkOff, width), groundY, 0.7)
  drawRock(g, wrapX(width * 0.90 - rkOff, width), groundY, 1.0)
}

// ── helpers ──

function wrapX(x, w) {
  return ((x + w * 100) % w + w) % w
}

function drawMountain(g, ox, gy, w, peak, spread) {
  g.beginPath()
  g.moveTo(ox, gy)
  g.bezierCurveTo(
    ox + w * (0.5 - spread), gy - peak,
    ox + w * (0.5 + spread), gy - peak * 0.3,
    ox + w, gy,
  )
  g.closePath()
  g.fill()
}

export function getTreeHeight(s, type) {
  // Returns approximate tree top Y offset from groundY for creature placement
  if (type === 'pine') return -(18 + 3 * 8 + 9) * s
  if (type === 'oak') return -(36 + 12) * s
  if (type === 'mixed') return -(22 + 9) * s
  if (type === 'bamboo') return -(38 + 5) * s
  return -(20) * s
}

export function getTreeCanopyRadius(s, type) {
  if (type === 'pine') return 8 * s
  if (type === 'oak') return 12 * s
  if (type === 'mixed') return 9 * s
  if (type === 'bamboo') return 5 * s
  return 6 * s
}

function drawTree(g, tx, gy, s, opacity, type) {
  // Clamp trunk width to max 6px regardless of scale
  const trunkW = Math.min(3 * s, 6)
  const trunkC = `rgba(26,26,46,${opacity * 0.4})`

  if (type === 'pine') {
    const leafC = `rgba(50,128,69,${opacity})`
    g.setFillStyle({ color: trunkC })
    g.beginPath()
    g.roundRect(tx - trunkW / 2, gy - 18 * s, trunkW, 18 * s, 1.5)
    g.fill()

    g.setFillStyle({ color: leafC })
    for (let tier = 0; tier < 3; tier++) {
      const ty = gy - (18 + tier * 8) * s
      const tw = (8 - tier * 2) * s
      const th = 9 * s
      g.beginPath()
      g.moveTo(tx, ty - th)
      g.lineTo(tx - tw, ty)
      g.lineTo(tx + tw, ty)
      g.closePath()
      g.fill()
    }
  } else if (type === 'oak') {
    const leafC = `rgba(50,128,69,${opacity})`
    g.setFillStyle({ color: trunkC })
    g.beginPath()
    g.roundRect(tx - trunkW / 2, gy - 22 * s, trunkW, 22 * s, 2)
    g.fill()

    g.setFillStyle({ color: leafC })
    g.beginPath()
    g.circle(tx, gy - 30 * s, 12 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.circle(tx - 8 * s, gy - 24 * s, 9 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.circle(tx + 8 * s, gy - 24 * s, 9 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.circle(tx + 1 * s, gy - 36 * s, 7 * s)
    g.closePath()
    g.fill()
  } else if (type === 'mixed') {
    const leafC = `rgba(50,128,69,${opacity * 1.2})`
    g.setFillStyle({ color: trunkC })
    g.beginPath()
    g.roundRect(tx - trunkW / 2, gy - 14 * s, trunkW, 14 * s, 1.5)
    g.fill()

    g.setFillStyle({ color: leafC })
    g.beginPath()
    g.circle(tx, gy - 22 * s, 9 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.circle(tx + 5 * s, gy - 17 * s, 6 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.circle(tx - 5 * s, gy - 17 * s, 6 * s)
    g.closePath()
    g.fill()
  } else if (type === 'bamboo') {
    const bambooC = `rgba(59,196,160,${opacity})`
    const bWidth = Math.min(1.5 * s, 3)
    g.setStrokeStyle({ color: `rgba(26,26,46,${opacity * 0.3})`, width: bWidth })
    for (let seg = 0; seg < 5; seg++) {
      const by = gy - (32 - seg * 6) * s
      g.beginPath()
      g.moveTo(tx, by)
      g.lineTo(tx, by - 5 * s)
      g.stroke()
    }
    g.setFillStyle({ color: bambooC })
    g.beginPath()
    g.ellipse(tx + 4 * s, gy - 34 * s, 5 * s, 2 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.ellipse(tx - 4 * s, gy - 36 * s, 4 * s, 2 * s)
    g.closePath()
    g.fill()
    g.beginPath()
    g.ellipse(tx + 3 * s, gy - 38 * s, 4 * s, 1.5 * s)
    g.closePath()
    g.fill()
  }
}

function drawLightRay(g, rx, ry, w, h, alpha) {
  g.setFillStyle({ color: `rgba(253,198,49,${alpha})` })
  g.beginPath()
  g.moveTo(rx + w * 0.2, ry)
  g.lineTo(rx + w * 0.8, ry)
  g.lineTo(rx + w, ry + h)
  g.lineTo(rx, ry + h)
  g.closePath()
  g.fill()
}

function drawGround(g, width, height, groundY, cameraX) {
  const gh = height - groundY

  // Ground fill
  g.setFillStyle({ color: GROUND_COLOR })
  g.rect(0, groundY, width, gh)
  g.fill()

  // Subtle undulation line
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.03)', width: 0.5 })
  for (let x = 0; x < width; x += 4) {
    const dy = Math.sin(x * 0.008 + cameraX * 0.01) * 3
    g.beginPath()
    g.moveTo(x, groundY + dy)
    g.lineTo(x + 2, groundY + dy)
    g.stroke()
  }

  // Ground texture lines
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.04)', width: 0.5 })
  for (let row = 1; row <= 5; row++) {
    g.beginPath()
    g.moveTo(0, groundY + row * 5)
    g.lineTo(width, groundY + row * 5)
    g.stroke()
  }
}

function drawFern(g, fx, gy, s) {
  g.setStrokeStyle({ color: `rgba(26,26,46,0.15)`, width: 1 })
  const fh = 14 * s
  // Stem
  g.beginPath()
  g.moveTo(fx, gy)
  g.lineTo(fx, gy - fh)
  g.stroke()
  // Fronds
  for (let i = 0; i < 4; i++) {
    const fy = gy - fh + i * (fh / 4)
    g.beginPath()
    g.moveTo(fx, fy)
    g.lineTo(fx - 4 * s * (1 - i * 0.2), fy - 2)
    g.stroke()
    g.beginPath()
    g.moveTo(fx, fy)
    g.lineTo(fx + 4 * s * (1 - i * 0.2), fy - 2)
    g.stroke()
  }
}

function drawMushroom(g, mx, gy, s) {
  // Stem
  g.setFillStyle({ color: 'rgba(26,26,46,0.12)' })
  g.beginPath()
  g.roundRect(mx - 2.5 * s, gy - 10 * s, 5 * s, 10 * s, 2)
  g.fill()

  // Cap
  g.setFillStyle({ color: 'rgba(242,121,166,0.40)' })
  g.beginPath()
  g.ellipse(mx, gy - 12 * s, 9 * s, 6 * s)
  g.fill()
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.20)', width: 1 })
  g.beginPath()
  g.ellipse(mx, gy - 12 * s, 9 * s, 6 * s)
  g.stroke()

  // Spots
  g.setFillStyle({ color: 'rgba(255,255,255,0.5)' })
  g.beginPath()
  g.circle(mx - 3 * s, gy - 13 * s, 2 * s)
  g.fill()
  g.beginPath()
  g.circle(mx + 3.5 * s, gy - 12 * s, 1.5 * s)
  g.fill()
  g.beginPath()
  g.circle(mx, gy - 11 * s, 1.2 * s)
  g.fill()
}

function drawRock(g, rx, gy, s) {
  g.setFillStyle({ color: 'rgba(26,26,46,0.12)' })
  g.beginPath()
  g.ellipse(rx, gy - 2 * s, 6 * s, 3.5 * s)
  g.fill()
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.18)', width: 0.8 })
  g.beginPath()
  g.ellipse(rx, gy - 2 * s, 6 * s, 3.5 * s)
  g.stroke()
}
