import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef } from 'react'
import WoollyMascot from './WoollyMascot'
import { BookOpen, Sparkle, Star, ArrowRight } from '@phosphor-icons/react'
import PixelSnow from './backgrounds/PixelSnow'
import { useCanvasSupport } from '../hooks/useCanvasSupport'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
  },
})

function FloatingBadge({ children, className = '', style = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className={`absolute px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function MagneticCTA({ href, children, primary = false }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.22)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={primary
        ? { x: sx, y: sy, background: '#FDC631', boxShadow: '0 8px 32px rgba(253,198,49,0.45)' }
        : { x: sx, y: sy, background: 'white', borderColor: 'rgba(26,26,46,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base cursor-pointer select-none text-[#1A1A2E] ${!primary ? 'border-2' : ''}`}
    >
      {children}
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: primary ? 'rgba(26,26,46,0.12)' : '#F4F3ED' }}
      >
        <ArrowRight size={14} weight="bold" color="#1A1A2E"/>
      </span>
    </motion.a>
  )
}

export default function Hero() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const canvasOk = useCanvasSupport()

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20"
      style={{ background: 'rgba(244,243,237,0.15)' }}
    >
      {/* soft ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-30 animate-blob"
          style={{ background: 'radial-gradient(circle at 40% 40%, #FDC631 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full opacity-20 animate-blob"
          style={{ background: 'radial-gradient(circle, #9273E4 0%, transparent 65%)', animationDelay: '4s' }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-[320px] h-[320px] rounded-full animate-blob"
          style={{ background: 'radial-gradient(circle, #F279A6 0%, transparent 65%)', animationDelay: '7s', opacity: 0.12 }}
        />
        {canvasOk && <PixelSnow density={70} speed={0.35} pixelSize={3} opacity={0.45}/>}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#1A1A2E" opacity="0.045"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-20 items-center py-24">
        {/* ── left text ── */}
        <div>
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-8"
            style={{ background: 'rgba(253,198,49,0.18)', color: '#B8860B', border: '1px solid rgba(253,198,49,0.35)' }}
          >
            <Sparkle size={12} weight="duotone"/>
            Nền tảng kể chuyện #1 cho trẻ Việt
          </motion.div>

          <motion.h1
            variants={fadeUp(0.1)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="font-display font-black leading-[1.08] tracking-tight mb-7"
            style={{ fontSize: 'clamp(38px, 5.5vw, 70px)', color: '#1A1A2E' }}
          >
            Thế giới truyện{' '}
            <span className="relative inline-block">
              <span style={{ color: '#DD3A34' }}>diệu kỳ</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" fill="none">
                <path d="M2 7 Q50 2 100 6 Q150 10 198 4" stroke="#FDC631" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
            </span>
            <br/>dành riêng cho con
          </motion.h1>

          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="text-lg leading-[1.8] mb-10 max-w-md"
            style={{ color: '#6B6B8A' }}
          >
            Yarnia mang đến 360+ câu chuyện tiếng Việt được biên soạn bởi chuyên gia,
            giúp bé <strong style={{ color: '#1A1A2E' }}>yêu thích đọc sách</strong>, phát triển
            ngôn ngữ và trí tưởng tượng từ 3–12 tuổi.
          </motion.p>

          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-wrap gap-4 mb-12"
          >
            <MagneticCTA href="#" primary>
              <BookOpen size={18}/>
              Bắt đầu miễn phí
            </MagneticCTA>
            <MagneticCTA href="#features">
              Xem tính năng
            </MagneticCTA>
          </motion.div>

          <motion.div
            variants={fadeUp(0.4)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex items-center gap-7 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#DD3A34','#0648D7','#328045','#9273E4','#F2763A'].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-[2.5px] border-white flex items-center justify-center text-white text-xs font-black"
                    style={{ background: c, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                  >
                    {['B','M','L','H','K'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: '#1A1A2E' }}>12,000+ gia đình</div>
                <div className="text-xs" style={{ color: '#6B6B8A' }}>đang tin dùng Yarnia</div>
              </div>
            </div>
            <div className="h-8 w-px" style={{ background: 'rgba(26,26,46,0.1)' }}/>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_,i) => <Star key={i} size={14} weight="fill" color="#FDC631"/>)}
              </div>
              <span className="text-sm font-bold" style={{ color: '#1A1A2E' }}>4.9</span>
              <span className="text-sm" style={{ color: '#6B6B8A' }}>/5 đánh giá</span>
            </div>
          </motion.div>
        </div>

        {/* ── right mascot ── */}
        <div className="relative flex items-center justify-center h-[560px]">
          <div className="absolute w-80 h-80 rounded-full opacity-35"
               style={{ background: 'radial-gradient(circle, #FDC631 0%, transparent 70%)' }}/>
          <div className="absolute w-48 h-48 rounded-full opacity-20 translate-x-24 -translate-y-16"
               style={{ background: 'radial-gradient(circle, #F279A6 0%, transparent 70%)' }}/>

          <motion.div
            initial={{ opacity: 0, scale: 0.65, y: 30 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="animate-float relative z-10"
          >
            <WoollyMascot size={280}/>
          </motion.div>

          <FloatingBadge
            className="left-0 top-24 text-white"
            style={{ background: '#0648D7', boxShadow: '0 8px 24px rgba(6,72,215,0.4)' }}
            delay={0.7}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📚</span>
              <div>
                <div className="text-[10px] opacity-75">Cổ tích</div>
                <div className="font-black text-sm">Tấm Cám</div>
              </div>
            </div>
          </FloatingBadge>

          <FloatingBadge
            className="right-0 top-28 text-white"
            style={{ background: '#328045', boxShadow: '0 8px 24px rgba(50,128,69,0.4)' }}
            delay={0.85}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🦋</span>
              <div>
                <div className="text-[10px] opacity-75">Ngụ ngôn</div>
                <div className="font-black text-sm">Thỏ & Rùa</div>
              </div>
            </div>
          </FloatingBadge>

          <FloatingBadge
            className="left-6 bottom-28 text-[#1A1A2E]"
            style={{ background: '#FDC631', boxShadow: '0 8px 24px rgba(253,198,49,0.5)' }}
            delay={1.0}
          >
            🔥 Chuỗi 7 ngày!
          </FloatingBadge>

          <FloatingBadge
            className="right-2 bottom-20 text-white"
            style={{ background: '#9273E4', boxShadow: '0 8px 24px rgba(146,115,228,0.45)' }}
            delay={1.1}
          >
            ⭐ +50 XP mới
          </FloatingBadge>
        </div>
      </div>

      {/* wave divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 72 L0 36 Q240 8 480 28 Q720 48 960 20 Q1200 0 1440 16 L1440 72Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
