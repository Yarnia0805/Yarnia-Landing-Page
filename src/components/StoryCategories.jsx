import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'
import SpotlightCard from './effects/SpotlightCard'
import { ArrowLeft, ArrowRight, Books } from '@phosphor-icons/react'

const categories = [
  { id: 'CO_TICH',     bg: '#0648D7', emoji: '🏰', title: 'Cổ Tích',       desc: 'Truyện dân gian Việt Nam và thế giới đầy màu sắc', count: '80+ truyện' },
  { id: 'NGU_NGON',    bg: '#328045', emoji: '🦋', title: 'Ngụ Ngôn',      desc: 'Bài học cuộc sống qua những con vật đáng yêu', count: '60+ truyện' },
  { id: 'THAN_THOAI',  bg: '#9273E4', emoji: '✨', title: 'Thần Thoại',    desc: 'Hành trình khám phá thần thoại Hy Lạp & Việt Nam', count: '45+ truyện' },
  { id: 'KHOA_HOC',    bg: '#0099CC', emoji: '🔭', title: 'Khoa Học',      desc: 'Câu chuyện khoa học vui nhộn về vũ trụ kỳ diệu', count: '50+ truyện' },
  { id: 'PHIEU_LUU',   bg: '#DD3A34', emoji: '🗺️', title: 'Phiêu Lưu',   desc: 'Những chuyến phiêu lưu đến các vùng đất bí ẩn', count: '70+ truyện' },
  { id: 'TRUYEN_CUOI', bg: '#FDC631', emoji: '😄', title: 'Truyện Cười',   desc: 'Tiếng cười rộn rã với câu chuyện hài hước ý nghĩa', count: '55+ truyện', dark: true },
  { id: 'DONG_VAT',    bg: '#F2763A', emoji: '🐘', title: 'Động Vật',      desc: 'Thế giới muông thú kỳ diệu và những tình bạn đẹp', count: '65+ truyện' },
  { id: 'LICH_SU',     bg: '#5B4FCF', emoji: '⚔️', title: 'Lịch Sử',     desc: 'Những anh hùng và sự kiện lịch sử hào hùng của Việt Nam', count: '40+ truyện' },
  { id: 'MOI_TRUONG',  bg: '#2E8B57', emoji: '🌿', title: 'Môi Trường',   desc: 'Yêu thiên nhiên, bảo vệ Trái Đất qua những câu chuyện xanh', count: '35+ truyện' },
  { id: 'AM_NHAC',     bg: '#C2185B', emoji: '🎵', title: 'Âm Nhạc',      desc: 'Truyện kể về âm nhạc, nhạc cụ và tình yêu nghệ thuật', count: '30+ truyện' },
  { id: 'SIEU_ANH_HUNG', bg: '#1565C0', emoji: '🦸', title: 'Siêu Anh Hùng', desc: 'Những chiến binh nhỏ dũng cảm bảo vệ thế giới', count: '50+ truyện' },
  { id: 'VIET_NAM',    bg: '#C62828', emoji: '🇻🇳', title: 'Việt Nam Tôi', desc: 'Văn hóa, phong tục và vẻ đẹp quê hương đất nước', count: '45+ truyện' },
]

function CategoryCard({ cat, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="embla__slide px-3"
      style={{ flex: '0 0 clamp(260px, 22vw, 340px)' }}
    >
      {/* outer shell — double bezel */}
      <div
        className="p-1.5 rounded-[28px] h-full cursor-pointer group"
        style={{ background: `${cat.bg}15`, border: `1px solid ${cat.bg}30` }}
      >
        <SpotlightCard
          spotlightColor="rgba(255,255,255,0.18)"
          borderColor="transparent"
          className="rounded-[22px] h-full"
          style={{
            background: cat.bg,
            boxShadow: `0 12px 40px ${cat.bg}50, inset 0 1px 1px rgba(255,255,255,0.2)`,
            minHeight: 240,
          }}
        >
        {/* inner core */}
        <motion.div
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative overflow-hidden rounded-[22px] p-8 h-full flex flex-col"
        >
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full opacity-15" style={{ background: 'white' }}/>
          <div className="absolute right-6 top-6 w-16 h-16 rounded-full opacity-10" style={{ background: 'white' }}/>

          <div className="relative z-10 flex flex-col flex-1">
            <span className="text-5xl mb-5 block">{cat.emoji}</span>
            <h3 className="font-display font-black text-2xl mb-2" style={{ color: 'white' }}>
              {cat.title}
            </h3>
            <p className="text-sm leading-relaxed mb-5 flex-1"
               style={{ color: 'rgba(255,255,255,0.82)' }}>
              {cat.desc}
            </p>
            <div className="flex items-center justify-between">
              <div
                className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: cat.dark ? 'rgba(26,26,46,0.14)' : 'rgba(255,255,255,0.22)',
                  color: 'white',
                }}
              >
                {cat.count}
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300"
                style={{ background: cat.dark ? '#1A1A2E' : 'white', color: cat.dark ? 'white' : cat.bg }}
              >
                <ArrowRight size={15} weight="bold"/>
              </div>
            </div>
          </div>
        </motion.div>
        </SpotlightCard>
      </div>
    </motion.div>
  )
}

export default function StoryCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [Autoplay({ delay: 3200, stopOnInteraction: true })]
  )
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section id="stories" className="py-32 overflow-hidden" style={{ background: 'transparent', backdropFilter: 'none' }} ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ background: 'rgba(6,72,215,0.1)', color: '#0648D7', border: '1px solid rgba(6,72,215,0.2)' }}
            >
              <Books size={13} weight="duotone"/> Kho truyện phong phú
            </div>
            <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              360+ câu chuyện,{' '}
              <span style={{ color: '#DD3A34' }}>6 thể loại</span> đặc sắc
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              onClick={scrollPrev}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold border-2"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white', background: 'rgba(255,255,255,0.1)' }}
            >
              <ArrowLeft size={18} weight="bold"/>
            </motion.button>
            <motion.button
              onClick={scrollNext}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: '#1A1A2E' }}
            >
              <ArrowRight size={18} weight="bold"/>
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Carousel full width — doubled for seamless loop */}
      <div className="embla mt-0 px-6" ref={emblaRef}>
        <div className="embla__container">
          {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
            <CategoryCard key={`${cat.id}-${i}`} cat={cat} index={i % categories.length} inView={inView}/>
          ))}
        </div>
      </div>

      {/* Marquee pill rows */}
      <div className="mt-10 overflow-hidden">
        <div className="flex items-center mb-3">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...categories, ...categories, ...categories].map((cat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shrink-0 mx-2 cursor-pointer"
                style={{
                  background: cat.bg,
                  color: 'white',
                  boxShadow: `0 4px 12px ${cat.bg}40`,
                }}
              >
                <span className="text-base">{cat.emoji}</span>
                {cat.title}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center" style={{ direction: 'rtl' }}>
          <div className="flex animate-marquee whitespace-nowrap" style={{ animationDuration: '36s' }}>
            {[...categories, ...categories, ...categories].reverse().map((cat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shrink-0 mx-2 cursor-pointer"
                style={{
                  background: cat.bg,
                  color: 'white',
                  boxShadow: `0 4px 12px ${cat.bg}40`,
                }}
              >
                <span className="text-base">{cat.emoji}</span>
                {cat.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full border-2 transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
          >
            Xem toàn bộ kho truyện <ArrowRight size={14} weight="bold"/>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
