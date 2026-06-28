import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const MacBook3DScene = lazy(() => import('./MacBook3DScene'))
import {
  Play, Pause, SkipForward, SkipBack,
  SpeakerHigh, SpeakerNone,
  Books, TextAa, Lightning, Star,
  BookmarkSimple, ArrowCounterClockwise, ArrowRight,
  CheckCircle, XCircle, Trophy,
} from '@phosphor-icons/react'

/* ─── DATA ────────────────────────────────────────────────── */
const STORIES = [
  {
    id: 'tam-cam',
    title: 'Tấm Cám',
    category: 'Cổ tích',
    color: '#0648D7',
    emoji: '🏰',
    age: '6–10 tuổi',
    xpReward: 50,
    duration: '3:24',
    pages: [
      'Ngày xưa, có hai chị em Tấm và Cám sống với nhau. Tấm hiền lành, chăm chỉ, còn Cám thì lười biếng và hay ghen ghét.',
      'Một ngày, mụ dì ghẻ sai hai chị em ra đồng bắt tép. Ai bắt được đầy giỏ sẽ được thưởng một cái yếm đỏ đẹp.',
      'Tấm chăm chỉ bắt được đầy giỏ. Cám lười biếng, bèn trút hết tép của Tấm vào giỏ mình rồi về nhà trước.',
      'Tấm ngồi khóc bên bờ ruộng. Bụt hiện ra hỏi: "Con khóc vì sao?" và dạy Tấm nuôi con cá bống trong giếng.',
    ],
    vocab: [{ word: 'Hiền lành', meaning: 'Kind, gentle — tính cách tốt đẹp, không làm hại ai' }],
    questions: [
      { q: 'Tại sao Tấm khóc bên bờ ruộng?', choices: ['Vì Cám trút hết tép của Tấm', 'Vì Tấm bắt được ít tép hơn Cám', 'Vì yếm đỏ quá đắt'], correct: 0, explain: 'Đúng! Cám lười biếng nên đã lấy hết tép của Tấm, khiến Tấm mất phần thưởng.' },
      { q: 'Bụt xuất hiện để làm gì?', choices: ['Trách Tấm vì khóc nhiều', 'Giúp Tấm và dạy nuôi cá bống', 'Phạt Cám vì tham lam'], correct: 1, explain: 'Bụt là nhân vật phép thuật luôn xuất hiện giúp người hiền lành trong truyện cổ tích.' },
      { q: 'Câu chuyện dạy chúng ta điều gì?', choices: ['Nên nhanh hơn người khác', 'Sự chăm chỉ và hiền lành sẽ được đền đáp', 'Cần có phép thuật để thành công'], correct: 1, explain: 'Tấm chăm chỉ và hiền lành nên được Bụt giúp đỡ — đây là bài học nhân quả của truyện cổ tích Việt Nam.' },
    ],
  },
  {
    id: 'tho-rua',
    title: 'Thỏ và Rùa',
    category: 'Ngụ ngôn',
    color: '#328045',
    emoji: '🐢',
    age: '4–8 tuổi',
    xpReward: 40,
    duration: '2:15',
    pages: [
      'Trong một khu rừng xanh tươi, Thỏ và Rùa là đôi bạn thân. Thỏ luôn tự hào về đôi chân nhanh nhẹn của mình.',
      '"Tớ chạy nhanh nhất rừng này!" — Thỏ hãnh diện nói. Rùa chỉ mỉm cười hiền lành và đề nghị thi đua.',
      'Cuộc đua bắt đầu. Thỏ vọt lên trước, nhưng nghĩ mình chắc thắng nên nằm ngủ dưới gốc cây.',
      'Rùa kiên nhẫn bước từng bước một, không nghỉ. Khi Thỏ tỉnh dậy, Rùa đã về đích từ lâu!',
    ],
    vocab: [{ word: 'Kiên nhẫn', meaning: 'Patient — bình tĩnh, không bỏ cuộc dù khó khăn' }],
    questions: [
      { q: 'Tại sao Thỏ thua cuộc đua?', choices: ['Vì Thỏ chạy chậm hơn Rùa', 'Vì Thỏ chủ quan và ngủ quên', 'Vì đường quá dài'], correct: 1, explain: 'Thỏ chủ quan vì nghĩ mình nhanh hơn, nên ngủ quên. Sự tự mãn là nguyên nhân thất bại!' },
      { q: 'Điều gì giúp Rùa giành chiến thắng?', choices: ['Phép thuật đặc biệt', 'Kiên nhẫn và không bỏ cuộc', 'Có nhiều bạn giúp đỡ'], correct: 1, explain: 'Rùa thắng không phải vì nhanh, mà vì kiên nhẫn bước từng bước — đây là bí quyết thành công!' },
      { q: 'Bài học từ câu chuyện này là gì?', choices: ['Cần phải ngủ đủ giấc', 'Chậm mà chắc còn hơn nhanh mà ẩu', 'Không nên thách đấu bạn bè'], correct: 1, explain: 'Ngụ ngôn "Thỏ và Rùa" dạy rằng sự kiên trì và chăm chỉ quan trọng hơn tài năng tự nhiên.' },
    ],
  },
  {
    id: 'son-tinh',
    title: 'Sơn Tinh Thủy Tinh',
    category: 'Thần thoại',
    color: '#9273E4',
    emoji: '⛰️',
    age: '7–12 tuổi',
    xpReward: 65,
    duration: '4:10',
    pages: [
      'Vua Hùng thứ mười tám có người con gái tuyệt đẹp tên Mỵ Nương. Hai chàng trai tài giỏi cùng đến cầu hôn.',
      'Sơn Tinh là thần núi — vẫy tay là rừng núi mọc lên. Thủy Tinh là thần nước — hét lên sóng biển dâng cao.',
      'Vua ra điều kiện: ai đến trước với đủ lễ vật sẽ cưới Mỵ Nương. Sơn Tinh đến sớm hơn và rước dâu về núi.',
      'Thủy Tinh tức giận, dâng nước lên đánh Sơn Tinh. Sơn Tinh nâng núi lên cao. Hai thần đánh nhau mãi — đó là lý do có lũ lụt hàng năm.',
    ],
    vocab: [{ word: 'Lễ vật', meaning: 'Wedding gifts/offerings — quà cưới, thường là vật quý hiếm' }],
    questions: [
      { q: 'Tại sao Sơn Tinh thắng và lấy được Mỵ Nương?', choices: ['Sơn Tinh đẹp trai hơn', 'Sơn Tinh đến sớm hơn với đủ lễ vật', 'Vua Hùng thích Sơn Tinh hơn'], correct: 1, explain: 'Vua đặt ra quy tắc rõ ràng — ai đến trước với đủ lễ vật sẽ thắng. Sơn Tinh tuân thủ và đến sớm!' },
      { q: 'Theo câu chuyện, lũ lụt hàng năm là do đâu?', choices: ['Mưa nhiều từ trời', 'Thủy Tinh tức giận dâng nước đánh Sơn Tinh', 'Biển tràn vào đất liền'], correct: 1, explain: 'Người Việt xưa giải thích hiện tượng lũ lụt qua thần thoại — đây là cách "khoa học dân gian" của cha ông.' },
      { q: 'Câu chuyện này thuộc thể loại nào?', choices: ['Cổ tích — có Bụt và phép màu', 'Thần thoại — giải thích hiện tượng tự nhiên', 'Ngụ ngôn — có bài học đạo đức'], correct: 1, explain: 'Thần thoại (myth) giải thích nguồn gốc các hiện tượng thiên nhiên — như mưa, lũ, núi lửa.' },
    ],
  },
  {
    id: 'bach-tuoc',
    title: 'Bạch Tuộc Thông Minh',
    category: 'Khoa học',
    color: '#0099CC',
    emoji: '🐙',
    age: '8–12 tuổi',
    xpReward: 55,
    duration: '2:50',
    pages: [
      'Bạch tuộc là sinh vật thông minh nhất đại dương. Dù không có xương sống, chúng có thể giải quyết các bài toán phức tạp!',
      'Bạch tuộc có 8 xúc tu, mỗi cái đều có "não" riêng — tức là chúng có thể điều khiển 8 cánh tay cùng lúc, độc lập với nhau.',
      'Chúng có thể mở nắp lọ, đi qua mê cung, thậm chí nhận ra khuôn mặt người. Trí nhớ của chúng kéo dài tới vài tháng!',
      'Bạch tuộc còn thay đổi màu da trong 0,3 giây để ngụy trang hoặc thể hiện cảm xúc. Thật sự là siêu năng lực!',
    ],
    vocab: [{ word: 'Ngụy trang', meaning: 'Camouflage — khả năng ẩn mình bằng cách thay đổi hình dạng/màu sắc' }],
    questions: [
      { q: 'Điều gì đặc biệt ở não của bạch tuộc?', choices: ['Não to nhất đại dương', 'Mỗi xúc tu có "não" riêng, hoạt động độc lập', 'Não phát sáng trong đêm tối'], correct: 1, explain: 'Bạch tuộc có hệ thần kinh phân tán — 2/3 tế bào thần kinh nằm ở 8 xúc tu, không phải trong đầu!' },
      { q: 'Bạch tuộc thay đổi màu da để làm gì?', choices: ['Để đẹp hơn trong nước', 'Để ngụy trang và thể hiện cảm xúc', 'Để bắt mồi nhanh hơn'], correct: 1, explain: 'Bạch tuộc dùng màu da để giao tiếp với đồng loại và ẩn mình khỏi kẻ thù — thay đổi trong chưa đầy 1 giây!' },
      { q: 'Bạch tuộc có thể nhớ khuôn mặt người trong bao lâu?', choices: ['Vài giây', 'Vài tháng', 'Cả đời'], correct: 1, explain: 'Nghiên cứu chứng minh bạch tuộc nhận ra và nhớ khuôn mặt người chăm sóc chúng trong nhiều tháng!' },
    ],
  },
]

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5]
const FONT_SIZES = [
  { label: 'Nhỏ', size: 14 },
  { label: 'Vừa', size: 16 },
  { label: 'Lớn', size: 19 },
]

const BARS = Array.from({ length: 36 }, (_, i) => ({
  h: Math.abs(Math.sin(i * 0.8 + 1.2) * 14) + Math.abs(Math.sin(i * 0.3) * 8) + 6,
  delay: (i * 0.05) % 0.5,
}))

/* ─── TTS via Web Speech API ─────────────────────────────── */
function useTTS() {
  const uttRef = useRef(null)
  const wordCbRef = useRef(null)

  const speak = useCallback((text, { rate = 1, onWord, onEnd } = {}) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'vi-VN'
    utt.rate = Math.max(0.5, Math.min(rate, 2))

    /* pick Vietnamese voice if available */
    const voices = window.speechSynthesis.getVoices()
    const viVoice = voices.find(v => v.lang.startsWith('vi'))
    if (viVoice) utt.voice = viVoice

    wordCbRef.current = onWord
    utt.onboundary = (e) => {
      if (e.name === 'word' && wordCbRef.current) wordCbRef.current(e)
    }
    utt.onend = () => { if (onEnd) onEnd() }
    uttRef.current = utt
    window.speechSynthesis.speak(utt)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const pause = useCallback(() => {
    window.speechSynthesis?.pause()
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis?.resume()
  }, [])

  return { speak, stop, pause, resume }
}

/* ─── URL TYPEWRITER ─────────────────────────────────────── */
const FULL_URL = 'yarnia.vn/stories/tam-cam'

function UrlTypewriter({ active, onDone }) {
  const [typed, setTyped] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!active) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setTyped(FULL_URL.slice(0, i))
      if (i >= FULL_URL.length) {
        clearInterval(iv)
        if (!doneRef.current) { doneRef.current = true; setTimeout(onDone, 600) }
      }
    }, 55)
    return () => clearInterval(iv)
  }, [active, onDone])

  useEffect(() => {
    const iv = setInterval(() => setShowCursor(c => !c), 500)
    return () => clearInterval(iv)
  }, [])

  return (
    <span className="font-mono text-[10px]" style={{ color: '#444', letterSpacing: 0 }}>
      {typed}<span style={{ opacity: showCursor ? 1 : 0, color: '#0648D7' }}>|</span>
    </span>
  )
}

/* ─── COMPONENT ──────────────────────────────────────────── */
export default function StoryReaderDemo() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  /* animation phases: 'intro3d' | 'closed' | 'opening' | 'typing' | 'ready' */
  const [phase, setPhase] = useState('intro3d')
  const [show3D, setShow3D] = useState(true)
  const [macbook3DPhase, setMacbook3DPhase] = useState('closed')

  const [storyIdx, setStoryIdx]         = useState(0)
  const [pageIdx, setPageIdx]           = useState(0)
  const [playing, setPlaying]           = useState(false)
  const [progress, setProgress]         = useState(0)
  const [wordIdx, setWordIdx]           = useState(-1)
  const [muted, setMuted]               = useState(true)
  const [volume, setVolume]             = useState(0.8)
  const [speed, setSpeed]               = useState(1.0)
  const [showVolume, setShowVolume]     = useState(false)
  const [fontSize, setFontSize]         = useState(1)
  const [bookmarked, setBookmarked]     = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [ttsSupported]                  = useState(() => typeof window !== 'undefined' && !!window.speechSynthesis)

  const [showQuiz, setShowQuiz]         = useState(false)
  const [quizIdx, setQuizIdx]           = useState(0)
  const [selected, setSelected]         = useState(null)
  const [answered, setAnswered]         = useState(false)
  const [score, setScore]               = useState(0)
  const [quizDone, setQuizDone]         = useState(false)
  const [earnedXP, setEarnedXP]         = useState(false)

  const intervalRef = useRef(null)
  const tts = useTTS()

  const story = STORIES[storyIdx]
  const safePageIdx = Math.min(pageIdx, story.pages.length - 1)
  const currentPage = story.pages[safePageIdx] ?? ''
  const words = currentPage.split(' ').filter(Boolean)
  const totalPages = story.pages.length
  const isLastPage = safePageIdx === totalPages - 1

  /* slower tick: 200ms base ÷ speed */
  const tickMs = Math.round(200 / speed)

  /* TTS speak current page */
  const speakPage = useCallback((text, spd) => {
    if (!ttsSupported) return
    tts.speak(text, {
      rate: spd * 0.85,
      onWord: (e) => {
        /* map char offset → word index */
        const before = text.slice(0, e.charIndex)
        const wi = before.split(' ').filter(Boolean).length
        setWordIdx(Math.min(wi, words.length - 1))
      },
      onEnd: () => {},
    })
  }, [tts, ttsSupported, words.length])

  /* Phase sequence on inView */
  useEffect(() => {
    if (!inView || phase !== 'intro3d') return
    /* 3D intro: MacBook flies in closed → lid opens → screen lights up → fade to CSS demo */
    const t0 = setTimeout(() => setMacbook3DPhase('opening'), 1000)   // lid starts opening
    const t1 = setTimeout(() => setMacbook3DPhase('typing'), 2600)    // screen content fades in fully
    const t2 = setTimeout(() => {
      /* transition: 3D fade out, CSS MacBook takes over for interaction */
      setShow3D(false)
      setPhase('opening')
    }, 6000)
    const t3 = setTimeout(() => setPhase('typing'), 7200)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  const handleUrlDone = useCallback(() => {
    setPhase('ready')
    setTimeout(() => setPlaying(true), 500)
  }, [])

  /* Simulation ticker (always runs for progress bar + word highlight fallback) */
  useEffect(() => {
    if (playing && !showQuiz) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current)
            setPlaying(false)
            if (isLastPage) {
              setShowQuiz(true)
            } else {
              setTimeout(() => {
                setPageIdx(pi => pi + 1)
                setProgress(0)
                setWordIdx(-1)
                setPlaying(true)
              }, 600)
            }
            return 100
          }
          return p + (100 / (words.length * 1.8))
        })
        /* only drive wordIdx via interval when TTS not available */
        if (!ttsSupported) {
          setWordIdx(w => (w + 1 < words.length ? w + 1 : w))
        }
      }, tickMs)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, showQuiz, isLastPage, words.length, tickMs, ttsSupported])

  /* TTS control */
  useEffect(() => {
    if (!ttsSupported || muted) return
    if (playing && !showQuiz) {
      speakPage(currentPage, speed)
    } else {
      tts.stop()
    }
    return () => tts.stop()
  }, [playing, showQuiz, safePageIdx, storyIdx, muted, speed, ttsSupported])

  const switchStory = useCallback((idx) => {
    clearInterval(intervalRef.current)
    tts.stop()
    setStoryIdx(idx)
    setPageIdx(0)
    setProgress(0)
    setWordIdx(-1)
    setPlaying(false)
    setShowQuiz(false)
    setQuizIdx(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setQuizDone(false)
    setEarnedXP(false)
    setBookmarked(false)
    setTimeout(() => setPlaying(true), 400)
  }, [tts])

  const togglePlay = () => {
    if (playing) {
      tts.pause()
    } else {
      if (ttsSupported && !muted) tts.resume()
    }
    setPlaying(v => !v)
  }

  const handleAnswer = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === story.questions[quizIdx].correct) setScore(s => s + 1)
  }

  const nextQuestion = () => {
    if (quizIdx + 1 >= story.questions.length) {
      setQuizDone(true)
      setEarnedXP(true)
    } else {
      setQuizIdx(q => q + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const restartStory = () => {
    setPageIdx(0); setProgress(0); setWordIdx(-1)
    setShowQuiz(false); setQuizIdx(0); setSelected(null)
    setAnswered(false); setScore(0); setQuizDone(false)
    setEarnedXP(false); setPlaying(true)
  }

  const goPage = (dir) => {
    const next = pageIdx + dir
    if (next < 0 || next >= totalPages) return
    clearInterval(intervalRef.current)
    tts.stop()
    setPageIdx(next)
    setProgress(0)
    setWordIdx(-1)
    setPlaying(false)
    setTimeout(() => setPlaying(true), 300)
  }

  const currentQuestion = story.questions[quizIdx]
  const xpEarned = Math.round(story.xpReward * (score / story.questions.length))

  /* ── RENDER ── */
  return (
    <section ref={ref} className="py-32 overflow-hidden" style={{ background: 'rgba(244,243,237,0.35)', backdropFilter: 'blur(4px)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-6"
            style={{ background: 'rgba(6,72,215,0.1)', color: '#0648D7', border: '1px solid rgba(6,72,215,0.2)' }}>
            <Books size={12} weight="duotone"/> Trải nghiệm đọc truyện thực tế
          </div>
          <h2 className="font-display font-black text-[#1A1A2E] mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
            Nghe · đọc · <span style={{ color: '#0648D7' }}>hiểu</span> từng từ một
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B6B8A' }}>
            Chọn truyện, điều chỉnh cỡ chữ và tốc độ đọc — rồi trả lời câu hỏi để kiếm XP!
          </p>
          {ttsSupported && (
            <p className="text-xs mt-2" style={{ color: '#9090B0' }}>
              🔊 Text-to-speech đang hoạt động — bật âm thanh để nghe!
            </p>
          )}
        </motion.div>

        {/* ── MacBook 3D intro ── */}
        <AnimatePresence mode="wait">
          {show3D && (
            <motion.div
              key="macbook3d"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: 860 }}
            >
              <Suspense fallback={
                <div style={{ height: 860, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 48, height: 48, border: '3px solid #0648D720', borderTopColor: '#0648D7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
                </div>
              }>
                <MacBook3DScene
                  phase={macbook3DPhase}
                  wordIdx={wordIdx}
                  progress={progress}
                  style={{ width: '100%', height: '100%' }}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MacBook CSS frame ── */}
        {!show3D && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
        >
          <div className="relative mx-auto" style={{ maxWidth: 900 }}>

            {/* ── Screen lid (3D open animation) ── */}
            <motion.div
              initial={{ rotateX: 90, transformOrigin: 'bottom center' }}
              animate={phase === 'closed'
                ? { rotateX: 90 }
                : { rotateX: 0 }
              }
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
            >
            {/* top lid */}
            <div className="relative rounded-t-[16px] rounded-b-[4px] overflow-hidden"
              style={{
                background: '#1d1d1f',
                padding: '10px 10px 0 10px',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 -4px 32px rgba(0,0,0,0.35)',
              }}>
              {/* notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-xl z-10"
                style={{ background: '#1d1d1f' }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{ background: '#0a0a0a', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)' }}/>
              </div>

              {/* screen inner */}
              <div className="rounded-t-[8px] overflow-hidden"
                style={{ background: phase === 'closed' ? '#111' : '#fff', minHeight: 480, transition: 'background 1.2s' }}>

                {/* closed state — black screen with Apple logo glow */}
                {phase === 'closed' && (
                  <div className="flex items-center justify-center" style={{ minHeight: 480 }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{ duration: 0.5 }}
                      className="text-white text-4xl select-none"
                    >

                    </motion.div>
                  </div>
                )}

                {/* macOS chrome — shown after opening */}
                {phase !== 'closed' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                {/* tab bar */}
                <div className="flex items-center gap-2 px-4 py-2.5"
                  style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }}/>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }}/>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }}/>
                  </div>
                  {/* address bar */}
                  <div className="flex-1 mx-3">
                    <div className="mx-auto max-w-xs h-6 rounded-md flex items-center gap-1.5 px-3"
                      style={{ background: phase === 'typing' || phase === 'ready' ? 'white' : '#e8e8e8', border: phase === 'typing' ? '1.5px solid #0648D7' : '1px solid #d0d0d0', transition: 'all 0.3s' }}>
                      <span style={{ fontSize: 10 }}>🔒</span>
                      {phase === 'opening' && (
                        <span className="text-[10px]" style={{ color: '#999' }}>Đang tải...</span>
                      )}
                      {(phase === 'typing' || phase === 'ready') && (
                        <UrlTypewriter active={phase === 'typing'} onDone={handleUrlDone}/>
                      )}
                    </div>
                  </div>
                  <div className="w-14"/>
                </div>

                {/* app chrome inside screen */}
                <div className="grid lg:grid-cols-[220px_1fr]" style={{ minHeight: 440 }}>

                  {/* ── Sidebar ── */}
                  <div className="flex flex-col gap-2 p-3 overflow-y-auto"
                    style={{ background: '#fafafa', borderRight: '1px solid #e8e8e8' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider px-1 pt-1" style={{ color: '#9090B0' }}>
                      4 câu chuyện
                    </p>

                    {STORIES.map((s, i) => (
                      <motion.button
                        key={s.id}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => switchStory(i)}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl text-left relative overflow-hidden"
                        style={{
                          background: storyIdx === i ? s.color : 'white',
                          border: `1.5px solid ${storyIdx === i ? s.color : 'rgba(0,0,0,0.07)'}`,
                          boxShadow: storyIdx === i ? `0 4px 12px ${s.color}35` : '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                      >
                        <span className="text-lg shrink-0">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[11px] truncate" style={{ color: storyIdx === i ? 'white' : '#1A1A2E' }}>
                            {s.title}
                          </div>
                          <div className="text-[9px] mt-0.5" style={{ color: storyIdx === i ? 'rgba(255,255,255,0.7)' : '#9090B0' }}>
                            {s.category} · {s.age}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: storyIdx === i ? 'rgba(255,255,255,0.2)' : `${s.color}18`, color: storyIdx === i ? 'white' : s.color }}>
                          +{s.xpReward}XP
                        </span>
                      </motion.button>
                    ))}

                    {/* vocab card */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="mt-1 p-3 rounded-xl"
                        style={{ background: `${story.color}10`, border: `1.5px solid ${story.color}25` }}
                      >
                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: story.color }}>
                          💡 Từ mới
                        </div>
                        <div className="font-bold text-[11px] text-[#1A1A2E]">{story.vocab[0].word}</div>
                        <div className="text-[10px] leading-relaxed mt-0.5" style={{ color: '#6B6B8A' }}>{story.vocab[0].meaning}</div>
                      </motion.div>
                    </AnimatePresence>

                    {(quizDone || score > 0) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl"
                        style={{ background: '#FDC63115', border: '1.5px solid #FDC63135' }}
                      >
                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: '#B8860B' }}>⭐ Kết quả</div>
                        <div className="font-black text-base" style={{ color: '#1A1A2E' }}>{score}/{story.questions.length} đúng</div>
                        {earnedXP && <div className="text-[10px] font-bold mt-0.5" style={{ color: '#328045' }}>+{xpEarned} XP!</div>}
                      </motion.div>
                    )}
                  </div>

                  {/* ── Main reader panel ── */}
                  <div className="flex flex-col" style={{ background: '#fff' }}>
                    {/* topbar */}
                    <div className="flex items-center justify-between px-4 py-2.5"
                      style={{ background: story.color, minHeight: 48 }}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{story.emoji}</span>
                        <div>
                          <div className="font-bold text-white text-sm">{story.title}</div>
                          <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {story.category} · {story.age}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setBookmarked(b => !b)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: bookmarked ? '#FDC631' : 'rgba(255,255,255,0.18)' }}>
                          <BookmarkSimple size={12} color={bookmarked ? '#1A1A2E' : 'white'} weight={bookmarked ? 'fill' : 'regular'}/>
                        </motion.button>
                        <div className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                          {safePageIdx + 1}/{totalPages}
                        </div>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowSettings(s => !s)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: showSettings ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)' }}>
                          <TextAa size={12} color="white" weight="bold"/>
                        </motion.button>
                      </div>
                    </div>

                    {/* settings panel */}
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ background: `${story.color}08`, borderBottom: `1px solid ${story.color}18`, overflow: 'hidden' }}
                        >
                          <div className="px-4 py-2 flex items-center gap-5 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold" style={{ color: '#6B6B8A' }}>Cỡ chữ</span>
                              <div className="flex gap-1">
                                {FONT_SIZES.map((f, i) => (
                                  <button key={i} onClick={() => setFontSize(i)}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold transition-all"
                                    style={{ background: fontSize === i ? story.color : '#F4F3ED', color: fontSize === i ? 'white' : '#6B6B8A' }}>
                                    {f.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Lightning size={10} color="#6B6B8A" weight="duotone"/>
                              <span className="text-[10px] font-bold" style={{ color: '#6B6B8A' }}>Tốc độ</span>
                              <div className="flex gap-1">
                                {SPEED_OPTIONS.map(s => (
                                  <button key={s} onClick={() => setSpeed(s)}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold transition-all"
                                    style={{ background: speed === s ? story.color : '#F4F3ED', color: speed === s ? 'white' : '#6B6B8A' }}>
                                    {s}×
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* story text / quiz — fills remaining height */}
                    <div className="flex-1 flex flex-col">
                      <AnimatePresence mode="wait">
                        {!showQuiz ? (
                          <motion.div
                            key={`${story.id}-${safePageIdx}`}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.28 }}
                            className="flex-1 flex flex-col px-6 pt-5 pb-3"
                            style={{ background: '#FAFAF8' }}
                          >
                            {/* page dots */}
                            <div className="flex gap-1.5 mb-4">
                              {story.pages.map((_, i) => (
                                <button key={i} onClick={() => goPage(i - safePageIdx)}
                                  className="rounded-full transition-all"
                                  style={{
                                    width: i === safePageIdx ? 18 : 5,
                                    height: 5,
                                    background: i === safePageIdx ? story.color : i < safePageIdx ? `${story.color}55` : '#E0DDD5',
                                  }}
                                />
                              ))}
                            </div>

                            <p className="flex-1 leading-[1.9]" style={{ fontSize: FONT_SIZES[fontSize].size, color: '#1A1A2E', fontWeight: 500 }}>
                              {words.map((word, wi) => {
                                const isActive = wordIdx === wi
                                const isPast   = wordIdx > wi
                                return (
                                  <motion.span
                                    key={`${safePageIdx}-${wi}`}
                                    animate={isActive
                                      ? { backgroundColor: story.color, color: 'white', scale: 1.05 }
                                      : { backgroundColor: isPast ? `${story.color}16` : 'transparent', color: isPast ? story.color : '#1A1A2E', scale: 1 }
                                    }
                                    transition={{ duration: 0.18 }}
                                    className="inline-block px-0.5 rounded"
                                    style={{ display: 'inline' }}
                                  >
                                    {word}{' '}
                                  </motion.span>
                                )
                              })}
                            </p>
                          </motion.div>
                        ) : (
                          <AnimatePresence mode="wait">
                            {!quizDone ? (
                              <motion.div
                                key={`q-${quizIdx}`}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.28 }}
                                className="flex-1 flex flex-col px-6 py-4"
                                style={{ background: '#FAFAF8' }}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${story.color}18` }}>
                                      <span className="text-xs">🧠</span>
                                    </div>
                                    <span className="font-bold text-xs" style={{ color: '#1A1A2E' }}>
                                      Câu {quizIdx + 1}/{story.questions.length}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    {story.questions.map((_, i) => (
                                      <div key={i} className="w-5 h-1.5 rounded-full"
                                        style={{ background: i < quizIdx ? '#328045' : i === quizIdx ? story.color : '#E0DDD5' }}/>
                                    ))}
                                  </div>
                                </div>

                                <p className="font-bold mb-4 text-sm" style={{ color: '#1A1A2E' }}>{currentQuestion.q}</p>

                                <div className="flex flex-col gap-2 mb-3">
                                  {currentQuestion.choices.map((choice, ci) => {
                                    const isCorrect  = ci === currentQuestion.correct
                                    const isSelected = ci === selected
                                    let bg = '#F4F3ED', borderCol = 'transparent', textCol = '#1A1A2E'
                                    if (answered) {
                                      if (isCorrect) { bg = '#32804515'; borderCol = '#328045'; textCol = '#328045' }
                                      else if (isSelected) { bg = '#DD3A3412'; borderCol = '#DD3A34'; textCol = '#DD3A34' }
                                    } else if (isSelected) {
                                      bg = `${story.color}16`; borderCol = story.color; textCol = story.color
                                    }
                                    return (
                                      <motion.button
                                        key={ci}
                                        onClick={() => handleAnswer(ci)}
                                        disabled={answered}
                                        whileHover={!answered ? { x: 3 } : {}}
                                        whileTap={!answered ? { scale: 0.98 } : {}}
                                        className="flex items-center gap-2.5 text-left px-3.5 py-2.5 rounded-xl text-xs font-medium"
                                        style={{ background: bg, border: `1.5px solid ${borderCol || 'transparent'}`, color: textCol, transition: 'all 0.18s' }}
                                      >
                                        <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-black shrink-0"
                                          style={{ borderColor: borderCol || '#D0CFC8', color: textCol }}>
                                          {['A','B','C'][ci]}
                                        </span>
                                        {choice}
                                        {answered && isCorrect  && <CheckCircle size={13} color="#328045" weight="fill" className="ml-auto shrink-0"/>}
                                        {answered && isSelected && !isCorrect && <XCircle size={13} color="#DD3A34" weight="fill" className="ml-auto shrink-0"/>}
                                      </motion.button>
                                    )
                                  })}
                                </div>

                                <AnimatePresence>
                                  {answered && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="p-3 rounded-xl mb-3 text-xs leading-relaxed"
                                      style={{
                                        background: selected === currentQuestion.correct ? '#32804510' : '#DD3A340D',
                                        border: `1px solid ${selected === currentQuestion.correct ? '#32804528' : '#DD3A3428'}`,
                                        color: selected === currentQuestion.correct ? '#328045' : '#DD3A34',
                                      }}
                                    >
                                      {selected === currentQuestion.correct ? '✅ ' : '❌ '}{currentQuestion.explain}
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {answered && (
                                  <motion.button
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={nextQuestion}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white"
                                    style={{ background: story.color }}
                                  >
                                    <span className="flex items-center justify-center gap-2">
                                      {quizIdx + 1 >= story.questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                                      <ArrowRight size={12} weight="bold"/>
                                    </span>
                                  </motion.button>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center"
                                style={{ background: '#FAFAF8' }}
                              >
                                <motion.div
                                  initial={{ scale: 0, rotate: -20 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                                  className="text-4xl mb-3"
                                >
                                  {score === story.questions.length ? '🏆' : score >= 2 ? '⭐' : '📖'}
                                </motion.div>
                                <h3 className="font-display font-black text-lg mb-1" style={{ color: '#1A1A2E' }}>
                                  {score === story.questions.length ? 'Xuất sắc!' : score >= 2 ? 'Tốt lắm!' : 'Cố lên!'}
                                </h3>
                                <p className="text-xs mb-3" style={{ color: '#6B6B8A' }}>{score}/{story.questions.length} câu đúng</p>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4, type: 'spring', stiffness: 240 }}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-[#1A1A2E] mb-4 text-sm"
                                  style={{ background: '#FDC631', boxShadow: '0 4px 16px rgba(253,198,49,0.4)' }}
                                >
                                  <Star size={13} weight="fill" color="#1A1A2E"/>
                                  +{xpEarned} XP kiếm được!
                                </motion.div>
                                <div className="flex gap-2 justify-center">
                                  <motion.button onClick={restartStory} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs"
                                    style={{ background: '#F4F3ED', color: '#1A1A2E' }}>
                                    <ArrowCounterClockwise size={12} weight="bold"/> Đọc lại
                                  </motion.button>
                                  <motion.button onClick={() => switchStory((storyIdx + 1) % STORIES.length)}
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white"
                                    style={{ background: story.color }}>
                                    <Trophy size={12} weight="bold"/> Truyện tiếp
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Audio controls ── */}
                    {!showQuiz && (
                      <div className="px-4 pb-4 pt-1" style={{ background: '#FAFAF8', borderTop: '1px solid #eee' }}>
                        {/* waveform */}
                        <div className="flex items-center gap-px h-7 mb-2 px-1">
                          {BARS.map((bar, i) => {
                            const activated = (i / BARS.length) * 100 <= progress
                            return (
                              <motion.div key={i} className="flex-1 rounded-full min-w-0.5"
                                style={{ background: muted ? '#E0DDD5' : activated ? story.color : '#E0DDD5' }}
                                animate={playing && activated && !muted
                                  ? { height: [bar.h * 0.45, bar.h * 0.85, bar.h * 0.6, bar.h, bar.h * 0.5] }
                                  : { height: bar.h * 0.35 }
                                }
                                transition={{ duration: 0.7 / speed, repeat: Infinity, delay: bar.delay, ease: 'easeInOut' }}
                              />
                            )
                          })}
                        </div>

                        {/* progress scrubber */}
                        <div
                          className="w-full h-1.5 rounded-full mb-2.5 cursor-pointer"
                          style={{ background: '#E8E6E0' }}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const pct = ((e.clientX - rect.left) / rect.width) * 100
                            setProgress(pct)
                            setWordIdx(Math.floor((pct / 100) * words.length))
                          }}
                        >
                          <motion.div className="h-full rounded-full relative"
                            style={{ background: story.color }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.08 }}
                          >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2"
                              style={{ borderColor: story.color }}/>
                          </motion.div>
                        </div>

                        {/* controls */}
                        <div className="flex items-center justify-between gap-2">

                          {/* Volume button + tooltip + slider */}
                          <div className="relative flex items-center gap-1.5">
                            <div className="relative">
                              <motion.button
                                whileTap={{ scale: 0.88 }}
                                onClick={() => {
                                  const newMuted = !muted
                                  setMuted(newMuted)
                                  if (newMuted) tts.stop()
                                  else if (playing) speakPage(currentPage, speed)
                                  setShowVolume(!newMuted)
                                }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center relative"
                                style={{ background: muted ? '#DD3A3412' : '#F4F3ED' }}
                              >
                                {muted
                                  ? <SpeakerNone size={12} color="#DD3A34" weight="bold"/>
                                  : <SpeakerHigh size={12} color="#6B6B8A" weight="duotone"/>
                                }
                              </motion.button>

                              {/* Tooltip khi muted */}
                              {muted && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4, scale: 0.92 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-50"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  <div className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white shadow-lg"
                                    style={{ background: '#1A1A2E', lineHeight: 1.4 }}>
                                    🔊 Bật âm để nghe truyện
                                    <div className="absolute top-full left-1/2 -translate-x-1/2"
                                      style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #1A1A2E' }}/>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {/* Volume slider — show khi unmuted */}
                            {!muted && (
                              <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 52, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="flex items-center overflow-hidden"
                              >
                                <input
                                  type="range" min={0} max={1} step={0.05}
                                  value={volume}
                                  onChange={e => {
                                    setVolume(+e.target.value)
                                    if (window.speechSynthesis) {
                                      window.speechSynthesis.getVoices()
                                    }
                                  }}
                                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                                  style={{
                                    accentColor: story.color,
                                    background: `linear-gradient(to right, ${story.color} ${volume * 100}%, #E0DDD5 ${volume * 100}%)`,
                                  }}
                                />
                              </motion.div>
                            )}
                          </div>

                          {/* Speed selector */}
                          <div className="flex items-center gap-1">
                            {[0.75, 1.0, 1.25, 1.5].map(s => (
                              <motion.button
                                key={s}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  setSpeed(s)
                                  if (playing && !muted) {
                                    tts.stop()
                                    setTimeout(() => speakPage(currentPage, s), 80)
                                  }
                                }}
                                className="rounded-md text-[9px] font-bold px-1.5 py-0.5"
                                style={{
                                  background: speed === s ? story.color : '#F4F3ED',
                                  color: speed === s ? '#fff' : '#6B6B8A',
                                }}
                              >
                                {s}×
                              </motion.button>
                            ))}
                          </div>

                          {/* Playback buttons */}
                          <div className="flex items-center gap-2">
                            <motion.button whileTap={{ scale: 0.88 }} onClick={() => goPage(-1)}
                              disabled={safePageIdx === 0}
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ background: '#F4F3ED', opacity: safePageIdx === 0 ? 0.35 : 1 }}>
                              <SkipBack size={12} color="#6B6B8A" weight="regular"/>
                            </motion.button>

                            <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlay}
                              className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                              style={{ background: story.color, boxShadow: `0 4px 16px ${story.color}45` }}>
                              {playing ? <Pause size={15} color="white" weight="fill"/> : <Play size={15} color="white" weight="fill"/>}
                            </motion.button>

                            <motion.button whileTap={{ scale: 0.88 }} onClick={() => goPage(1)}
                              disabled={isLastPage}
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ background: '#F4F3ED', opacity: isLastPage ? 0.35 : 1 }}>
                              <SkipForward size={12} color="#6B6B8A" weight="regular"/>
                            </motion.button>
                          </div>

                          <div className="text-[9px] font-medium shrink-0" style={{ color: '#9090B0' }}>
                            T.{safePageIdx + 1} · {story.duration}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
                  </motion.div>
                )}

              </div>
            </div> {/* end top lid */}
            </motion.div> {/* end screen lid 3D */}

            {/* hinge / base connector */}
            <div className="h-2 rounded-b-sm mx-[-2px]"
              style={{ background: 'linear-gradient(to bottom, #2a2a2c, #1a1a1c)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}/>
            {/* keyboard base */}
            <div className="h-4 rounded-b-[10px] mx-[-16px] relative"
              style={{ background: 'linear-gradient(to bottom, #e8e8e8, #d4d4d4)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.08)' }}/>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </section>
  )
}
