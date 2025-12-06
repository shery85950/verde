import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { queryVerdeBot } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hi! I'm the Verde expert. Ask me anything about the paper, RepOps, or dispute resolution." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const answer = await queryVerdeBot(input);
    
    setMessages(prev => [...prev, { role: 'model', content: answer }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-coffee-800/95 backdrop-blur-xl border border-coffee-600 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up" style={{ height: '550px' }}>
          {/* Header */}
          <div className="bg-coffee-900/80 p-5 flex justify-between items-center border-b border-coffee-700">
             <div className="flex items-center space-x-3">
               <div className="bg-verde-800 p-2 rounded-full border border-verde-600/50">
                 <Bot size={20} className="text-verde-200" />
               </div>
               <span className="font-bold text-coffee-100">Verde Assistant</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-coffee-400 hover:text-coffee-100 transition-colors">
               <X size={20} />
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-coffee-600 scrollbar-track-transparent">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-verde-700 text-white rounded-br-none shadow-lg' : 'bg-coffee-700 text-coffee-100 rounded-bl-none border border-coffee-600'}`}>
                    {m.content}
                  </div>
               </div>
             ))}
             {loading && (
               <div className="flex justify-start">
                 <div className="bg-coffee-700 p-4 rounded-2xl rounded-bl-none flex space-x-1.5 border border-coffee-600">
                   <div className="w-2 h-2 bg-verde-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-verde-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-verde-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-coffee-700 bg-coffee-900/50">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Verde..."
                className="flex-1 bg-coffee-950 border border-coffee-600 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500 placeholder-coffee-600 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-verde-600 hover:bg-verde-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-verde-600 hover:bg-verde-500 text-white w-16 h-16 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:-rotate-12 border border-verde-400/30"
      >
        <MessageSquare size={28} className="group-hover:hidden" />
        <Bot size={28} className="hidden group-hover:block" />
      </button>
    </div>
  );
};

export default ChatBot;