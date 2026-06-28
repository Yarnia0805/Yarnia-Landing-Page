export function drawCloud(g, x, y, scale = 1) {
  const s = scale
  // soft shadow behind cloud
  g.setFillStyle({ color: 'rgba(200, 195, 185, 0.18)' })
  g.ellipse(x + 2 * s, y + 2 * s, 38 * s, 14 * s)
  g.fill()

  // main cloud body — layered fluffy circles, no stroke
  g.setFillStyle({ color: 'rgba(255, 255, 255, 0.7)' })
  g.circle(x - 14 * s, y + 2 * s, 12 * s)
  g.fill()
  g.circle(x + 16 * s, y + 2 * s, 14 * s)
  g.fill()
  g.circle(x + 2 * s, y - 4 * s, 16 * s)
  g.fill()
  g.circle(x - 6 * s, y - 8 * s, 11 * s)
  g.fill()
  g.circle(x + 10 * s, y - 8 * s, 10 * s)
  g.fill()

  // lighter highlight bumps on top
  g.setFillStyle({ color: 'rgba(255, 255, 255, 0.4)' })
  g.circle(x, y - 12 * s, 7 * s)
  g.fill()
  g.circle(x + 8 * s, y - 12 * s, 5 * s)
  g.fill()
}
