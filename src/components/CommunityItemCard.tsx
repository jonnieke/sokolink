

import React from 'react';
import type { CommunityItem } from '../types';
import { TagIcon, MapPinIcon, MessageCircleIcon, HeartIcon, MonitorIcon, SofaIcon, ShirtIcon, RefrigeratorIcon, BookIcon, PuzzleIcon, CoffeeIcon, UtensilsIcon, ShoppingBagIcon as ShopBagIcon, ScissorsIcon, WrenchIcon, PackageIcon } from 'lucide-react';

// Lucide icon mapping for categories (same as BuyerView)
const categoryIconMap: Record<string, React.ReactNode> = {
  electronics: <MonitorIcon className="w-20 h-20 text-amber-400" />,
  furniture: <SofaIcon className="w-20 h-20 text-amber-400" />,
  clothing: <ShirtIcon className="w-20 h-20 text-amber-400" />,
  appliances: <RefrigeratorIcon className="w-20 h-20 text-amber-400" />,
  books: <BookIcon className="w-20 h-20 text-amber-400" />,
  toys: <PuzzleIcon className="w-20 h-20 text-amber-400" />,
  cafe: <CoffeeIcon className="w-20 h-20 text-amber-400" />,
  restaurant: <UtensilsIcon className="w-20 h-20 text-amber-400" />,
  shop: <ShopBagIcon className="w-20 h-20 text-amber-400" />,
  salon: <ScissorsIcon className="w-20 h-20 text-amber-400" />,
  services: <WrenchIcon className="w-20 h-20 text-amber-400" />,
  other: <PackageIcon className="w-20 h-20 text-amber-400" />,
};

function getLucideCategoryIcon(category: string) {
  if (!category) return categoryIconMap.other;
  const key = Object.keys(categoryIconMap).find(k => category.toLowerCase().includes(k));
  return key ? categoryIconMap[key] : categoryIconMap.other;
}

interface CommunityItemCardProps {
    item: CommunityItem;
    isFavorite: boolean;
    onStartNegotiation: (name: string) => void;
    onContactSeller: (id: string, name: string) => void;
    onToggleFavorite: (item: CommunityItem) => void;
}

const CommunityItemCard: React.FC<CommunityItemCardProps> = ({ item, isFavorite, onStartNegotiation, onContactSeller, onToggleFavorite }) => {
    const { id, title, price, imageUrl, category, condition, location, negotiable, sellerName } = item;
        
    const hasImage = Boolean(imageUrl);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {hasImage ? (
                        <img 
                            src={imageUrl} 
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        getLucideCategoryIcon(category)
                    )}
                </div>
                 <button 
                    onClick={() => onToggleFavorite(item)} 
                    className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:scale-110 transition-transform"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-600 dark:text-slate-300'}`} />
                </button>
                <div className="absolute top-2 right-2 bg-slate-800/60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    {price}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-md text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-600 transition-colors">
                    {title}
                </h3>
                <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <TagIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{condition}</span>
                    </div>
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{location} (Seller: {sellerName})</span>
                    </div>
                </div>
                <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                     {negotiable && (
                        <button 
                          onClick={() => onStartNegotiation(title)}
                          className="w-full flex items-center justify-center text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-2 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                        >
                            <MessageCircleIcon className="w-4 h-4" /> <span className="ml-1.5">AI Negotiate</span>
                        </button>
                    )}
                     <button 
                        onClick={() => onContactSeller(id, title)}
                        className={`w-full flex items-center justify-center text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-2 py-2 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-colors ${!negotiable && 'col-span-2'}`}
                      >
                          <MessageCircleIcon className="w-4 h-4" /> <span className="ml-1.5">Message Seller</span>
                      </button>
                </div>
            </div>
        </div>
    )
};

export default CommunityItemCard;
