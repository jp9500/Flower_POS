import React from "react";

export default function NoDataAnimated({ className = "", width = 240, height = 240 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-labelledby="title desc"
      role="img"
    >
      <title id="title">No data illustration</title>
      <desc id="desc">Animated person confused in front of a monitor with a no-data message.</desc>

      {/* --- BACKGROUND CARD --- */}
      <rect x="16" y="16" width="480" height="480" rx="28" fill="#CFE9D8"/>
      <rect x="32" y="32" width="448" height="448" rx="22" fill="#EAF7EF"/>

      {/* --- DESK LINE --- */}
      <rect x="60" y="352" width="392" height="8" rx="4" fill="#c6d0d8"/>

      {/* --- MONITOR --- */}
      <g>
        <rect x="280" y="210" width="170" height="110" rx="10" fill="#ffffff" stroke="#1f2a37" strokeWidth="4"/>
        <rect x="340" y="325" width="50" height="10" rx="5" fill="#9aa5b1"/>
        <rect x="358" y="335" width="14" height="18" rx="3" fill="#1f2a37"/>
        {/* screen glow sweep */}
        <rect x="280" y="210" width="170" height="110" rx="10" fill="url(#screenShine)" opacity="0.55">
          <animate attributeName="x" values="280;450;280" dur="3.5s" repeatCount="indefinite"/>
        </rect>
        {/* NO DATA pill */}
        <g transform="translate(305,255)">
          <rect width="120" height="34" rx="8" fill="#ffffff" stroke="#1f2a37" strokeWidth="3"/>
          <text x="60" y="22" textAnchor="middle" fontFamily="Inter, Arial" fontWeight="700" fontSize="14" fill="#1f2a37">
            NO DATA
          </text>
        </g>
      </g>

      {/* --- PERSON --- */}
      <g transform="translate(120,190)">
        {/* body */}
        <path d="M30 120c0-40 26-72 58-72s58 32 58 72v40H30z" fill="#7aa7f6"/>
        {/* head */}
        <circle cx="88" cy="56" r="30" fill="#ffb9a7"/>
        {/* hair */}
        <path d="M58 56c6-26 52-34 64 0" fill="none" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round"/>
        {/* arm scratching head */}
        <path d="M50 62c-16-16-22-22-8-34 11-9 24-2 34 8" fill="none" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round">
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="-8 60 50; 8 60 50; -8 60 50" dur="2.6s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* --- QUESTION MARKS FLOATING --- */}
      <g fill="#7aa7f6" fontFamily="Inter, Arial" fontWeight="800">
        <text x="110" y="120" fontSize="34">?</text>
        <text x="150" y="92" fontSize="30">?</text>
        <text x="190" y="118" fontSize="34">?</text>
        <g>
          <text x="110" y="120" fontSize="34">?</text>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur="2.2s" repeatCount="indefinite"/>
        </g>
        <g>
          <text x="150" y="92" fontSize="30">?</text>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -8; 0 0" dur="1.8s" repeatCount="indefinite"/>
        </g>
        <g>
          <text x="190" y="118" fontSize="34">?</text>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -12; 0 0" dur="2.5s" repeatCount="indefinite"/>
        </g>
      </g>

      {/* --- FOLDER WITH RED CROSS (bobbing) --- */}
      <g transform="translate(380,120)">
        <g>
          <path d="M0 40h64a8 8 0 0 0 8-8V20a8 8 0 0 0-8-8h-28l-8-10H10a10 10 0 0 0-10 10v20a8 8 0 0 0 8 8z" fill="#f4a261" stroke="#844c22" strokeWidth="3"/>
          <circle cx="66" cy="10" r="16" fill="#fff" stroke="#e63946" strokeWidth="4"/>
          <path d="M58 2l16 16M74 2L58 18" stroke="#e63946" strokeWidth="4" strokeLinecap="round"/>
        </g>
        <animateTransform attributeName="transform" type="translate" values="380 120; 380 112; 380 120" dur="2.4s" repeatCount="indefinite"/>
      </g>

      {/* --- LITTLE PLANT --- */}
      <g transform="translate(70,360)">
        <rect x="0" y="18" width="36" height="18" rx="4" fill="#2a9d8f"/>
        <circle cx="10" cy="14" r="6" fill="#8bd3c7"/>
        <circle cx="22" cy="8" r="5" fill="#74c3b8"/>
        <circle cx="30" cy="14" r="4" fill="#57b3a6"/>
        <animateTransform attributeName="transform" type="translate" values="70 360; 70 356; 70 360" dur="3s" repeatCount="indefinite"/>
      </g>

      {/* --- DEFINITIONS --- */}
      <defs>
        {/* diagonal gradient for the screen sweep */}
        <linearGradient id="screenShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0"/>
          <stop offset="50%" stopColor="#e6f0ff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
