const NoDataSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="300" height="300">
    <rect width="512" height="512" rx="30" fill="#b7d8f0"/>
    {/* Computer */}
    <rect x="160" y="320" width="200" height="100" rx="10" fill="#fff" stroke="#333" strokeWidth="4"/>
    <text x="260" y="380" textAnchor="middle" fontSize="28" fill="#333" fontWeight="bold">
      NO DATA
    </text>
    {/* Girl */}
    <circle cx="200" cy="200" r="60" fill="#ffb6b6"/>
    <path d="M160 200 q40-60 80 0 v80 h-80z" fill="#4569a0"/>
    <path d="M180 160 q20-40 60 0" fill="none" stroke="#333" strokeWidth="6"/>
    {/* Hand scratching head */}
    <path d="M140 140 q40-40 60 20" fill="none" stroke="#333" strokeWidth="6"/>
    {/* Question marks */}
    <text x="120" y="80" fontSize="40" fontWeight="bold" fill="#fff">?</text>
    <text x="180" y="60" fontSize="40" fontWeight="bold" fill="#fff">?</text>
    <text x="240" y="80" fontSize="40" fontWeight="bold" fill="#fff">?</text>
    {/* Folder with cross */}
    <rect x="340" y="120" width="100" height="70" rx="8" fill="#f4a261" stroke="#333" strokeWidth="3"/>
    <rect x="340" y="100" width="50" height="30" rx="6" fill="#e76f51"/>
    <circle cx="430" cy="110" r="20" fill="#fff" stroke="#e63946" strokeWidth="4"/>
    <line x1="420" y1="100" x2="440" y2="120" stroke="#e63946" strokeWidth="4"/>
    <line x1="440" y1="100" x2="420" y2="120" stroke="#e63946" strokeWidth="4"/>
    {/* Small plant */}
    <rect x="90" y="360" width="40" height="30" rx="6" fill="#2a9d8f"/>
    <circle cx="110" cy="340" r="12" fill="#52b788"/>
    <circle cx="120" cy="330" r="10" fill="#40916c"/>
  </svg>
);

export default NoDataSVG;
