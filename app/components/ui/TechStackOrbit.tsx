import { OrbitingCircles } from './OrbitingCircles';

// Tech Stack Icon Components
const TechIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain"
    style={{ filter: 'brightness(0.9)' }}
  />
);

export function TechStackOrbit() {
  return (
    <div className="relative flex h-[400px] w-full max-w-[400px] mx-auto items-center justify-center overflow-visible">
      {/* Center Logo/Badge */}
      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-400/30 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-10 h-10 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-[8px] font-bold text-accent-400 mt-1">AI</span>
        </div>
      </div>

      {/* Inner Orbit - Faster, Smaller Icons */}
      <OrbitingCircles
        className="border-slate-700/30 bg-slate-900/80 hover:bg-slate-800/90 transition-colors"
        radius={100}
        duration={20}
        delay={0}
        iconSize={45}
        speed={1.5}
      >
        <TechIcon src="/icons/react.svg" alt="React" />
        <TechIcon src="/icons/typescript.svg" alt="TypeScript" />
        <TechIcon src="/icons/nextjs.svg" alt="Next.js" />
        <TechIcon src="/icons/vue.svg" alt="Vue" />
        <TechIcon src="/icons/angular.svg" alt="Angular" />
      </OrbitingCircles>

      {/* Middle Orbit - Medium Speed */}
      <OrbitingCircles
        className="border-slate-700/40 bg-slate-900/70 hover:bg-slate-800/80 transition-colors"
        radius={160}
        duration={30}
        delay={5}
        iconSize={50}
        speed={1}
        reverse
      >
        <TechIcon src="/icons/vite.svg" alt="Vite" />
        <TechIcon src="/icons/remix.svg" alt="Remix" />
        <TechIcon src="/icons/astro.svg" alt="Astro" />
        <TechIcon src="/icons/svelte.svg" alt="Svelte" />
        <TechIcon src="/icons/nuxt.svg" alt="Nuxt" />
        <TechIcon src="/icons/qwik.svg" alt="Qwik" />
      </OrbitingCircles>

      {/* Outer Orbit - Slower, Larger Icons */}
      <OrbitingCircles
        className="border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/70 transition-colors"
        radius={220}
        duration={40}
        delay={10}
        iconSize={55}
        speed={0.8}
      >
        <TechIcon src="/icons/solidjs.svg" alt="Solid.js" />
        <TechIcon src="/icons/expo.svg" alt="Expo" />
        <TechIcon src="/icons/remotion.svg" alt="Remotion" />
        <TechIcon src="/icons/shadcn.svg" alt="shadcn/ui" />
        <TechIcon src="/icons/netlify.svg" alt="Netlify" />
      </OrbitingCircles>
    </div>
  );
}

