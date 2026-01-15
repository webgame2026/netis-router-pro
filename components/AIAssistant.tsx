
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { routerService } from '../services/routerService';
import { RouterState } from '../types';
import { Bot, Send, User, Sparkles, Loader2, Info } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your Netis Pro AI Assistant. How can I help you optimize your network today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentState, setCurrentState] = useState<RouterState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    routerService.getStatus().then(setCurrentState);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Fix: Follow @google/genai initialization guidelines using process.env.API_KEY directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const logs = routerService.getLogs();
      
      const prompt = `
        You are a highly skilled Network Engineer AI specializing in Netis routers (Model: WF2409E).
        Current Router State: ${JSON.stringify(currentState)}
        Recent Logs: ${JSON.stringify(logs)}
        User Question: ${userMessage}
        Provide concise, helpful advice. Refer to devices by name/IP.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || "I'm sorry, I couldn't analyze the network at this moment.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI service. Please check your internet." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="netis-gradient p-4 md:p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot size={20} className="md:size-[24px]" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-lg">AI Assistant</h3>
            <p className="text-[10px] text-blue-100 opacity-80">Gemini 3 Flash</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
          <Sparkles size={12} className="animate-pulse" />
          Analysis Active
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50/50 no-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`flex gap-2.5 md:gap-3 max-w-[90%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow-sm text-slate-600 border'
              }`}>
                {m.role === 'user' ? <User size={14} className="md:size-[16px]" /> : <Bot size={14} className="md:size-[16px]" />}
              </div>
              <div className={`p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 bg-white border rounded-lg flex items-center justify-center text-slate-400">
                <Bot size={14} />
              </div>
              <div className="bg-white px-3 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 p-1.5 md:p-2 bg-slate-100 rounded-xl md:rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <input 
            type="text"
            className="flex-1 bg-transparent px-2 md:px-3 py-1.5 md:py-2 text-sm focus:outline-none placeholder:text-slate-400"
            placeholder="Ask AI..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['Network health?', 'Find slow devices', 'Fix Wi-Fi'].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold text-slate-500 hover:border-blue-300 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
