

import React, { useState } from 'react';
import { APP_TITLE } from '../constants';
import { Role, type Conversation, type Business, type CommunityItem } from '../../types';
import { StoreIcon, InboxIcon, HeartIcon } from 'lucide-react';
import BuyerInboxModal from './modals/BuyerInboxModal';
import FavoritesModal from './modals/FavoritesModal';
import RoleSwitcher from './RoleSwitcher';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  conversations: Conversation[];
  onReply: (conversationId: string, text: string) => void;
  onMarkConversationAsRead: (conversationId: string) => void;
  unreadCount: number;
  favoriteBusinesses: Business[];
  favoriteItems: CommunityItem[];
  onToggleFavoriteBusiness: (business: Business) => void;
  onToggleFavoriteItem: (item: CommunityItem) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentRole, 
  onRoleChange, 
  conversations, 
  onReply, 
  onMarkConversationAsRead, 
  unreadCount,
  favoriteBusinesses,
  favoriteItems,
  onToggleFavoriteBusiness,
  onToggleFavoriteItem
}) => {
  const [isBuyerInboxOpen, setIsBuyerInboxOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  
  const favoritesCount = favoriteBusinesses.length + favoriteItems.length;

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              className="flex items-center space-x-3 focus:outline-none group"
              onClick={() => window.location.pathname = '/'}
              aria-label="Go to homepage"
            >
              <div className="p-2 bg-teal-500 rounded-full group-hover:scale-105 transition-transform">
                <StoreIcon className="text-white w-6 h-6" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 tracking-tight group-hover:underline">
                  {APP_TITLE}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Your AI-powered market guide.
                </p>
              </div>
            </button>
            <div className="flex items-center space-x-2">
              <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
              {currentRole === Role.Buyer && (
                <>
                  <button onClick={() => setIsFavoritesOpen(true)} className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <HeartIcon className="w-6 h-6" />
                    {favoritesCount > 0 && (
                       <span className="absolute -top-1 -right-1 block h-4 w-4 text-xs flex items-center justify-center rounded-full bg-red-500 text-white ring-2 ring-white dark:ring-slate-900">{favoritesCount}</span>
                    )}
                 </button>
                 <button onClick={() => setIsBuyerInboxOpen(true)} className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <InboxIcon className="w-6 h-6" />
                    {unreadCount > 0 && (
                       <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                 </button>
                 </>
              )}
            </div>
          </div>
        </div>
      </header>
      {isBuyerInboxOpen && (
        <BuyerInboxModal
          isOpen={isBuyerInboxOpen}
          onClose={() => setIsBuyerInboxOpen(false)}
          conversations={conversations}
          onReply={onReply}
          onMarkAsRead={onMarkConversationAsRead}
        />
      )}
      {isFavoritesOpen && (
        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favoriteBusinesses={favoriteBusinesses}
          favoriteItems={favoriteItems}
          onToggleFavoriteBusiness={onToggleFavoriteBusiness}
          onToggleFavoriteItem={onToggleFavoriteItem}
        />
      )}
    </>
  );
};

export default Header;
