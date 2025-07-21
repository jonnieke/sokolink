

import React, { useState } from 'react';
import { SendIcon, XIcon, MailIcon } from 'lucide-react';

interface ContactSellerModalProps {
    itemName: string;
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
}

const ContactSellerModal: React.FC<ContactSellerModalProps> = ({ itemName, isOpen, onClose, onSend }) => {
    const [message, setMessage] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSend(message);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                        <MailIcon className="w-6 h-6 text-teal-500" />
                        <div>
                            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Contact Seller</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Regarding: {itemName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSend}>
                    <div className="p-4">
                        <label htmlFor="message-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Your Message
                        </label>
                        <textarea
                            id="message-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`e.g., "Hi, I'm interested in the ${itemName}. Is it still available?"`}
                            className="w-full h-32 rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 p-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                        <button type="submit" disabled={!message.trim()} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            <SendIcon className="w-5 h-5 mr-2" />
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactSellerModal;
