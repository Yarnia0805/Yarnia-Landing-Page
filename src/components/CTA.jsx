import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef } from 'react'
import WoollyMascot from './WoollyMascot'
import { RocketLaunch, CheckCircle } from '@phosphor-icons/react'

function MagBtn({ href, children, dark = false }) {
  const ref = useRef(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.2)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.2)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.a
      ref={ref} href={href} style={{ x: sx, y: sy }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base cursor-pointer`}
      style={dark
        ? { background: '#DD3A34', color: 'white', boxShadow: '0 8px 28px rgba(221,58,52,0.4)' }
        : { background: 'rgba(26,26,46,0.12)', color: 'white' }
      }
    >
      {children}
    </motion.a>
  )
}

export default function CTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-32" style={{ background: 'transparent', backdropFilter: 'none' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* outer shell */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="p-2 rounded-[40px]"
          style={{ background: 'rgba(253,198,49,0.35)', border: '1px solid rgba(253,198,49,0.5)' }}
        >
          {/* inner core */}
          <div
            className="relative rounded-4xl overflow-hidden p-10 md:p-16 text-center"
            style={{ background: '#FDC631', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)' }}
          >
            {/* bg deco */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-18"
                 style={{ background: '#DD3A34' }}/>
            <div className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full opacity-12"
                 style={{ background: '#0648D7' }}/>
            <div className="absolute top-8 left-8 w-24 h-24 rounded-full opacity-10"
                 style={{ background: '#9273E4' }}/>

            {/* mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex justify-center mb-8 animate-float relative z-10"
            >
              <WoollyMascot size={130}/>
            </motion.div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-display font-black leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: '#1A1A2E' }}
              >
                Bắt đầu hành trình đọc sách<br/>cùng con ngay hôm nay!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.35 }}
                className="text-base md:text-lg mb-10 max-w-lg mx-auto"
                style={{ color: '#4A3A1A' }}
              >
                Thử miễn phí 30 ngày — không cần thẻ tín dụng.
                Hàng ngàn gia đình đã tin tưởng Yarnia.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <MagBtn href="#" dark><RocketLaunch size={18} weight="duotone"/> Dùng thử miễn phí 30 ngày</MagBtn>
                <MagBtn href="#pricing">Xem bảng giá</MagBtn>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="text-xs mt-7 opacity-55"
                style={{ color: '#1A1A2E' }}
              >
                <CheckCircle size={12} weight="fill" color="#328045" style={{ display:'inline', verticalAlign:'middle', marginRight:3 }}/> Không cần thẻ tín dụng
                {' · '}
                <CheckCircle size={12} weight="fill" color="#328045" style={{ display:'inline', verticalAlign:'middle', marginRight:3 }}/> Hủy bất kỳ lúc nào
                {' · '}
                <CheckCircle size={12} weight="fill" color="#328045" style={{ display:'inline', verticalAlign:'middle', marginRight:3 }}/> Hỗ trợ 24/7
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
