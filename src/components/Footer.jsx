export default function Footer() {
  const linkClass = "text-sm transition-colors hover:text-white"
  const linkStyle = { color: 'rgba(255,255,255,0.5)' }
  const socials = [
    { label: 'FB', name: 'Facebook', href: '#' },
    { label: 'TT', name: 'TikTok', href: '#' },
    { label: 'YT', name: 'YouTube', href: '#' },
    { label: 'IG', name: 'Instagram', href: '#' },
    { label: 'ZA', name: 'Zalo', href: '#' },
  ]

  return (
    <footer style={{ background: '#1A1A2E' }} className="pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* brand — col 1-2 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: '#FDC631' }}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M12 3 Q8 6 6 10 Q4 14 6 18 Q10 22 12 20 Q14 22 18 18 Q20 14 18 10 Q16 6 12 3Z"
                        fill="#1A1A2E"/>
                  <circle cx="9" cy="12" r="1.5" fill="#FDC631"/>
                  <circle cx="15" cy="12" r="1.5" fill="#FDC631"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">Yarnia</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Nền tảng kể chuyện số 1 Việt Nam — giúp trẻ em yêu thích đọc sách
              và phát triển toàn diện từ 3–12 tuổi.
            </p>
            <div className="flex gap-2 mb-6">
              {socials.map(s => (
                <a key={s.label} href={s.href} title={s.name}
                   className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors hover:text-white"
                   style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                  {s.label}
                </a>
              ))}
            </div>
            {/* app badges inline */}
            <div className="flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-colors hover:bg-white/10"
                 style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-xl">🍎</span>
                <div>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Tải trên</div>
                  <div className="text-xs font-bold text-white">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-colors hover:bg-white/10"
                 style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-xl">🤖</span>
                <div>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Tải trên</div>
                  <div className="text-xs font-bold text-white">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* links — col 3-5 */}
          {[
            {
              title: 'Khám phá',
              links: [
                { label: 'Kho truyện', href: '#stories' },
                { label: 'Tính năng', href: '#features' },
                { label: 'Cách hoạt động', href: '#how-it-works' },
                { label: 'Bảng giá', href: '#pricing' },
                { label: 'Kid Mode', href: '#kid-mode' },
              ],
            },
            {
              title: 'Về Yarnia',
              links: [
                { label: 'Về chúng tôi', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Tuyển dụng', href: '#' },
                { label: 'Đối tác', href: '#' },
                { label: 'Báo chí', href: '#' },
              ],
            },
            {
              title: 'Hỗ trợ',
              links: [
                { label: 'Trung tâm hỗ trợ', href: '#' },
                { label: 'Liên hệ', href: '#contact' },
                { label: 'Chính sách bảo mật', href: '#' },
                { label: 'Điều khoản sử dụng', href: '#' },
                { label: 'Cookie', href: '#' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className={linkClass} style={linkStyle}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between gap-4"
             style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © 2026 Yarnia. Mọi quyền được bảo lưu.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Được làm với ❤️ tại Việt Nam · Nội dung phù hợp trẻ em 3–12 tuổi
          </p>
        </div>
      </div>
    </footer>
  )
}
