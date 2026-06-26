import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X, ArrowRight } from '@phosphor-icons/react'

const navLinks = [
  { label: 'Trang chủ',   href: '#' },
  { label: 'Tính năng',   href: '#features' },
  { label: 'Kho truyện',  href: '#stories' },
  { label: 'Bảng giá',    href: '#pricing' },
  { label: 'Liên hệ',     href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4"
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          animate={scrolled
            ? { backdropFilter: 'blur(18px)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)' }
            : { backdropFilter: 'blur(0px)', background: 'rgba(255,255,255,0.0)', boxShadow: 'none' }
          }
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="w-full max-w-5xl rounded-full px-5 h-14 flex items-center justify-between"
          style={{ pointerEvents: 'all' }}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FDC631' }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M12 3 Q8 6 6 10 Q4 14 6 18 Q10 22 12 20 Q14 22 18 18 Q20 14 18 10 Q16 6 12 3Z" fill="#1A1A2E"/>
                <circle cx="9" cy="12" r="1.5" fill="#FDC631"/>
                <circle cx="15" cy="12" r="1.5" fill="#FDC631"/>
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-tight" style={{ color: '#1A1A2E' }}>Yarnia</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <motion.a
                key={l.href}
                href={l.href}
                whileHover={{ color: '#1A1A2E', backgroundColor: 'rgba(26,26,46,0.05)' }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{ color: '#6B6B8A' }}
              >
                {l.label}
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(253,198,49,0.5)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full text-[#1A1A2E]"
              style={{ background: '#FDC631' }}
            >
              Đăng ký sớm
              <ArrowRight size={14} weight="bold" color="#1A1A2E"/>
            </motion.a>
          </div>

          {/* Mobile toggle */}
          <motion.button
            className="md:hidden p-2 rounded-xl"
            onClick={() => setOpen(v => !v)}
            whileTap={{ scale: 0.92 }}
            style={{ color: '#1A1A2E' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.18 }}><X size={22} weight="bold"/></motion.span>
                : <motion.span key="m" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.18 }}><List size={22} weight="regular"/></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-20 z-40 rounded-3xl overflow-hidden md:hidden"
            style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)' }}
          >
            <div className="p-5 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm font-semibold py-3 px-3 rounded-xl hover:bg-[#F4F3ED] transition-colors"
                  style={{ color: '#1A1A2E' }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-[#1A1A2E]"
                style={{ background: '#FDC631' }}
              >
                Đăng ký sớm
                <ArrowRight size={14} weight="bold"/>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
