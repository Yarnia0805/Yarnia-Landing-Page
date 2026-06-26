import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Envelope, Phone, CheckCircle, ArrowRight, Warning, Sparkle, Lock } from '@phosphor-icons/react'
import SpotlightCard from './SpotlightCard'
import GridMotion from './backgrounds/GridMotion'

const INTERESTS = ['Kho truyện', 'Kid Mode', 'Gamification', 'Báo cáo phụ huynh', 'Bảng giá']

/* Replace this URL with your SheetDB endpoint when ready */
const SHEETDB_URL = 'https://sheetdb.io/api/v1/YOUR_SHEETDB_ID'

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            name: form.name,
            email: form.email,
            phone: form.phone,
            interest: form.interest,
            message: form.message,
            date: new Date().toISOString(),
          }],
        }),
      })
      if (!res.ok) throw new Error('Gửi thất bại')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', interest: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    }
  }

  const inputClass = 'w-full bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-[#9090B0] outline-none transition-all duration-200'
  const inputStyle = { border: '1.5px solid rgba(0,0,0,0.08)', fontFamily: 'var(--font-body)' }
  const inputFocusStyle = { borderColor: '#FDC63166', boxShadow: '0 0 0 3px rgba(253,198,49,0.12)' }

  function InputField({ label, name, type = 'text', placeholder, required }) {
    const [focused, setFocused] = useState(false)
    return (
      <div>
        <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {label}{required && <span style={{ color: '#DD3A34' }}> *</span>}
        </label>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={set(name)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClass}
          style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
          required={required}
        />
      </div>
    )
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #0D1B3E 50%, #1A1A2E 100%)',
      }}
    >
      {/* bg ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <GridMotion
          cols={8}
          rows={5}
          cellColor="rgba(253,198,49,0.04)"
          activeColor="rgba(253,198,49,0.22)"
          borderColor="rgba(255,255,255,0.07)"
          pulseSpeed={2800}
        />
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full opacity-12"
             style={{ background: 'radial-gradient(circle, #FDC631, transparent 65%)' }}/>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8"
             style={{ background: 'radial-gradient(circle, #9273E4, transparent 65%)' }}/>
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
            style={{ background: 'rgba(253,198,49,0.15)', color: '#FDC631', border: '1px solid rgba(253,198,49,0.3)' }}
          >
            <Sparkle size={13} weight="duotone"/> Liên hệ sớm
          </div>
          <h2 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
            Đăng ký nhận ưu đãi{' '}
            <span style={{ color: '#FDC631' }}>ra mắt sớm</span>
          </h2>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Yarnia đang trong giai đoạn Beta. Để lại thông tin — bạn sẽ được dùng thử miễn phí
            và nhận ưu đãi đặc biệt khi ra mắt chính thức.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="p-1.5 rounded-[28px]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="rounded-[22px] p-8" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                        style={{ background: 'rgba(50,128,69,0.2)' }}
                      >
                        <CheckCircle size={44} color="#328045" weight="duotone"/>
                      </motion.div>
                      <h3 className="font-display font-black text-white text-2xl mb-3">Đăng ký thành công!</h3>
                      <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Cảm ơn bạn đã quan tâm đến Yarnia. Chúng tôi sẽ gửi email thông báo sớm nhất khi có update.
                      </p>
                      <motion.button
                        onClick={() => setStatus('idle')}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-6 px-6 py-2.5 rounded-full text-sm font-bold text-[#1A1A2E]"
                        style={{ background: '#FDC631' }}
                      >
                        Đăng ký thêm
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InputField label="Họ và tên" name="name" placeholder="Nguyễn Văn A" required/>
                        <InputField label="Email" name="email" type="email" placeholder="email@gmail.com" required/>
                      </div>
                      <InputField label="Số điện thoại" name="phone" type="tel" placeholder="0909 xxx xxx"/>

                      {/* interest selector */}
                      <div>
                        <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          Bạn quan tâm đến
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map(item => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, interest: f.interest === item ? '' : item }))}
                              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                              style={{
                                background: form.interest === item ? '#FDC631' : 'rgba(255,255,255,0.08)',
                                color: form.interest === item ? '#1A1A2E' : 'rgba(255,255,255,0.7)',
                                border: `1px solid ${form.interest === item ? '#FDC631' : 'rgba(255,255,255,0.12)'}`,
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* message */}
                      <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          Nhắn gửi (không bắt buộc)
                        </label>
                        <textarea
                          rows={3}
                          value={form.message}
                          onChange={set('message')}
                          placeholder="Câu hỏi hoặc ý kiến của bạn..."
                          className={inputClass}
                          style={{ ...inputStyle, resize: 'none' }}
                        />
                      </div>

                      {status === 'error' && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                             style={{ background: 'rgba(221,58,52,0.15)', color: '#FF8080' }}>
                          <Warning size={16} weight="duotone"/>
                          {errorMsg}
                        </div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={status === 'loading'}
                        whileHover={{ scale: status === 'loading' ? 1 : 1.02, boxShadow: '0 8px 28px rgba(253,198,49,0.45)' }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[#1A1A2E] text-base"
                        style={{ background: '#FDC631', opacity: status === 'loading' ? 0.7 : 1 }}
                      >
                        {status === 'loading' ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-[#1A1A2E30] border-t-[#1A1A2E] rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            Đăng ký nhận thông báo
                            <ArrowRight size={16} weight="bold"/>
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        <Lock size={11} weight="duotone" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }}/> Thông tin của bạn được bảo mật hoàn toàn. Không spam, hủy bất kỳ lúc nào.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* side info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* benefits */}
            <div>
              <h3 className="font-display font-black text-white text-xl mb-5">
                Quyền lợi khi đăng ký sớm
              </h3>
              {[
                { emoji: '🎁', title: 'Dùng thử miễn phí 60 ngày', desc: 'Gấp đôi thời gian dùng thử so với người dùng thông thường.' },
                { emoji: '💰', title: 'Ưu đãi giá ra mắt 40%', desc: 'Giá đặc biệt chỉ dành cho người đăng ký trước khi ra mắt.' },
                { emoji: '🔔', title: 'Thông báo sớm nhất', desc: 'Biết trước khi tính năng mới ra mắt và tham gia beta testing.' },
                { emoji: '⭐', title: 'Hỗ trợ ưu tiên', desc: 'Đường dây hỗ trợ riêng, phản hồi trong vòng 2 giờ.' },
              ].map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex gap-4 py-4 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <span className="text-2xl shrink-0">{b.emoji}</span>
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">{b.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* contact info */}
            <SpotlightCard
              spotlightColor="rgba(253,198,49,0.1)"
              borderColor="rgba(255,255,255,0.1)"
              className="rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Liên hệ trực tiếp
                </p>
                <div className="flex flex-col gap-3">
                  <a href="mailto:hello@yarnia.vn" className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                     style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(253,198,49,0.15)' }}>
                      <Envelope size={15} color="#FDC631" weight="duotone"/>
                    </div>
                    hello@yarnia.vn
                  </a>
                  <a href="tel:+84909000000" className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                     style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(253,198,49,0.15)' }}>
                      <Phone size={15} color="#FDC631" weight="duotone"/>
                    </div>
                    0909 000 000
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
