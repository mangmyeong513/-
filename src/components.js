export const InkCat = ({ className = "", mood = 0, alpha = 0.9 }) => {
  const poses = [
    "M50 70 C40 80 30 95 35 105 C55 120 110 120 130 105 C140 95 130 80 120 70 C130 40 115 30 100 30 C85 30 70 40 75 58 C60 58 55 60 50 70 Z"
  ];
  return (
    <svg viewBox="0 0 180 140" className={className} aria-hidden>
      <ellipse cx="96" cy="63" rx="6" ry="7" fill="#fff"/>
      <ellipse cx="118" cy="64" rx="6" ry="7" fill="#fff"/>
    </svg>
  );
};

export const Smudge = ({ className = "", alpha = 0.08 }) => (
  <svg viewBox="0 0 200 120" className={className} aria-hidden>
    <path d="M10,90 C25,20 80,5 110,38 C140,15 175,25 190,70 C140,75 120,95 100,110 C80,100 45,95 10,90 Z"
          fill="#0f0f0f" opacity={alpha}/>
  </svg>
);
