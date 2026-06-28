// ── Woolly colors (from DESIGN.md mascot system) ──
export const WOLLY_BODY = '#EDE9DC' // darker cream — visible on bg
export const WOLLY_FACE = '#E0DCCC' // face tone
export const WOLLY_EAR_INNER = '#F279A6' // pink accent
export const WOLLY_NOSE = '#C4785A' // unique — warm brown
export const WOLLY_SCARF = '#FDC631' // accent yellow
export const WOLLY_YARN = '#FDC631' // accent yellow

export const TEXT_DARK = '#1A1A2E'
export const TEXT_MUTED = '#4A4A6A'

// ── Terrain (brand-aligned) ──
export const SKY_TOP = 'rgba(253,198,49,0.06)'
export const SKY_BOTTOM = '#F4F3ED'

// Depth layers — each layer has its own scroll speed and color
// Each layer rendered front-to-back (index 0 = farthest)
export const DEPTH_LAYERS = [
  // Far mountains — silhouette style, parallax 0.03
  { color: 'rgba(6,72,215,0.12)', speed: 0.012, peak: 55, spread: 0.45 },
  // Mid mountains — parallax 0.06
  { color: 'rgba(146,115,228,0.20)', speed: 0.025, peak: 45, spread: 0.35 },
  // Back hills — parallax 0.10
  { color: 'rgba(50,128,69,0.25)', speed: 0.05, peak: 35, spread: 0.30 },
  // Mid hills — parallax 0.18
  { color: 'rgba(242,121,166,0.28)', speed: 0.10, peak: 28, spread: 0.25 },
  // Near hills — parallax 0.28
  { color: 'rgba(146,115,228,0.35)', speed: 0.18, peak: 20, spread: 0.20 },
  // Front hill — parallax 0.40
  { color: 'rgba(253,198,49,0.20)', speed: 0.28, peak: 14, spread: 0.15 },
]

// Object depths — separate parallax for trees/details
export const TREE_DEPTHS = [
  { speed: 0.04, scale: [0.4, 0.6], count: 6, opacity: 0.12 },  // far trees
  { speed: 0.12, scale: [0.6, 0.9], count: 5, opacity: 0.20 },  // mid trees
  { speed: 0.30, scale: [0.9, 1.3], count: 4, opacity: 0.30 },  // near trees
]

export const GROUND_COLOR = 'rgba(26,26,46,0.10)'
export const GROUND_LINE = '#1A1A2E'
export const GROUND_LINE_Y = 3

// ── Sizing ──
export const WOLLY_WIDTH = 48
export const WOLLY_HEIGHT = 60

export const getGroundY = (height) => height * 0.55
export const getWoollyY = (height) => getGroundY(height) - WOLLY_HEIGHT

// Woolly screen X (fixed — camera scrolls terrain instead)
export const WOLLY_X = 48

// ── Scroll speed ──
export const SCROLL_SPEED_BASE = 1.0

// ── Props ──
export const PROP_SPAWN_INTERVAL = 60 // frames between spawns
export const BOOK_WIDTH = 14
export const BOOK_HEIGHT = 18
export const STAR_RADIUS = 8
export const BOOK_COLOR = '#DD3A34'    // brand red
export const STAR_COLOR = '#FDC631'    // brand yellow

// ── HUD ──
export const XP_BAR_WIDTH = 200
export const XP_BAR_HEIGHT = 12
export const XP_BAR_X = 20
export const XP_BAR_Y = 20
export const MAX_XP = 100

// ── Clouds ──
export const CLOUD_COUNT = 4
export const CLOUD_SPEED_MULTIPLIER = 0.15
