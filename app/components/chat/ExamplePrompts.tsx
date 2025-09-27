import React from 'react';

export const EXAMPLE_PROMPTS = [
  { text: 'Create a mobile app about code launching' },
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Build a simple blog using Astro' },
  { text: 'Create a cookie consent form using Material UI' },
  { text: 'Make a space invaders game' },
  { text: 'Make a Tic Tac Toe game in html, css and js only' },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <button
                onClick={(event) => {
                  sendMessage?.(event, examplePrompt.text);
                }}
                className="relative w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white text-lg">
                      {index === 0 && '📱'}
                      {index === 1 && '✅'}
                      {index === 2 && '📝'}
                      {index === 3 && '🍪'}
                      {index === 4 && '🎮'}
                      {index === 5 && '⭕'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                      {examplePrompt.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1 h-1 bg-accent-500 rounded-full opacity-60"></div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Click to try</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-4 h-4 text-accent-500">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
