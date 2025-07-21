

import React, { useState, useEffect, useRef } from 'react';
import type { Conversation } from '../../types';
import { Role } from '../../types';
import { XIcon, MailIcon, ChevronDownIcon, SendIcon } from 'lucide-react';

interface BuyerInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onReply: (conversationId: string, text: string) => void;
  onMarkAsRead: (conversationId: string) => void;
}

const BuyerInboxModal: React.FC<BuyerInboxModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onReply,
  onMarkAsRead,
}) => {
  const [expandedConvoId, setExpandedConvoId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [expandedConvoId, conversations]);
  
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[80vh] max-h-[700px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <MailIcon className="w-6 h-6 text-teal-500" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Your Inbox</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
             <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't sent any messages yet.</p>
          ) : (
            conversations.map(convo => (
                <div key={convo.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                  <button onClick={() => handleToggle(convo)} className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center">
                      {!convo.isReadByBuyer && <span className="w-2 h-2 bg-teal-500 rounded-full mr-3 flex-shrink-0"></span>}
                      <div>
                        <p className={`font-semibold text-sm ${convo.isReadByBuyer ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
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
                             <div key={index} className={`flex items-start gap-2 ${msg.sender === Role.Buyer ? 'justify-end' : ''}`}>
                               <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg text-sm ${msg.sender === Role.Buyer ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-600'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === Role.Buyer ? 'text-teal-100' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                               </div>
                             </div>
                          ))}
                           <div ref={messagesEndRef} />
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
    </div>
  );
};

export default BuyerInboxModal;
