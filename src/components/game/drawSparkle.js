export function drawSparkle(g, x, y, size, alpha) {
  if (alpha < 0.01) return
  g.setFillStyle({ color: `rgba(253, 198, 49, ${alpha})` })
  g.beginPath()
  g.circle(x, y, size)
  g.fill()
}
