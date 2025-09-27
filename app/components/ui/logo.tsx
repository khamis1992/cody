import React from 'react';

export const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="256" height="256" rx="60" fill="url(#gradient)" />
    <path
      d="M93.8193 189.333L60 155.514L93.8193 121.695L102.305 130.181L81.472 151.014V159.907L102.305 180.847L93.8193 189.333Z"
      fill="#D1D5DB"
    />
    <path
      d="M162.181 189.333L153.695 180.847L174.528 159.907V151.014L153.695 130.181L162.181 121.695L196 155.514L162.181 189.333Z"
      fill="#D1D5DB"
    />
    <path d="M141.667 114.667L114.667 196H126.667L153.667 114.667H141.667Z" fill="url(#plunger)" />
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1F2937" />
        <stop offset="1" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="plunger" x1="120.5" y1="114.667" x2="120.5" y2="196" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#818CF8" />
      </linearGradient>
    </defs>
  </svg>
);
