

import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import BuyerView from './components/BuyerView';
import SellerView from './components/SellerView';
import LandingPage from './components/LandingPage';
import { findBusinesses, findCommunityItems } from './services/geminiService';
import type { Business, CommunityItem, Conversation, Message, BusinessProfile, Product } from './types';
import { Role } from './types';
import { APP_TITLE } from './constants';

// A custom hook to manage state in localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

// Helper to create a stable ID from business properties
const createBusinessId = (biz: Omit<Business, 'id' | 'products' | 'socialMedia'>) => {
    return (biz.name + biz.address).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

// Helper to create a stable ID from AI-generated item properties
const createCommunityItemId = (item: Omit<CommunityItem, 'id' | 'status'>) => {
    return `ai-item-${(item.title + item.location + item.sellerName).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
};

// Helper to create a stable ID for user-created items
const createUserItemId = (item: Omit<CommunityItem, 'id' | 'status'>) => {
    // Combines title, category, and price for a reasonably unique ID for user-listed items.
    return `user-item-${(item.title + item.category + item.price).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [currentRole, setCurrentRole] = useLocalStorage<Role>('soko-link-role', Role.Buyer);

  const [businesses, setBusinesses] = useLocalStorage<Business[]>('soko-link-businesses', []);
  const [aiCommunityItems, setAiCommunityItems] = useLocalStorage<CommunityItem[]>('soko-link-ai-items', []);
  const [userListedItems, setUserListedItems] = useLocalStorage<CommunityItem[]>('soko-link-user-items', []);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('soko-link-conversations', []);
  const [businessProfile, setBusinessProfile] = useLocalStorage<BusinessProfile>('soko-link-seller-profile', {
      businessName: '',
      address: '',
      category: 'shop',
      website: '',
      instagram: '',
      facebook: '',
      twitter: '',
      whatsapp: '',
      products: [],
      phone: '',
      hours: 'Mon-Fri 9am-5pm',
      delivery: false,
      priceRange: '$$',
      negotiable: false,
  });
  
  // State for favorites
  const [favoriteBusinesses, setFavoriteBusinesses] = useLocalStorage<Business[]>('soko-link-fav-biz', []);
  const [favoriteItems, setFavoriteItems] = useLocalStorage<CommunityItem[]>('soko-link-fav-items', []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useLocalStorage<boolean>('soko-link-has-searched', false);
  const [defaultView, setDefaultView] = useState<'businesses' | 'community'>('businesses');
  
  const handleStart = () => {
    setDefaultView('businesses');
    setCurrentView('app');
  };
  
  const fetchDefaultCommunityItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const communityResults = await findCommunityItems("Kenya");
      const processedAiItems = communityResults.map((item) => ({
        ...item,
        id: createCommunityItemId(item),
        status: 'available' as const,
      }));
      setAiCommunityItems(processedAiItems);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSokoMtaani = () => {
    setCurrentRole(Role.Buyer);
    setDefaultView('community');
    setCurrentView('app');
    if (aiCommunityItems.length === 0 && userListedItems.length === 0){
        fetchDefaultCommunityItems();
    }
  };
  
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
  };

  const handleSearch = useCallback(async (businessType: string, location: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setBusinesses([]);
    setAiCommunityItems([]);
    setDefaultView('businesses');

    try {
      let [businessResults, communityResults] = await Promise.all([
        findBusinesses(businessType, location),
        findCommunityItems(location)
      ]);
      
      const processedBusinessResults = businessResults.map((biz) => ({
        ...biz,
        id: createBusinessId(biz),
      }));
      
      // Inject the seller's own business into the results if it exists
      if (businessProfile.businessName && businessProfile.address) {
          const sellerBusiness: Business = {
              id: 'seller-biz-profile',
              name: businessProfile.businessName,
              address: businessProfile.address,
              category: businessProfile.category,
              products: businessProfile.products,
              phone: businessProfile.phone || businessProfile.whatsapp || "Not specified",
              hours: businessProfile.hours,
              delivery: businessProfile.delivery,
              priceRange: businessProfile.priceRange,
              negotiable: businessProfile.negotiable,
              socialMedia: {
                  website: businessProfile.website,
                  instagram: businessProfile.instagram,
                  facebook: businessProfile.facebook,
                  twitter: businessProfile.twitter,
                  whatsapp: businessProfile.whatsapp,
              },
          };
           // Avoid duplicates by replacing if it exists, otherwise add to the front
           const existingIndex = processedBusinessResults.findIndex(b => b.id === sellerBusiness.id);
           if (existingIndex > -1) {
             processedBusinessResults[existingIndex] = sellerBusiness;
           } else {
             processedBusinessResults.unshift(sellerBusiness);
           }
      }
      
      setBusinesses(processedBusinessResults);
      const processedAiItems = communityResults.map((item) => ({
        ...item,
        id: createCommunityItemId(item),
        status: 'available' as const,
      }));
      setAiCommunityItems(processedAiItems);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [businessProfile, setBusinesses, setAiCommunityItems, setHasSearched]);

  const handleAddItem = (item: Omit<CommunityItem, 'id' | 'status'>) => {
    const newItem: CommunityItem = {
      ...item,
      id: createUserItemId(item),
      status: 'available',
    };
    setUserListedItems(prevItems => {
        const exists = prevItems.some(i => i.id === newItem.id);
        if (exists) {
            console.warn(`Item with id ${newItem.id} already exists.`);
            // Optionally alert the user, for now we just prevent duplicates silently.
            return prevItems;
        }
        return [newItem, ...prevItems];
    });
  };
  
  const handleDeleteItem = (itemId: string) => {
    setUserListedItems(prev => prev.filter(item => item.id !== itemId));
    setFavoriteItems(prev => prev.filter(item => item.id !== itemId)); // Also remove from favorites
  };
  
  const handleUpdateItemStatus = (itemId: string, status: 'available' | 'sold') => {
     setUserListedItems(prev => prev.map(item => item.id === itemId ? { ...item, status } : item));
  };
  
  const handleAddProduct = (product: Product) => {
      setBusinessProfile(prev => ({
          ...prev,
          products: [...(prev.products || []), product]
      }));
  }
  
  const handleDeleteProduct = (productName: string) => {
      setBusinessProfile(prev => ({
          ...prev,
          products: (prev.products || []).filter(p => p.name !== productName)
      }));
  }
  
  const handleToggleFavoriteBusiness = (business: Business) => {
    setFavoriteBusinesses(prev => {
        const isFav = prev.some(fav => fav.id === business.id);
        return isFav ? prev.filter(fav => fav.id !== business.id) : [...prev, business];
    })
  };

  const handleToggleFavoriteItem = (item: CommunityItem) => {
    setFavoriteItems(prev => {
        const isFav = prev.some(fav => fav.id === item.id);
        return isFav ? prev.filter(fav => fav.id !== item.id) : [...prev, item];
    })
  };

  const handleSendMessage = (itemId: string, itemName: string, text: string) => {
    const newMessage: Message = {
      sender: Role.Buyer,
      text,
      timestamp: new Date(),
    };

    setConversations(prevConvos => {
      const existingConvoIndex = prevConvos.findIndex(c => c.itemId === itemId);

      if (existingConvoIndex > -1) {
        const updatedConvos = [...prevConvos];
        const existingConvo = updatedConvos[existingConvoIndex];
        existingConvo.messages.push(newMessage);
        existingConvo.isReadBySeller = false;
        return updatedConvos;
      } else {
        const newConversation: Conversation = {
          id: itemId,
          itemId,
          itemName,
          messages: [newMessage],
          isReadByBuyer: true,
          isReadBySeller: false,
        };
        return [newConversation, ...prevConvos];
      }
    });
  };

  const handleReply = (conversationId: string, text: string) => {
      const newMessage: Message = {
        sender: Role.Seller,
        text,
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(convo => {
          if (convo.id === conversationId) {
              const updatedConvo = { ...convo };
              updatedConvo.messages.push(newMessage);
              updatedConvo.isReadByBuyer = false; // Mark unread for buyer
              updatedConvo.isReadBySeller = true; // Mark read for sender
              return updatedConvo;
          }
          return convo;
      }));
  };
  
  const handleMarkConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(convo => {
        if (convo.id === conversationId) {
          if (currentRole === Role.Buyer) {
            return { ...convo, isReadByBuyer: true };
          }
          return { ...convo, isReadBySeller: true };
        }
        return convo;
      })
    );
  };
  
  const renderContent = () => {
    if (currentView === 'landing') {
        return <LandingPage onStart={handleStart} onStartSokoMtaani={handleStartSokoMtaani} />;
    }
    
    const unreadMessageCount = conversations.filter(c => currentRole === Role.Buyer ? !c.isReadByBuyer : !c.isReadBySeller).length;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          conversations={conversations}
          onReply={handleReply}
          onMarkConversationAsRead={handleMarkConversationAsRead}
          unreadCount={unreadMessageCount}
          favoriteBusinesses={favoriteBusinesses}
          favoriteItems={favoriteItems}
          onToggleFavoriteBusiness={handleToggleFavoriteBusiness}
          onToggleFavoriteItem={handleToggleFavoriteItem}
        />
        <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {currentRole === Role.Buyer ? (
            <BuyerView
              onSearch={handleSearch}
              businesses={businesses}
              communityItems={[...userListedItems, ...aiCommunityItems]}
              isLoading={isLoading}
              error={error}
              searched={hasSearched}
              defaultView={defaultView}
              onSendMessage={handleSendMessage}
              favoriteBusinesses={favoriteBusinesses}
              favoriteItems={favoriteItems}
              onToggleFavoriteBusiness={handleToggleFavoriteBusiness}
              onToggleFavoriteItem={handleToggleFavoriteItem}
            />
          ) : (
            <SellerView
              onAddItem={handleAddItem}
              userListedItems={userListedItems}
              onDeleteItem={handleDeleteItem}
              onUpdateItemStatus={handleUpdateItemStatus}
              conversations={conversations}
              onReply={handleReply}
              onMarkConversationAsRead={handleMarkConversationAsRead}
              businessProfile={businessProfile}
              onBusinessProfileChange={setBusinessProfile}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </main>
        <footer className="text-center py-4 mt-8">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} {APP_TITLE}. AI-powered results & negotiation tips.
            </p>
        </footer>
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default App;
