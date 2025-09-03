import React from "react";

export default function NoDataAnimated({ width = 300, height = 200, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Floating circles */}
      <circle cx="50" cy="150" r="10" fill="#4CAF50" opacity="0.4">
        <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="80" r="8" fill="#2196F3" opacity="0.4">
        <animate attributeName="cy" values="80;70;80" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Magnifying glass */}
      <g transform="translate(120,60)">
        <circle cx="30" cy="30" r="28" stroke="#4CAF50" strokeWidth="4" fill="none">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 30 30"
            to="360 30 30"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
        <line
          x1="50"
          y1="50"
          x2="70"
          y2="70"
          stroke="#4CAF50"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <animate attributeName="x2" values="70;65;70" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="70;75;70" dur="1.5s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Text */}
      <text
        x="150"
        y="160"
        textAnchor="middle"
        fontSize="20"
        fontFamily="Arial, sans-serif"
        fill="#666"
      >
        No Data Found
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </text>
    </svg>
  );
}
