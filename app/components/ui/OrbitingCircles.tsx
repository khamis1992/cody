import { classNames } from '~/utils/classNames';

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: OrbitingCirclesProps) {
  const childrenArray = Array.isArray(children) 
    ? children 
    : children 
    ? [children] 
    : [];

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <circle
            className="stroke-slate-700/50 stroke-1 dark:stroke-slate-700/50"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      )}

      {childrenArray.map((child, index) => {
        const angle = (360 / childrenArray.length) * index;
        const animationDuration = duration / speed;
        const animationDelay = (delay * index) / childrenArray.length;

        return (
          <div
            key={index}
            className={classNames(
              'absolute flex items-center justify-center rounded-full border border-slate-800/50 bg-slate-950/90 backdrop-blur-sm',
              className,
            )}
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              '--duration': `${animationDuration}s`,
              '--delay': `${animationDelay}s`,
              '--radius': `${radius}px`,
              '--angle': `${angle}deg`,
              '--reverse': reverse ? '-1' : '1',
              animation: `orbit var(--duration) linear infinite`,
              animationDelay: `var(--delay)`,
            } as React.CSSProperties}
          >
            <div className="flex items-center justify-center" style={{ width: `${iconSize * 0.6}px`, height: `${iconSize * 0.6}px` }}>
              {child}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: 
              rotate(calc(var(--angle) * 1deg))
              translateX(calc(var(--radius) * 1px * var(--reverse)))
              rotate(calc(var(--angle) * -1deg));
          }
          to {
            transform: 
              rotate(calc((var(--angle) + 360) * 1deg))
              translateX(calc(var(--radius) * 1px * var(--reverse)))
              rotate(calc((var(--angle) + 360) * -1deg));
          }
        }
      `}</style>
    </>
  );
}

