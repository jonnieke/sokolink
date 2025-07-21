import { GoogleGenAI, Type } from "@google/genai";
import type { Business, CommunityItem } from '../types';
import { BusinessCategories, CommunityItemCategories } from "../types";

// Vite env type declaration should be in a global .d.ts file, not here.

// Get the API key from environment variables (Vite style).
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log('VITE_GEMINI_API_KEY at runtime:', API_KEY);

// Initialize the AI client only if the key exists.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// A helper function to check for the API key at runtime.
const checkApiKey = () => {
    if (!ai) {
        // This user-friendly message avoids exposing technical details.
        throw new Error("The AI service is not available. Please contact the administrator to ensure it's configured correctly.");
    }
};

const businessSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the business." },
    address: { type: Type.STRING, description: "Full physical address." },
    phone: { type: Type.STRING, description: "Primary contact phone number." },
    hours: { type: Type.STRING, description: "Opening hours, e.g., 'Mon-Fri 9am-6pm'." },
    delivery: { type: Type.BOOLEAN, description: "Does the business offer delivery services?" },
    priceRange: { type: Type.STRING, description: "A price range like $, $$, $$$, or $$$$." },
    negotiable: { type: Type.BOOLEAN, description: "Are the prices negotiable?" },
    category: { type: Type.STRING, enum: [...BusinessCategories], description: "Categorize the business type." },
    socialMedia: {
      type: Type.OBJECT,
      properties: {
        instagram: { type: Type.STRING, description: "Full URL to their Instagram page." },
        facebook: { type: Type.STRING, description: "Full URL to their Facebook page." },
        website: { type: Type.STRING, description: "Full URL to their official website." },
        twitter: { type: Type.STRING, description: "Full URL to their Twitter (X) page." },
        whatsapp: { type: Type.STRING, description: "WhatsApp business phone number in international format (e.g., +254712345678)." },
      },
    },
  },
};

const communityItemSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy title for the item for sale." },
    description: { type: Type.STRING, description: "A brief description of the item, its state, and why it's being sold." },
    price: { type: Type.STRING, description: "The asking price in KES, formatted like 'KES 15,000'." },
    condition: { type: Type.STRING, enum: ['New', 'Used - Like New', 'Used - Good', 'For Parts'], description: "The condition of the item." },
    category: { type: Type.STRING, enum: [...CommunityItemCategories], description: "The most relevant category for the item." },
    location: { type: Type.STRING, description: "The neighborhood where the item is located." },
    sellerName: { type: Type.STRING, description: "A plausible Kenyan first name for the seller." },
    negotiable: { type: Type.BOOLEAN, description: "Are the prices negotiable?" },
  }
};


export const findBusinesses = async (businessType: string, location: string): Promise<Omit<Business, 'id'>[]> => {
  checkApiKey();
  const prompt = `
    Act as a local business directory expert. I am looking for "${businessType}" in "${location}".
    Please find 3 to 5 relevant local businesses.
    For each business, provide all the requested details in the JSON schema. It is very important to correctly categorize each business from the provided enum. Include social media links like instagram, facebook, twitter, and a whatsapp number where available.
  `;

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: businessSchema
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "";
    if (!jsonText) {
        console.error("Gemini API returned an empty response for businesses.");
        return [];
    }

    const businesses: Omit<Business, 'id'>[] = JSON.parse(jsonText);
    return businesses;
  } catch (error) {
    console.error("Error fetching businesses from Gemini API:", error);
    throw new Error("Failed to find businesses. The AI may be busy, please try again.");
  }
};

export const findCommunityItems = async (location: string): Promise<Omit<CommunityItem, 'id' | 'status'>[]> => {
    checkApiKey();
    const prompt = `
      Act as a simulator for a Kenyan neighborhood marketplace called "Soko Mtaani".
      I am looking for second-hand items being sold by individuals in the "${location}" area.
      Please generate a list of 6 diverse items that people would realistically sell (e.g., electronics, furniture, appliances, clothing).
      For each item, provide all the requested details in the JSON schema. It is very important to choose the most relevant category from the enum. Make the descriptions and titles sound authentic.
      Do NOT generate an imageUrl. The category will be used to display an icon.
    `;
    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: communityItemSchema
                },
            },
        });

        const jsonText = response.text ? response.text.trim() : "";
        if (!jsonText) {
            console.error("Gemini API returned an empty response for community items.");
            return [];
        }
        return JSON.parse(jsonText);
    } catch(error) {
        console.error("Error fetching community items from Gemini API:", error);
        throw new Error("Failed to find community items.");
    }
};

export const getNegotiationTip = async (itemName: string, userMessage: string): Promise<string> => {
    checkApiKey();
    const prompt = `
        You are a friendly and savvy Kenyan negotiation assistant for an app called "Soko Link".
        A user is interested in an item named "${itemName}".
        The user's request is: "${userMessage}".

        Your goal is to provide helpful, actionable advice. Your response should be encouraging and formatted in simple markdown.
        - If they ask for a price, suggest a realistic range and a polite way to ask.
        - If they ask for a message draft, provide one in both English and Swahili.
        - Keep your response concise, friendly, and culturally relevant to a Kenyan market context.
        - Use emojis to make the response more engaging.

        Example response structure:
        "Great choice! For the ${itemName}, here's a tip 💡:
        
        **Price Suggestion:** A fair price would be around...
        
        **Opening Message (Swahili):**
        'Mambo vipi! Nimeona ${itemName} yako na nimeipenda sana. Kuna nafasi ya maongezi kidogo kwenye bei?'
        
        **Opening Message (English):**
        'Hello! I saw your ${itemName} and I'm very interested. Is the price slightly negotiable?'

        Remember to always be encouraging!
    `;

    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text ?? "";
    } catch (error) {
        console.error("Error fetching negotiation tip from Gemini API:", error);
        return "Sorry, I couldn't get a tip right now. The AI might be busy. Please try again in a moment. 🙏";
    }
};

export const getAIPriceSuggestion = async (itemName: string, itemDescription: string): Promise<string> => {
    checkApiKey();
    const prompt = `
        Act as a price suggestion expert for a Kenyan marketplace app.
        A user is listing an item and needs help with pricing.
        Item Title: "${itemName}"
        Item Description: "${itemDescription}"
        Based on this information, provide a realistic price range in Kenyan Shillings (KES).
        Return ONLY the numeric value for a suggested starting price. Do not include "KES" or any other text. Just the number.
        For example, if the suggested price is KES 15,000, you should return "15000".
    `;
    try {
        const response = await ai!.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        const price = response.text ? response.text.trim().replace(/[^0-9]/g, '') : ""; // Sanitize to ensure only numbers are returned
        return price || "0";
    } catch (error) {
        console.error("Error fetching price suggestion from Gemini API:", error);
        return "";
    }
};

export const getAIDescription = async (itemName: string): Promise<string> => {
    checkApiKey();
    const prompt = `
        Act as a creative copywriter for a Kenyan marketplace app.
        A user has provided a title for an item they want to sell: "${itemName}".
        Generate a compelling, friendly, and concise description (2-3 sentences) for this item.
        Highlight its potential benefits or condition. Make it sound authentic for a peer-to-peer sale.
    `;
    try {
        const response = await ai!.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        return response.text ? response.text.trim() : "";
    } catch (error) {
        console.error("Error fetching description from Gemini API:", error);
        return "";
    }
};
