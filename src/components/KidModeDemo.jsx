import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Lightning, Trophy, Target, Sparkle, CheckCircle } from '@phosphor-icons/react'
import { IPhoneFrame } from './DeviceFrames'
import SpotlightCard from './SpotlightCard'

const BADGES = [
  { id: 'reader',   emoji: '📚', label: 'Ham đọc',   color: '#0648D7', xp: 50 },
  { id: 'streak7',  emoji: '🔥', label: '7 ngày',    color: '#DD3A34', xp: 100 },
  { id: 'explorer', emoji: '🗺️', label: 'Khám phá', color: '#328045', xp: 75 },
  { id: 'night',    emoji: '🌙', label: 'Đêm muộn',  color: '#9273E4', xp: 30 },
  { id: 'fast',     emoji: '⚡', label: 'Siêu tốc',  color: '#F2763A', xp: 60 },
  { id: 'star5',    emoji: '⭐', label: '5 sao',      color: '#FDC631', xp: 80, dark: true },
]

const STORY_CARDS = [
  { emoji: '🏰', title: 'Tấm Cám',   cat: 'Cổ tích',   color: '#0648D7', xp: 50, done: true },
  { emoji: '🐢', title: 'Thỏ & Rùa', cat: 'Ngụ ngôn',  color: '#328045', xp: 40, done: true },
  { emoji: '✨', title: 'Sơn Tinh',  cat: 'Thần thoại', color: '#9273E4', xp: 60, done: false },
  { emoji: '🔭', title: 'Sao Băng',  cat: 'Khoa học',   color: '#0099CC', xp: 45, done: false },
]

const CALLOUTS = [
  { Icon: Lightning, color: '#FDC631', title: 'Hệ thống XP thời gian thực', desc: 'Mỗi câu chuyện hoàn thành, câu hỏi đúng, ngày đọc liên tục — bé thấy tiến bộ rõ ràng từng ngày.' },
  { Icon: Trophy,    color: '#DD3A34', title: '50+ huy hiệu độc quyền',     desc: 'Từ "Ham đọc sách" đến "Nhà thám hiểm" — mỗi huy hiệu khuyến khích bé khám phá nội dung mới.' },
  { Icon: Star,      color: '#F2763A', title: 'Streak — chuỗi ngày đọc',    desc: 'Đọc mỗi ngày để giữ lửa streak. Mất streak là mất huy hiệu đặc biệt!' },
  { Icon: Target,    color: '#328045', title: 'Mục tiêu cá nhân hóa',       desc: 'Yarnia tự đặt mục tiêu phù hợp tốc độ đọc từng bé — không quá dễ, không quá khó.' },
]

function XPBar({ xp, max = 300 }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Level 4 · Explorer</span>
        <span className="text-[10px] font-bold" style={{ color: '#FDC631' }}>{xp}/{max} XP</span>
      </div>
      <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #FDC631, #F2763A)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${(xp / max) * 100}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0 opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

function BadgeItem({ badge, unlocked, delay }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex flex-col items-center gap-0.5"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg relative"
        style={{
          background: unlocked ? badge.color : '#2A2A40',
          opacity: unlocked ? 1 : 0.35,
          boxShadow: unlocked ? `0 4px 12px ${badge.color}50` : 'none',
        }}
      >
        {badge.emoji}
        {unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: '#FDC631' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
          >
            <Star size={7} weight="fill" color="#1A1A2E"/>
          </motion.div>
        )}
      </div>
      <span className="text-[9px] font-bold text-center leading-tight" style={{ color: unlocked ? 'rgba(255,255,255,0.8)' : '#3A3A5A' }}>
        {badge.label}
      </span>
    </motion.div>
  )
}

export default function KidModeDemo() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const [xp, setXp] = useState(120)
  const [unlockedCount, setUnlockedCount] = useState(2)
  const [notification, setNotification] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [streakDay, setStreakDay] = useState(5)

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => {
      setXp(180)
      setNotification({ text: '+50 XP kiếm được!', color: '#FDC631' })
      setTimeout(() => setNotification(null), 2000)
    }, 1500)
    const t2 = setTimeout(() => {
      setUnlockedCount(3)
      setNotification({ text: '🏆 Huy hiệu mới mở!', color: '#328045' })
      setTimeout(() => setNotification(null), 2000)
    }, 3500)
    const t3 = setTimeout(() => {
      setStreakDay(6)
      setXp(220)
      setNotification({ text: '🔥 Streak 6 ngày!', color: '#DD3A34' })
      setTimeout(() => setNotification(null), 2500)
    }, 5500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  /* Phone screen content */
  const phoneContent = (
    <div style={{ background: '#1A1A2E', minHeight: 460 }}>
      {/* header */}
      <div className="px-4 py-3" style={{ background: '#1A1A2E' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#DD3A34' }}>B</div>
            <div>
              <div className="text-white text-xs font-bold">Xin chào, Bảo! 👋</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Hôm nay đọc gì nào?</div>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black text-white"
            style={{ background: '#DD3A34' }}
          >
            🔥 {streakDay}
          </motion.div>
        </div>
        <XPBar xp={xp}/>
      </div>

      {/* story list */}
      <div className="px-4 py-3 space-y-2" style={{ background: '#0D0D1E' }}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Tiếp tục đọc</div>
        {STORY_CARDS.map((card, i) => (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedCard(selectedCard === i ? null : i)}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl text-left"
            style={{
              background: selectedCard === i ? card.color : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedCard === i ? card.color : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                 style={{ background: selectedCard === i ? 'rgba(255,255,255,0.2)' : card.color }}>
              {card.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[11px] font-bold truncate">{card.title}</div>
              <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{card.cat}</div>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: card.done ? '#FDC63125' : 'rgba(255,255,255,0.1)', color: card.done ? '#FDC631' : 'white' }}>
              {card.done
                ? <><CheckCircle size={9} weight="fill" style={{ display: 'inline', verticalAlign: 'middle' }}/> {card.xp}xp</>
                : `+${card.xp}xp`
              }
            </span>
          </motion.button>
        ))}
      </div>

      {/* badges */}
      <div className="px-4 py-3" style={{ background: '#0D0D1E' }}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Huy hiệu ({unlockedCount}/{BADGES.length})
        </div>
        <div className="grid grid-cols-6 gap-1">
          {BADGES.map((b, i) => (
            <BadgeItem key={b.id} badge={b} unlocked={i < unlockedCount} delay={0.5 + i * 0.07}/>
          ))}
        </div>
      </div>

      {/* toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            className="absolute top-14 left-3 right-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl text-white font-bold text-xs shadow-xl"
            style={{ background: notification.color, zIndex: 10 }}
          >
            {notification.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <section ref={ref} className="py-32 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
               style={{ background: 'rgba(221,58,52,0.1)', color: '#DD3A34', border: '1px solid rgba(221,58,52,0.2)' }}>
            <Sparkle size={13} weight="duotone"/> Kid Mode · Gamification
          </div>
          <h2 className="font-display font-black text-[#1A1A2E] mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
            Bé đọc sách như <span style={{ color: '#DD3A34' }}>chơi game</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B6B8A' }}>
            Hệ thống XP, huy hiệu và streak khiến bé háo hức mở app mỗi ngày — không cần bố mẹ nhắc.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-14 items-center">
          {/* iPhone frame */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -3 }}
            animate={inView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <IPhoneFrame>
              {phoneContent}
            </IPhoneFrame>
          </motion.div>

          {/* callout cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col gap-4"
          >
            {CALLOUTS.map((item, i) => {
              const Icon = item.Icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <SpotlightCard
                    spotlightColor={`${item.color}15`}
                    borderColor="rgba(0,0,0,0.06)"
                    className="rounded-2xl"
                    style={{ background: 'white' }}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                      className="flex gap-4 p-5"
                    >
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                           style={{ background: `${item.color}14` }}>
                        <Icon size={20} color={item.color} weight="duotone"/>
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1A2E] mb-1">{item.title}</div>
                        <div className="text-sm leading-relaxed" style={{ color: '#6B6B8A' }}>{item.desc}</div>
                      </div>
                    </motion.div>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
