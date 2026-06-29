import { TEXT_DARK } from './constants'

const COLORS = ['#F279A6', '#FDC631', '#3BC4A0', '#9273E4', '#DD3A34']

export function drawButterfly(g, x, y, wingPhase, colorIdx, s) {
  const wing = Math.abs(Math.sin(wingPhase))
  const wx = 4 * (0.2 + wing * 0.8) * (s ?? 1)
  const wy = 3 * (s ?? 1)
  const ci = (colorIdx ?? 0) % COLORS.length

  // Wings
  g.setFillStyle({ color: COLORS[ci] })
  g.setStrokeStyle({ color: TEXT_DARK, width: 0.8 })
  g.beginPath()
  g.ellipse(x - 3 * (s ?? 1), y, wx, wy)
  g.fill()
  g.stroke()
  g.beginPath()
  g.ellipse(x + 3 * (s ?? 1), y, wx, wy)
  g.fill()
  g.stroke()

  // Wing detail
  g.setFillStyle({ color: 'rgba(255,255,255,0.3)' })
  g.beginPath()
  g.ellipse(x - 3 * (s ?? 1), y, wx * 0.4, wy * 0.5)
  g.fill()
  g.beginPath()
  g.ellipse(x + 3 * (s ?? 1), y, wx * 0.4, wy * 0.5)
  g.fill()

  // Body
  g.setFillStyle({ color: TEXT_DARK })
  g.beginPath()
  g.ellipse(x, y, 1.2 * (s ?? 1), 2.5 * (s ?? 1))
  g.fill()
}
