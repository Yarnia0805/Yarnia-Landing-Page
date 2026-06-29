import { TEXT_DARK } from './constants'

export function drawBird(g, x, y, s, wingPhase, isPerched) {
  const wingAngle = isPerched ? 0.2 : Math.sin(wingPhase) * 0.6 + 0.3
  const bodyBob = isPerched ? 0 : Math.sin(wingPhase * 2) * 0.5

  // Body
  g.setFillStyle({ color: '#9273E4' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1 })
  g.beginPath()
  g.ellipse(x, y + bodyBob, 4 * s, 2.5 * s)
  g.fill()
  g.stroke()

  // Left wing
  g.setFillStyle({ color: '#7B5FCC' })
  g.beginPath()
  g.ellipse(x - 4 * s, y + bodyBob - wingAngle * s, 3 * s, 1.5 * s)
  g.fill()
  g.stroke()

  // Right wing
  g.beginPath()
  g.ellipse(x + 4 * s, y + bodyBob - wingAngle * s, 3 * s, 1.5 * s)
  g.fill()
  g.stroke()

  // Head
  g.setFillStyle({ color: '#9273E4' })
  g.beginPath()
  g.circle(x, y - 3 * s + bodyBob, 2 * s)
  g.fill()
  g.stroke()

  // Eye
  g.setFillStyle({ color: TEXT_DARK })
  g.beginPath()
  g.circle(x + 0.8 * s, y - 3.5 * s + bodyBob, 0.5 * s)
  g.fill()

  // Beak
  g.setFillStyle({ color: '#FDC631' })
  g.beginPath()
  g.moveTo(x + 2 * s, y - 3 * s + bodyBob)
  g.lineTo(x + 4 * s, y - 2.5 * s + bodyBob)
  g.lineTo(x + 2 * s, y - 2 * s + bodyBob)
  g.closePath()
  g.fill()

  // Tail
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.8 })
  g.beginPath()
  g.moveTo(x - 4 * s, y + bodyBob)
  g.lineTo(x - 6 * s, y + 2 * s + bodyBob)
  g.stroke()
}

export function drawPerch(g, x, y, w) {
  g.setStrokeStyle({ color: 'rgba(26,26,46,0.15)', width: 1.5 })
  g.beginPath()
  g.moveTo(x - w / 2, y)
  g.lineTo(x + w / 2, y)
  g.stroke()
}
