import { TEXT_DARK } from './constants'

export function drawButterfly(g, x, y, wingPhase) {
  const wing = Math.abs(Math.sin(wingPhase)) // 0..1 flap
  const wx = 4 * (0.2 + wing * 0.8)
  const wy = 3

  g.setFillStyle({ color: '#F279A6' })
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.8 })
  g.beginPath()
  g.ellipse(x - 3, y, wx, wy)
  g.fill()
  g.stroke()
  g.beginPath()
  g.ellipse(x + 3, y, wx, wy)
  g.fill()
  g.stroke()

  // body
  g.setFillStyle({ color: TEXT_DARK })
  g.beginPath()
  g.ellipse(x, y, 1.2, 2.5)
  g.fill()
}
