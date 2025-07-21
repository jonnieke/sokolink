

import React, { useState } from 'react';
import { ShoppingBagIcon } from 'lucide-react';

const KibandaIcon = () => (
  <svg width="140" height="140" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 shadow-lg rounded-xl dark:shadow-teal-900/20">
    <rect width="100" height="100" rx="15" ry="15" fill="white" className="dark:fill-slate-800" />
    <path d="M5 35 L 50 15 L 95 35 Z" fill="#a16943" stroke="#5f370e" strokeWidth="2" className="dark:fill-amber-700 dark:stroke-amber-900"/>
    <rect x="20" y="35" width="10" height="40" fill="#c2a07c" stroke="#5f370e" strokeWidth="1" className="dark:fill-amber-600 dark:stroke-amber-800"/>
    <rect x="70" y="35" width="10" height="40" fill="#c2a07c" stroke="#5f370e" strokeWidth="1" className="dark:fill-amber-600 dark:stroke-amber-800"/>
    <rect x="10" y="75" width="80" height="15" rx="3" ry="3" fill="#c2a07c" stroke="#5f370e" strokeWidth="1" className="dark:fill-amber-600 dark:stroke-amber-800"/>
    <rect x="15" y="78" width="20" height="9" fill="#f59e0b" />
    <rect x="40" y="78" width="20" height="9" fill="#16a34a" />
    <rect x="65" y="78" width="20" height="9" fill="#ef4444" />
    <text x="50" y="60" fontFamily="sans-serif" fontSize="12" fill="#5f370e" textAnchor="middle" fontWeight="bold" className="dark:fill-amber-100">SOKO</text>
  </svg>
);


const LangToggle: React.FC<{ language: 'en' | 'sw'; onToggle: () => void }> = ({ language, onToggle }) => (
  <button
    onClick={onToggle}
    className="absolute top-4 right-4 z-20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-sm text-slate-800 dark:text-white px-3 py-1.5 rounded-full shadow-md border border-slate-200 dark:border-slate-600 hover:scale-105 transition-transform"
  >
    {language === 'en' ? '🇰🇪 Swahili' : '🇬🇧 English'}
  </button>
);

interface LandingPageProps {
  onStart: () => void;
  onStartSokoMtaani: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onStartSokoMtaani }) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'));
  };
  
  const content = {
    en: {
      heading: 'Soko karibu nawe',
      sub: 'Your local market, online. Discover businesses and browse community listings in your neighborhood.',
      cta: 'Find a Business',
      sokoMtaani: 'Browse Soko Mtaani',
    },
    sw: {
      heading: 'Soko karibu nawe',
      sub: 'Soko lako la mtaa, mtandaoni. Tafuta biashara na vitu vinavyouzwa na majirani.',
      cta: 'Tafuta Biashara',
      sokoMtaani: 'Vinjari Soko Mtaani',
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-teal-50 to-amber-100 dark:from-slate-900 dark:via-teal-900/40 dark:to-slate-800 text-center p-4 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-16 w-64 h-64 bg-teal-200/50 dark:bg-teal-800/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-16 w-72 h-72 bg-amber-200/50 dark:bg-amber-700/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-24 left-20 w-72 h-72 bg-sky-200/50 dark:bg-sky-600/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

      <LangToggle language={language} onToggle={toggleLanguage} />

      <div className="relative z-10 w-full max-w-3xl">
        <KibandaIcon />
        <h1
          className="text-5xl md:text-7xl font-extrabold text-teal-800 dark:text-teal-200 tracking-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
        >
          {content[language].heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          {content[language].sub}
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-full shadow-2xl hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              {content[language].cta}
            </button>
            <button
              onClick={onStartSokoMtaani}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold text-md rounded-full shadow-2xl hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <ShoppingBagIcon className="w-5 h-5"/>
              {content[language].sokoMtaani}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
