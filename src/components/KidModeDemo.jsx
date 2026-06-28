import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Star, Lightning, Trophy, Target, Sparkle, CheckCircle,
  DeviceMobile, DeviceTablet, BookOpen, X, Play,
} from '@phosphor-icons/react'
import { IPhoneFrame, IPadFrame } from './DeviceFrames'

/* ─── data ─── */
const BADGES = [
  { id: 'reader',   emoji: '📚', label: 'Ham đọc',   color: '#0648D7', cond: 'Đọc 5 truyện' },
  { id: 'streak7',  emoji: '🔥', label: '7 ngày',    color: '#DD3A34', cond: 'Đọc 7 ngày liên tục' },
  { id: 'explorer', emoji: '🗺️', label: 'Khám phá', color: '#328045', cond: 'Đọc 3 thể loại khác nhau' },
  { id: 'night',    emoji: '🌙', label: 'Đêm muộn',  color: '#9273E4', cond: 'Đọc sau 9 giờ tối' },
  { id: 'fast',     emoji: '⚡', label: 'Siêu tốc',  color: '#F2763A', cond: 'Hoàn thành truyện < 5 phút' },
  { id: 'star5',    emoji: '⭐', label: '5 sao',      color: '#FDC631', cond: 'Đạt 5 sao trong quiz' },
]

const STORY_CARDS = [
  { emoji: '🏰', title: 'Tấm Cám',   cat: 'Cổ tích',    color: '#0648D7', xp: 50, done: true,
    preview: 'Ngày xưa, có hai chị em Tấm và Cám sống với nhau. Tấm hiền lành, chăm chỉ còn Cám thì lười biếng và hay ganh ghét...' },
  { emoji: '🐢', title: 'Thỏ & Rùa', cat: 'Ngụ ngôn',   color: '#328045', xp: 40, done: true,
    preview: 'Thỏ và Rùa một ngày nọ quyết định thi chạy. Thỏ tự tin vào tốc độ của mình nên dừng lại nghỉ ngơi giữa đường...' },
  { emoji: '✨', title: 'Sơn Tinh',  cat: 'Thần thoại',  color: '#9273E4', xp: 60, done: false,
    preview: 'Vua Hùng có người con gái tên Mị Nương xinh đẹp tuyệt trần. Hai chàng trai tài giỏi là Sơn Tinh và Thuỷ Tinh cùng đến cầu hôn...' },
  { emoji: '🔭', title: 'Sao Băng',  cat: 'Khoa học',    color: '#0099CC', xp: 45, done: false,
    preview: 'Mỗi đêm, hàng triệu ngôi sao băng lao vào bầu khí quyển Trái Đất với tốc độ khủng khiếp. Nhưng tại sao chúng ta thấy vệt sáng dài như vậy?...' },
]

// callout id links to highlight target in screen
const CALLOUTS = [
  { side: 'left',  id: 'xp',     Icon: Lightning, color: '#FDC631', bg: '#FFFBEB',
    title: 'Hệ thống XP',      desc: 'Bé thấy tiến bộ rõ ràng từng ngày.', triggerXP: true },
  { side: 'left',  id: 'badge',  Icon: Trophy,    color: '#DD3A34', bg: '#FFF5F5',
    title: '50+ huy hiệu',     desc: 'Mỗi huy hiệu khuyến khích bé khám phá.', triggerBadge: true },
  { side: 'right', id: 'streak', Icon: Star,      color: '#F2763A', bg: '#FFF8F5',
    title: 'Streak ngày đọc',  desc: 'Đọc mỗi ngày để giữ lửa streak!', triggerStreak: true },
  { side: 'right', id: 'goal',   Icon: Target,    color: '#328045', bg: '#F0FFF4',
    title: 'Mục tiêu cá nhân', desc: 'Yarnia tự đặt mục tiêu phù hợp từng bé.', triggerGoal: true },
]

/* ─── XP coin particle ─── */
function CoinBurst({ onDone }) {
  const coins = Array.from({ length: 6 }, (_, i) => i)
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {coins.map(i => {
        const angle = (i / coins.length) * 360
        const rad   = (angle * Math.PI) / 180
        const tx    = Math.cos(rad) * 36
        const ty    = Math.sin(rad) * 36 - 12
        return (
          <motion.div key={i}
            className="absolute text-sm"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.04, ease: 'easeOut' }}
            onAnimationComplete={i === 0 ? onDone : undefined}
          >⭐</motion.div>
        )
      })}
    </div>
  )
}

/* ─── XP Bar ─── */
function XPBar({ xp, max = 300, highlight }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold" style={{ color: '#6B6B8A' }}>Level 4 · Explorer</span>
        <span className="text-[10px] font-bold" style={{ color: '#F2763A' }}>{xp}/{max} XP</span>
      </div>
      <motion.div
        className="w-full h-2.5 rounded-full relative"
        style={{ background: '#F0F0F5' }}
        animate={highlight ? { boxShadow: ['0 0 0 0px #FDC63166', '0 0 0 4px #FDC63166', '0 0 0 0px #FDC63166'] } : {}}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #FDC631, #F2763A)' }}
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
      </motion.div>
    </div>
  )
}

/* ─── Badge item with tooltip + shake ─── */
function BadgeItem({ badge, unlocked, delay, size = 'sm', highlight }) {
  const [tooltip, setTooltip]   = useState(false)
  const [shaking, setShaking]   = useState(false)
  const sz = size === 'lg' ? 'w-12 h-12 text-xl' : 'w-9 h-9 text-base'

  const handleClick = () => {
    if (!unlocked) { setShaking(true); setTimeout(() => setShaking(false), 500); return }
    setTooltip(v => !v)
  }

  return (
    <div className="relative flex flex-col items-center gap-0.5">
      <motion.button
        initial={{ scale: 0, rotate: -15 }}
        animate={{
          scale: shaking ? [1, 1.08, 0.95, 1.05, 1] : 1,
          rotate: shaking ? [0, -8, 8, -4, 0] : 0,
        }}
        transition={shaking
          ? { duration: 0.4 }
          : { delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
        }
        onClick={handleClick}
        className={`${sz} rounded-xl flex items-center justify-center relative cursor-pointer`}
        style={{
          background: unlocked ? badge.color : '#E8E8F0',
          opacity: unlocked ? 1 : 0.45,
          boxShadow: highlight
            ? `0 0 0 3px ${badge.color}66, 0 4px 16px ${badge.color}50`
            : unlocked ? `0 4px 12px ${badge.color}40` : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        {badge.emoji}
        {unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: '#FDC631' }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
          >
            <Star size={7} weight="fill" color="#1A1A2E"/>
          </motion.div>
        )}
      </motion.button>
      <span className="text-[9px] font-bold text-center leading-tight" style={{ color: unlocked ? '#1A1A2E' : '#B0B0C8' }}>
        {badge.label}
      </span>

      {/* tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 text-center whitespace-nowrap rounded-xl px-2 py-1.5 text-white text-[9px] font-bold shadow-xl"
            style={{ transform: 'translateX(-50%)', background: badge.color, zIndex: 30, minWidth: 80 }}
          >
            {badge.cond}
            <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: badge.color, clipPath: 'polygon(0 0,100% 0,50% 100%)' }}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Mini reader overlay ─── */
function MiniReader({ card, onClose }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setProgress(p => Math.min(p + 1.2, 100)), 120)
    return () => clearInterval(id)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col"
      style={{ background: '#fff', zIndex: 25, borderRadius: 4 }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F0F0F5' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{card.emoji}</span>
          <div>
            <div className="font-bold text-[12px]" style={{ color: '#1A1A2E' }}>{card.title}</div>
            <div className="text-[9px]" style={{ color: '#9090B0' }}>{card.cat}</div>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: '#F0F0F5' }}>
          <X size={12} color="#6B6B8A"/>
        </button>
      </div>
      {/* progress */}
      <div className="px-4 pt-2">
        <div className="flex justify-between text-[9px] mb-1" style={{ color: '#9090B0' }}>
          <span>Đang đọc…</span><span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#F0F0F5' }}>
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}99)`, width: `${progress}%` }}/>
        </div>
      </div>
      {/* text */}
      <div className="flex-1 px-4 py-3 overflow-hidden">
        <p className="text-[11px] leading-relaxed" style={{ color: '#3A3A5A' }}>{card.preview}</p>
        <div className="mt-3 flex gap-1 flex-wrap">
          {['📖','🤔','💡'].map(e => (
            <span key={e} className="text-lg cursor-pointer hover:scale-125 transition-transform inline-block">{e}</span>
          ))}
        </div>
      </div>
      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          className="w-full py-2.5 rounded-2xl text-white font-bold text-[12px] flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)` }}
        >
          <Play size={11} weight="fill"/> Tiếp tục đọc
        </button>
        {!card.done && (
          <div className="text-center mt-1.5 text-[9px] font-bold" style={{ color: '#F2763A' }}>
            +{card.xp} XP khi hoàn thành
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Kid screen content ─── */
function KidContent({
  xp, onAddXP, streakDay, onStreakTap,
  unlockedCount, notification, inView,
  openCard, setOpenCard,
  highlightXP, highlightBadge, highlightStreak,
  tablet = false,
}) {
  const [burstActive, setBurstActive] = useState(false)
  const px   = tablet ? 'px-5' : 'px-4'
  const gap  = tablet ? 'space-y-2.5' : 'space-y-2'

  const handleAddXP = () => {
    setBurstActive(true)
    onAddXP(15)
  }

  return (
    <div style={{ background: '#F8F9FC', minHeight: tablet ? 360 : 460, position: 'relative' }}>

      {/* header */}
      <div className={`${px} py-3`} style={{ background: '#fff', borderBottom: '1px solid #F0F0F5' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#DD3A34' }}>B</div>
            <div>
              <div className="font-bold text-[#1A1A2E]" style={{ fontSize: tablet ? 13 : 12 }}>Xin chào, Bảo! 👋</div>
              <div className="text-[10px]" style={{ color: '#9090B0' }}>Hôm nay đọc gì nào?</div>
            </div>
          </div>

          {/* streak — tap to pulse */}
          <motion.button
            onClick={onStreakTap}
            animate={highlightStreak
              ? { scale: [1, 1.25, 1], filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }
              : { scale: [1, 1.06, 1] }
            }
            transition={highlightStreak
              ? { duration: 0.5, repeat: 2 }
              : { duration: 1.5, repeat: Infinity }
            }
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black text-white"
            style={{ background: '#DD3A34' }}
          >
            🔥 {streakDay}
          </motion.button>
        </div>

        {/* XP bar + tap button */}
        <div className="relative">
          <XPBar xp={xp} highlight={highlightXP}/>
          <motion.button
            onClick={handleAddXP}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-1 right-0 text-[9px] font-black px-2 py-0.5 rounded-full text-white"
            style={{ background: 'linear-gradient(90deg,#FDC631,#F2763A)', boxShadow: '0 2px 6px #FDC63166' }}
          >
            + XP
          </motion.button>
          {burstActive && <CoinBurst onDone={() => setBurstActive(false)}/>}
        </div>
      </div>

      {/* story list */}
      <div className={`${px} py-3 ${gap}`} style={{ background: '#F8F9FC' }}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9090B0' }}>Tiếp tục đọc</div>
        {STORY_CARDS.map((card, i) => (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpenCard(openCard === i ? null : i)}
            className="w-full flex items-center gap-2.5 rounded-2xl text-left"
            style={{
              padding: tablet ? '10px 12px' : '10px 10px',
              background: openCard === i ? card.color : '#fff',
              border: `1px solid ${openCard === i ? card.color : '#EBEBF5'}`,
              transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                 style={{ background: openCard === i ? 'rgba(255,255,255,0.25)' : `${card.color}18` }}>
              {card.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate" style={{ fontSize: 11, color: openCard === i ? '#fff' : '#1A1A2E' }}>{card.title}</div>
              <div className="text-[9px]" style={{ color: openCard === i ? 'rgba(255,255,255,0.65)' : '#9090B0' }}>{card.cat}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: card.done ? '#FDC63122' : `${card.color}18`, color: card.done ? '#B8860B' : card.color }}>
                {card.done
                  ? <><CheckCircle size={9} weight="fill" style={{ display: 'inline', verticalAlign: 'middle' }}/> {card.xp}xp</>
                  : `+${card.xp}xp`}
              </span>
              <BookOpen size={10} color={openCard === i ? 'rgba(255,255,255,0.7)' : '#C0C0D8'} weight="duotone"/>
            </div>
          </motion.button>
        ))}
      </div>

      {/* badges */}
      <div className={`${px} py-3`} style={{ background: '#fff', borderTop: '1px solid #F0F0F5' }}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#9090B0' }}>
          Huy hiệu ({unlockedCount}/{BADGES.length})
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {BADGES.map((b, i) => (
            <BadgeItem
              key={b.id} badge={b} unlocked={i < unlockedCount}
              delay={0.5 + i * 0.07}
              size={tablet ? 'lg' : 'sm'}
              highlight={highlightBadge && i < unlockedCount}
            />
          ))}
        </div>
      </div>

      {/* toast */}
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

      {/* mini reader overlay */}
      <AnimatePresence>
        {openCard !== null && openCard !== undefined && (
          <MiniReader card={STORY_CARDS[openCard]} onClose={() => setOpenCard(null)}/>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Callout card ─── */
function CalloutCard({ item, inView, delay, side, onHover, onLeave, onTrigger, active }) {
  const Icon = item.Icon
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -32 : 32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22,1,0.36,1] }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="rounded-2xl p-4 cursor-pointer select-none"
        whileHover={{ y: -3, boxShadow: `0 8px 28px ${item.color}22` }}
        whileTap={{ scale: 0.97 }}
        onClick={onTrigger}
        style={{
          background: '#fff',
          border: `1px solid ${active ? item.color + '55' : '#EBEBF5'}`,
          boxShadow: active
            ? `0 4px 20px ${item.color}30`
            : '0 4px 16px rgba(0,0,0,0.06)',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: item.bg }}
            animate={active ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Icon size={18} color={item.color} weight="duotone"/>
          </motion.div>
          <div>
            <div className="font-bold text-[13px] mb-1" style={{ color: '#1A1A2E' }}>{item.title}</div>
            <div className="text-[11px] leading-relaxed" style={{ color: '#6B6B8A' }}>{item.desc}</div>
          </div>
        </div>
        <div className="mt-2 text-[10px] font-bold" style={{ color: item.color, opacity: 0.7 }}>
          {side === 'left' ? 'Nhấn để xem demo →' : '← Nhấn để xem demo'}
        </div>
      </motion.div>

      {/* dashed connector */}
      <svg
        className={`absolute top-1/2 pointer-events-none ${side === 'left' ? 'left-full' : 'right-full'}`}
        style={{ transform: 'translateY(-50%)', overflow: 'visible', width: 48, height: 2 }}
      >
        {side === 'left'
          ? <>
              <motion.line x1="0" y1="1" x2="48" y2="1"
                stroke={item.color} strokeWidth="1.5" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: active ? 1 : 0.55 } : {}}
                transition={{ delay: delay + 0.4, duration: 0.6 }}
              />
              <motion.circle cx="48" cy="1" r={active ? 4 : 3} fill={item.color}
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ delay: delay + 0.9, type: 'spring' }}
              />
            </>
          : <>
              <motion.line x1="48" y1="1" x2="0" y2="1"
                stroke={item.color} strokeWidth="1.5" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: active ? 1 : 0.55 } : {}}
                transition={{ delay: delay + 0.4, duration: 0.6 }}
              />
              <motion.circle cx="0" cy="1" r={active ? 4 : 3} fill={item.color}
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ delay: delay + 0.9, type: 'spring' }}
              />
            </>
        }
      </svg>
    </motion.div>
  )
}

/* ─── Main export ─── */
export default function KidModeDemo() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [device, setDevice]             = useState('phone')
  const [xp, setXp]                     = useState(120)
  const [unlockedCount, setUnlockedCount] = useState(2)
  const [notification, setNotification] = useState(null)
  const [openCard, setOpenCard]         = useState(null)
  const [streakDay, setStreakDay]       = useState(5)
  const [hoveredCallout, setHoveredCallout] = useState(null) // callout id
  const [activeCallout, setActiveCallout]   = useState(null) // triggered callout id

  const showNotif = useCallback((text, color) => {
    setNotification({ text, color })
    setTimeout(() => setNotification(null), 2200)
  }, [])

  // auto demo sequence on inView
  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => { setXp(180);  showNotif('+50 XP kiếm được!', '#FDC631') }, 1500)
    const t2 = setTimeout(() => { setUnlockedCount(3); showNotif('🏆 Huy hiệu mới mở!', '#328045') }, 3500)
    const t3 = setTimeout(() => { setStreakDay(6); setXp(220); showNotif('🔥 Streak 6 ngày!', '#DD3A34') }, 5500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView, showNotif])

  // click callout → trigger demo inside screen
  const handleCalloutTrigger = (item) => {
    setActiveCallout(item.id)
    setTimeout(() => setActiveCallout(null), 1800)

    if (item.triggerXP) {
      setXp(p => Math.min(p + 20, 300))
      showNotif('+20 XP!', '#FDC631')
    } else if (item.triggerBadge) {
      if (unlockedCount < BADGES.length) {
        setUnlockedCount(c => c + 1)
        showNotif('🏆 Huy hiệu mới mở!', '#328045')
      } else {
        showNotif('Đã mở hết rồi! 🎉', '#328045')
      }
    } else if (item.triggerStreak) {
      setStreakDay(d => d + 1)
      showNotif(`🔥 Streak ${streakDay + 1} ngày!`, '#DD3A34')
    } else if (item.triggerGoal) {
      showNotif('🎯 Mục tiêu hôm nay đạt!', '#328045')
    }
  }

  const leftCallouts  = CALLOUTS.filter(c => c.side === 'left')
  const rightCallouts = CALLOUTS.filter(c => c.side === 'right')

  const screenProps = {
    xp,
    onAddXP: (v) => { setXp(p => Math.min(p + v, 300)); showNotif(`+${v} XP!`, '#FDC631') },
    streakDay,
    onStreakTap: () => { setStreakDay(d => d + 1); showNotif(`🔥 Streak ${streakDay + 1} ngày!`, '#DD3A34') },
    unlockedCount,
    notification,
    inView,
    openCard, setOpenCard,
    highlightXP:     hoveredCallout === 'xp'     || activeCallout === 'xp',
    highlightBadge:  hoveredCallout === 'badge'  || activeCallout === 'badge',
    highlightStreak: hoveredCallout === 'streak' || activeCallout === 'streak',
  }

  return (
    <section ref={ref} className="py-32 overflow-hidden" style={{ background: 'rgba(245,245,247,0.35)', backdropFilter: 'blur(4px)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
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

          {/* device toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: '#E8E8F0' }}>
              {[
                { key: 'phone',  Icon: DeviceMobile, label: 'iPhone' },
                { key: 'tablet', Icon: DeviceTablet, label: 'iPad' },
              ].map(({ key, Icon: Ic, label }) => (
                <button key={key} onClick={() => setDevice(key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200"
                  style={{
                    background: device === key ? '#fff' : 'transparent',
                    color: device === key ? '#1A1A2E' : '#9090B0',
                    boxShadow: device === key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Ic size={15} weight={device === key ? 'fill' : 'regular'}/> {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3-col layout */}
        <div className="flex items-center justify-center gap-0">

          {/* Left callouts */}
          <div className="flex flex-col gap-6 flex-1 max-w-65">
            {leftCallouts.map((item, i) => (
              <CalloutCard
                key={item.id} item={item} inView={inView} delay={0.3 + i * 0.12} side="left"
                onHover={() => setHoveredCallout(item.id)}
                onLeave={() => setHoveredCallout(null)}
                onTrigger={() => handleCalloutTrigger(item)}
                active={hoveredCallout === item.id || activeCallout === item.id}
              />
            ))}
          </div>

          <div className="w-12 shrink-0"/>

          {/* Device */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0 relative z-10"
            style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.16))' }}
          >
            <AnimatePresence mode="wait">
              {device === 'phone' ? (
                <motion.div key="phone"
                  initial={{ opacity: 0, scale: 0.92, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.92, x: 20 }}
                  transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                >
                  <IPhoneFrame>
                    <KidContent {...screenProps} tablet={false}/>
                  </IPhoneFrame>
                </motion.div>
              ) : (
                <motion.div key="tablet"
                  initial={{ opacity: 0, scale: 0.92, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.92, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                >
                  <IPadFrame>
                    <KidContent {...screenProps} tablet={true}/>
                  </IPadFrame>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="w-12 shrink-0"/>

          {/* Right callouts */}
          <div className="flex flex-col gap-6 flex-1 max-w-65">
            {rightCallouts.map((item, i) => (
              <CalloutCard
                key={item.id} item={item} inView={inView} delay={0.35 + i * 0.12} side="right"
                onHover={() => setHoveredCallout(item.id)}
                onLeave={() => setHoveredCallout(null)}
                onTrigger={() => handleCalloutTrigger(item)}
                active={hoveredCallout === item.id || activeCallout === item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
