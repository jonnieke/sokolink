import React, { useState } from 'react';
import { ICONS } from '../constants';

interface SearchBarProps {
  onSearch: (businessType: string, location: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [businessType, setBusinessType] = useState('Vibanda vya mboga');
  const [location, setLocation] = useState('Buru Buru shopping center');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessType && location && !isLoading) {
      onSearch(businessType, location);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="business-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            I'm looking for...
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {ICONS.search}
            </div>
            <input
              type="text"
              id="business-type"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="k.m., duka la nguo, saluni"
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Near...
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {ICONS.location}
            </div>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="k.m., Nairobi CBD"
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isLoading || !businessType || !location}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Inatafuta...' : 'Tafuta Biashara'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;