export function drawFirefly(g, x, y, s, glowAlpha) {
  // Glow halo
  g.setFillStyle({ color: `rgba(180, 255, 150, ${glowAlpha * 0.3})` })
  g.beginPath()
  g.circle(x, y, 6 * s)
  g.fill()

  g.setFillStyle({ color: `rgba(180, 255, 150, ${glowAlpha * 0.5})` })
  g.beginPath()
  g.circle(x, y, 3 * s)
  g.fill()

  // Bright center
  g.setFillStyle({ color: `rgba(210, 255, 180, ${glowAlpha})` })
  g.beginPath()
  g.circle(x, y, 1.5 * s)
  g.fill()
}
