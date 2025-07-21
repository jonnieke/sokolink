

export enum Role {
  Buyer = 'Buyer',
  Seller = 'Seller',
}

export const BusinessCategories = ['cafe', 'restaurant', 'shop', 'salon', 'services', 'other'] as const;
export type BusinessCategory = typeof BusinessCategories[number];

export const CommunityItemCategories = ['Electronics', 'Furniture', 'Clothing', 'Appliances', 'Books', 'Toys', 'Other'] as const;
export type CommunityItemCategory = typeof CommunityItemCategories[number];


export interface BusinessProfile {
  businessName: string;
  address: string;
  category: BusinessCategory;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  products: Product[];
  phone: string;
  hours: string;
  delivery: boolean;
  priceRange: string;
  negotiable: boolean;
}

export interface Product {
    name: string;
    price: string;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  delivery: boolean;
  priceRange: string;
  negotiable: boolean;
  category: BusinessCategory;
  products?: Product[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    website?: string;
    twitter?: string;
    whatsapp?: string;
  };
}

export interface CommunityItem {
  id: string; // Unique ID for each item
  title: string;
  description: string;
  price: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'For Parts';
  category: CommunityItemCategory;
  imageUrl?: string;
  location: string;
  sellerName: string;
  negotiable: boolean;
  status: 'available' | 'sold'; // Status to manage listings
}

export interface Message {
  sender: Role; // Role of the user who sent the message
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string; // Unique ID for the conversation (e.g., based on itemId)
  itemId: string;
  itemName: string;
  messages: Message[];
  isReadByBuyer: boolean;
  isReadBySeller: boolean;
}