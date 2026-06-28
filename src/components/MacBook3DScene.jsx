import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.setDecoderPath('/draco/')

const F = 'Arial, sans-serif'

/* word list — ASCII only to avoid canvas diacritic rendering bugs */
const WORDS_ASCII = 'Ngay xua co hai chi em Tam va Cam song voi nhau Tam hien lanh cham chi con Cam thi luoi bieng va hay ghen ghet'.split(' ')
/* display words with diacritics — matched by index */
const WORDS_VN   = 'Ngày xưa, có hai chị em Tấm và Cám sống với nhau. Tấm hiền lành, chăm chỉ, còn Cám thì lười biếng và hay ghen ghét.'.split(' ')

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.arcTo(x+w, y, x+w, y+h, r)
  ctx.arcTo(x+w, y+h, x, y+h, r)
  ctx.arcTo(x, y+h, x, y, r)
  ctx.arcTo(x, y, x+w, y, r)
  ctx.closePath()
}

/* ── Dynamic region: word highlight + progress bars ── */
function drawDynamic(ctx, W, H, wordIdx, progress) {
  const SB = 280, RX = SB + 1
  const PLAYER_H = 68
  const TEXT_TOP = 190
  const textX = RX + 44
  const maxLineW = W - RX - 88

  /* clear text area */
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(RX, TEXT_TOP - 4, W - RX, H - TEXT_TOP - PLAYER_H - 4)

  /* thin progress bar under header */
  ctx.fillStyle = '#e4e8ff'; ctx.fillRect(RX, 186, W - RX, 4)
  ctx.fillStyle = '#0648D7'; ctx.fillRect(RX, 186, (W - RX) * Math.min(progress / 100, 1), 4)

  /* word-by-word rendering */
  ctx.font = `500 27px ${F}`; ctx.textBaseline = 'alphabetic'
  const lineH = 52
  let curX = textX, curY = TEXT_TOP + 38

  WORDS_VN.forEach((word, i) => {
    const ww = ctx.measureText(word + ' ').width
    if (curX + ww > textX + maxLineW) { curX = textX; curY += lineH }
    if (curY > H - PLAYER_H - 20) return
    const isH = i === wordIdx, isPast = i < wordIdx
    if (isH) {
      ctx.fillStyle = '#0648D7'
      roundRect(ctx, curX - 4, curY - 32, ww + 4, 40, 8); ctx.fill()
      ctx.fillStyle = '#ffffff'
    } else {
      ctx.fillStyle = isPast ? 'rgba(6,72,215,0.42)' : '#1A1A2E'
    }
    ctx.fillText(word, curX, curY)
    curX += ww
  })

  /* player track (dynamic part only) */
  const PY = H - PLAYER_H + 22
  const trackX = RX + 175, trackW = W - RX - 340
  ctx.fillStyle = '#e8e8ee'; roundRect(ctx, trackX, PY - 3, trackW, 6, 3); ctx.fill()
  const fill = Math.min(progress / 100, 1) * trackW
  ctx.fillStyle = '#0648D7'; roundRect(ctx, trackX, PY - 3, fill, 6, 3); ctx.fill()
  ctx.beginPath(); ctx.arc(trackX + fill, PY, 9, 0, Math.PI * 2); ctx.fill()
  /* time */
  const elapsed = Math.round((progress / 100) * 204)
  const mm = Math.floor(elapsed / 60), ss = elapsed % 60
  ctx.fillStyle = '#888'; ctx.font = `500 19px ${F}`; ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'; ctx.fillText(`${mm}:${ss.toString().padStart(2,'0')}`, trackX, PY - 20)
  ctx.textAlign = 'right'; ctx.fillText('3:24', trackX + trackW, PY - 20); ctx.textAlign = 'left'
}

/* ── Static UI ── */
function makeScreenTexture() {
  const W = 1440, H = 900
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const x = c.getContext('2d')

  x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H)

  const SB = 280, HDR = 70, PLAYER_H = 68
  const RX = SB + 1

  /* macOS chrome */
  x.fillStyle = '#ececed'; x.fillRect(0, 0, W, 36)
  ;['#FF5F57','#FFBD2E','#28C840'].forEach((col, i) => {
    x.fillStyle = col; x.beginPath(); x.arc(16 + i*20, 18, 6, 0, Math.PI*2); x.fill()
  })
  x.fillStyle = '#fff'; roundRect(x, 72, 5, 210, 26, 7); x.fill()
  x.fillStyle = '#444'; x.font = `600 13px ${F}`; x.textAlign = 'left'; x.textBaseline = 'middle'
  x.fillText('Tam Cam - Yarnia', 86, 18)
  x.fillStyle = '#fff'; x.strokeStyle = '#ccc'; x.lineWidth = 1
  roundRect(x, 330, 5, 600, 26, 7); x.fill(); x.stroke()
  x.fillStyle = '#888'; x.font = `500 12px ${F}`; x.textAlign = 'center'
  x.fillText('yarnia.vn/stories/tam-cam', 630, 18)

  /* app navbar */
  x.fillStyle = '#fff'; x.fillRect(0, 36, W, 46)
  x.strokeStyle = '#eee'; x.lineWidth = 1
  x.beginPath(); x.moveTo(0, 82); x.lineTo(W, 82); x.stroke()
  x.fillStyle = '#0648D7'; x.font = `800 20px ${F}`; x.textAlign = 'left'; x.textBaseline = 'middle'
  x.fillText('Yarnia', 20, 59)
  ;['Trang chu','Kho truyen','Bang xep hang','Ho so'].forEach((n, i) => {
    x.fillStyle = i===1 ? '#0648D7' : '#666'
    x.font = i===1 ? `700 13px ${F}` : `500 13px ${F}`
    x.fillText(n, 250 + i*148, 59)
  })
  x.fillStyle = '#FFF7ED'; x.strokeStyle = '#FDE68A'; x.lineWidth = 1.5
  roundRect(x, W-210, 46, 108, 26, 13); x.fill(); x.stroke()
  x.fillStyle = '#B8860B'; x.font = `700 12px ${F}`; x.textAlign = 'center'
  x.fillText('1,240 XP', W-156, 59)
  x.fillStyle = '#0648D7'; x.beginPath(); x.arc(W-62, 59, 15, 0, Math.PI*2); x.fill()
  x.fillStyle = '#fff'; x.font = `700 13px ${F}`; x.fillText('T', W-62, 59)

  /* sidebar */
  x.fillStyle = '#fafafa'; x.fillRect(0, 82, SB, H-82)
  x.strokeStyle = '#e8e8e8'; x.lineWidth = 1
  x.beginPath(); x.moveTo(SB, 82); x.lineTo(SB, H); x.stroke()
  x.fillStyle = '#aaa'; x.font = `700 11px ${F}`; x.textAlign = 'left'; x.textBaseline = 'middle'
  x.fillText('4 CAU CHUYEN', 14, 104)

  const stories = [
    { t:'Tam Cam', s:'Co tich · 6-10 tuoi', xp:'+50 XP', col:'#0648D7', on:true },
    { t:'Tho va Rua', s:'Ngu ngon · 4-8 tuoi', xp:'+40 XP', col:'#328045' },
    { t:'Son Tinh Thuy Tinh', s:'Than thoai · 7-12', xp:'+65 XP', col:'#9273E4' },
    { t:'Bach Tuoc Ti Hon', s:'Khoa hoc · 8-12', xp:'+55 XP', col:'#0099CC' },
  ]
  let sy = 118
  stories.forEach(st => {
    const cH = 62
    x.fillStyle = st.on ? st.col : '#fff'
    roundRect(x, 8, sy, SB-16, cH, 12)
    if (!st.on) { x.strokeStyle = '#eee'; x.lineWidth = 1; x.fill(); x.stroke() } else { x.fill() }
    x.fillStyle = st.on ? '#fff' : '#1A1A2E'; x.font = `700 14px ${F}`; x.textAlign = 'left'
    x.fillText(st.t, 18, sy + 21)
    x.fillStyle = st.on ? 'rgba(255,255,255,0.7)' : '#999'; x.font = `500 11px ${F}`
    x.fillText(st.s, 18, sy + 41)
    x.fillStyle = st.on ? 'rgba(255,255,255,0.9)' : st.col; x.font = `700 12px ${F}`; x.textAlign = 'right'
    x.fillText(st.xp, SB-14, sy+21); x.textAlign = 'left'
    sy += cH + 8
  })

  /* vocab card */
  x.fillStyle = '#FFFBEB'; x.strokeStyle = '#FDE68A'; x.lineWidth = 1.5
  roundRect(x, 8, H-130, SB-16, 110, 14); x.fill(); x.stroke()
  x.fillStyle = '#B8860B'; x.font = `700 11px ${F}`; x.textBaseline = 'middle'; x.textAlign = 'left'
  x.fillText('TU MOI HOM NAY', 20, H-110)
  x.fillStyle = '#1A1A2E'; x.font = `800 17px ${F}`; x.fillText('Hien lanh', 20, H-86)
  x.fillStyle = '#6B6B8A'; x.font = `400 12px ${F}`; x.fillText('Kind, gentle - tinh cach tot dep', 20, H-64)
  x.fillStyle = '#0648D7'; x.font = `600 12px ${F}`; x.fillText('Xem them tu vung ->', 20, H-44)

  /* reader header */
  const grad = x.createLinearGradient(RX, 82, RX, 82+HDR)
  grad.addColorStop(0, '#0648D7'); grad.addColorStop(1, '#1E5FFF')
  x.fillStyle = grad; x.fillRect(RX, 82, W-RX, HDR)
  x.font = `28px serif`; x.textAlign = 'left'; x.textBaseline = 'middle'
  x.fillText('🏰', RX+18, 82+HDR/2)
  x.fillStyle = '#fff'; x.font = `800 22px ${F}`
  x.fillText('Tam Cam', RX+58, 82+HDR/2-10)
  x.fillStyle = 'rgba(255,255,255,0.75)'; x.font = `500 13px ${F}`
  x.fillText('Co tich · 6-10 tuoi · +50 XP', RX+58, 82+HDR/2+12)
  x.fillStyle = 'rgba(255,255,255,0.22)'; roundRect(x, W-106, 95, 78, 26, 13); x.fill()
  x.fillStyle = '#fff'; x.font = `700 13px ${F}`; x.textAlign = 'center'
  x.fillText('Trang 1/4', W-67, 108); x.textAlign = 'left'

  /* settings strip */
  x.fillStyle = '#f8f9ff'; x.fillRect(RX, 82+HDR, W-RX, 30)
  x.strokeStyle = '#e8eaff'; x.lineWidth = 1
  x.beginPath(); x.moveTo(RX, 82+HDR+30); x.lineTo(W, 82+HDR+30); x.stroke()
  ;['Aa Co chu','1x Toc do','Nen sang'].forEach((b, i) => {
    if (i===0) { x.fillStyle = '#EEF2FF'; roundRect(x, RX+12+i*175, 82+HDR+4, 110, 22, 6); x.fill() }
    x.fillStyle = i===0 ? '#0648D7' : '#777'; x.font = i===0 ? `700 12px ${F}` : `500 12px ${F}`
    x.textBaseline = 'middle'; x.fillText(b, RX+20+i*175, 82+HDR+15)
  })

  /* initial dynamic draw */
  drawDynamic(x, W, H, -1, 0)

  /* player bar static */
  const PY_c = H - PLAYER_H + 22
  x.fillStyle = '#fff'; x.fillRect(RX, H-PLAYER_H, W-RX, PLAYER_H)
  x.strokeStyle = '#eaeaff'; x.lineWidth = 1
  x.beginPath(); x.moveTo(RX, H-PLAYER_H); x.lineTo(W, H-PLAYER_H); x.stroke()
  x.fillStyle = '#aaa'; x.font = `500 16px ${F}`; x.textBaseline = 'middle'; x.textAlign = 'center'
  x.fillText('<<', RX+56, PY_c)
  x.fillStyle = '#0648D7'; x.beginPath(); x.arc(RX+106, PY_c, 22, 0, Math.PI*2); x.fill()
  x.fillStyle = '#fff'; x.beginPath()
  x.moveTo(RX+99, PY_c-11); x.lineTo(RX+99, PY_c+11); x.lineTo(RX+119, PY_c); x.closePath(); x.fill()
  x.fillStyle = '#aaa'; x.textAlign = 'center'; x.fillText('>>', RX+154, PY_c)
  x.fillStyle = '#EEF2FF'; roundRect(x, W-208, H-PLAYER_H+12, 50, 26, 8); x.fill()
  x.fillStyle = '#0648D7'; x.font = `700 13px ${F}`; x.fillText('1x', W-183, PY_c)
  x.fillStyle = '#f5f5f7'; roundRect(x, W-148, H-PLAYER_H+12, 50, 26, 8); x.fill()
  x.fillStyle = '#555'; x.font = `700 13px ${F}`; x.fillText('Vol', W-123, PY_c)
  x.fillStyle = '#FFF7ED'; roundRect(x, W-88, H-PLAYER_H+12, 60, 26, 8); x.fill()
  x.fillStyle = '#B8860B'; x.font = `700 13px ${F}`; x.fillText('Luu', W-58, PY_c)
  x.textAlign = 'left'

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.flipY = true
  tex.needsUpdate = true
  return { canvas: c, tex }
}

/* ─── MacBook model ── */
function MacBookModel({ phase, wordIdx, progress }) {
  const { scene } = useGLTF('/macbook-pro.glb')
  const lidPivotRef = useRef(null)
  const lidOpen = useRef(1)
  const targetOpen = useRef(1)
  const canvasRef = useRef(null)
  const texRef = useRef(null)

  const model = useMemo(() => scene.clone(true), [scene])

  const setup = useMemo(() => {
    model.updateWorldMatrix(true, true)
    const full = new THREE.Box3().setFromObject(model)
    const fullSize = new THREE.Vector3(); full.getSize(fullSize)
    const hingeY = full.min.y + fullSize.y * 0.42
    const hingeZ = full.max.z
    const lidMeshes = []
    const { canvas, tex } = makeScreenTexture()
    canvasRef.current = canvas
    texRef.current = tex
    model.traverse(obj => {
      if (!obj.isMesh) return
      obj.castShadow = true; obj.receiveShadow = true
      const b = new THREE.Box3().setFromObject(obj)
      const cv = new THREE.Vector3(); b.getCenter(cv)
      if (cv.y > hingeY) lidMeshes.push(obj)
      if (obj.name === 'Object_123') {
        obj.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
      }
    })
    const pivot = new THREE.Group()
    pivot.position.set(0, hingeY, hingeZ)
    model.add(pivot)
    lidMeshes.forEach(m => pivot.attach(m))
    return { pivot }
  }, [model])

  useEffect(() => { lidPivotRef.current = setup.pivot }, [setup])
  useEffect(() => { targetOpen.current = phase === 'closed' ? 0 : 1 }, [phase])

  useEffect(() => {
    const canvas = canvasRef.current; const tex = texRef.current
    if (!canvas || !tex) return
    drawDynamic(canvas.getContext('2d'), canvas.width, canvas.height, wordIdx, progress)
    tex.needsUpdate = true
  }, [wordIdx, progress])

  useFrame((_, delta) => {
    const pivot = lidPivotRef.current; if (!pivot) return
    lidOpen.current = THREE.MathUtils.lerp(lidOpen.current, targetOpen.current, delta * 1.4)
    pivot.rotation.x = Math.PI * 0.52 * (1 - lidOpen.current)
  })

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3(), center = new THREE.Vector3()
    box.getSize(size); box.getCenter(center)
    const scale = 3.2 / (Math.max(size.x, size.y, size.z) || 1)
    return { scale, offset: [-center.x, -center.y, -center.z] }
  }, [model])

  return (
    <group rotation={[0, -0.4, 0]} position={[0, -0.1, 0]} scale={fit.scale}>
      <group position={fit.offset}><primitive object={model} /></group>
    </group>
  )
}

/* ─── Camera ── */
function CameraRig({ phase }) {
  const { camera } = useThree()
  const tz = useRef(5.5), ty = useRef(1.8)
  useEffect(() => {
    if (phase !== 'closed') { tz.current = 5.4; ty.current = 1.6 }
    else { tz.current = 6.2; ty.current = 2.2 }
  }, [phase])
  useFrame((_, delta) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz.current, delta * 0.6)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty.current, delta * 0.6)
    camera.lookAt(0, 0.2, 0)
  })
  return null
}

/* ─── Float ── */
function FloatGroup({ children }) {
  const ref = useRef(); const t = useRef(0)
  useFrame((_, delta) => {
    t.current += delta
    if (ref.current) ref.current.position.y = Math.sin(t.current * 0.55) * 0.04
  })
  return <group ref={ref}>{children}</group>
}

/* ─── Export ── */
export default function MacBook3DScene({ phase, wordIdx = -1, progress = 0, style }) {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas shadows gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }} dpr={[1, 1.5]} style={{ background: 'transparent' }}>
        <PerspectiveCamera makeDefault fov={34} position={[0.4, 1.6, 6.2]} />
        <CameraRig phase={phase} />
        <ambientLight intensity={0.4} color="#f0f3ff" />
        <directionalLight position={[4, 8, 5]} intensity={2.6} castShadow color="#ffffff" shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
        <directionalLight position={[-6, 4, -2]} intensity={1.0} color="#cdd8ff" />
        <directionalLight position={[0, 2, -6]} intensity={0.8} color="#ffffff" />
        <Suspense fallback={null}>
          <FloatGroup>
            <MacBookModel phase={phase} wordIdx={wordIdx} progress={progress} />
          </FloatGroup>
          <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={7} blur={2.8} far={3} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/macbook-pro.glb')
