import {
  SKY_TOP, SKY_BOTTOM, DEPTH_LAYERS, TREE_DEPTHS,
  GROUND_COLOR, GROUND_LINE, GROUND_LINE_Y, getGroundY,
} from './constants'

export function drawWorld(g, width, height, cameraX) {
  const groundY = getGroundY(height)
  const gh = height - groundY // ground height

  // ── SKY ──
  g.setFillStyle({ color: SKY_TOP })
  g.rect(0, 0, width, groundY * 0.6)
  g.fill()
  g.setFillStyle({ color: SKY_BOTTOM })
  g.rect(0, groundY * 0.6, width, groundY * 0.4)
  g.fill()

  // ── DEPTH LAYERS (back to front) ──
  DEPTH_LAYERS.forEach((layer) => {
    const off = (cameraX * layer.speed) % (width * 2)
    g.setFillStyle({ color: layer.color })
    drawDepthPeak(g, -off, groundY, width, layer.peak, layer.spread)
    drawDepthPeak(g, width - off, groundY, width, layer.peak, layer.spread)
  })

  // ── TREES (depth-grouped) ──
  TREE_DEPTHS.forEach((td) => {
    const spacing = width / td.count
    const off = (cameraX * td.speed) % spacing
    for (let i = 0; i < td.count; i++) {
      const offsetX = wrapX(i * spacing - off, width)
      const s = td.scale[0] + Math.random() * (td.scale[1] - td.scale[0])
      drawTree(g, offsetX, groundY, s, td.opacity)
    }
  })

  // ── GROUND FILL ──
  g.setFillStyle({ color: GROUND_COLOR })
  g.rect(0, groundY, width, gh)
  g.fill()

  // ── GROUND TEXTURE LINES ──
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.05)', width: 0.5 })
  for (let row = 1; row <= 4; row++) {
    g.beginPath()
    g.moveTo(0, groundY + row * 6)
    g.lineTo(width, groundY + row * 6)
    g.stroke()
  }

  // ── MUSHROOMS (nearest objects — fast scroll) ──
  const mo = (cameraX * 0.50) % (width * 0.4)
  drawMushroom(g, wrapX(width * 0.10 - mo, width), groundY, 1.2)
  drawMushroom(g, wrapX(width * 0.38 - mo, width), groundY, 1.0)
  drawMushroom(g, wrapX(width * 0.60 - mo, width), groundY, 0.9)
  drawMushroom(g, wrapX(width * 0.82 - mo, width), groundY, 1.1)

  // ── ROCKS ──
  const ro = (cameraX * 0.55) % (width * 0.5)
  drawRock(g, wrapX(width * 0.20 - ro, width), groundY, 1.2)
  drawRock(g, wrapX(width * 0.48 - ro, width), groundY, 1.0)
  drawRock(g, wrapX(width * 0.72 - ro, width), groundY, 0.8)
  drawRock(g, wrapX(width * 0.92 - ro, width), groundY, 1.1)

  // ── FLOWERS ──
  const fo = (cameraX * 0.60) % width
  const flowerColors = ['#F279A6', '#FDC631', '#9273E4']
  for (let i = 0; i < 15; i++) {
    const fx = wrapX((width / 15) * i - fo, width)
    g.setFillStyle({ color: flowerColors[i % 3] })
    g.beginPath()
    g.circle(fx, groundY - 2.5 + Math.random() * 3, 1.5 + Math.random() * 1.5)
    g.fill()
  }

  // ── GROUND LINE ──
  g.setFillStyle({ color: GROUND_LINE })
  g.rect(0, groundY, width, GROUND_LINE_Y)
  g.fill()

  // ── GRASS ──
  g.setStrokeStyle({ color: GROUND_LINE, width: 0.8 })
  const gs = 14
  const go = (cameraX * 0.50) % gs
  for (let i = 0; i < width + gs; i += gs) {
    const bx = ((i - go + width * 2) % width + width) % width
    const sway = Math.sin(i * 0.4 + cameraX * 0.04) * 1.5
    const gh2 = 5 + Math.sin(i * 0.6) * 2
    g.beginPath()
    g.moveTo(bx, groundY)
    g.lineTo(bx + sway, groundY - gh2)
    g.stroke()
  }
}

// ── helpers ──

function wrapX(x, w) {
  return ((x + w * 2) % w + w) % w
}

function drawDepthPeak(g, ox, gy, w, peak, spread) {
  g.beginPath()
  g.moveTo(ox, gy)
  g.bezierCurveTo(
    ox + w * (0.5 - spread), gy - peak,
    ox + w * (0.5 + spread), gy - peak * 0.4,
    ox + w, gy,
  )
  g.closePath()
  g.fill()
}

function drawTree(g, tx, gy, s, opacity) {
  const trunkC = `rgba(26,26,46,${opacity * 0.5})`
  const leafC = `rgba(50,128,69,${opacity})`

  // Trunk
  g.setFillStyle({ color: trunkC })
  g.beginPath()
  g.roundRect(tx - 2 * s, gy - 20 * s, 4 * s, 20 * s, 2)
  g.fill()

  // Foliage
  g.setFillStyle({ color: leafC })
  g.beginPath()
  g.circle(tx, gy - 28 * s, 11 * s)
  g.closePath()
  g.fill()
  g.beginPath()
  g.circle(tx - 6 * s, gy - 22 * s, 8 * s)
  g.closePath()
  g.fill()
  g.beginPath()
  g.circle(tx + 6 * s, gy - 22 * s, 8 * s)
  g.closePath()
  g.fill()
  g.beginPath()
  g.circle(tx + 1 * s, gy - 34 * s, 7 * s)
  g.closePath()
  g.fill()
}

function drawMushroom(g, mx, gy, s) {
  g.setFillStyle({ color: 'rgba(26,26,46,0.15)' })
  g.beginPath()
  g.roundRect(mx - 2 * s, gy - 8 * s, 4 * s, 8 * s, 1.5)
  g.fill()

  g.setFillStyle({ color: 'rgba(242,121,166,0.40)' })
  g.beginPath()
  g.ellipse(mx, gy - 10 * s, 7 * s, 5 * s)
  g.fill()
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.25)', width: 1 })
  g.beginPath()
  g.ellipse(mx, gy - 10 * s, 7 * s, 5 * s)
  g.stroke()

  g.setFillStyle({ color: 'rgba(255,255,255,0.6)' })
  g.beginPath()
  g.circle(mx - 2.5 * s, gy - 11 * s, 1.5 * s)
  g.fill()
  g.beginPath()
  g.circle(mx + 2.5 * s, gy - 10 * s, 1.2 * s)
  g.fill()
  g.beginPath()
  g.circle(mx, gy - 9 * s, 1 * s)
  g.fill()
}

function drawRock(g, rx, gy, s) {
  g.setFillStyle({ color: 'rgba(26,26,46,0.15)' })
  g.beginPath()
  g.ellipse(rx, gy - 3 * s, 5 * s, 3 * s)
  g.fill()
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.20)', width: 0.8 })
  g.beginPath()
  g.ellipse(rx, gy - 3 * s, 5 * s, 3 * s)
  g.stroke()
}
