

import React from 'react';
// Ensure the correct path to your types file; adjust as needed if the file is in a different location.
// Update the path below to the actual location of your types file, e.g., './types' or '../../types'
import type { Business, Product } from '../types';
import { ICONS, getIconForCategory } from '../constants';
import { MessageCircleIcon, ListIcon, HeartIcon } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
  isFavorite: boolean;
  onStartNegotiation: (name: string) => void;
  onContactSeller: (id: string, name: string) => void;
  onToggleFavorite: (business: Business) => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
        <span className="flex-shrink-0 text-slate-400 dark:text-slate-500 mt-1">{icon}</span>
        <span className="text-sm">{children}</span>
    </div>
);

const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
  <div className="flex justify-between items-center text-sm py-1">
    <span className="text-slate-700 dark:text-slate-300">{product.name}</span>
    <span className="font-semibold text-slate-800 dark:text-slate-200">Ksh {product.price}</span>
  </div>
);

const BusinessCard: React.FC<BusinessCardProps> = ({ business, isFavorite, onStartNegotiation, onContactSeller, onToggleFavorite }) => {
  const { id, name, address, phone, hours, delivery, priceRange, negotiable, socialMedia, category, products } = business;

  const categoryIcon = getIconForCategory(category);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
      <button 
        onClick={() => onToggleFavorite(business)} 
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:scale-110 transition-transform"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-500 dark:text-slate-300'}`} />
      </button>
      <div className="p-5">
        <div className="flex items-center space-x-3">
            <img src={categoryIcon} alt={`${category} icon`} className="w-8 h-8 flex-shrink-0" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 pr-8">{name}</h3>
        </div>
        <div className="mt-4 space-y-3 pl-11">
          <InfoRow icon={<ICONS.location />}>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">{address}</a>
          </InfoRow>
          <InfoRow icon={<ICONS.phone />}>
            <a href={`tel:${phone}`} className="hover:text-teal-600 transition-colors">{phone}</a>
          </InfoRow>
          <InfoRow icon={<ICONS.clock />}>{hours}</InfoRow>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {delivery && (
                <span className="flex items-center text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded-full">
                    <ICONS.delivery /> <span className="ml-1.5">Delivery Available</span>
                </span>
            )}
             {priceRange && (
                <span className="flex items-center text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-full">
                    <ICONS.price /> <span className="ml-1.5">{priceRange}</span>
                </span>
            )}
             {negotiable && (
                <button 
                  onClick={() => onStartNegotiation(business.name)}
                  className="flex items-center text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                >
                    <MessageCircleIcon className="w-4 h-4" /> <span className="ml-1.5">AI Negotiate</span>
                </button>
            )}
             <button 
                onClick={() => onContactSeller(business.id, business.name)}
                className="flex items-center text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-colors"
              >
                  <ICONS.message /> <span className="ml-1.5">Message Seller</span>
              </button>
          </div>
        </div>
      </div>
      
      {products && products.length > 0 && (
         <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
           <h4 className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
             <ListIcon className="w-4 h-4 mr-2" />
             Products
           </h4>
           <div className="space-y-1">
             {products.map((prod) => <ProductListItem key={prod.name} product={prod} />)}
           </div>
         </div>
      )}
      
      {socialMedia && Object.values(socialMedia).some(v => v) && (
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-end space-x-4">
                {socialMedia.website && <a href={socialMedia.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-500 transition-colors"><ICONS.website /></a>}
                {socialMedia.instagram && <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors"><ICONS.instagram /></a>}
                {socialMedia.facebook && <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><ICONS.facebook /></a>}
                {socialMedia.twitter && <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500 transition-colors"><ICONS.twitter /></a>}
                {socialMedia.whatsapp && <a href={`https://wa.me/${socialMedia.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-500 transition-colors"><ICONS.whatsapp /></a>}
            </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
