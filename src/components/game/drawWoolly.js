import {
  TEXT_DARK, WOLLY_BODY, WOLLY_FACE, WOLLY_EAR_INNER,
  WOLLY_NOSE, WOLLY_SCARF, WOLLY_YARN,
} from './constants'

const CX = 24

export function drawWoolly(g, x, y, legSin) {
  g.clear()

  // ── BODY ──
  g.setFillStyle({ color: WOLLY_BODY })
  g.setStrokeStyle({ color: TEXT_DARK, width: 2 })
  g.moveTo(x + 12, y + 15)
  g.bezierCurveTo(x + 9, y + 28, x + 12, y + 42, x + 21, y + 43)
  g.bezierCurveTo(x + 27, y + 43, x + 39, y + 42, x + 36, y + 15)
  g.fill()
  g.stroke()

  // ── FACE ──
  g.setFillStyle({ color: WOLLY_FACE })
  g.setStrokeStyle({ color: TEXT_DARK, width: 2 })
  g.ellipse(x + CX, y + 21, 12, 10)
  g.fill()
  g.stroke()

  // ── EARS ──
  g.setFillStyle({ color: WOLLY_FACE })
  g.ellipse(x + 14, y + 14, 4, 5.5)
  g.fill()
  g.stroke()
  g.setFillStyle({ color: '#F279A6' })
  g.ellipse(x + 14, y + 14, 2, 3)
  g.fill()

  g.setFillStyle({ color: WOLLY_FACE })
  g.ellipse(x + 34, y + 14, 4, 5.5)
  g.fill()
  g.stroke()
  g.setFillStyle({ color: '#F279A6' })
  g.ellipse(x + 34, y + 14, 2, 3)
  g.fill()

  // ── EYES ──
  g.setStrokeStyle({ color: TEXT_DARK, width: 2 })
  g.beginPath()
  g.moveTo(x + 17, y + 21)
  g.lineTo(x + 20, y + 18)
  g.lineTo(x + 23, y + 21)
  g.closePath()
  g.stroke()
  g.beginPath()
  g.moveTo(x + 25, y + 21)
  g.lineTo(x + 28, y + 18)
  g.lineTo(x + 31, y + 21)
  g.closePath()
  g.stroke()

  // ── NOSE ──
  g.setFillStyle({ color: '#C4785A' })
  g.ellipse(x + CX, y + 24, 2, 1.5)
  g.fill()

  // ── SMILE ──
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.beginPath()
  g.arc(x + CX, y + 27, 3.5, 0.2, Math.PI - 0.2)
  g.stroke()

  // ── SCARF ──
  g.setFillStyle({ color: '#FDC631' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.roundRect(x + 11, y + 31, 26, 4, 2)
  g.fill()
  g.stroke()
  g.beginPath()
  g.moveTo(x + 14, y + 35)
  g.lineTo(x + 13, y + 40)
  g.stroke()
  g.beginPath()
  g.moveTo(x + 19, y + 35)
  g.lineTo(x + 18, y + 39)
  g.stroke()

  // ── YARN BALL ──
  g.setFillStyle({ color: '#FDC631' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1.5 })
  g.beginPath()
  g.circle(x + 32, y + 39, 4)
  g.closePath()
  g.fill()
  g.stroke()
  g.beginPath()
  g.moveTo(x + 30, y + 37.5)
  g.lineTo(x + 34, y + 40.5)
  g.stroke()
  g.beginPath()
  g.moveTo(x + 30, y + 40.5)
  g.lineTo(x + 34, y + 37.5)
  g.stroke()

  // ── ARM ──
  g.setStrokeStyle({ color: TEXT_DARK, width: 2.5 })
  g.beginPath()
  g.moveTo(x + 5, y + 32)
  g.bezierCurveTo(x + 2, y + 36, x + 8, y + 40, x + 11, y + 39)
  g.stroke()

  // ── LEGS ──
  const rad = legSin * 12 * (Math.PI / 180)
  const negRad = -legSin * 12 * (Math.PI / 180)

  g.setFillStyle({ color: TEXT_DARK })
  const lx = x + 13, ly = y + 40, lcx = lx + 3, lcy = ly + 4
  const rlx = (lx - lcx) * Math.cos(rad) - (ly - lcy) * Math.sin(rad) + lcx
  const rly = (lx - lcx) * Math.sin(rad) + (ly - lcy) * Math.cos(rad) + lcy
  g.beginPath()
  g.roundRect(rlx, rly, 6, 8, 2)
  g.closePath()
  g.fill()

  const rx = x + 29, ry = y + 40, rcx = rx + 3, rcy = ry + 4
  const rrx = (rx - rcx) * Math.cos(negRad) - (ry - rcy) * Math.sin(negRad) + rcx
  const rry = (rx - rcx) * Math.sin(negRad) + (ry - rcy) * Math.cos(negRad) + rcy
  g.beginPath()
  g.roundRect(rrx, rry, 6, 8, 2)
  g.closePath()
  g.fill()
}
