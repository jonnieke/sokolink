

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { TagIcon, ImageIcon, PlusCircleIcon, BarChart3Icon, InboxIcon, ShoppingBagIcon, Building2Icon, XIcon, CheckCircleIcon, MapPinIcon, MailIcon, ChevronDownIcon, SendIcon, EyeIcon, Trash2Icon, PackageCheckIcon, ListIcon, SparklesIcon, LayoutDashboardIcon, PhoneIcon, ClockIcon, GlobeIcon, InstagramIcon, FacebookIcon, TwitterIcon } from 'lucide-react';
import LocationPickerModal from '../components/modals/LocationPickerModal';
import { getIconForCategory } from '../constants';

// Use Lucide icons directly for all social icons
const WebsiteIcon = GlobeIcon;
const WhatsappIcon = PhoneIcon;
import type { CommunityItem, Conversation, Business, BusinessProfile, Product, CommunityItemCategory } from '../types';
import { BusinessCategories, CommunityItemCategories } from '../types';
import BusinessCard from '../components/BusinessCard';
import { getAIDescription, getAIPriceSuggestion } from '../services/geminiService';

interface SellerViewProps {
  onAddItem: (item: Omit<CommunityItem, 'id' | 'status'>) => void;
  userListedItems: CommunityItem[];
  onDeleteItem: (itemId: string) => void;
  onUpdateItemStatus: (itemId: string, status: 'available' | 'sold') => void;
  conversations: Conversation[];
  onReply: (conversationId: string, text: string) => void;
  onMarkConversationAsRead: (conversationId: string) => void;
  businessProfile: BusinessProfile;
  onBusinessProfileChange: (profile: BusinessProfile) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productName: string) => void;
}

type SellerTab = 'dashboard' | 'business' | 'soko';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; }> = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const FormSuccessMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="mt-2 flex items-center justify-center text-sm text-green-600 dark:text-green-400 font-medium">
      <CheckCircleIcon className="w-4 h-4 mr-1.5" />
      {message}
    </div>
);

const InboxCard: React.FC<{
  conversations: Conversation[];
  onMarkAsRead: (id: string) => void;
  onReply: (conversationId: string, text: string) => void;
}> = ({ conversations, onMarkAsRead, onReply }) => {
  const [expandedConvoId, setExpandedConvoId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const unreadCount = conversations.filter(c => !c.isReadBySeller).length;

  const handleToggle = (convo: Conversation) => {
    onMarkAsRead(convo.id);
    setExpandedConvoId(prevId => (prevId === convo.id ? null : convo.id));
    setReplyText('');
  };

  const handleReplySubmit = (e: React.FormEvent, convo: Conversation) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(convo.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
        <MailIcon className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
        Inbox
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>
        )}
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {conversations.length === 0 ? (
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">No messages yet.</p>
        ) : (
          conversations.map(convo => (
            <div key={convo.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
              <button onClick={() => handleToggle(convo)} className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 flex justify-between items-center">
                <div className="flex items-center">
                  {!convo.isReadBySeller && <span className="w-2 h-2 bg-teal-500 rounded-full mr-3 flex-shrink-0"></span>}
                  <div>
                    <p className={`font-semibold text-sm ${convo.isReadBySeller ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
                      {convo.itemName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{convo.messages[convo.messages.length - 1]?.text}</p>
                  </div>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${expandedConvoId === convo.id ? 'rotate-180' : ''}`} />
              </button>
              {expandedConvoId === convo.id && (
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-b-lg space-y-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {convo.messages.map((msg, index) => (
                       <div key={index} className={`flex items-start gap-2 ${msg.sender === 'Seller' ? 'justify-end' : ''}`}>
                         <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg text-sm ${msg.sender === 'Seller' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-600'}`}>
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'Seller' ? 'text-teal-100' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                         </div>
                       </div>
                    ))}
                  </div>
                   <form onSubmit={(e) => handleReplySubmit(e, convo)} className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            className="flex-1 block w-full rounded-full border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 px-4 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                        />
                        <button type="submit" disabled={!replyText.trim()} className="p-2 rounded-full text-white bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SellerView: React.FC<SellerViewProps> = ({ 
    onAddItem, 
    userListedItems, 
    onDeleteItem,
    onUpdateItemStatus,
    conversations, 
    onReply, 
    onMarkConversationAsRead, 
    businessProfile, 
    onBusinessProfileChange,
    onAddProduct,
    onDeleteProduct
}) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('dashboard');
  
  // State for Soko Mtaani form
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [itemNegotiable, setItemNegotiable] = useState(true);
  const [itemCategory, setItemCategory] = useState<CommunityItemCategory>('Other');
  const [itemCondition, setItemCondition] = useState<CommunityItem['condition']>('Used - Good');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sokoMtaaniMessage, setSokoMtaaniMessage] = useState<string | null>(null);
  // State for AI assistance
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);

  // State for business product form
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productMessage, setProductMessage] = useState<string | null>(null);

  // State for business profile form
  const [localProfile, setLocalProfile] = useState(businessProfile);
  const [businessInfoMessage, setBusinessInfoMessage] = useState<string | null>(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  
  useEffect(() => {
    setLocalProfile(businessProfile);
  }, [businessProfile]);

  const activeListingsCount = useMemo(() => {
    return userListedItems.filter(item => item.status === 'available').length;
  }, [userListedItems]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setItemImage(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSokoMtaaniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSokoMtaaniFormValid) return;

    const newItem: Omit<CommunityItem, 'id' | 'status'> = {
      title: itemTitle,
      description: itemDescription,
      price: `Ksh ${parseInt(itemPrice, 10).toLocaleString()}`,
      condition: itemCondition, 
      category: itemCategory, 
      imageUrl: itemImage || undefined,
      location: businessProfile.address || 'Seller Location',
      sellerName: "You",
      negotiable: itemNegotiable,
    };

    onAddItem(newItem);

    setSokoMtaaniMessage('Success! Your item has been listed.');
    // Reset form
    setItemTitle('');
    setItemDescription('');
    setItemPrice('');
    setItemNegotiable(true);
    setItemCategory('Other');
    setItemCondition('Used - Good');
    handleRemoveImage();
    setTimeout(() => setSokoMtaaniMessage(null), 3000);
  };
  const isSokoMtaaniFormValid = itemTitle && itemPrice && itemImage && itemDescription;
  
  const handleGenerateDescription = async () => {
    if (!itemTitle.trim()) return;
    setIsGeneratingDescription(true);
    try {
      const description = await getAIDescription(itemTitle);
      setItemDescription(description);
    } catch (e) {
      console.error(e);
      // Optionally set an error message to display to the user
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  
  const handleSuggestPrice = async () => {
    if (!itemTitle.trim()) return;
    setIsSuggestingPrice(true);
    try {
      const price = await getAIPriceSuggestion(itemTitle, itemDescription);
      setItemPrice(price);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggestingPrice(false);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProductFormValid) return;
    onAddProduct({ name: productName, price: productPrice });
    setProductMessage('Success! Product added.');
    setProductName('');
    setProductPrice('');
    setTimeout(() => setProductMessage(null), 3000);
  };
  const isProductFormValid = productName.trim() !== '' && productPrice.trim() !== '';

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const val = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setLocalProfile({ ...localProfile, [name]: val });
  };
  const handleBusinessInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBusinessProfileChange(localProfile);
    setBusinessInfoMessage('Success! Your business profile has been updated.');
    setTimeout(() => setBusinessInfoMessage(null), 3000);
  };
  const isBusinessInfoFormValid = localProfile.businessName.trim() !== '' && localProfile.address.trim() !== '';
  
  const previewBusiness: Business = useMemo(() => ({
      id: 'seller-preview-id',
      name: localProfile.businessName || "Your Business Name",
      phone: localProfile.phone || "Not specified",
      hours: localProfile.hours || "Not specified",
      delivery: localProfile.delivery,
      priceRange: localProfile.priceRange,
      negotiable: localProfile.negotiable,
      products: businessProfile.products || [],
      category: localProfile.category,
      address: localProfile.address || "Your Business Location",
      socialMedia: {
          website: localProfile.website,
          instagram: localProfile.instagram,
          facebook: localProfile.facebook,
          twitter: localProfile.twitter,
          whatsapp: localProfile.whatsapp,
      }
  }), [localProfile, businessProfile.products]);
  
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard icon={<BarChart3Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />} title="Sales (Month)" value="Ksh 123,450" />
              <StatCard icon={<InboxIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />} title="New Messages" value={String(conversations.filter(c => !c.isReadBySeller).length)} />
              <StatCard icon={<TagIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />} title="Active Listings" value={String(activeListingsCount)} />
            </div>
            <InboxCard conversations={conversations} onMarkAsRead={onMarkConversationAsRead} onReply={onReply} />
          </div>
        );
      case 'business':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <Building2Icon className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
                    Manage Business Profile
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Update your location and contact information to help customers connect with you.
                </p>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleBusinessInfoSubmit}>
                     <div className="sm:col-span-2">
                          <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                          <input type="text" name="businessName" id="businessName" value={localProfile.businessName} onChange={handleBusinessInfoChange} placeholder="e.g., Bob's Electronics" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-3 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </div>
                     <div className="sm:col-span-2">
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Category</label>
                        <select 
                            name="category" 
                            id="category" 
                            value={localProfile.category} 
                            onChange={handleBusinessInfoChange} 
                            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {BusinessCategories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Location</label>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="relative flex-grow">
                                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><MapPinIcon className="h-5 w-5 text-slate-400" /></div>
                                <input type="text" name="address" value={localProfile.address} readOnly id="address" placeholder="Click 'Pin on Map' to set location" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none cursor-default" />
                            </div>
                            <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                Pin on Map
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact Phone</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><PhoneIcon className="h-5 w-5 text-slate-400" /></div>
                            <input type="tel" name="phone" value={localProfile.phone} onChange={handleBusinessInfoChange} id="phone" placeholder="0712 345 678" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Opening Hours</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><ClockIcon className="h-5 w-5 text-slate-400" /></div>
                            <input type="text" name="hours" value={localProfile.hours} onChange={handleBusinessInfoChange} id="hours" placeholder="Mon-Sat 9am-7pm" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-3 gap-4 items-center">
                        <div>
                            <label htmlFor="priceRange" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price Range</label>
                            <select name="priceRange" id="priceRange" value={localProfile.priceRange} onChange={handleBusinessInfoChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option>$</option>
                                <option>$$</option>
                                <option>$$$</option>
                                <option>$$$$</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-center pt-6">
                             <label htmlFor="delivery-toggle" className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" name="delivery" id="delivery-toggle" className="sr-only peer" checked={localProfile.delivery} onChange={handleBusinessInfoChange} />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-500"></div>
                               <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Delivery?</span>
                            </label>
                        </div>
                         <div className="flex items-center justify-center pt-6">
                             <label htmlFor="negotiable-toggle" className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" name="negotiable" id="negotiable-toggle" className="sr-only peer" checked={localProfile.negotiable} onChange={handleBusinessInfoChange} />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-500"></div>
                               <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Negotiable?</span>
                            </label>
                        </div>
                    </div>


                    <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-600 pt-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Social & Web Links</p>
                    </div>

                    <div>
                        <label htmlFor="website-url" className="sr-only">Website</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><WebsiteIcon className="h-5 w-5 text-slate-400" /></div>
                            <input type="url" name="website" value={localProfile.website} onChange={handleBusinessInfoChange} id="website-url" placeholder="https://mybusiness.com" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="instagram-url" className="sr-only">Instagram</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{InstagramIcon && <InstagramIcon className="h-5 w-5 text-slate-400" />}</div>
                            <input type="url" name="instagram" value={localProfile.instagram} onChange={handleBusinessInfoChange} id="instagram-url" placeholder="https://instagram.com/mybiz" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="facebook-url" className="sr-only">Facebook</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{FacebookIcon && <FacebookIcon className="h-5 w-5 text-slate-400" />}</div>
                            <input type="url" name="facebook" value={localProfile.facebook} onChange={handleBusinessInfoChange} id="facebook-url" placeholder="https://facebook.com/mybiz" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="twitter-url" className="sr-only">Twitter (X)</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{TwitterIcon && <TwitterIcon className="h-5 w-5 text-slate-400" />}</div>
                            <input type="url" name="twitter" value={localProfile.twitter} onChange={handleBusinessInfoChange} id="twitter-url" placeholder="https://x.com/mybiz" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="whatsapp-number" className="sr-only">WhatsApp Number</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><WhatsappIcon className="h-5 w-5 text-slate-400" /></div>
                            <input type="tel" name="whatsapp" value={localProfile.whatsapp} onChange={handleBusinessInfoChange} id="whatsapp-number" placeholder="WhatsApp: +254712345678" className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div className="sm:col-span-2 pt-2">
                        <button type="submit" disabled={!isBusinessInfoFormValid} className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            Save Profile
                        </button>
                        {businessInfoMessage && <FormSuccessMessage message={businessInfoMessage} />}
                    </div>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                      <PlusCircleIcon className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
                      Add Product to Your Business
                  </h3>
                  <form className="space-y-4" onSubmit={handleProductSubmit}>
                      <div>
                          <label htmlFor="product-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
                          <input type="text" id="product-name" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., 'Hand-woven Basket'" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-3 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                      </div>
                      <div>
                          <label htmlFor="product-price" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price (Ksh)</label>
                          <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-slate-500 sm:text-sm">Ksh</span>
                          </div>
                          <input type="number" id="product-price" value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="2500" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                          </div>
                      </div>
                      <div className="pt-2">
                          <button type="submit" disabled={!isProductFormValid} className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                              Add Product
                          </button>
                          {productMessage && <FormSuccessMessage message={productMessage} />}
                      </div>
                  </form>
                </div>
                 <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                        <ListIcon className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
                        My Business Products
                    </h3>
                     <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                       {(businessProfile.products || []).length === 0 ? (
                           <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">You haven't added any products.</p>
                       ) : (
                           (businessProfile.products || []).map(prod => (
                               <div key={prod.name} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                   <div>
                                       <p className="font-semibold text-slate-800 dark:text-slate-100">{prod.name}</p>
                                       <p className="text-sm text-slate-500 dark:text-slate-400">Ksh {prod.price}</p>
                                   </div>
                                   <button onClick={() => onDeleteProduct(prod.name)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete Product">
                                       <Trash2Icon className="w-4 h-4" />
                                   </button>
                               </div>
                           ))
                       )}
                    </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg lg:sticky lg:top-24">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                  <EyeIcon className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
                  Your Business Preview
              </h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  This is how your business card will appear to buyers.
              </p>
              <BusinessCard 
                business={previewBusiness}
                isFavorite={false}
                onStartNegotiation={() => {}} 
                onContactSeller={() => {}}
                onToggleFavorite={() => {}}
              />
            </div>
          </div>
        );
      case 'soko':
         return (
            <div className="space-y-8">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <ShoppingBagIcon className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />
                    Sell a Personal Item (Soko Mtaani)
                </h3>
                <form className="space-y-4" onSubmit={handleSokoMtaaniSubmit}>
                 <div>
                    <label htmlFor="item-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Title</label>
                    <input type="text" id="item-title" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder="e.g., 'Slightly used 42-inch TV'" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-3 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="item-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <button type="button" onClick={handleGenerateDescription} disabled={!itemTitle.trim() || isGeneratingDescription} className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                          <SparklesIcon className="w-4 h-4 mr-1" />
                          {isGeneratingDescription ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                    <textarea id="item-description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} rows={2} placeholder="e.g., 'Works perfectly, selling due to upgrade.'" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-3 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                   <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="item-price" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Asking Price (Ksh)</label>
                        <button type="button" onClick={handleSuggestPrice} disabled={!itemTitle.trim() || isSuggestingPrice} className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                          <SparklesIcon className="w-4 h-4 mr-1" />
                          {isSuggestingPrice ? 'Suggesting...' : 'Suggest'}
                        </button>
                    </div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-slate-500 sm:text-sm">Ksh</span></div>
                      <input type="number" id="item-price" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="18000" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 pl-10 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="item-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                        <select id="item-category" value={itemCategory} onChange={e => setItemCategory(e.target.value as CommunityItemCategory)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                            {CommunityItemCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="item-condition" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Condition</label>
                        <select id="item-condition" value={itemCondition} onChange={e => setItemCondition(e.target.value as CommunityItem['condition'])} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>New</option>
                            <option>Used - Like New</option>
                            <option>Used - Good</option>
                            <option>For Parts</option>
                        </select>
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Image</label>
                    <div className="mt-1">
                        {itemImage ? (
                            <div className="relative group">
                                <img src={itemImage} alt="Item preview" className="w-full h-32 object-cover rounded-md" />
                                <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="file-upload" className="relative cursor-pointer flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400"><span className="text-amber-600 dark:text-amber-400 font-semibold">Click to upload</span> or take a photo</p>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleImageChange} accept="image/*" capture="environment" />
                                </div>
                            </label>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Price Negotiable?</span>
                    <label htmlFor="soko-negotiable-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="soko-negotiable-toggle" className="sr-only peer" checked={itemNegotiable} onChange={(e) => setItemNegotiable(e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={!isSokoMtaaniFormValid} className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        List on Soko Mtaani
                    </button>
                    {sokoMtaaniMessage && <FormSuccessMessage message={sokoMtaaniMessage} />}
                  </div>
                </form>
            </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                      <ListIcon className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />
                      My Soko Mtaani Listings
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {userListedItems.length === 0 ? (
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">You haven't listed any items yet.</p>
                    ) : (
                        userListedItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                     <img src={item.imageUrl || getIconForCategory(item.category)} alt={item.title} className="w-12 h-12 rounded-md object-cover bg-slate-200 dark:bg-slate-600 p-1" />
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.price} - <span className={`${item.status === 'sold' ? 'text-red-500' : 'text-green-600'}`}>{item.status}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     {item.status === 'available' && (
                                        <button onClick={() => onUpdateItemStatus(item.id, 'sold')} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Mark as Sold">
                                            <PackageCheckIcon className="w-5 h-5"/>
                                        </button>
                                    )}
                                    <button onClick={() => onDeleteItem(item.id)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                                        <Trash2Icon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                  </div>
               </div>
            </div>
         );
       default:
        return null;
    }
  }


  return (
    <div className="space-y-8 w-full px-4 md:px-8 lg:px-16 xl:px-24">
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Seller Dashboard</h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your business profile and personal sales.</p>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700 w-full">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <SellerTabButton
            icon={<LayoutDashboardIcon className="w-5 h-5 mr-2" />}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SellerTabButton
            icon={<Building2Icon className="w-5 h-5 mr-2" />}
            label="My Business"
            isActive={activeTab === 'business'}
            onClick={() => setActiveTab('business')}
          />
          <SellerTabButton
            icon={<ShoppingBagIcon className="w-5 h-5 mr-2" />}
            label="Soko Mtaani"
            isActive={activeTab === 'soko'}
            onClick={() => setActiveTab('soko')}
          />
        </nav>
      </div>

      <div className="mt-6 w-full">
        {renderContent()}
      </div>

      {isLocationPickerOpen && (
        <LocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          onLocationSelect={(lat, lng) => {
            setLocalProfile(prev => ({ ...prev, address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}` }));
            setIsLocationPickerOpen(false);
          }}
        />
      )}
    </div>
  );
};

const SellerTabButton: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
      ${isActive
        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
    }`}
  >
    {icon}
    {label}
  </button>
);


export default SellerView;
