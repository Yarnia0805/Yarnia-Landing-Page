export default function WoollyMascot({ size = 160, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 180"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <filter id="woolly-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A1A2E" floodOpacity="0.10"/>
        </filter>
      </defs>
      {/* fluffy wool body — smooth bezier blob */}
      <path
        d="M36 128 Q36 158 80 160 Q124 158 124 128 Q124 108 108 102 Q120 96 120 84 Q120 72 108 70 Q116 62 112 52 Q104 38 88 44 Q84 36 80 36 Q76 36 72 44 Q56 38 48 52 Q44 62 52 70 Q40 72 40 84 Q40 96 52 102 Q36 108 36 128Z"
        fill="#F4F3ED" stroke="#1A1A2E" strokeWidth="1.8" strokeLinejoin="round"
        filter="url(#woolly-shadow)"
      />
      {/* face patch */}
      <ellipse cx="80" cy="62" rx="22" ry="20" fill="#EDE9DC"/>
      {/* ears */}
      <path d="M58 48 Q52 36 58 28 Q64 22 70 30 Q66 38 64 46Z" fill="#EDE9DC" stroke="#1A1A2E" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M102 48 Q108 36 102 28 Q96 22 90 30 Q94 38 96 46Z" fill="#EDE9DC" stroke="#1A1A2E" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M60 46 Q56 38 60 32 Q64 28 68 34 Q66 40 64 46Z" fill="#F279A6"/>
      <path d="M100 46 Q104 38 100 32 Q96 28 92 34 Q94 40 96 46Z" fill="#F279A6"/>
      {/* happy squint eyes */}
      <path d="M70 60 Q74 56 78 60" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M82 60 Q86 56 90 60" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* nose */}
      <ellipse cx="80" cy="68" rx="3" ry="2" fill="#C4785A"/>
      {/* smile */}
      <path d="M74 73 Q80 79 86 73" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* legs */}
      <path d="M64 148 Q62 156 64 166 Q68 170 72 166 Q74 156 72 148Z" fill="#EDE9DC" stroke="#1A1A2E" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M88 148 Q86 156 88 166 Q92 170 96 166 Q98 156 96 148Z" fill="#EDE9DC" stroke="#1A1A2E" strokeWidth="1.6" strokeLinejoin="round"/>
      {/* scarf */}
      <path d="M52 108 Q66 116 80 114 Q94 116 108 108" stroke="#FDC631" strokeWidth="9" strokeLinecap="round" fill="none"/>
      {/* yarn ball */}
      <circle cx="124" cy="132" r="14" fill="#FDC631" stroke="#1A1A2E" strokeWidth="1.8"/>
      <path d="M111 132 Q118 124 124 119" stroke="#E8B220" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M111 138 Q120 136 131 134" stroke="#E8B220" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M114 145 Q122 140 130 126" stroke="#E8B220" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* arm */}
      <path d="M106 112 Q118 120 114 132" stroke="#EDE9DC" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M106 112 Q118 120 114 132" stroke="#1A1A2E" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M111 132 Q104 124 98 112" stroke="#FDC631" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="3 3"/>
    </svg>
  )
}
