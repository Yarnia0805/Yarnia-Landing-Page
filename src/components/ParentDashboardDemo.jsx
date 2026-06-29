import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ShieldCheck, ChartLine, Clock, Books, Sparkle } from '@phosphor-icons/react'
import { MacBrowserFrame } from './DeviceFrames'
import SpotlightCard from './effects/SpotlightCard'

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const READING_MINS = [12, 20, 8, 25, 18, 35, 28]
const MAX_MIN = 40

const CHILDREN = [
  { name: 'Bảo',  age: 7, avatar: '#DD3A34', level: 4, xp: 220, stories: 12, streak: 6 },
  { name: 'Linh', age: 5, avatar: '#0648D7', level: 2, xp: 95,  stories: 6,  streak: 3 },
]

const ACTIVITY_LOG = [
  { time: '20:15', child: 'Bảo',  action: 'Đọc xong "Tấm Cám"',          xp: '+50 XP',  color: '#0648D7' },
  { time: '20:32', child: 'Bảo',  action: 'Trả lời đúng 3/3 câu hỏi',    xp: '+30 XP',  color: '#328045' },
  { time: '21:00', child: 'Linh', action: 'Nghe "Thỏ và Rùa"',            xp: '+40 XP',  color: '#9273E4' },
  { time: '21:10', child: 'Bảo',  action: 'Mở khóa huy hiệu 🏆',          xp: '+100 XP', color: '#DD3A34' },
]

function BarChart({ animated }) {
  return (
    <div className="flex items-end gap-1.5 h-24">
      {DAYS.map((day, i) => {
        const pct = (READING_MINS[i] / MAX_MIN) * 100
        const isToday = i === 6
        return (
          <div key={day} className="flex flex-col items-center gap-1 flex-1">
            <div className="text-[8px] font-bold" style={{ color: '#9090B0' }}>{READING_MINS[i]}p</div>
            <div className="w-full flex-1 flex items-end rounded-lg overflow-hidden" style={{ background: '#F4F3ED' }}>
              <motion.div
                className="w-full rounded-lg"
                style={{ background: isToday ? 'linear-gradient(180deg,#FDC631,#F2763A)' : '#0648D7', opacity: isToday ? 1 : 0.45 }}
                initial={{ height: 0 }}
                animate={{ height: animated ? `${pct}%` : 0 }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="text-[8px] font-bold" style={{ color: isToday ? '#F2763A' : '#9090B0' }}>{day}</div>
          </div>
        )
      })}
    </div>
  )
}

function TimeLimit({ animated }) {
  const [limit, setLimit] = useState(45)
  const [used, setUsed] = useState(0)
  useEffect(() => {
    if (!animated) return
    const t = setInterval(() => setUsed(u => u < 28 ? u + 1 : 28), 60)
    return () => clearInterval(t)
  }, [animated])
  const pct = (used / limit) * 100
  const color = pct > 80 ? '#DD3A34' : pct > 60 ? '#F2763A' : '#328045'
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold" style={{ color: '#6B6B8A' }}>Giới hạn hôm nay</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setLimit(l => Math.max(15, l - 15))}
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#F4F3ED', color: '#1A1A2E' }}>−</button>
          <span className="text-xs font-black" style={{ color: '#1A1A2E' }}>{limit}p</span>
          <button onClick={() => setLimit(l => Math.min(120, l + 15))}
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#F4F3ED', color: '#1A1A2E' }}>+</button>
        </div>
      </div>
      <div className="w-full h-2.5 rounded-full" style={{ background: '#F4F3ED' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}/>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px]" style={{ color: '#9090B0' }}>{used} phút đã dùng</span>
        <span className="text-[9px]" style={{ color }}>{limit - used} phút còn lại</span>
      </div>
    </div>
  )
}

/* Dashboard content rendered inside the MacBook browser frame */
function DashboardContent({ inView, activeChild, setActiveChild, visibleLogs }) {
  const child = CHILDREN[activeChild]
  const STAT_ITEMS = [
    { Icon: Books,      label: 'Truyện đọc',    value: child.stories, color: '#0648D7', suffix: '' },
    { Icon: ChartLine,  label: 'Level',          value: child.level,   color: '#328045', suffix: '' },
    { Icon: Clock,      label: 'Phút/ngày TB',   value: 22,            color: '#9273E4', suffix: 'p' },
    { Icon: ShieldCheck,label: 'Streak',         value: child.streak,  color: '#DD3A34', suffix: '🔥' },
  ]
  return (
    <div style={{ background: '#F9F9F7', minHeight: 380 }}>
      {/* topbar */}
      <div className="flex items-center justify-between px-5 py-3" style={{ background: '#1A1A2E' }}>
        <div>
          <div className="font-bold text-white text-sm">Tổng quan gia đình</div>
          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Thứ 7, 21/06/2026</div>
        </div>
        <div className="flex items-center gap-1.5">
          {CHILDREN.map((c, i) => (
            <button key={c.name} onClick={() => setActiveChild(i)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white transition-all"
              style={{ background: activeChild === i ? c.avatar : 'rgba(255,255,255,0.08)' }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                   style={{ background: activeChild === i ? 'rgba(255,255,255,0.25)' : c.avatar }}>
                {c.name[0]}
              </div>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* stat row */}
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          {STAT_ITEMS.map(s => {
            const Icon = s.Icon
            return (
              <div key={s.label} className="bg-white rounded-xl p-3 text-center"
                   style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                     style={{ background: `${s.color}14` }}>
                  <Icon size={14} color={s.color} weight="duotone"/>
                </div>
                <div className="font-black text-base" style={{ color: s.color }}>{s.value}{s.suffix}</div>
                <div className="text-[9px]" style={{ color: '#9090B0' }}>{s.label}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* bar chart */}
          <div className="bg-white rounded-xl p-3" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="font-bold text-xs text-[#1A1A2E]">Phút đọc trong tuần</div>
              <div className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                   style={{ background: '#0648D712', color: '#0648D7' }}>↑ 28%</div>
            </div>
            <BarChart animated={inView}/>
          </div>

          {/* activity log */}
          <div className="bg-white rounded-xl p-3" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="font-bold text-xs text-[#1A1A2E] mb-2">Hoạt động hôm nay</div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {ACTIVITY_LOG.slice(0, visibleLogs).map((log, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: log.color }}/>
                    <div className="text-[9px] font-medium flex-1 min-w-0">
                      <span className="font-bold" style={{ color: '#1A1A2E' }}>{log.child}</span>
                      <span style={{ color: '#6B6B8A' }}> · {log.action}</span>
                    </div>
                    <span className="text-[8px] font-bold shrink-0" style={{ color: log.color }}>{log.xp}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* time limit */}
        <div className="mt-2.5 bg-white rounded-xl p-3" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Clock size={12} color="#9273E4" weight="duotone"/>
            <span className="font-bold text-xs text-[#1A1A2E]">Kiểm soát thời gian — {child.name}</span>
          </div>
          <TimeLimit animated={inView}/>
        </div>
      </div>
    </div>
  )
}

export default function ParentDashboardDemo() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const [activeChild, setActiveChild] = useState(0)
  const [visibleLogs, setVisibleLogs] = useState(0)

  useEffect(() => {
    if (!inView) return
    ACTIVITY_LOG.forEach((_, i) => setTimeout(() => setVisibleLogs(i + 1), 900 + i * 650))
  }, [inView])

  const SIDE_ITEMS = [
    { Icon: Books,      color: '#0648D7', title: 'Báo cáo tiến độ tự động', desc: 'Yarnia gửi báo cáo PDF mỗi tuần — bao gồm số truyện đọc, thời gian và từ mới học được.' },
    { Icon: ShieldCheck,color: '#328045', title: 'Bộ lọc nội dung thông minh', desc: 'Bé chỉ thấy nội dung phù hợp độ tuổi. Bố mẹ có thể chặn/cho phép từng thể loại riêng.' },
    { Icon: ChartLine,  color: '#9273E4', title: 'Phân tích học tập chi tiết', desc: 'Biểu đồ tốc độ đọc, từ vựng tích lũy, chủ đề yêu thích — insight sâu cho bố mẹ.' },
  ]

  return (
    <section ref={ref} className="py-32 overflow-hidden" style={{ background: 'transparent', backdropFilter: 'none' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
               style={{ background: 'rgba(50,128,69,0.1)', color: '#328045', border: '1px solid rgba(50,128,69,0.2)' }}>
            <Sparkle size={13} weight="duotone"/> Bảng điều khiển phụ huynh
          </div>
          <h2 className="font-display font-black text-[#1A1A2E] mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
            Bố mẹ <span style={{ color: '#328045' }}>nắm toàn bộ</span> — ngay trên điện thoại
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B6B8A' }}>
            Theo dõi tiến độ đọc, đặt giới hạn thời gian và nhận báo cáo tự động mỗi tuần.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-center">
          {/* MacBook browser frame */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 6 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200 }}
          >
            <MacBrowserFrame url="yarnia.vn/parent/dashboard">
              <DashboardContent
                inView={inView}
                activeChild={activeChild}
                setActiveChild={setActiveChild}
                visibleLogs={visibleLogs}
              />
            </MacBrowserFrame>
          </motion.div>

          {/* side callouts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {SIDE_ITEMS.map((item, i) => {
              const Icon = item.Icon
              return (
                <motion.div key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <SpotlightCard
                    spotlightColor={`${item.color}14`}
                    borderColor="rgba(0,0,0,0.06)"
                    className="rounded-2xl"
                    style={{ background: '#F9F9F7' }}
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
                        <div className="font-bold text-[#1A1A2E] mb-1 text-sm">{item.title}</div>
                        <div className="text-xs leading-relaxed" style={{ color: '#6B6B8A' }}>{item.desc}</div>
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
