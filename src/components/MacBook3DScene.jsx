import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* Tell drei where to find Draco decoder (needed for this GLB) */
useGLTF.setDecoderPath('/draco/')

/* ─── Screen UI rendered inside canvas via Html ───────────── */
function ScreenContent() {
  return (
    <div style={{
      width: 1280, height: 800,
      background: '#fff',
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', borderRadius: 6,
    }}>
      {/* Chrome bar */}
      <div style={{ height: 38, background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }}/>)}
        </div>
        <div style={{ flex: 1, margin: '0 60px', background: 'white', borderRadius: 7, border: '1px solid #d0d0d0', height: 25, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, color: '#555', gap: 5 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ color: '#888' }}>yarnia.vn</span><span>/stories/</span><span style={{ color: '#0648D7', fontWeight: 700 }}>tam-cam</span>
        </div>
      </div>

      {/* App body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 252, background: '#fafafa', borderRight: '1px solid #e8e8e8', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '0.12em', padding: '0 6px 6px', textTransform: 'uppercase' }}>4 câu chuyện</div>
          {[
            { t: 'Tấm Cám', c: 'Cổ tích · 6–10 tuổi', xp: '+50XP', col: '#0648D7', e: '🏰', active: true },
            { t: 'Thỏ và Rùa', c: 'Ngụ ngôn · 4–8 tuổi', xp: '+40XP', col: '#328045', e: '🐢' },
            { t: 'Sơn Tinh Thủ...', c: 'Thần thoại · 7–12', xp: '+65XP', col: '#9273E4', e: '⛰️' },
            { t: 'Bạch Tuộc T...', c: 'Khoa học · 8–12', xp: '+55XP', col: '#0099CC', e: '🐙' },
          ].map((s, i) => (
            <div key={i} style={{ borderRadius: 11, padding: '9px 10px', display: 'flex', gap: 9, alignItems: 'center', background: s.active ? s.col : 'transparent', border: s.active ? 'none' : '1.5px solid #eee' }}>
              <span style={{ fontSize: 17 }}>{s.e}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: s.active ? '#fff' : '#1A1A2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.t}</div>
                <div style={{ fontSize: 10, color: s.active ? 'rgba(255,255,255,0.7)' : '#999', marginTop: 1 }}>{s.c}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.active ? 'rgba(255,255,255,0.9)' : '#0648D7', background: s.active ? 'rgba(255,255,255,0.2)' : '#0648D712', borderRadius: 5, padding: '2px 5px', flexShrink: 0 }}>{s.xp}</div>
            </div>
          ))}
          <div style={{ marginTop: 'auto', background: '#FDC63118', border: '1.5px solid #FDC63140', borderRadius: 11, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#B8860B', marginBottom: 3 }}>🌟 TỪ MỚI</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A2E' }}>Hiền lành</div>
            <div style={{ fontSize: 11, color: '#6B6B8A', marginTop: 2, lineHeight: 1.4 }}>Kind, gentle – tính cách tốt đẹp</div>
          </div>
        </div>

        {/* Reader panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px 12px', background: '#0648D7', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>🏰</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>Tấm Cám</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)' }}>Cổ tích · 6–10 tuổi</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 7, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>1 / 4</div>
            </div>
          </div>
          <div style={{ height: 3, background: '#e4e4e4', flexShrink: 0 }}>
            <div style={{ width: '25%', height: '100%', background: '#0648D7' }}/>
          </div>
          <div style={{ flex: 1, padding: '26px 30px', overflowY: 'hidden', background: '#fff' }}>
            <p style={{ fontSize: 19, lineHeight: 1.9, color: '#1A1A2E', margin: 0 }}>
              Ngày xưa, có hai chị em{' '}
              <span style={{ background: '#0648D7', color: '#fff', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>Tấm</span>
              {' '}và <strong>Cám</strong> sống với nhau.{' '}
              <span style={{ background: '#0648D720', borderRadius: 3, padding: '0 2px', fontWeight: 600 }}>Tấm</span>
              {' '}hiền lành, chăm chỉ, còn Cám thì lười biếng và hay ghen ghét.
            </p>
          </div>
          <div style={{ padding: '11px 22px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>🔊 TTS · 1×</div>
            <div style={{ flex: 1, height: 4, background: '#e0e0e0', borderRadius: 4 }}>
              <div style={{ width: '25%', height: '100%', background: '#0648D7', borderRadius: 4 }}/>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {['⏮','⏭'].map((icon, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{icon}</div>
              ))}
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#0648D7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '11px solid #fff', marginLeft: 3 }}/>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>T.1 · 3:24</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Screen Html anchor — lives inside scene's screen node ── */
function ScreenHtml({ screenNode, phase }) {
  /*
   * We render this component as a child of <primitive object={screenNode}/>.
   * screenNode is the Three.js Object3D for the lid — Html follows it automatically.
   *
   * screen node local space (GLB rest = lid open, 90° around X already applied):
   *   - matte bbox in model space: x±15.2, z[-21.3..-1.7], y≈-0.46
   *   - In screen-node LOCAL space after 90°X: original Z becomes Y, original Y becomes -Z
   *   - matte center z_model = -11.5 → local y = 11.5
   *   - matte center y_model = -0.46 → local z = 0.46
   *   - matte width=30.4, height(z-span)=19.6
   *   - Html scale: 30.4 model units = 1280px → scale = 30.4/1280 = 0.02375
   */
  const screenOn = phase === 'opening' || phase === 'typing' || phase === 'ready'
  if (!screenOn) return null

  const opacity = phase === 'opening' ? 0.6 : 1

  return (
    <primitive object={screenNode}>
      <Html
        transform
        occlude={false}
        position={[0, 11.5, 0.5]}
        rotation={[0, Math.PI, 0]}
        style={{
          width: 1280,
          height: 800,
          pointerEvents: 'none',
          overflow: 'hidden',
          borderRadius: 4,
          opacity,
          transition: 'opacity 1.2s ease',
        }}
        scale={0.02375}
      >
        <ScreenContent />
      </Html>
    </primitive>
  )
}

/* ─── MacBook model ───────────────────────────────────────── */
function MacBookModel({ phase }) {
  const { scene } = useGLTF('/macbook.glb')
  const screenNodeRef = useRef(null)
  const [screenNode, setScreenNode] = useState(null)
  const lidOpen = useRef(0)
  const targetOpen = useRef(0)

  useEffect(() => {
    scene.traverse(obj => {
      if (obj.name === 'screen') {
        screenNodeRef.current = obj
        setScreenNode(obj)
      }
    })
  }, [scene])

  useEffect(() => {
    targetOpen.current = phase === 'closed' ? 0 : 1
  }, [phase])

  useFrame((_, delta) => {
    lidOpen.current = THREE.MathUtils.lerp(lidOpen.current, targetOpen.current, delta * 0.55)
    const node = screenNodeRef.current
    if (!node) return

    /* GLB rest = lid open (90°X). Extra rotation closes lid. */
    const baseQ = new THREE.Quaternion(0.7071068, 0, 0, 0.7071068)
    const closeAngle = Math.PI * 0.56
    const extraQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      closeAngle * (1 - lidOpen.current)
    )
    node.quaternion.copy(baseQ).premultiply(extraQ)
  })

  /* ── MacBook keyboard layout (model units at scale=0.095)
   * Body runs z: -12 (hinge) → +11 (front edge), total depth ≈23
   * Keyboard area: z -7 → +3  (center z=-2)
   * Spacebar row:  z ≈ +4
   * Trackpad:      z +5.5 → +10.5 (center z=+8)
   * x range: ±13 (body width ≈26)
   */
  const KY = 0.07   // key top face Y above body surface
  const kw = 1.38, kd = 1.18, gx = 0.24, gz = 0.24
  const cols = 14, rows = 4
  const totalW = cols * (kw + gx) - gx  // ≈22.5
  const totalD = rows * (kd + gz) - gz  // ≈ 5.6
  // keyboard block center: z = -2 (upper body, near hinge side = negative z)
  const kbCenterZ = -2.0

  const keyRows = [
    // row 0 (top — number row): 14 keys
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','⌫'],
    // row 1: tab + QWERTYUIOP[]
    ['⇥','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
    // row 2: caps + ASDFGHJKL;'
    ['⇪','A','S','D','F','G','H','J','K','L',';',"'",'↩','↩'],
    // row 3: shift + ZXCVBNM,./
    ['⇧','Z','X','C','V','B','N','M',',','.','/',null,'⇧','⇧'],
  ]

  const keys = []
  for (let r = 0; r < rows; r++) {
    let xCursor = -totalW / 2
    const rowLabels = keyRows[r]
    for (let c = 0; c < cols; c++) {
      const label = rowLabels[c]
      if (label === null) continue   // skip merged key slot
      // Return key spans 2 cols at row 2
      const isReturn = r === 2 && c === 12
      // Shift spans 2 cols at row 3 col 12
      const isRShift = r === 3 && c === 12
      const w = (isReturn || isRShift) ? kw * 2 + gx : kw
      const cx = xCursor + w / 2
      const cz = kbCenterZ - totalD / 2 + r * (kd + gz) + kd / 2
      keys.push({ x: cx, z: cz, w, label, r, c })
      xCursor += w + gx
    }
  }

  // Function key row (row -1, above number row)
  const fnKeys = ['esc','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','⏏']
  const fnCenterZ = kbCenterZ - totalD / 2 - kd * 0.85 - gz
  const fnKw = totalW / fnKeys.length - gx * 0.7

  return (
    <group scale={0.095} rotation={[0, -0.3, 0]} position={[0, 0.05, 0.5]}>
      <primitive object={scene} />

      {/* Main key grid */}
      {keys.map(({ x, z, w, label }, i) => (
        <mesh key={i} position={[x, KY, z]} castShadow>
          <boxGeometry args={[w, 0.22, kd]} />
          <meshStandardMaterial color="#1e1e1e" metalness={0.15} roughness={0.75} />
        </mesh>
      ))}

      {/* Function row */}
      {fnKeys.map((label, i) => {
        const fx = -totalW / 2 + i * (fnKw + gx * 0.7) + fnKw / 2
        return (
          <mesh key={`fn${i}`} position={[fx, KY, fnCenterZ]} castShadow>
            <boxGeometry args={[fnKw, 0.16, kd * 0.72]} />
            <meshStandardMaterial color="#1e1e1e" metalness={0.15} roughness={0.75} />
          </mesh>
        )
      })}

      {/* Spacebar */}
      <mesh position={[0, KY, kbCenterZ + totalD / 2 + gz + kd / 2]} castShadow>
        <boxGeometry args={[10.2, 0.22, kd]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.15} roughness={0.75} />
      </mesh>

      {/* Bottom modifier row (fn/ctrl/opt/cmd · arrows · cmd/opt) */}
      {[
        { x: -totalW/2 + 0.7, w: 1.4, label: 'fn' },
        { x: -totalW/2 + 2.8, w: 1.4, label: '⌃' },
        { x: -totalW/2 + 4.5, w: 1.8, label: '⌥' },
        { x: -totalW/2 + 7.0, w: 2.4, label: '⌘' },
        { x:  totalW/2 - 7.0, w: 2.4, label: '⌘' },
        { x:  totalW/2 - 4.5, w: 1.8, label: '⌥' },
        { x:  totalW/2 - 2.2, w: 1.4, label: '◄' },
        { x:  totalW/2 - 0.7, w: 1.4, label: '►' },
      ].map(({ x, w, label }, i) => {
        const mz = kbCenterZ + totalD / 2 + gz + kd / 2
        return (
          <mesh key={`mod${i}`} position={[x, KY, mz + kd + gz]} castShadow>
            <boxGeometry args={[w, 0.22, kd]} />
            <meshStandardMaterial color="#1e1e1e" metalness={0.15} roughness={0.75} />
          </mesh>
        )
      })}

      {/* Trackpad — centered below spacebar, near front edge */}
      <mesh position={[0, 0.025, kbCenterZ + totalD / 2 + gz + kd + gz + 4.8]} castShadow>
        <boxGeometry args={[9.2, 0.05, 6.0]} />
        <meshStandardMaterial color="#b0b0b8" metalness={0.88} roughness={0.08} />
      </mesh>

      {screenNode && (
        <ScreenHtml screenNode={screenNode} phase={phase} />
      )}
    </group>
  )
}

/* ─── Camera ─────────────────────────────────────────────── */
function CameraRig({ phase }) {
  const { camera } = useThree()
  const tz = useRef(5.5)
  const ty = useRef(1.8)

  useEffect(() => {
    if (phase !== 'closed') { tz.current = 4.6; ty.current = 1.2 }
    else { tz.current = 5.5; ty.current = 1.8 }
  }, [phase])

  useFrame((_, delta) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz.current, delta * 0.5)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty.current, delta * 0.5)
    camera.lookAt(0, 0.1, 0)
  })
  return null
}

/* ─── Idle float ─────────────────────────────────────────── */
function FloatGroup({ children }) {
  const ref = useRef()
  const t = useRef(0)
  useFrame((_, delta) => {
    t.current += delta
    if (ref.current) {
      ref.current.position.y = Math.sin(t.current * 0.55) * 0.04
    }
  })
  return <group ref={ref}>{children}</group>
}

/* ─── Export ─────────────────────────────────────────────── */
export default function MacBook3DScene({ phase, style }) {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault fov={34} position={[0.5, 1.8, 5.5]} />
        <CameraRig phase={phase} />

        <ambientLight intensity={0.55} color="#eaeeff" />
        <directionalLight
          position={[4, 8, 5]} intensity={2.2} castShadow color="#ffffff"
          shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 3, -3]} intensity={0.7} color="#c0ccff" />
        <pointLight position={[0, 5, 2]} intensity={0.5} color="#fff" />

        <Suspense fallback={null}>
          <FloatGroup>
            <MacBookModel phase={phase} />
          </FloatGroup>
          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.3} scale={5} blur={2.5} far={2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/macbook.glb')
