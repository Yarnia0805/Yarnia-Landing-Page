import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ArrowLeft, ArrowRight, ChatCircle } from '@phosphor-icons/react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'

const reviews = [
  {
    name: 'Chị Lan Anh', role: 'Mẹ của bé Minh, 6 tuổi', avatar: '#DD3A34', initials: 'LA',
    text: 'Con tôi từ một đứa không chịu đọc sách, sau 2 tuần dùng Yarnia đã tự mình ngồi nghe truyện mỗi tối trước khi ngủ. Hệ thống huy hiệu khiến bé hào hứng hơn hẳn!',
    stars: 5,
  },
  {
    name: 'Anh Tuấn', role: 'Bố của bé Khánh, 8 tuổi', avatar: '#0648D7', initials: 'T',
    text: 'Chất lượng audio rất rõ ràng, giọng đọc truyền cảm. Con trai tôi học được nhiều từ mới và hiểu hơn về văn hóa dân gian Việt Nam qua những câu chuyện cổ tích.',
    stars: 5,
  },
  {
    name: 'Chị Hương', role: 'Giáo viên mầm non', avatar: '#328045', initials: 'H',
    text: 'Tôi dùng Yarnia cho cả lớp học. Câu hỏi tương tác sau truyện rất hay, giúp các em rèn tư duy và khả năng diễn đạt. Nội dung hoàn toàn phù hợp với chương trình mầm non.',
    stars: 5,
  },
  {
    name: 'Chị Mai', role: 'Mẹ của 2 bé, 4 và 9 tuổi', avatar: '#9273E4', initials: 'M',
    text: 'Tôi thích nhất là chế độ kiểm soát phụ huynh. Đặt giờ đọc, chọn nội dung phù hợp cho từng độ tuổi của hai bé riêng biệt — rất tiện lợi cho gia đình có nhiều con.',
    stars: 5,
  },
  {
    name: 'Anh Bình', role: 'Bố của bé Vy, 5 tuổi', avatar: '#F2763A', initials: 'B',
    text: 'Thiết kế ứng dụng cực kỳ dễ dùng. Con gái 5 tuổi của tôi tự biết cách mở truyện và chọn câu chuyện mình thích mà không cần bố mẹ hỗ trợ gì cả!',
    stars: 5,
  },
  {
    name: 'Chị Thảo', role: 'Mẹ của bé Nam, 7 tuổi', avatar: '#FDC631', initials: 'T',
    text: 'Giá cả hợp lý và nội dung chất lượng cao. So với mua sách giấy thì vừa tiết kiệm vừa có thêm audio và trò chơi tương tác. Con tôi học đọc nhanh hơn hẳn.',
    stars: 5, dark: true,
  },
]

function ReviewCard({ r }) {
  return (
    <div className="embla__slide px-3" style={{ flex: '0 0 340px' }}>
      <div
        className="h-full rounded-[22px] bg-white"
        style={{ minHeight: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="p-7 h-full flex flex-col gap-4"
          >
            <div className="flex gap-1">
              {[...Array(r.stars)].map((_,j) => <Star key={j} size={13} weight="fill" color="#FDC631"/>)}
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: '#4A4A6A' }}>
              "{r.text}"
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                style={{ background: r.avatar, color: r.dark ? '#1A1A2E' : 'white' }}
              >
                {r.initials}
              </div>
              <div>
                <div className="text-sm font-bold text-[#1A1A2E]">{r.name}</div>
                <div className="text-xs" style={{ color: '#9090B0' }}>{r.role}</div>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="py-32 overflow-hidden" style={{ background: 'rgba(244,243,237,0.35)', backdropFilter: 'blur(4px)' }} ref={ref}>
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
              style={{ background: 'rgba(253,198,49,0.18)', color: '#B8860B', border: '1px solid rgba(253,198,49,0.3)' }}
            >
              <ChatCircle size={13} weight="duotone"/> Phụ huynh nói gì
            </div>
            <h2 className="font-display font-black text-[#1A1A2E]" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              12,000+ gia đình đã{' '}
              <span style={{ color: '#FDC631' }}>tin yêu</span> Yarnia
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <motion.button onClick={scrollPrev} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold border-2"
              style={{ borderColor: 'rgba(26,26,46,0.15)', color: '#1A1A2E', background: 'white' }}
            ><ArrowLeft size={18} weight="bold"/></motion.button>
            <motion.button onClick={scrollNext} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: '#1A1A2E' }}
            ><ArrowRight size={18} weight="bold"/></motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="embla -mx-3" ref={emblaRef}>
            <div className="embla__container">
              {reviews.map((r) => <ReviewCard key={r.name} r={r}/>)}
            </div>
          </div>
        </motion.div>

        {/* aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-12"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_,i) => <Star key={i} size={18} weight="fill" color="#FDC631"/>)}
          </div>
          <span className="font-bold text-[#1A1A2E]">4.9/5</span>
          <span style={{ color: '#6B6B8A' }}>·</span>
          <span className="text-sm" style={{ color: '#6B6B8A' }}>dựa trên 2,400+ đánh giá</span>
        </motion.div>
      </div>
    </section>
  )
}
