const ITEMS = [
  { emoji: '🏰', label: 'Cổ Tích Việt Nam' },
  { emoji: '🦋', label: 'Ngụ Ngôn La Fontaine' },
  { emoji: '✨', label: 'Thần Thoại Hy Lạp' },
  { emoji: '🔭', label: 'Khoa Học Vũ Trụ' },
  { emoji: '🗺️', label: 'Phiêu Lưu Kỳ Thú' },
  { emoji: '😄', label: 'Truyện Cười Dân Gian' },
  { emoji: '🐉', label: 'Rồng & Phượng' },
  { emoji: '🌊', label: 'Đại Dương Xanh' },
  { emoji: '🦁', label: 'Vương Quốc Rừng Xanh' },
  { emoji: '🌙', label: 'Chuyện Trước Khi Ngủ' },
]

const COLORS = ['#0648D7','#DD3A34','#328045','#9273E4','#F2763A','#0099FF','#FDC631','#0648D7','#328045','#DD3A34']

function MarqueeItem({ item, color }) {
  const dark = color === '#FDC631'
  return (
    <div
      className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm flex-shrink-0 mx-2"
      style={{
        background: color,
        color: dark ? '#1A1A2E' : 'white',
        boxShadow: `0 4px 12px ${color}40`,
      }}
    >
      <span className="text-base">{item.emoji}</span>
      {item.label}
    </div>
  )
}

export default function MarqueeSection() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="py-10 overflow-hidden" style={{ background: '#F4F3ED' }}>
      {/* row 1 — left */}
      <div className="flex items-center mb-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((item, i) => (
            <MarqueeItem key={i} item={item} color={COLORS[i % COLORS.length]}/>
          ))}
        </div>
      </div>
      {/* row 2 — right (reverse) */}
      <div className="flex items-center" style={{ direction: 'rtl' }}>
        <div className="flex animate-marquee whitespace-nowrap" style={{ animationDuration: '36s' }}>
          {[...doubled].reverse().map((item, i) => (
            <MarqueeItem key={i} item={item} color={COLORS[(i + 3) % COLORS.length]}/>
          ))}
        </div>
      </div>
    </div>
  )
}
