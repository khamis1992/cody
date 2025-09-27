import React from 'react';

export const WireframeSphere = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-96 h-96 lg:w-[32rem] lg:h-[32rem]">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full animate-spin-slow"
          style={{ animationDuration: '30s' }}
        >
          {/* Outer ring */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="url(#sphereGradient)"
            strokeWidth="0.5"
            opacity="0.6"
            className="animate-pulse-glow"
          />

          {/* Middle ring */}
          <circle
            cx="200"
            cy="200"
            r="140"
            fill="none"
            stroke="url(#sphereGradient)"
            strokeWidth="0.5"
            opacity="0.8"
            className="animate-pulse-glow"
            style={{ animationDelay: '1s' }}
          />

          {/* Inner ring */}
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="url(#sphereGradient)"
            strokeWidth="0.5"
            opacity="1"
            className="animate-pulse-glow"
            style={{ animationDelay: '2s' }}
          />

          {/* Vertical lines */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 200 + 180 * Math.cos(angle);
            const y1 = 200 + 180 * Math.sin(angle);
            const x2 = 200 + 100 * Math.cos(angle);
            const y2 = 200 + 100 * Math.sin(angle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#sphereGradient)"
                strokeWidth="0.3"
                opacity="0.4"
                className="animate-pulse-glow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            );
          })}

          {/* Horizontal grid lines */}
          {Array.from({ length: 8 }, (_, i) => {
            const y = 200 + (i - 3.5) * 40;
            const radius = Math.sqrt(180 * 180 - (y - 200) * (y - 200));

            if (radius > 0) {
              return (
                <ellipse
                  key={i}
                  cx="200"
                  cy={y}
                  rx={radius}
                  ry={radius * 0.3}
                  fill="none"
                  stroke="url(#sphereGradient)"
                  strokeWidth="0.3"
                  opacity="0.5"
                  className="animate-pulse-glow"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              );
            }
            return null;
          })}

          {/* Glowing dots */}
          {Array.from({ length: 20 }, (_, i) => {
            const angle1 = (i * 18) * Math.PI / 180;
            const angle2 = ((i * 23) % 360) * Math.PI / 180;
            const radius = 120 + Math.sin(i) * 40;
            const x = 200 + radius * Math.cos(angle1) * Math.sin(angle2);
            const y = 200 + radius * Math.sin(angle1);

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="url(#dotGradient)"
                className="animate-pulse-glow"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}

          <defs>
            <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891B2" stopOpacity="0.3" />
            </radialGradient>

            <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="1" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.6" />
            </radialGradient>
          </defs>
        </svg>

        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-accent-400/20 via-accent-500/10 to-transparent animate-pulse-slow"></div>
      </div>
    </div>
  );
};