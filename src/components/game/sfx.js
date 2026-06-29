let ctx = null
let muted = true

export function isMuted() { return muted }
export function toggleSfx() {
  muted = !muted
  if (!muted && !ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return !muted
}

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function playTone(freq, duration, type = 'square', volume = 0.1) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    gain.gain.setValueAtTime(volume, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + duration)
  } catch {}
}

function playNoise(duration, volume = 0.05) {
  try {
    const c = getCtx()
    const bufSize = c.sampleRate * duration
    const buf = c.createBuffer(1, bufSize, c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2)
    }
    const src = c.createBufferSource()
    src.buffer = buf
    const gain = c.createGain()
    gain.gain.setValueAtTime(volume, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    src.connect(gain)
    gain.connect(c.destination)
    src.start(c.currentTime)
  } catch {}
}

export function sfxJump() { if (muted) return
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(300, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.15)
  gain.gain.setValueAtTime(0.08, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.2)
}

export function sfxCollect() { if (muted) return
  playTone(880, 0.1, 'sine', 0.08)
  setTimeout(() => playTone(1320, 0.15, 'sine', 0.06), 60)
}

export function sfxHit() { if (muted) return
  playNoise(0.15, 0.1)
  playTone(150, 0.2, 'sawtooth', 0.06)
}

export function sfxLevelUp() { if (muted) return
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.25, 'sine', 0.07), i * 100)
  })
}

export function sfxGameOver() { if (muted) return
  const notes = [392, 349, 330, 262]
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, 'sawtooth', 0.06), i * 150)
  })
}

// ── Forest ambient ──

let ambientNodes = null

export function startForestAmbient() {
  if (muted || ambientNodes) return
  const c = getCtx()

  // Wind noise
  const bufSize = c.sampleRate * 2
  const buf = c.createBuffer(1, bufSize, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 0.3)
  }

  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true

  const windGain = c.createGain()
  windGain.gain.setValueAtTime(0.015, c.currentTime)
  src.connect(windGain)
  windGain.connect(c.destination)
  src.start()

  // Bird chirps (intermittent)
  let chirpInterval = setInterval(() => {
    if (muted) return
    const freq = 1200 + Math.random() * 800
    playTone(freq, 0.08, 'sine', 0.02)
    setTimeout(() => playTone(freq + 200, 0.06, 'sine', 0.015), 80)
  }, 2000 + Math.random() * 3000)

  // Cricket (low square wave)
  const cricket = c.createOscillator()
  const cricketGain = c.createGain()
  cricket.type = 'square'
  cricket.frequency.setValueAtTime(4000, c.currentTime)
  cricketGain.gain.setValueAtTime(0.004, c.currentTime)
  // Pulse the cricket
  const now = c.currentTime
  for (let i = 0; i < 60; i++) {
    cricketGain.gain.setValueAtTime(0.004, now + i * 0.3)
    cricketGain.gain.setValueAtTime(0.001, now + i * 0.3 + 0.15)
  }
  cricket.connect(cricketGain)
  cricketGain.connect(c.destination)
  cricket.start()

  ambientNodes = { src, windGain, cricket, cricketGain, chirpInterval }
}

export function stopForestAmbient() {
  if (!ambientNodes) return
  try {
    ambientNodes.src.stop()
    ambientNodes.cricket.stop()
    clearInterval(ambientNodes.chirpInterval)
  } catch {}
  ambientNodes = null
}

