

import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import NegotiationModal from '../components/modals/NegotiationModal';
import ContactSellerModal from '../components/modals/ContactSellerModal';
import CommunityItemCard from '../components/CommunityItemCard';
import type { Business, CommunityItem } from '../types';
import { ICONS, getIconForCategory } from '../constants';
import { StoreIcon, ShoppingBagIcon, SearchIcon } from 'lucide-react';


interface BuyerViewProps {
  onSearch: (businessType: string, location: string) => void;
  businesses: Business[];
  communityItems: CommunityItem[];
  isLoading: boolean;
  error: string | null;
  searched: boolean;
  defaultView: 'businesses' | 'community';
  onSendMessage: (itemId: string, itemName: string, text: string) => void;
  favoriteBusinesses: Business[];
  favoriteItems: CommunityItem[];
  onToggleFavoriteBusiness: (business: Business) => void;
  onToggleFavoriteItem: (item: CommunityItem) => void;
}

const BuyerView: React.FC<BuyerViewProps> = ({ 
  onSearch, 
  businesses, 
  communityItems, 
  isLoading, 
  error, 
  searched, 
  defaultView, 
  onSendMessage,
  favoriteBusinesses,
  favoriteItems,
  onToggleFavoriteBusiness,
  onToggleFavoriteItem
}) => {
  const [negotiatingItemName, setNegotiatingItemName] = useState<string | null>(null);
  const [contactingItem, setContactingItem] = useState<{ id: string; name: string; } | null>(null);
  const [activeView, setActiveView] = useState<'businesses' | 'community'>(defaultView);
  
  // State for Soko Mtaani filtering
  const [sokoSearchQuery, setSokoSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const availableCommunityItems = useMemo(() => communityItems.filter(item => item.status === 'available'), [communityItems]);

  useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);


  const handleStartNegotiation = (name: string) => setNegotiatingItemName(name);
  const handleCloseNegotiation = () => setNegotiatingItemName(null);

  const handleContactSeller = (id: string, name: string) => setContactingItem({ id, name });
  const handleCloseContactSeller = () => setContactingItem(null);

  const handleSendMessage = (message: string) => {
    if (contactingItem) {
      onSendMessage(contactingItem.id, contactingItem.name, message);
      handleCloseContactSeller();
    }
  };
  
  const hasAnyResults = businesses.length > 0 || availableCommunityItems.length > 0;
  
  const sokoCategories = useMemo(() => {
    const categories = new Set(availableCommunityItems.map(item => item.category));
    return Array.from(categories);
  }, [availableCommunityItems]);

  const filteredCommunityItems = useMemo(() => {
    return availableCommunityItems.filter(item => {
      const matchesCategory = !activeCategory || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !sokoSearchQuery ||
        item.title.toLowerCase().includes(sokoSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(sokoSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [availableCommunityItems, sokoSearchQuery, activeCategory]);
  

  const renderTabs = () => (
    <div className="mb-6 flex p-1 bg-slate-200 dark:bg-slate-700/50 rounded-lg">
      <TabButton
        icon={<StoreIcon className="w-5 h-5 mr-2" />}
        label="Local Businesses"
        count={businesses.length}
        isActive={activeView === 'businesses'}
        onClick={() => setActiveView('businesses')}
      />
      <TabButton
        icon={<ShoppingBagIcon className="w-5 h-5 mr-2" />}
        label="Soko Mtaani"
        count={availableCommunityItems.length}
        isActive={activeView === 'community'}
        onClick={() => setActiveView('community')}
      />
    </div>
  );
  
  const SokoMtaaniFilters = () => (
    <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg space-y-4">
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={sokoSearchQuery}
              onChange={(e) => setSokoSearchQuery(e.target.value)}
              placeholder="Search items in Soko Mtaani..."
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
        </div>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${!activeCategory ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
                All
            </button>
            {sokoCategories.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeCategory === category ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                >
                    <img src={getIconForCategory(category)} alt={category} className="w-4 h-4" />
                    {category}
                </button>
            ))}
        </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>;
    }

    if (!searched && availableCommunityItems.length === 0) {
        return (
            <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="flex justify-center items-center mx-auto h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/50 mb-4">
                   {React.cloneElement(ICONS.search, { className: "h-8 w-8 text-teal-600 dark:text-teal-400" })}
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Tafuta Biashara Karibu Nawe</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Andika unachotafuta (k.m. Duka la dawa) na eneo lako (k.m. Nairobi CBD) ili uanze.
                </p>
            </div>
        );
    }
    
    if (!hasAnyResults && searched) {
      return <EmptyState message="Hakuna kilichopatikana. Jaribu utafutaji tofauti!" />;
    }

    if (activeView === 'businesses') {
      return businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {businesses.map((business) => (
            <BusinessCard 
              key={business.id}
              business={business}
              isFavorite={favoriteBusinesses.some(fav => fav.id === business.id)}
              onStartNegotiation={handleStartNegotiation} 
              onContactSeller={handleContactSeller}
              onToggleFavorite={onToggleFavoriteBusiness}
            />
          ))}
        </div>
      ) : <EmptyState message={searched ? "Hakuna biashara iliyopatikana kwa utafutaji huu." : "Tumia upau wa utafutaji hapo juu kupata biashara za karibu."} />;
    }
    
    if (activeView === 'community') {
       return (
        <>
          <SokoMtaaniFilters />
          {filteredCommunityItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCommunityItems.map((item) => (
                <CommunityItemCard 
                  key={item.id} 
                  item={item}
                  isFavorite={favoriteItems.some(fav => fav.id === item.id)}
                  onStartNegotiation={handleStartNegotiation}
                  onContactSeller={handleContactSeller}
                  onToggleFavorite={onToggleFavoriteItem}
                />
              ))}
            </div>
          ) : <EmptyState message="No items match your search. Try different keywords or clear the filters!" />}
        </>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <SearchBar onSearch={onSearch} isLoading={isLoading} />
      <div className="mt-6">
        {(searched || availableCommunityItems.length > 0) && hasAnyResults && renderTabs()}
        {renderContent()}
      </div>
      {negotiatingItemName && (
        <NegotiationModal 
          itemName={negotiatingItemName}
          isOpen={!!negotiatingItemName}
          onClose={handleCloseNegotiation}
        />
      )}
      {contactingItem && (
        <ContactSellerModal
          itemName={contactingItem.name}
          isOpen={!!contactingItem}
          onClose={handleCloseContactSeller}
          onSend={handleSendMessage}
        />
      )}
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


export default BuyerView;
