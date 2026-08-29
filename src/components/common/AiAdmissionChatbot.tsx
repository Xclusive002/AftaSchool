import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiAdmissionChatbot: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I'm the AITI AI Admissions Consultant. Ask me anything about our 3-Month Certificate and 6-Month Diploma programs, 2026/2027 tuition fees, course schedules, or admission requirements in Ilorin!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await api.askVisitorAi(userText, messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text })));
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `For immediate assistance, please call our admissions line at ${settings?.contact.primaryPhone || '08030947468'} or send us a message on WhatsApp.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What is the tuition fee for Certificate & Diploma?",
    "Where is AITI campus located in Ilorin?",
    "How does the online application work?",
    "Do you offer weekend classes?"
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      {isOpen && (
        <div className="mb-3 w-84 sm:w-[400px] h-[520px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-md transition-all">
          {/* Header */}
          <div className="bg-linear-to-r from-cyan-600 to-sky-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center font-bold text-white border border-white/20">
                <Bot className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  AITI AI Admissions Advisor
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h4>
                <p className="text-[11px] text-cyan-100">Grounded in 2026/2027 AITI Programs</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/70 space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 ${
                      m.sender === 'user' ? 'text-cyan-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
                <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl rounded-tl-none border border-slate-700 text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInput(q); }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 px-2.5 py-1 rounded-full border border-cyan-900/50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about programs, admission, fees..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="aiti-ai-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-medium px-4 py-3 rounded-full shadow-xl shadow-cyan-950/40 hover:shadow-cyan-500/20 transition-all hover:scale-105"
      >
        <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
        <span className="text-sm font-semibold hidden sm:inline">AI Admission Advisor</span>
      </button>
    </div>
  );
};
