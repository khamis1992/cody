import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { motion } from 'framer-motion';

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?:
    | 'aurora'
    | 'sunset'
    | 'ocean'
    | 'cosmic'
    | 'cyberpunk'
    | 'forest'
    | 'warmth'
    | 'cool'
    | 'pastel'
    | 'vibrant'
    | 'minimal'
    | 'dark';
  pattern?:
    | 'none'
    | 'dots'
    | 'grid'
    | 'waves'
    | 'mesh'
    | 'noise'
    | 'circuit'
    | 'organic';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
  overlay?: 'none' | 'light' | 'dark' | 'gradient';
  blur?: boolean;
}

interface AnimatedGradientProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  colors: string[];
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
}

interface MeshGradientProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  colors: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  animated?: boolean;
}

// Modern Gradient Background Component
export const GradientBackground = forwardRef<HTMLDivElement, GradientBackgroundProps>(({
  className,
  children,
  variant = 'aurora',
  pattern = 'none',
  intensity = 'medium',
  animated = false,
  overlay = 'none',
  blur = false,
  ...props
}, ref) => {
  const gradientVariants = {
    aurora: {
      subtle: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20',
      medium: 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30',
      strong: 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800/40 dark:via-purple-800/40 dark:to-pink-800/40',
    },
    sunset: {
      subtle: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20',
      medium: 'bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 dark:from-orange-900/30 dark:via-red-900/30 dark:to-pink-900/30',
      strong: 'bg-gradient-to-br from-orange-300 via-red-300 to-pink-300 dark:from-orange-800/40 dark:via-red-800/40 dark:to-pink-800/40',
    },
    ocean: {
      subtle: 'bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-blue-950/20 dark:via-teal-950/20 dark:to-cyan-950/20',
      medium: 'bg-gradient-to-br from-blue-100 via-teal-100 to-cyan-100 dark:from-blue-900/30 dark:via-teal-900/30 dark:to-cyan-900/30',
      strong: 'bg-gradient-to-br from-blue-200 via-teal-200 to-cyan-200 dark:from-blue-800/40 dark:via-teal-800/40 dark:to-cyan-800/40',
    },
    cosmic: {
      subtle: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20',
      medium: 'bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30',
      strong: 'bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 dark:from-purple-800/40 dark:via-violet-800/40 dark:to-indigo-800/40',
    },
    cyberpunk: {
      subtle: 'bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-cyan-950/20',
      medium: 'bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-cyan-900/30',
      strong: 'bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300 dark:from-pink-800/40 dark:via-purple-800/40 dark:to-cyan-800/40',
    },
    forest: {
      subtle: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20',
      medium: 'bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30',
      strong: 'bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 dark:from-green-800/40 dark:via-emerald-800/40 dark:to-teal-800/40',
    },
    warmth: {
      subtle: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20',
      medium: 'bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30',
      strong: 'bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 dark:from-yellow-800/40 dark:via-orange-800/40 dark:to-red-800/40',
    },
    cool: {
      subtle: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950/20 dark:via-blue-950/20 dark:to-indigo-950/20',
      medium: 'bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-900/30 dark:via-blue-900/30 dark:to-indigo-900/30',
      strong: 'bg-gradient-to-br from-slate-200 via-blue-200 to-indigo-200 dark:from-slate-800/40 dark:via-blue-800/40 dark:to-indigo-800/40',
    },
    pastel: {
      subtle: 'bg-gradient-to-br from-pink-50 via-violet-50 to-indigo-50 dark:from-pink-950/10 dark:via-violet-950/10 dark:to-indigo-950/10',
      medium: 'bg-gradient-to-br from-pink-100 via-violet-100 to-indigo-100 dark:from-pink-900/20 dark:via-violet-900/20 dark:to-indigo-900/20',
      strong: 'bg-gradient-to-br from-pink-200 via-violet-200 to-indigo-200 dark:from-pink-800/30 dark:via-violet-800/30 dark:to-indigo-800/30',
    },
    vibrant: {
      subtle: 'bg-gradient-to-br from-fuchsia-100 via-purple-100 to-violet-100 dark:from-fuchsia-900/30 dark:via-purple-900/30 dark:to-violet-900/30',
      medium: 'bg-gradient-to-br from-fuchsia-200 via-purple-200 to-violet-200 dark:from-fuchsia-800/40 dark:via-purple-800/40 dark:to-violet-800/40',
      strong: 'bg-gradient-to-br from-fuchsia-300 via-purple-300 to-violet-300 dark:from-fuchsia-700/50 dark:via-purple-700/50 dark:to-violet-700/50',
    },
    minimal: {
      subtle: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950',
      medium: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900 dark:to-slate-900',
      strong: 'bg-gradient-to-br from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800',
    },
    dark: {
      subtle: 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900',
      medium: 'bg-gradient-to-br from-gray-800 via-slate-800 to-zinc-800',
      strong: 'bg-gradient-to-br from-gray-700 via-slate-700 to-zinc-700',
    },
  };

  const patternStyles = {
    dots: 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]',
    grid: 'bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]',
    waves: 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
    mesh: 'bg-[url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="mesh" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23mesh)"/%3E%3C/svg%3E")]',
    noise: 'bg-[url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.1"/%3E%3C/svg%3E")]',
    circuit: 'bg-[url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20h-4v-4h4v4zm-4-8h4v4h-4v-4zm8 0h4v4h-4v-4zm-8 8h4v4h-4v-4zm8 0h4v4h-4v-4z"/%3E%3C/g%3E%3C/svg%3E")]',
    organic: 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3Ccircle cx="10" cy="30" r="2"/%3E%3Ccircle cx="50" cy="30" r="2"/%3E%3Ccircle cx="30" cy="10" r="2"/%3E%3Ccircle cx="30" cy="50" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
    none: '',
  };

  const overlayStyles = {
    none: '',
    light: 'bg-white/10',
    dark: 'bg-black/10',
    gradient: 'bg-gradient-to-t from-black/20 via-transparent to-white/20',
  };

  const baseClasses = gradientVariants[variant][intensity];
  const patternClasses = pattern !== 'none' ? patternStyles[pattern] : '';
  const overlayClasses = overlay !== 'none' ? overlayStyles[overlay] : '';

  return (
    <div
      ref={ref}
      className={classNames(
        'relative min-h-screen overflow-hidden',
        baseClasses,
        animated ? 'animate-pulse' : '',
        className
      )}
      {...props}
    >
      {/* Pattern Layer */}
      {pattern !== 'none' && (
        <div className={classNames('absolute inset-0', patternClasses)} />
      )}

      {/* Overlay Layer */}
      {overlay !== 'none' && (
        <div className={classNames('absolute inset-0', overlayClasses)} />
      )}

      {/* Blur Layer */}
      {blur && (
        <div className="absolute inset-0 backdrop-blur-3xl" />
      )}

      {/* Animated Elements */}
      {animated && (
        <>
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [100, 0, 100],
              y: [50, 0, 50],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-3/4 right-1/4 w-40 h-40 bg-white/3 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, 100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-white/7 rounded-full blur-lg"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});
GradientBackground.displayName = 'GradientBackground';

// Animated Gradient Component
export const AnimatedGradient = forwardRef<HTMLDivElement, AnimatedGradientProps>(({
  className,
  children,
  colors,
  speed = 'medium',
  direction = 'diagonal',
  ...props
}, ref) => {
  const speedValues = {
    slow: '8s',
    medium: '4s',
    fast: '2s',
  };

  const directionClasses = {
    horizontal: 'bg-gradient-to-r',
    vertical: 'bg-gradient-to-b',
    diagonal: 'bg-gradient-to-br',
    radial: 'bg-radial-gradient',
  };

  const gradientColors = colors.join(', ');

  return (
    <div
      ref={ref}
      className={classNames(
        'relative min-h-screen overflow-hidden',
        className
      )}
      style={{
        background: `linear-gradient(-45deg, ${gradientColors})`,
        backgroundSize: '400% 400%',
        animation: `gradientShift ${speedValues[speed]} ease infinite`,
      }}
      {...props}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});
AnimatedGradient.displayName = 'AnimatedGradient';

// Mesh Gradient Component
export const MeshGradient = forwardRef<HTMLDivElement, MeshGradientProps>(({
  className,
  children,
  colors,
  complexity = 'medium',
  animated = false,
  ...props
}, ref) => {
  const complexitySettings = {
    simple: { points: 4, blur: 'blur-3xl' },
    medium: { points: 6, blur: 'blur-2xl' },
    complex: { points: 8, blur: 'blur-xl' },
  };

  const settings = complexitySettings[complexity];

  const generateMeshPoints = () => {
    const points = [];
    for (let i = 0; i < settings.points; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[i % colors.length],
        size: 200 + Math.random() * 300,
      });
    }
    return points;
  };

  const meshPoints = generateMeshPoints();

  return (
    <div
      ref={ref}
      className={classNames(
        'relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black',
        className
      )}
      {...props}
    >
      {/* Mesh Points */}
      {meshPoints.map((point, index) => (
        <motion.div
          key={index}
          className={classNames(
            'absolute rounded-full mix-blend-multiply opacity-70',
            settings.blur,
            animated ? 'animate-pulse' : ''
          )}
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.size}px`,
            height: `${point.size}px`,
            backgroundColor: point.color,
            transform: 'translate(-50%, -50%)',
          }}
          animate={animated ? {
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          } : {}}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});
MeshGradient.displayName = 'MeshGradient';

// Usage Examples
export const GradientBackgroundExamples = {
  aurora: {
    variant: 'aurora' as const,
    pattern: 'dots' as const,
    intensity: 'medium' as const,
    animated: true,
  },

  cyberpunk: {
    variant: 'cyberpunk' as const,
    pattern: 'circuit' as const,
    intensity: 'strong' as const,
    animated: true,
    overlay: 'dark' as const,
  },

  minimal: {
    variant: 'minimal' as const,
    pattern: 'grid' as const,
    intensity: 'subtle' as const,
    overlay: 'light' as const,
  },

  ocean: {
    variant: 'ocean' as const,
    pattern: 'waves' as const,
    intensity: 'medium' as const,
    blur: true,
  },

  animatedMesh: {
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    complexity: 'complex' as const,
    animated: true,
  },

  simpleAnimated: {
    colors: ['#ff9a9e', '#fecfef', '#fecfef'],
    speed: 'slow' as const,
    direction: 'diagonal' as const,
  },
};