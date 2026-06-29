import { TEXT_DARK } from './constants'

export function drawSquirrel(g, x, y, s, phase) {
  const tailWag = Math.sin(phase * 2) * 1.5
  const headBob = Math.sin(phase) * 0.5

  // Tail (big bushy)
  g.setFillStyle({ color: '#C4785A' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.8 })
  g.beginPath()
  g.ellipse(x + 7 * s + tailWag, y - 9 * s, 4 * s, 6 * s)
  g.fill()
  g.stroke()

  // Body
  g.setFillStyle({ color: '#C4785A' })
  g.beginPath()
  g.ellipse(x, y - 4 * s, 5 * s, 5 * s)
  g.fill()
  g.stroke()

  // Belly
  g.setFillStyle({ color: '#EDE9DC' })
  g.beginPath()
  g.ellipse(x - 1 * s, y - 3 * s, 3 * s, 3.5 * s)
  g.fill()

  // Head
  g.setFillStyle({ color: '#C4785A' })
  g.beginPath()
  g.circle(x, y - 11 * s + headBob, 3.5 * s)
  g.fill()
  g.stroke()

  // Ears
  g.setFillStyle({ color: '#C4785A' })
  g.beginPath()
  g.ellipse(x - 2 * s, y - 15 * s + headBob, 1.5 * s, 2.5 * s)
  g.fill()
  g.stroke()
  g.beginPath()
  g.ellipse(x + 2 * s, y - 15 * s + headBob, 1.5 * s, 2.5 * s)
  g.fill()
  g.stroke()

  // Eyes
  g.setFillStyle({ color: TEXT_DARK })
  g.beginPath()
  g.circle(x - 1.2 * s, y - 11 * s + headBob, 0.7 * s)
  g.fill()
  g.beginPath()
  g.circle(x + 1.2 * s, y - 11 * s + headBob, 0.7 * s)
  g.fill()

  // Arms
  g.setStrokeStyle({ color: TEXT_DARK, width: 1 })
  g.beginPath()
  g.moveTo(x - 3 * s, y - 6 * s)
  g.lineTo(x - 5 * s, y - 3 * s)
  g.stroke()
  g.beginPath()
  g.moveTo(x + 3 * s, y - 6 * s)
  g.lineTo(x + 5 * s, y - 3 * s)
  g.stroke()
}

export function drawAcorn(g, x, y, s) {
  // Nut
  g.setFillStyle({ color: '#C4785A' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.8 })
  g.beginPath()
  g.ellipse(x, y + 1.5 * s, 2.5 * s, 3 * s)
  g.fill()
  g.stroke()

  // Cap
  g.setFillStyle({ color: '#8B5E3C' })
  g.beginPath()
  g.ellipse(x, y - 1.5 * s, 3 * s, 2 * s)
  g.fill()
  g.stroke()
}
