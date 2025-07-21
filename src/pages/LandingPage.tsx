

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
      cta: 'Ingia Soko',
      sokoMtaani: 'Browse Soko Mtaani',
    },
    sw: {
      heading: 'Soko karibu nawe',
      sub: 'Soko lako la mtaa, mtandaoni. Tafuta biashara na vitu vinavyouzwa na majirani.',
      cta: 'Ingia Soko',
      sokoMtaani: 'Vinjari Soko Mtaani',
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden text-slate-900 dark:text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img src="https://res.cloudinary.com/ditoywccm/image/upload/v1753093263/a_vegetable_vendor_resized_jxkxas.jpg" alt="Market background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <LangToggle language={language} onToggle={toggleLanguage} />

      <div className="relative z-10 w-full max-w-3xl px-4 md:px-8 lg:px-16 xl:px-24 flex flex-col items-center justify-center">
        <KibandaIcon />
        <h1 className="text-5xl md:text-7xl font-extrabold text-amber-400 tracking-tight drop-shadow-lg">{content[language].heading}</h1>
        <p className="mt-4 text-lg md:text-xl text-white font-semibold animate-fade-in drop-shadow">
          {content[language].sub}
        </p>

        {/* App briefs for buyers and sellers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-6 shadow-lg text-left">
            <h2 className="text-xl font-bold text-amber-600 mb-2">For Buyers</h2>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-200 text-base space-y-1">
              <li>Discover local businesses and services near you.</li>
              <li>Browse community listings for unique items and deals.</li>
              <li>Contact sellers directly and negotiate prices.</li>
              <li>Support your neighborhood economy.</li>
            </ul>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-6 shadow-lg text-left">
            <h2 className="text-xl font-bold text-amber-600 mb-2">For Sellers</h2>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-200 text-base space-y-1">
              <li>List your business or personal items for free.</li>
              <li>Reach buyers in your local community.</li>
              <li>Manage your business profile and product catalog.</li>
              <li>Chat with interested buyers and grow your sales.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-5 bg-soko-yellow-dark text-soko-yellow-contrast font-extrabold text-xl rounded-full shadow-2xl hover:bg-soko-yellow focus:outline-none focus:ring-4 focus:ring-soko-green/50 transform hover:scale-110 transition-all duration-300 ease-in-out border-4 border-soko-brown-dark"
          >
            {content[language].cta}
          </button>
          <button
            onClick={onStartSokoMtaani}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-soko-green text-soko-green-contrast font-bold text-lg rounded-full shadow-2xl hover:bg-soko-green-accent focus:outline-none focus:ring-4 focus:ring-soko-yellow/50 transform hover:scale-110 transition-all duration-300 ease-in-out border-4 border-soko-yellow-dark"
          >
            <ShoppingBagIcon className="w-6 h-6 animate-bounce"/>
            {content[language].sokoMtaani}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
