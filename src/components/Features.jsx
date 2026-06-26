import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Headphones, Lightning, ShieldCheck, Trophy, BookBookmark, Users, Sparkle, ArrowRight,
} from '@phosphor-icons/react'
import CardSwap, { Card } from './CardSwap'

const features = [
  {
    icon: Headphones,
    color: '#0648D7',
    bg: 'linear-gradient(135deg, #0648D7 0%, #4F7FFF 100%)',
    label: 'Audio',
    title: 'Audio kể chuyện',
    desc: 'Giọng đọc chuyên nghiệp chuẩn tiếng Việt giúp bé luyện phát âm và cảm thụ văn học qua tai nghe.',
    stats: '500+ truyện',
    statsLabel: 'có audio HD',
    highlights: ['Giọng đọc cảm xúc', 'Tốc độ điều chỉnh', 'Nền nhạc nhẹ nhàng'],
  },
  {
    icon: Lightning,
    color: '#DD3A34',
    bg: 'linear-gradient(135deg, #DD3A34 0%, #FF7050 100%)',
    label: 'Kid Mode',
    title: 'Chế độ Kid Mode',
    desc: 'Giao diện riêng dành cho trẻ — không quảng cáo, không nội dung người lớn, an toàn tuyệt đối.',
    stats: '100%',
    statsLabel: 'nội dung an toàn',
    highlights: ['Không quảng cáo', 'Bộ lọc nội dung', 'Giao diện thân thiện'],
  },
  {
    icon: Trophy,
    color: '#B8860B',
    bg: 'linear-gradient(135deg, #E8A020 0%, #FDC631 100%)',
    label: 'XP & Huy hiệu',
    title: 'Gamification XP & Huy hiệu',
    desc: 'Bé kiếm điểm kinh nghiệm, mở khóa huy hiệu và leo bảng xếp hạng khi đọc — vừa học vừa chơi.',
    stats: '80+',
    statsLabel: 'huy hiệu độc đáo',
    highlights: ['Bảng xếp hạng', 'Streak đọc sách', 'Phần thưởng bất ngờ'],
  },
  {
    icon: ShieldCheck,
    color: '#328045',
    bg: 'linear-gradient(135deg, #328045 0%, #4CAF6E 100%)',
    label: 'Phụ huynh',
    title: 'Kiểm soát phụ huynh',
    desc: 'Bố mẹ theo dõi tiến độ đọc, đặt giới hạn thời gian và chọn nội dung phù hợp với từng bé.',
    stats: 'Realtime',
    statsLabel: 'báo cáo tiến độ',
    highlights: ['Giới hạn giờ đọc', 'Chọn độ tuổi', 'Thống kê tuần/tháng'],
  },
  {
    icon: BookBookmark,
    color: '#7C3AED',
    bg: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    label: 'Tương tác',
    title: 'Câu hỏi tương tác',
    desc: 'Sau mỗi truyện có câu hỏi hiểu bài thú vị, kích thích tư duy phản biện và sáng tạo cho trẻ.',
    stats: '5–10',
    statsLabel: 'câu hỏi mỗi truyện',
    highlights: ['Câu hỏi gợi mở', 'Giải thích đáp án', 'Luyện tư duy'],
  },
  {
    icon: Users,
    color: '#C2520A',
    bg: 'linear-gradient(135deg, #C2520A 0%, #F2763A 100%)',
    label: 'Gia đình',
    title: 'Đọc cùng gia đình',
    desc: 'Chế độ đọc chung — bố mẹ và con cùng nghe, cùng thảo luận, gắn kết tình cảm qua câu chuyện.',
    stats: '4+',
    statsLabel: 'thành viên mỗi tài khoản',
    highlights: ['Hồ sơ riêng từng bé', 'Ghi chú chia sẻ', 'Thư viện chung'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function FeatureCard({ feat }) {
  const Icon = feat.icon
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: feat.bg,
        borderRadius: 20,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* bg circle decoration */}
      <div style={{
        position: 'absolute', right: -30, top: -30,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }}/>
      <div style={{
        position: 'absolute', right: 20, bottom: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
      }}/>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={22} color="#fff" weight="duotone"/>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.75 }}>
            {feat.label}
          </span>
        </div>

        {/* title + desc */}
        <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.3 }}>{feat.title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.82, margin: 0 }}>{feat.desc}</p>

        {/* highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 18 }}>
          {feat.highlights.map(h => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, opacity: 0.9 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', flexShrink: 0 }}/>
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* stat */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{feat.stats}</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>{feat.statsLabel}</div>
      </div>
    </div>
  )
}

export default function Features() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section
      id="features"
      className="py-32 relative"
      style={{ background: '#fff', overflow: 'clip' }}
      ref={ref}
    >
      {/* soft blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{ position: 'absolute', top: '-8%', left: '-4%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, #EEF2FF 0%, transparent 70%)', opacity: 0.9 }}/>
        <div style={{ position: 'absolute', bottom: 0, right: '-4%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, #FFF7ED 0%, transparent 70%)', opacity: 0.9 }}/>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
            style={{ background: 'rgba(6,72,215,0.08)', color: '#0648D7', border: '1px solid rgba(6,72,215,0.15)' }}
          >
            <Sparkle size={13} weight="duotone"/> Tính năng nổi bật
          </div>
          <h2 className="font-display font-black text-[#1A1A2E] mb-4" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Được xây dựng cho{' '}
            <span style={{ color: '#0648D7' }}>sự phát triển</span> của bé
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B6B8A' }}>
            Mỗi tính năng được thiết kế dựa trên nghiên cứu giáo dục và phản hồi từ hàng nghìn gia đình Việt Nam.
          </p>
        </motion.div>

        {/* Main layout: list left + CardSwap right */}
        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* Feature list left — vertical */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-3"
            style={{ width: '45%' }}
          >
            {features.map((feat) => {
              const Icon = feat.icon
              return (
                <motion.div key={feat.title} variants={itemVariants}>
                  <motion.div
                    whileHover={{ x: 4, boxShadow: '0 8px 28px rgba(0,0,0,0.08)' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="rounded-2xl p-4 flex gap-4 items-center"
                    style={{
                      background: '#FAFAFA',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${feat.color}14` }}
                    >
                      <Icon size={19} color={feat.color} weight="duotone"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[15px]" style={{ color: '#1A1A2E' }}>{feat.title}</h3>
                      <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: '#6B6B8A' }}>{feat.desc}</p>
                    </div>
                    <div
                      className="shrink-0 text-right"
                      style={{ minWidth: 72 }}
                    >
                      <div className="font-black text-[15px]" style={{ color: feat.color }}>{feat.stats}</div>
                      <div className="text-[10px]" style={{ color: '#9090B0' }}>{feat.statsLabel}</div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CardSwap right */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 flex items-center justify-center"
            style={{ width: '45%', height: 600, position: 'relative', overflow: 'visible', flexShrink: 0 }}
          >
            {inView && (
              <CardSwap
                width={340}
                height={420}
                cardDistance={42}
                verticalDistance={52}
                delay={3500}
                pauseOnHover
                skewAmount={4}
                easing="elastic"
              >
                {features.map((feat) => (
                  <Card key={feat.title}>
                    <FeatureCard feat={feat} />
                  </Card>
                ))}
              </CardSwap>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
