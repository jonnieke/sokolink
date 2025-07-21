
import React, { useState, useRef, useEffect } from 'react';
import { getNegotiationTip } from '../services/geminiService';
import { MessageCircleIcon, SendIcon, XIcon, SparklesIcon } from 'lucide-react';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface NegotiationModalProps {
    itemName: string;
    isOpen: boolean;
    onClose: () => void;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({ itemName, isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initialMessage: Message = {
        sender: 'ai',
        text: `Hello! I'm your AI negotiation assistant for **${itemName}**. Ask me for a fair price or help drafting a message! 💡`
    };

    useEffect(() => {
        if (isOpen) {
            setMessages([initialMessage]);
            setUserInput('');
        }
    }, [isOpen, itemName]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const aiResponseText = await getNegotiationTip(itemName, userInput);
        const newAiMessage: Message = { sender: 'ai', text: aiResponseText };
        
        setMessages(prev => [...prev, newAiMessage]);
        setIsLoading(false);
    };

    // Basic markdown to HTML renderer
    const renderMarkdown = (text: string) => {
        const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const listItems = bolded.replace(/-\s(.*?)(?:\n|$)/g, '<li>$1</li>');
        const wrappedList = listItems.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        return <div dangerouslySetInnerHTML={{ __html: wrappedList.replace(/\n/g, '<br />') }} />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[80vh] max-h-[700px]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                        <MessageCircleIcon className="w-6 h-6 text-teal-500" />
                        <div>
                            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">AI Negotiator</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">for {itemName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-teal-500" /></div>}
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                {renderMarkdown(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-teal-500" /></div>
                             <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask for help..."
                            className="flex-1 block w-full rounded-full border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="p-2 rounded-full text-white bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NegotiationModal;