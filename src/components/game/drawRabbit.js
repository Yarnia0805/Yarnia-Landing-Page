import { TEXT_DARK } from './constants'

export function drawRabbit(g, x, y, s, phase) {
  const bob = Math.sin(phase) * 1.5 // idle breathing
  const bodyY = y + bob

  // Body
  g.setFillStyle({ color: '#EDE9DC' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 1 })
  g.beginPath()
  g.ellipse(x, bodyY - 4 * s, 6 * s, 5 * s)
  g.fill()
  g.stroke()

  // Head
  g.beginPath()
  g.circle(x, bodyY - 11 * s, 4 * s)
  g.fill()
  g.stroke()

  // Left ear
  g.setFillStyle({ color: '#EDE9DC' })
  g.beginPath()
  g.ellipse(x - 2.5 * s, bodyY - 18 * s, 2 * s, 5 * s)
  g.fill()
  g.stroke()
  g.setFillStyle({ color: '#F279A6' })
  g.beginPath()
  g.ellipse(x - 2.5 * s, bodyY - 18 * s, 1 * s, 3.5 * s)
  g.fill()

  // Right ear
  g.setFillStyle({ color: '#EDE9DC' })
  g.beginPath()
  g.ellipse(x + 2.5 * s, bodyY - 18 * s, 2 * s, 5 * s)
  g.fill()
  g.stroke()
  g.setFillStyle({ color: '#F279A6' })
  g.beginPath()
  g.ellipse(x + 2.5 * s, bodyY - 18 * s, 1 * s, 3.5 * s)
  g.fill()

  // Tail
  g.setFillStyle({ color: '#FFFFFF' })
  g.beginPath()
  g.circle(x + 6 * s, bodyY - 2 * s, 2.5 * s)
  g.fill()

  // Eye
  g.setFillStyle({ color: TEXT_DARK })
  g.beginPath()
  g.circle(x + 1.5 * s, bodyY - 11 * s, 0.8 * s)
  g.fill()

  // Nose
  g.setFillStyle({ color: '#F279A6' })
  g.beginPath()
  g.circle(x, bodyY - 9.5 * s, 0.6 * s)
  g.fill()
}
