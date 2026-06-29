// ── Woolly colors (from DESIGN.md mascot system) ──
export const WOLLY_BODY = '#EDE9DC' // darker cream — visible on bg
export const WOLLY_FACE = '#E0DCCC' // face tone
export const WOLLY_EAR_INNER = '#F279A6' // pink accent
export const WOLLY_NOSE = '#C4785A' // unique — warm brown
export const WOLLY_SCARF = '#FDC631' // accent yellow
export const WOLLY_YARN = '#FDC631' // accent yellow

export const TEXT_DARK = '#1A1A2E'
export const TEXT_MUTED = '#4A4A6A'

// ── Sky ──
export const SKY_TOP = 'rgba(253,198,49,0.10)'
export const SKY_BOTTOM = '#F4F3ED'

// ── Forest depth layers — mountain silhouettes far-to-near ──
export const DEPTH_LAYERS = [
  // Farthest — ice peaks
  { color: 'rgba(180,200,240,0.10)', speed: 0.003, peak: 260, spread: 0.48 },
  // Far blue mountains
  { color: 'rgba(6,72,215,0.14)', speed: 0.008, peak: 200, spread: 0.45 },
  // Mid purple ridge
  { color: 'rgba(146,115,228,0.22)', speed: 0.018, peak: 160, spread: 0.42 },
  // Back green hills
  { color: 'rgba(50,128,69,0.30)', speed: 0.04, peak: 120, spread: 0.38 },
  // Mid teal forest
  { color: 'rgba(59,196,160,0.30)', speed: 0.08, peak: 90, spread: 0.33 },
  // Near pink hills
  { color: 'rgba(242,121,166,0.32)', speed: 0.14, peak: 60, spread: 0.28 },
  // Front gold hill
  { color: 'rgba(253,198,49,0.22)', speed: 0.24, peak: 36, spread: 0.22 },
]

// ── Tree types for each depth ──
export const TREE_DEPTHS = [
  // Far — tiny pine silhouettes
  { speed: 0.01, type: 'pine', scale: [1.0, 1.6], count: 16, opacity: 0.10 },
  // Mid-far — mixed
  { speed: 0.03, type: 'mixed', scale: [1.5, 2.2], count: 10, opacity: 0.16 },
  // Mid — oak trees (tall canopy)
  { speed: 0.07, type: 'oak', scale: [2.0, 2.8], count: 7, opacity: 0.24 },
  // Mid-near — bamboo
  { speed: 0.14, type: 'bamboo', scale: [2.5, 3.5], count: 8, opacity: 0.34 },
  // Near — giant oak, foreground
  { speed: 0.28, type: 'oak', scale: [3.2, 4.0], count: 4, opacity: 0.46 },
  // Closest — large pine silhouettes
  { speed: 0.40, type: 'pine', scale: [3.5, 4.5], count: 3, opacity: 0.50 },
]

// ── Ground ──
export const GROUND_COLOR = 'rgba(26,26,46,0.10)'
export const GROUND_LINE_COLOR = '#1A1A2E'
export const GROUND_LINE_Y = 3

// ── Mist ──
export const MIST_LAYERS = [
  { y: 0.20, h: 0.08, alpha: 0.08, speed: 0.008 },
  { y: 0.35, h: 0.06, alpha: 0.12, speed: 0.015 },
  { y: 0.50, h: 0.10, alpha: 0.06, speed: 0.025 },
]

// ── Light rays ──
export const RAY_COUNT = 3
export const RAY_ALPHA = 0.04

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
