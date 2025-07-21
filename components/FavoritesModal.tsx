

import React, { useState } from 'react';
import type { Business, CommunityItem } from '../types';
import BusinessCard from './BusinessCard';
import CommunityItemCard from './CommunityItemCard';
import { XIcon, HeartIcon, StoreIcon, ShoppingBagIcon } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteBusinesses: Business[];
  favoriteItems: CommunityItem[];
  onToggleFavoriteBusiness: (business: Business) => void;
  onToggleFavoriteItem: (item: CommunityItem) => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteBusinesses,
  favoriteItems,
  onToggleFavoriteBusiness,
  onToggleFavoriteItem,
}) => {
  const [activeTab, setActiveTab] = useState<'businesses' | 'items'>('businesses');

  if (!isOpen) return null;

  const renderContent = () => {
    if (activeTab === 'businesses') {
      if (favoriteBusinesses.length === 0) {
        return <EmptyState message="You haven't favorited any businesses yet." />;
      }
      return (
        <div className="grid grid-cols-1 gap-6">
          {favoriteBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              isFavorite={true}
              onToggleFavorite={onToggleFavoriteBusiness}
              onStartNegotiation={() => {}} // Not needed in this context
              onContactSeller={() => {}}    // Not needed in this context
            />
          ))}
        </div>
      );
    } else {
      if (favoriteItems.length === 0) {
        return <EmptyState message="You haven't favorited any items from Soko Mtaani yet." />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favoriteItems.map(item => (
            <CommunityItemCard
              key={item.id}
              item={item}
              isFavorite={true}
              onToggleFavorite={onToggleFavoriteItem}
              onStartNegotiation={() => {}} // Not needed in this context
              onContactSeller={() => {}}    // Not needed in this context
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] max-h-[800px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <HeartIcon className="w-6 h-6 text-red-500" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Your Favorites</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 border-b border-slate-200 dark:border-slate-700">
          <div className="flex p-1 bg-slate-200 dark:bg-slate-700/50 rounded-lg">
            <TabButton
              icon={<StoreIcon className="w-5 h-5 mr-2" />}
              label="Businesses"
              count={favoriteBusinesses.length}
              isActive={activeTab === 'businesses'}
              onClick={() => setActiveTab('businesses')}
            />
            <TabButton
              icon={<ShoppingBagIcon className="w-5 h-5 mr-2" />}
              label="Soko Mtaani"
              count={favoriteItems.length}
              isActive={activeTab === 'items'}
              onClick={() => setActiveTab('items')}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-8 text-slate-500 dark:text-slate-400">{message}</div>
);

const TabButton: React.FC<{icon: React.ReactNode, label: string, count: number, isActive: boolean, onClick: () => void}> = ({ icon, label, count, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center text-sm font-semibold p-2 rounded-md transition-colors ${
      isActive
        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600/50'
    }`}
  >
    {icon}
    {label}
    <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-teal-100 dark:bg-teal-900/80 text-teal-700 dark:text-teal-200' : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'}`}>
      {count}
    </span>
  </button>
);

export default FavoritesModal;