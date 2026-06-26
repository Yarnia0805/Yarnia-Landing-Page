import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SpotlightCard from './SpotlightCard'
import BorderGlow from './BorderGlow'
import { RocketLaunch } from '@phosphor-icons/react'

const steps = [
  { num: '01', color: '#FDC631', glow: '42 100 58',  gc: ['#FDC631','#F2763A','#E8B220'], dark: true, emoji: '👨‍👩‍👧', title: 'Tạo hồ sơ gia đình', desc: 'Đăng ký trong 30 giây. Tạo hồ sơ cho từng bé với độ tuổi và sở thích riêng — Yarnia tự cá nhân hóa nội dung cho con.' },
  { num: '02', color: '#DD3A34', glow: '3 71 53',    gc: ['#DD3A34','#F2763A','#FDC631'], emoji: '📖', title: 'Khám phá kho truyện', desc: 'Bé chọn thể loại yêu thích và bắt đầu đọc hoặc nghe. Giao diện Kid Mode siêu đơn giản, bé 3 tuổi cũng tự dùng được.' },
  { num: '03', color: '#0648D7', glow: '222 82 56',  gc: ['#0648D7','#9273E4','#38bdf8'], emoji: '🧠', title: 'Học qua câu hỏi', desc: 'Sau mỗi câu chuyện, bé trả lời câu hỏi thú vị để kiểm tra độ hiểu và khám phá bài học ý nghĩa ẩn sau câu chuyện.' },
  { num: '04', color: '#328045', glow: '138 44 35',  gc: ['#328045','#FDC631','#0648D7'], emoji: '🏆', title: 'Thu thập huy hiệu', desc: 'Kiếm XP, mở khóa huy hiệu đặc biệt và leo lên cấp độ cao hơn. Bé sẽ muốn đọc thêm mỗi ngày để không mất chuỗi streak!' },
]

export default function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-32 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
            style={{ background: 'rgba(50,128,69,0.1)', color: '#328045', border: '1px solid rgba(50,128,69,0.2)' }}
          >
            <RocketLaunch size={13} weight="duotone"/> Cách hoạt động
          </div>
          <h2 className="font-display font-black text-[#1A1A2E]" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Chỉ 4 bước để bé <span style={{ color: '#DD3A34' }}>yêu đọc sách</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* gradient connector line */}
          <div
            className="hidden lg:block absolute top-22 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 z-0"
            style={{ background: 'linear-gradient(90deg, #FDC631 0%, #DD3A34 33%, #0648D7 66%, #328045 100%)', opacity: 0.4 }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 48, scale: 0.93 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              {/* double-bezel step card */}
              <BorderGlow
                backgroundColor="white"
                borderRadius={24}
                glowColor={step.glow}
                colors={step.gc}
                glowIntensity={0.85}
                glowRadius={28}
                edgeSensitivity={20}
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 4px 20px rgba(0,0,0,0.04)' }}
              >
                <SpotlightCard
                  spotlightColor={`${step.color}20`}
                  borderColor="transparent"
                  className="rounded-[22px]"
                >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="p-7 text-center"
                >
                  {/* emoji circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-lg"
                    style={{ background: step.color, boxShadow: `0 8px 24px ${step.color}50` }}
                  >
                    <span className="text-2xl">{step.emoji}</span>
                  </div>

                  <div
                    className="inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full mb-4"
                    style={{ background: `${step.color}18`, color: step.dark ? '#B8860B' : step.color }}
                  >
                    Bước {step.num}
                  </div>

                  <h3 className="font-bold text-base text-[#1A1A2E] mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B8A' }}>{step.desc}</p>
                </motion.div>
                </SpotlightCard>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
