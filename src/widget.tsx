import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MessageSquare, Send, X, Leaf } from 'lucide-react';
import { handleUserMessage } from './chatbotEngine';
import type { ChatState, VolunteerData, Language } from './chatbotEngine';
import { isLlamaAvailable } from './services/llamaService';

interface WidgetMessage {
  id: string;
  text: string;
  isOutgoing: boolean;
  time: string;
  source?: 'form' | 'direct_faq' | 'llama_ai' | 'fallback';
}

function StandaloneChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([
    {
      id: 'init-1',
      text: "Hello! Welcome to Vasundhara Abhiyan (Baner-Pashan Hills, Pune). 🌿\nI am your Smart Green Companion. Ask me about our daily 7-9 AM volunteer drives, native trees, or 80G donations!",
      isOutgoing: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>('IDLE');
  const [tempData, setTempData] = useState<Partial<VolunteerData>>({});
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isTyping, setIsTyping] = useState(false);
  const isLlamaActive = isLlamaAvailable();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const getTimeString = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : input;
    if (!textToSend.trim()) return;

    const userText = textToSend;
    const msgTime = getTimeString();

    setMessages(prev => [
      ...prev,
      { id: `u-${Date.now()}`, text: userText, isOutgoing: true, time: msgTime }
    ]);
    if (customText === undefined) setInput('');
    setIsTyping(true);

    try {
      const response = await handleUserMessage(userText, chatState, tempData, currentLang);
      setChatState(response.nextState);
      setCurrentLang(response.detectedLanguage);

      const botReplies: WidgetMessage[] = response.messages.map((text, idx) => ({
        id: `b-${Date.now()}-${idx}`,
        text: text.startsWith('QR_CODE:') ? text.substring(8).trim() : text,
        isOutgoing: false,
        time: getTimeString(),
        source: response.source
      }));

      setMessages(prev => [...prev, ...botReplies]);

      if (response.action?.type === 'REGISTER_VOLUNTEER') {
        try {
          const existing = JSON.parse(localStorage.getItem('va_volunteers') || '[]');
          existing.unshift({
            id: String(Date.now()),
            ...response.action.data,
            lang: response.detectedLanguage,
            date: new Date().toLocaleString()
          });
          localStorage.setItem('va_volunteers', JSON.stringify(existing));
        } catch { }
        setTempData({});
      }

      if (response.isUnanswered) {
        try {
          const existing = JSON.parse(localStorage.getItem('va_unanswered_queries') || '[]');
          existing.unshift({
            id: `uq-${Date.now()}`,
            query: userText,
            time: getTimeString(),
            date: new Date().toLocaleDateString(),
            lang: response.detectedLanguage,
            resolved: false
          });
          localStorage.setItem('va_unanswered_queries', JSON.stringify(existing));
        } catch { }
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#005c35',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(0, 92, 53, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Chat with Vasundhara Green Bot"
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '560px',
          maxHeight: 'calc(100vh - 48px)',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#005c35',
            color: '#ffffff',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Leaf size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Vasundhara Bot</h4>
                  <span style={{
                    fontSize: '0.62rem',
                    background: isLlamaActive ? '#10b981' : 'rgba(255,255,255,0.25)',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 600
                  }}>
                    {isLlamaActive ? '⚡ Llama AI' : '🌱 Local FAQ'}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#d1fae5' }}>Online | English • हिंदी • मराठी</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#f8fafc'
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.isOutgoing ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.isOutgoing ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  backgroundColor: m.isOutgoing ? '#005c35' : '#ffffff',
                  color: m.isOutgoing ? '#ffffff' : '#1e293b',
                  padding: '10px 14px',
                  borderRadius: m.isOutgoing ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                  {!m.isOutgoing && m.source && m.source !== 'form' && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '0.65rem',
                      color: m.source === 'llama_ai' ? '#059669' : '#64748b',
                      fontWeight: 600
                    }}>
                      {m.source === 'llama_ai' ? '⚡ Generated by Llama 3.1' : '🌱 Verified NGO Knowledge'}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '8px 12px', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                Vasundhara Bot is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chips */}
          {chatState === 'IDLE' && (
            <div style={{
              display: 'flex',
              gap: '6px',
              padding: '8px 12px',
              overflowX: 'auto',
              backgroundColor: '#f1f5f9',
              borderTop: '1px solid #e2e8f0'
            }}>
              {[
                { label: '🌿 Trees', q: 'Which trees do you plant?' },
                { label: '🕒 Timings', q: 'What are the daily volunteer timings?' },
                { label: '💳 80G Tax', q: 'Are donations eligible for 80G tax exemption?' },
                { label: '📍 Location', q: 'Where is Tukai Hill located?' }
              ].map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(c.q)}
                  style={{
                    whiteSpace: 'nowrap',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    color: '#005c35',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '10px 12px',
              display: 'flex',
              gap: '8px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0'
            }}
          >
            <input
              type="text"
              placeholder="Ask in English, हिंदी, मराठी..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#005c35',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Auto mount on host website
if (typeof document !== 'undefined') {
  let mountContainer = document.getElementById('vasundhara-chat-widget');
  if (!mountContainer) {
    mountContainer = document.createElement('div');
    mountContainer.id = 'vasundhara-chat-widget';
    document.body.appendChild(mountContainer);
  }
  const root = createRoot(mountContainer);
  root.render(<StandaloneChatWidget />);
}

export default StandaloneChatWidget;
