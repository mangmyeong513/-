// 잉크고양이 & 먹물 번짐 SVG 컴포넌트
// - 가우시안 블러로 은은한 번짐
// - 라디얼 그라디언트로 먹색 깊이감
// - props: className, mood(0~3), alpha(투명도)

export const InkCat = ({ className = "", mood = 0, alpha = 0.9 }) => {
  const poses = [
    // 착석 자세
    "M50 70 C40 80 30 95 35 105 C55 120 110 120 130 105 C140 95 130 80 120 70 C130 40 115 30 100 30 C85 30 70 40 75 58 C60 58 55 60 50 70 Z",
    // 말아 올라간 꼬리
    "M55 95 C45 105 45 115 65 120 C80 124 120 124 135 116 C145 110 145 98 130 92 C138 80 130 64 110 64 C95 64 85 68 82 76 C75 72 64 78 60 86 Z",
    // 낮잠 직전
    "M40 90 C30 100 30 112 48 120 C80 132 130 124 150 110 C160 100 158 88 142 84 C150 70 140 55 118 58 C98 61 90 70 88 78 C80 74 60 76 52 84 Z",
    // 긴장 살짝
    "M60 78 C48 90 48 106 66 114 C88 124 128 124 146 112 C158 104 154 86 136 84 C142 70 130 56 110 58 C92 60 80 70 78 78 C72 74 64 74 60 78 Z",
  ];
  return (
    <svg viewBox="0 0 180 140" className={className} aria-hidden>
      <defs>
        <filter id="inkBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id="inkSoft" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#171717" />
          <stop offset="100%" stopColor="#0b0b0b" />
        </radialGradient>
      </defs>
      {/* tail */}
      <path
        d="M20 110 C40 120 60 130 80 120 C100 110 95 95 85 92"
        stroke="#0b0b0b"
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#inkBlur)"
        opacity={alpha}
      />
      {/* body */}
      <path
        d={poses[mood % poses.length]}
        fill="url(#inkSoft)"
        filter="url(#inkBlur)"
        opacity={alpha}
      />
      {/* ears */}
      <path d="M85 40 L95 20 L105 40 Z" fill="#0b0b0b" filter="url(#inkBlur)" opacity={alpha} />
      <path d="M110 42 L122 22 L130 45 Z" fill="#0b0b0b" filter="url(#inkBlur)" opacity={alpha} />
      {/* eyes */}
      <ellipse cx="96" cy="63" rx="6" ry="7" fill="#fff" opacity=".95" />
      <ellipse cx="118" cy="64" rx="6" ry="7" fill="#fff" opacity=".95" />
    </svg>
  );
};

export const Smudge = ({ className = "", alpha = 0.08 }) => (
  <svg viewBox="0 0 200 120" className={className} aria-hidden>
    <defs>
      <filter id="sm" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
    <path
      d="M10,90 C25,20 80,5 110,38 C140,15 175,25 190,70 C140,75 120,95 100,110 C80,100 45,95 10,90 Z"
      fill="#0f0f0f"
      filter="url(#sm)"
      opacity={alpha}
    />
  </svg>
);
