export default function Footer() {
  return (
    <footer style={{ background: '#1A1A2E' }} className="pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* brand */}
          <div className="md:col-span-1">
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
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Nền tảng kể chuyện số 1 Việt Nam — giúp trẻ em yêu thích đọc sách
              và phát triển toàn diện từ 3–12 tuổi.
            </p>
            <div className="flex gap-3">
              {['FB', 'TT', 'YT', 'IG'].map(s => (
                <a key={s} href="#"
                   className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors hover:text-white"
                   style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* links */}
          {[
            {
              title: 'Sản phẩm',
              links: ['Kho truyện', 'Kid Mode', 'Audio truyện', 'Huy hiệu & XP', 'Báo cáo phụ huynh'],
            },
            {
              title: 'Công ty',
              links: ['Về chúng tôi', 'Blog', 'Tuyển dụng', 'Đối tác', 'Báo chí'],
            },
            {
              title: 'Hỗ trợ',
              links: ['Trung tâm hỗ trợ', 'Liên hệ', 'Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie'],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors hover:text-white"
                       style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* app badges */}
        <div className="flex flex-wrap gap-4 mb-10">
          <a href="#" className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-colors hover:bg-white/10"
             style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-2xl">🍎</span>
            <div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Tải trên</div>
              <div className="text-sm font-bold text-white">App Store</div>
            </div>
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-colors hover:bg-white/10"
             style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-2xl">🤖</span>
            <div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Tải trên</div>
              <div className="text-sm font-bold text-white">Google Play</div>
            </div>
          </a>
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
