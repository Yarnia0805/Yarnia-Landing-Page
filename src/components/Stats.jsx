import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import FaultyTerminal from './backgrounds/FaultyTerminal'
import { useCanvasSupport } from '../hooks/useCanvasSupport'

const stats = [
  { value: 12000, suffix: '+', label: 'Gia đình tin dùng', color: '#DD3A34' },
  { value: 360,   suffix: '+', label: 'Câu chuyện hay', color: '#0648D7' },
  { value: 98,    suffix: '%', label: 'Phụ huynh hài lòng', color: '#328045' },
  { value: 4.9,   suffix: '/5', label: 'Đánh giá trung bình', color: '#9273E4', decimal: 1 },
]

function CountUp({ value, suffix, decimal, color }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 })
  const displayRef = useRef(null)

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    const unsub = spring.on('change', v => {
      if (displayRef.current) {
        displayRef.current.textContent = decimal
          ? v.toFixed(decimal)
          : Math.round(v).toLocaleString('vi-VN')
      }
    })
    return unsub
  }, [spring, decimal])

  return (
    <span className="font-display font-black" style={{ color, fontSize: 'clamp(36px,5vw,56px)' }}>
      <span ref={ref}/>
      <span ref={displayRef}>0</span>
      {suffix}
    </span>
  )
}

export default function Stats() {
  const canvasOk = useCanvasSupport()
  return (
    <section className="py-16 relative overflow-hidden" style={{ background: '#1A1A2E' }}>
      <div className="absolute inset-0 pointer-events-none">
        {canvasOk && <FaultyTerminal
          scale={1.0}
          gridMul={[2, 1]}
          digitSize={2.0}
          timeScale={0.2}
          tint="#9273E4"
          scanlineIntensity={0.4}
          glitchAmount={1.5}
          flickerAmount={1.0}
          noiseAmp={0.5}
          brightness={0.3}
          mouseReact={false}
          pageLoadAnimation={false}
          curvature={0}
          style={{ position: 'absolute', inset: 0 }}
        />}
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <CountUp {...s}/>
              <div className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

