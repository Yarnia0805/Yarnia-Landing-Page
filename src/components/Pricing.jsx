import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Diamond, Lock } from '@phosphor-icons/react'
import SpotlightCard from './SpotlightCard'
import BorderGlow from './BorderGlow'

const plans = [
  {
    name: 'Miễn phí',
    price: '0',
    period: '/tháng',
    color: '#1A1A2E',
    bg: 'white',
    border: 'rgba(26,26,46,0.12)',
    glow: '222 82 56', gc: ['#0648D7','#9273E4','#FDC631'],
    features: [
      '20 câu chuyện cơ bản',
      'Chế độ Kid Mode',
      '1 hồ sơ trẻ em',
      'Câu hỏi sau truyện',
      'Audio đọc truyện (giới hạn)',
    ],
    cta: 'Bắt đầu miễn phí',
    ctaBg: '#F4F3ED',
    ctaColor: '#1A1A2E',
  },
  {
    name: 'Gia đình',
    price: '89.000',
    period: 'đ/tháng',
    color: 'white',
    bg: '#DD3A34',
    border: '#DD3A34',
    glow: '42 100 58', gc: ['#FDC631','#F2763A','#ffffff'],
    badge: '🔥 Phổ biến nhất',
    features: [
      'Toàn bộ 360+ câu chuyện',
      'Không quảng cáo',
      'Tối đa 4 hồ sơ trẻ em',
      'Audio HD không giới hạn',
      'Hệ thống XP & huy hiệu',
      'Báo cáo tiến độ phụ huynh',
      'Offline reading',
    ],
    cta: 'Dùng thử 30 ngày',
    ctaBg: '#FDC631',
    ctaColor: '#1A1A2E',
  },
  {
    name: 'Hàng năm',
    price: '69.000',
    period: 'đ/tháng',
    color: '#1A1A2E',
    bg: 'white',
    border: 'rgba(26,26,46,0.12)',
    glow: '138 44 35', gc: ['#328045','#FDC631','#0648D7'],
    badge: '💰 Tiết kiệm 23%',
    sub: 'Thanh toán 828.000đ/năm',
    features: [
      'Tất cả tính năng Gia đình',
      'Ưu tiên hỗ trợ khách hàng',
      'Truy cập beta tính năng mới',
      'Tặng 1 tháng miễn phí',
    ],
    cta: 'Mua ngay',
    ctaBg: '#1A1A2E',
    ctaColor: 'white',
  },
]

export default function Pricing() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="pricing" className="py-32" style={{ background: 'white' }} ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
               style={{ background: '#9273E415', color: '#9273E4' }}>
            <Diamond size={13} weight="duotone"/> Bảng giá
          </div>
          <h2 className="font-display font-black text-[#1A1A2E] mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Giá cả <span style={{ color: '#328045' }}>minh bạch</span>, không phí ẩn
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6B6B8A' }}>
            Bắt đầu miễn phí. Nâng cấp khi bé cần thêm câu chuyện.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transform: plan.bg === '#DD3A34' ? 'scale(1.04)' : 'scale(1)' }}
            >
            <BorderGlow
              backgroundColor={plan.bg}
              borderRadius={24}
              glowColor={plan.glow}
              colors={plan.gc}
              glowIntensity={plan.bg === '#DD3A34' ? 1.1 : 0.85}
              glowRadius={36}
              edgeSensitivity={20}
              className="h-full"
              style={{ boxShadow: plan.bg === '#DD3A34' ? '0 24px 64px rgba(221,58,52,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}
            >
            <SpotlightCard
              spotlightColor={plan.bg === '#DD3A34' ? 'rgba(255,255,255,0.12)' : 'rgba(253,198,49,0.12)'}
              borderColor="transparent"
              className="rounded-3xl h-full"
            >
              <div className="p-8 flex flex-col relative overflow-hidden h-full">
              {/* badge */}
              {plan.badge && (
                <div
                  className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: plan.bg === '#DD3A34' ? '#FDC631' : '#DD3A3415',
                    color: plan.bg === '#DD3A34' ? '#1A1A2E' : '#DD3A34',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div
                  className="text-sm font-bold mb-3 opacity-70"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span
                    className="font-display font-black"
                    style={{ fontSize: 42, color: plan.color, lineHeight: 1 }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm font-semibold pb-1 opacity-70"
                    style={{ color: plan.color }}
                  >
                    {plan.period}
                  </span>
                </div>
                {plan.sub && (
                  <div className="text-xs opacity-60" style={{ color: plan.color }}>{plan.sub}</div>
                )}
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm" style={{ color: plan.color }}>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: plan.bg === '#DD3A34' ? 'rgba(255,255,255,0.25)' : '#32804520',
                      }}
                    >
                      <Check size={11} color={plan.bg === '#DD3A34' ? 'white' : '#328045'} weight="bold"/>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="text-center py-3.5 rounded-2xl font-bold text-sm transition-transform hover:scale-105 block"
                style={{ background: plan.ctaBg, color: plan.ctaColor }}
              >
                {plan.cta}
              </a>
            </div>
            </SpotlightCard>
            </BorderGlow>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-sm mt-8"
          style={{ color: '#9090B0' }}
        >
          <Lock size={12} weight="duotone" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> Bảo mật thanh toán · Hủy bất kỳ lúc nào · Không thu phí ẩn
        </motion.p>
      </div>
    </section>
  )
}
