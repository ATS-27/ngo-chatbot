import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Smartphone,
  LayoutDashboard,
  Globe,
  Users,
  DollarSign,
  Info,
  Clock,
  Leaf,
  Droplet,
  Download,
  Sparkles,
  Lock,
  LogOut,
  Copy,
  Check,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { handleUserMessage } from './chatbotEngine';
import type { ChatState, VolunteerData, Language } from './chatbotEngine';
import { isLlamaAvailable } from './services/llamaService';

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
  time: string;
  isDonationLinks?: boolean;
  imageUrl?: string;
  source?: 'form' | 'direct_faq' | 'llama_ai' | 'fallback';
}

interface VolunteerRecord extends VolunteerData {
  id: string;
  lang: Language;
  date: string;
}

interface ActivityLog {
  id: string;
  type: 'volunteer' | 'donation' | 'qa';
  detail: string;
  time: string;
  lang: Language;
}

interface UnansweredQuery {
  id: string;
  query: string;
  time: string;
  date: string;
  lang: Language;
  resolved: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'website' | 'whatsapp' | 'admin'>('website');
  const [activeSection, setActiveSection] = useState('home');
  const [isLlamaActive] = useState<boolean>(isLlamaAvailable());

  // Share DB State with localStorage persistence
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('va_volunteers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read volunteers from localStorage', e);
    }
    return [
      {
        id: '1',
        name: 'Amit Deshmukh',
        email: 'amit.d@example.com',
        phone: '9822314567',
        address: 'Pashan, Pune',
        lang: 'mr',
        date: '2026-07-12, 11:20 AM'
      },
      {
        id: '2',
        name: 'Pooja Sharma',
        email: 'pooja.s@example.com',
        phone: '9545300221',
        address: 'Baner Road, Pune',
        lang: 'hi',
        date: '2026-07-12, 02:15 PM'
      }
    ];
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('va_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read logs from localStorage', e);
    }
    return [
      {
        id: '1',
        type: 'volunteer',
        detail: 'Amit Deshmukh signed up as a volunteer (Marathi)',
        time: '11:20 AM',
        lang: 'mr'
      },
      {
        id: '2',
        type: 'volunteer',
        detail: 'Pooja Sharma signed up as a volunteer (Hindi)',
        time: '02:15 PM',
        lang: 'hi'
      },
      {
        id: '3',
        type: 'qa',
        detail: 'User requested contact information (English)',
        time: '04:02 PM',
        lang: 'en'
      }
    ];
  });

  const [donationClicks, setDonationClicks] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('va_donation_clicks');
      if (saved) return Number(saved);
    } catch (e) {
      console.warn('Could not read donation clicks', e);
    }
    return 14;
  });

  const [langStats, setLangStats] = useState<Record<Language, number>>(() => {
    try {
      const saved = localStorage.getItem('va_lang_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read lang stats', e);
    }
    return {
      en: 25,
      hi: 18,
      mr: 20
    };
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('va_volunteers', JSON.stringify(volunteers));
    } catch { }
  }, [volunteers]);

  useEffect(() => {
    try {
      localStorage.setItem('va_logs', JSON.stringify(logs));
    } catch { }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('va_donation_clicks', String(donationClicks));
    } catch { }
  }, [donationClicks]);

  useEffect(() => {
    try {
      localStorage.setItem('va_lang_stats', JSON.stringify(langStats));
    } catch { }
  }, [langStats]);

  // Unanswered queries auto-tracker state
  const [unansweredQueries, setUnansweredQueries] = useState<UnansweredQuery[]>(() => {
    try {
      const saved = localStorage.getItem('va_unanswered_queries');
      if (saved) return JSON.parse(saved);
    } catch { }
    return [
      {
        id: 'uq-1',
        query: 'Can I bring my pet dog to the morning plantation drive?',
        time: '09:15 AM',
        date: '2026-10-07',
        lang: 'en',
        resolved: false
      },
      {
        id: 'uq-2',
        query: 'झाडे दत्तक घेण्याची ऑनलाइन पावती कशी मिळेल?',
        time: '11:40 AM',
        date: '2026-10-08',
        lang: 'mr',
        resolved: false
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('va_unanswered_queries', JSON.stringify(unansweredQueries));
    } catch { }
  }, [unansweredQueries]);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('va_admin_auth') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [embedCopied, setEmbedCopied] = useState(false);

  // Chat States - Website Widget
  const [webChatOpen, setWebChatOpen] = useState(false);
  const [isWebTyping, setIsWebTyping] = useState(false);
  const [webMessages, setWebMessages] = useState<Message[]>([
    {
      id: 'w-1',
      text: "Welcome to Vasundhara Abhiyan (Baner, Pune). 🌿\nI am your Smart Green Companion. How can I help you today?\n\nAsk me anything in English, हिंदी, or मराठी about our daily 7-9 AM volunteer drives, native trees, Section 80G donations, or Tukai Hill directions!",
      isOutgoing: false,
      time: '08:30 PM'
    }
  ]);
  const [webInput, setWebInput] = useState('');
  const [webChatState, setWebChatState] = useState<ChatState>('IDLE');
  const [webTempData, setWebTempData] = useState<Partial<VolunteerData>>({});
  const [webLang, setWebLang] = useState<Language>('en');

  // Chat States - WhatsApp Simulator
  const [isWaTyping, setIsWaTyping] = useState(false);
  const [waMessages, setWaMessages] = useState<Message[]>([
    {
      id: 'a-1',
      text: "Welcome to Vasundhara Abhiyan (Baner, Pune). 🌿\nI am your Smart Green Companion. How can I help you today?\n\nFeel free to ask questions about volunteering, donations, or tree species in English, हिंदी, or मराठी!",
      isOutgoing: false,
      time: '08:30 PM'
    }
  ]);
  const [waInput, setWaInput] = useState('');
  const [waChatState, setWaChatState] = useState<ChatState>('IDLE');
  const [waTempData, setWaTempData] = useState<Partial<VolunteerData>>({});
  const [waLang, setWaLang] = useState<Language>('en');

  // Refs for auto scrolling chats
  const webChatEndRef = useRef<HTMLDivElement>(null);
  const waChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    webChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [webMessages, webChatOpen]);

  useEffect(() => {
    waChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [waMessages]);

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const exportVolunteersToCSV = () => {
    if (volunteers.length === 0) {
      alert("No volunteers registered yet to export.");
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Language', 'Registered Date'];
    const rows = volunteers.map(v => [
      `"${v.id}"`,
      `"${v.name.replace(/"/g, '""')}"`,
      `"${v.email.replace(/"/g, '""')}"`,
      `"${v.phone}"`,
      `"${v.address.replace(/"/g, '""')}"`,
      `"${v.lang}"`,
      `"${v.date}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vasundhara_volunteers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process Website Chat Messages
  const handleSendWebMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText : webInput;
    if (!textToSend.trim()) return;

    const userText = textToSend;
    const msgTime = getTimeString();

    // 1. Add User Message
    const userMsgId = `w-u-${Date.now()}`;
    setWebMessages(prev => [...prev, { id: userMsgId, text: userText, isOutgoing: true, time: msgTime }]);
    if (customText === undefined) setWebInput('');

    setIsWebTyping(true);

    try {
      const response = await handleUserMessage(userText, webChatState, webTempData, webLang);

      // Update states
      setWebChatState(response.nextState);
      setWebLang(response.detectedLanguage);

      // Increment analytics stats
      setLangStats(prev => ({
        ...prev,
        [response.detectedLanguage]: prev[response.detectedLanguage] + 1
      }));

      // Create Bot Messages
      const botResponses = response.messages.map((text, idx) => {
        const isQr = text.startsWith('QR_CODE:');
        return {
          id: `w-b-${Date.now()}-${idx}`,
          text: isQr ? text.substring(8).trim() : text,
          isOutgoing: false,
          time: getTimeString(),
          isDonationLinks: response.action?.type === 'SEND_DONATION_LINKS',
          imageUrl: isQr ? '/qr-code.png' : undefined,
          source: response.source
        };
      });

      setWebMessages(prev => [...prev, ...botResponses]);

      // Handle custom engine actions
      if (response.action) {
        if (response.action.type === 'REGISTER_VOLUNTEER') {
          const vData = response.action.data as VolunteerData;
          const newVol: VolunteerRecord = {
            id: String(volunteers.length + 1),
            ...vData,
            lang: response.detectedLanguage,
            date: new Date().toLocaleString()
          };
          setVolunteers(prev => [newVol, ...prev]);
          setLogs(prev => [
            {
              id: String(Date.now()),
              type: 'volunteer',
              detail: `${vData.name} registered as a volunteer (${response.detectedLanguage.toUpperCase()})`,
              time: getTimeString(),
              lang: response.detectedLanguage
            },
            ...prev
          ]);
          setWebTempData({});
        } else if (response.action.type === 'SEND_DONATION_LINKS') {
          setDonationClicks(prev => prev + 1);
          setLogs(prev => [
            {
              id: String(Date.now()),
              type: 'donation',
              detail: `Donation links requested (${response.detectedLanguage.toUpperCase()})`,
              time: getTimeString(),
              lang: response.detectedLanguage
            },
            ...prev
          ]);
        }
      } else {
        // Log Q&A interaction
        setLogs(prev => [
          {
            id: String(Date.now()),
            type: 'qa',
            detail: `${response.source === 'llama_ai' ? '[Llama AI]' : '[FAQ]'} "${userText.substring(0, 30)}${userText.length > 30 ? '...' : ''}"`,
            time: getTimeString(),
            lang: response.detectedLanguage
          },
          ...prev
        ]);

        // Auto Unanswered Query Tracking
        if (response.isUnanswered) {
          setUnansweredQueries(prev => [
            {
              id: `uq-${Date.now()}`,
              query: userText,
              time: getTimeString(),
              date: new Date().toLocaleDateString(),
              lang: response.detectedLanguage,
              resolved: false
            },
            ...prev
          ]);
        }
      }
    } finally {
      setIsWebTyping(false);
    }
  };

  // Process WhatsApp Chat Messages
  const handleSendWaMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!waInput.trim()) return;

    const userText = waInput;
    const msgTime = getTimeString();

    // 1. Add User Message
    const userMsgId = `wa-u-${Date.now()}`;
    setWaMessages(prev => [...prev, { id: userMsgId, text: userText, isOutgoing: true, time: msgTime }]);
    setWaInput('');
    setIsWaTyping(true);

    try {
      const response = await handleUserMessage(userText, waChatState, waTempData, waLang);

      // Update states
      setWaChatState(response.nextState);
      setWaLang(response.detectedLanguage);

      // Increment analytics stats
      setLangStats(prev => ({
        ...prev,
        [response.detectedLanguage]: prev[response.detectedLanguage] + 1
      }));

      // Create Bot Messages
      const botResponses = response.messages.map((text, idx) => {
        const isQr = text.startsWith('QR_CODE:');
        return {
          id: `wa-b-${Date.now()}-${idx}`,
          text: isQr ? text.substring(8).trim() : text,
          isOutgoing: false,
          time: getTimeString(),
          isDonationLinks: response.action?.type === 'SEND_DONATION_LINKS',
          imageUrl: isQr ? '/qr-code.png' : undefined,
          source: response.source
        };
      });

      setWaMessages(prev => [...prev, ...botResponses]);

      // Handle custom engine actions
      if (response.action) {
        if (response.action.type === 'REGISTER_VOLUNTEER') {
          const vData = response.action.data as VolunteerData;
          const newVol: VolunteerRecord = {
            id: String(volunteers.length + 1),
            ...vData,
            lang: response.detectedLanguage,
            date: new Date().toLocaleString()
          };
          setVolunteers(prev => [newVol, ...prev]);
          setLogs(prev => [
            {
              id: String(Date.now()),
              type: 'volunteer',
              detail: `${vData.name} registered as a volunteer via WhatsApp (${response.detectedLanguage.toUpperCase()})`,
              time: getTimeString(),
              lang: response.detectedLanguage
            },
            ...prev
          ]);
          setWaTempData({});
        } else if (response.action.type === 'SEND_DONATION_LINKS') {
          setDonationClicks(prev => prev + 1);
          setLogs(prev => [
            {
              id: String(Date.now()),
              type: 'donation',
              detail: `Donation links requested via WhatsApp (${response.detectedLanguage.toUpperCase()})`,
              time: getTimeString(),
              lang: response.detectedLanguage
            },
            ...prev
          ]);
        }
        // Log Q&A interaction
        setLogs(prev => [
          {
            id: String(Date.now()),
            type: 'qa',
            detail: `WhatsApp query processed: "${userText.substring(0, 30)}${userText.length > 30 ? '...' : ''}"`,
            time: getTimeString(),
            lang: response.detectedLanguage
          },
          ...prev
        ]);

        // Auto Unanswered Query Tracking
        if (response.isUnanswered) {
          setUnansweredQueries(prev => [
            {
              id: `uq-${Date.now()}`,
              query: userText,
              time: getTimeString(),
              date: new Date().toLocaleDateString(),
              lang: response.detectedLanguage,
              resolved: false
            },
            ...prev
          ]);
        }
      }
    } finally {
      setIsWaTyping(false);
    }
  };


  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-img">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="logo-icon" style={{ width: '100%', height: '100%', color: '#005c35' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="logo-text">
            <h1>Vasundhara</h1>
            <span>CHATBOT PANEL</span>
          </div>
        </div>

        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'website' ? 'active' : ''}`}
            onClick={() => setActiveTab('website')}
          >
            <Globe size={20} />
            NGO Website
          </button>

          <button
            className={`nav-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <Smartphone size={20} />
            WhatsApp Chat
          </button>

          <button
            className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <LayoutDashboard size={20} />
            Admin Panel
          </button>
        </div>

        <div className="sidebar-footer">
          <p>© 2026 Vasundhara Abhiyan</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>Multilingual Smart Bot v2.0</p>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <main className="main-panel">

        {/* VIEW 1: WEBSITE PREVIEW */}
        {activeTab === 'website' && (
          <div className="website-preview">
            <header className="web-header">
              <div className="web-logo">
                <Leaf size={24} color="#005c35" />
                <span className="web-logo-text">Vasundhara Abhiyan</span>
              </div>
              <nav className="web-nav">
                <a
                  href="#home"
                  className={activeSection === 'home' ? 'active' : ''}
                  onClick={(e) => scrollToSection('home', e)}
                >
                  Home
                </a>
                <a
                  href="#about"
                  className={activeSection === 'about' ? 'active' : ''}
                  onClick={(e) => scrollToSection('about', e)}
                >
                  About Tukai Hill
                </a>
                <a
                  href="#initiatives"
                  className={activeSection === 'initiatives' ? 'active' : ''}
                  onClick={(e) => scrollToSection('initiatives', e)}
                >
                  Initiatives
                </a>
                <a
                  href="#contact"
                  className={activeSection === 'contact' ? 'active' : ''}
                  onClick={(e) => scrollToSection('contact', e)}
                >
                  Contact
                </a>
                <button
                  className="web-btn-donate"
                  onClick={() => {
                    setWebChatOpen(true);
                    setWebMessages(prev => [
                      ...prev,
                      {
                        id: `w-d-${Date.now()}`,
                        text: "I clicked 'Donate Now' on the website.",
                        isOutgoing: true,
                        time: getTimeString()
                      },
                      {
                        id: `w-d-bot-info-${Date.now()}`,
                        text: "Thank you for your generous support! 🙏 Your contribution will help us plant and nurture native trees on the Baner-Pashan Hills. Here are your payment options:",
                        isOutgoing: false,
                        time: getTimeString()
                      },
                      {
                        id: `w-d-bot-qr-${Date.now()}`,
                        text: "📱 UPI (Google Pay, PhonePe, Paytm): eazypay.OPCH8Q0NYA45HZT@icici",
                        isOutgoing: false,
                        time: getTimeString(),
                        imageUrl: '/qr-code.png'
                      },
                      {
                        id: `w-d-bot-bank-${Date.now()}`,
                        text: "🏛 Bank Transfer Details:\n\nYou can also transfer your contribution to Vasundhara Abhiyan Baner bank account.\n\nVasundhara Abhiyan Baner\n\nBank: ICICI Bank LTD\nBeneficiary Name: Vasundhara Abhiyan Baner\nAccount No.:  624001082227\nRTGS / NEFT / IFSC:  ICIC0006240\nAccount Type: Current\n\nWrite to us at vasundharaabhiyan2006@gmail.com after transferring your contribution.",
                        isOutgoing: false,
                        time: getTimeString()
                      }
                    ]);
                    setDonationClicks(prev => prev + 1);
                    setLogs(prev => [
                      {
                        id: String(Date.now()),
                        type: 'donation',
                        detail: 'User clicked website Donate button, opening chatbot donation links',
                        time: getTimeString(),
                        lang: 'en'
                      },
                      ...prev
                    ]);
                  }}
                >
                  Donate Now
                </button>
              </nav>
            </header>

            <section id="home" className="hero-section">
              <div className="hero-content">
                <span className="hero-tag">Registered NGO | Pune, India</span>
                <h1 className="hero-title">Transforming Baner-Pashan Hill Into A Green Oasis</h1>
                <p className="hero-subtitle">
                  We have planted over 40,000 native trees since 2006. Join our daily volunteer drives from 7:00 AM to 9:00 AM to conserve water, enrich soil, and nurture local biodiversity.
                </p>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={() => {
                    setWebChatOpen(true);
                    setWebMessages(prev => [
                      ...prev,
                      {
                        id: `w-v-${Date.now()}`,
                        text: "I want to volunteer!",
                        isOutgoing: true,
                        time: getTimeString()
                      }
                    ]);
                    setWebChatState('VOLUNTEER_NAME');
                    setWebMessages(prev => [
                      ...prev,
                      {
                        id: `w-v-bot-${Date.now()}`,
                        text: "Wonderful! To register you as a volunteer, please enter your Full Name:",
                        isOutgoing: false,
                        time: getTimeString()
                      }
                    ]);
                  }}>
                    Volunteer Daily Seva
                  </button>
                  <button className="btn-secondary" onClick={() => setWebChatOpen(true)}>
                    Chat with Green Bot
                  </button>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
              <div className="about-container">
                <div className="about-content">
                  <span className="section-tag">About Tukai Hill</span>
                  <h2>A Sacred Grove Turned Biodiversity Sanctuary</h2>
                  <p>
                    Tukai Hill (Baner-Pashan Hills) was once a barren, rocky landscape suffering from heavy soil erosion. Since 2006, Vasundhara Abhiyan has transformed this dry land into a thriving ecosystem. Today, it hosts thousands of flourishing trees, recharges groundwater, and serves as a micro-climate buffer for Pune.
                  </p>
                  <div className="about-highlights">
                    <div className="highlight-item">
                      <strong>Sacred Heritage:</strong> Home to the historic Tukai Devi temple, blending spiritual heritage with ecological conservation.
                    </div>
                    <div className="highlight-item">
                      <strong>Soil & Water:</strong> Built over 5,000 meters of trenches to capture every drop of monsoon rain.
                    </div>
                  </div>
                </div>
                <div className="about-image-card">
                  <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80" alt="Lush Forest Canopy" className="about-img" />
                </div>
              </div>
            </section>

            <section id="initiatives" className="features-section">
              <div className="section-header">
                <h2>Our Ecosystem Restoration Projects</h2>
                <p>Simple daily acts build sustainable, breathing green lungs for Pune city.</p>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <Leaf size={28} />
                  </div>
                  <h3>Native Afforestation</h3>
                  <p>Planting native species like Neem, Amla, Banyan, and Tamarind to build resilient forest cover that sustains birds, bees, and butterflies.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <Droplet size={28} />
                  </div>
                  <h3>Rainwater Harvesting</h3>
                  <p>Building continuous contour trenches, check dams, and water reservoirs to recharge groundwater and sustain dry-season growth.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <Users size={28} />
                  </div>
                  <h3>Citizens Movement</h3>
                  <p>Uniting corporate CSR partners, school field tours, and individual citizens who give 2 hours daily of voluntary physical work on the hills.</p>
                </div>
              </div>
            </section>

            <section className="stats-section">
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>40,000+</h3>
                  <p>Native Trees Planted</p>
                </div>
                <div className="stat-item">
                  <h3>350+</h3>
                  <p>Biodiversity Species</p>
                </div>
                <div className="stat-item">
                  <h3>20 Years</h3>
                  <p>Environmental Action</p>
                </div>
                <div className="stat-item">
                  <h3>500+</h3>
                  <p>Active Volunteers</p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
              <div className="contact-container">
                <div className="contact-info-panel">
                  <span className="section-tag">Get in Touch</span>
                  <h2>Join the Green Revolution</h2>
                  <p>Have questions about volunteering, donation receipts, or school plantation visits? Feel free to contact us or visit our daily morning drives.</p>

                  <div className="contact-details-list">
                    <div className="contact-detail-item">
                      <strong>📍 Location:</strong>
                      <span>Baner-Pashan Hills (Tukai Hill), Pune, MH, India</span>
                    </div>
                    <div className="contact-detail-item">
                      <strong>🕒 Work Timings:</strong>
                      <span>Every day from 7:00 AM to 9:00 AM</span>
                    </div>
                    <div className="contact-detail-item">
                      <strong>📞 Phone:</strong>
                      <span>+91 9882 501 501</span>
                    </div>
                    <div className="contact-detail-item">
                      <strong>✉️ Email:</strong>
                      <span>vasundharaabhiyan2006@gmail.com</span>
                    </div>
                  </div>
                </div>
                <div className="contact-form-panel">
                  <h3>Send a Quick Inquiry</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thank you! Your inquiry has been sent. We will get back to you shortly.");
                    setLogs(prev => [
                      {
                        id: String(Date.now()),
                        type: 'qa',
                        detail: 'User submitted a contact form inquiry on the preview website',
                        time: getTimeString(),
                        lang: 'en'
                      },
                      ...prev
                    ]);
                    (e.target as HTMLFormElement).reset();
                  }}>
                    <input type="text" placeholder="Your Name" required className="contact-input" />
                    <input type="email" placeholder="Your Email" required className="contact-input" />
                    <textarea placeholder="How can we help you?" required className="contact-textarea" rows={4}></textarea>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
                  </form>
                </div>
              </div>
            </section>

            {/* Float Chat Widget Button */}
            <button className="chat-widget-trigger" onClick={() => setWebChatOpen(!webChatOpen)}>
              {webChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>

            {/* Chat Widget Window */}
            {webChatOpen && (
              <div className="chat-widget-window">
                <div className="chat-header">
                  <div className="chat-bot-profile">
                    <div className="chat-bot-avatar">
                      <Leaf size={18} color="white" />
                      <div className="online-dot" />
                    </div>
                    <div className="chat-bot-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h4 style={{ margin: 0 }}>Vasundhara Bot</h4>
                        <span style={{
                          fontSize: '0.65rem',
                          background: isLlamaActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.2)',
                          color: isLlamaActive ? '#10b981' : '#ffffff',
                          padding: '1px 7px',
                          borderRadius: '12px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          {isLlamaActive ? <><Sparkles size={10} /> Llama 3.1 AI</> : '🌱 Local FAQ DB'}
                        </span>
                      </div>
                      <span>Online | English • हिंदी • मराठी</span>
                    </div>
                  </div>
                  <div className="chat-header-actions">
                    <button onClick={() => setWebChatOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* 1-Click Language Switcher Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 12px',
                  backgroundColor: '#004729',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ fontSize: '0.7rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Globe size={12} /> Language:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { code: 'en', label: 'English', trigger: 'lang:en' },
                      { code: 'hi', label: 'हिंदी', trigger: 'lang:hi' },
                      { code: 'mr', label: 'मराठी', trigger: 'lang:mr' }
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleSendWebMessage(undefined, l.trigger)}
                        style={{
                          background: webLang === l.code ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: webLang === l.code ? 700 : 400,
                          padding: '1px 7px',
                          cursor: 'pointer'
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="chat-messages">
                  {webMessages.map((msg) => (
                    <div key={msg.id} className={`msg-wrapper ${msg.isOutgoing ? 'outgoing' : 'incoming'}`}>
                      <div className="chat-msg">
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        {msg.imageUrl && (
                          <div className="chat-image-wrapper" style={{ marginTop: '0.75rem', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={msg.imageUrl} alt="Attached Media" style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '6px' }} />
                          </div>
                        )}
                        {!msg.isOutgoing && msg.source && msg.source !== 'form' && (
                          <div style={{
                            marginTop: '0.4rem',
                            fontSize: '0.65rem',
                            color: msg.source === 'llama_ai' ? '#059669' : '#475569',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {msg.source === 'llama_ai' ? (
                              <><Sparkles size={10} /> Answered by Llama 3.1 (Grounded)</>
                            ) : (
                              <>🌱 Verified Vasundhara Knowledge Base</>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="msg-meta">{msg.time}</span>
                    </div>
                  ))}

                  {isWebTyping && (
                    <div className="msg-wrapper incoming">
                      <div className="chat-msg" style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>
                        {isLlamaActive ? "Vasundhara Bot (Llama 3.1) is thinking..." : "Searching local knowledge base..."}
                      </div>
                    </div>
                  )}

                  <div ref={webChatEndRef} />
                </div>

                {/* Quick Suggestion Pills */}
                {webChatState === 'IDLE' && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    padding: '0.5rem 0.75rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    {[
                      { label: "🌿 Native Trees?", q: "Which native trees do you plant?" },
                      { label: "🕒 Daily Timings?", q: "What are the daily volunteer timings?" },
                      { label: "🎒 What to Wear?", q: "What should I wear and bring for volunteering?" },
                      { label: "📜 Student Certificate?", q: "Do students get volunteer certificates?" },
                      { label: "💳 80G Tax Exemption?", q: "Are donations eligible for 80G tax exemption?" },
                      { label: "📍 How to Reach?", q: "How do I reach Tukai Hill and where is parking?" }
                    ].map((pill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendWebMessage(undefined, pill.q)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '16px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          color: '#005c35',
                          cursor: 'pointer',
                          fontWeight: 500,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#005c35';
                          e.currentTarget.style.background = '#ecfdf5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                )}

                <form className="chat-input-bar" onSubmit={(e) => handleSendWebMessage(e)}>
                  <input
                    type="text"
                    placeholder="Type in English, Hindi, or Marathi..."
                    value={webInput}
                    onChange={(e) => setWebInput(e.target.value)}
                  />
                  <button type="submit">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: WHATSAPP WEB SIMULATOR */}
        {activeTab === 'whatsapp' && (
          <div className="whatsapp-simulator">
            <div className="wa-container">
              {/* WhatsApp Sidebar */}
              <div className="wa-sidebar">
                <div className="wa-sidebar-header">
                  <div className="wa-profile-pic">U</div>
                  <div className="wa-sidebar-icons">
                    <MessageSquare size={20} />
                    <span style={{ fontSize: '1.25rem', lineHeight: '1', cursor: 'pointer' }}>⋮</span>
                  </div>
                </div>

                <div className="wa-search">
                  <div className="wa-search-box">
                    <input type="text" placeholder="Search or start new chat" disabled />
                  </div>
                </div>

                <div className="wa-chats-list">
                  <div className="wa-chat-item">
                    <div className="wa-profile-pic" style={{ backgroundColor: '#005c4b', fontSize: '0.85rem' }}>VA</div>
                    <div className="wa-chat-info">
                      <div className="wa-chat-title-time">
                        <h4>Vasundhara Abhiyan</h4>
                        <span>{getTimeString()}</span>
                      </div>
                      <p>🌿 Online companion for tree planting...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Main Section */}
              <div className="wa-main-chat">
                <div className="wa-chat-header">
                  <div className="wa-chat-header-info">
                    <div className="wa-profile-pic" style={{ backgroundColor: '#005c4b', width: '38px', height: '38px', fontSize: '0.8rem' }}>VA</div>
                    <div className="wa-chat-header-text">
                      <h4>Vasundhara Abhiyan Support</h4>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Online</span>
                    </div>
                  </div>
                  <div className="wa-chat-header-icons">
                    <span style={{ marginRight: '0.5rem' }}>🔍</span>
                    <span>⋮</span>
                  </div>
                </div>

                {/* Messages Panel */}
                <div className="wa-messages-area">
                  {waMessages.map((msg) => (
                    <div key={msg.id} className={`wa-msg-wrapper ${msg.isOutgoing ? 'outgoing' : 'incoming'}`}>
                      <div className="wa-bubble">
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        {msg.imageUrl && (
                          <div className="chat-image-wrapper" style={{ marginTop: '0.75rem', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={msg.imageUrl} alt="Attached Media" style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '6px' }} />
                          </div>
                        )}
                        <div className="wa-time-tick">
                          <span>{msg.time}</span>
                          {msg.isOutgoing && <span style={{ color: '#53bdeb' }}>✓✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isWaTyping && (
                    <div className="wa-msg-wrapper incoming">
                      <div className="wa-bubble" style={{ fontStyle: 'italic', color: '#667781', fontSize: '0.85rem' }}>
                        Typing...
                      </div>
                    </div>
                  )}

                  <div ref={waChatEndRef} />
                </div>

                {/* Input Panel */}
                <form className="wa-input-area" onSubmit={handleSendWaMessage}>
                  <input
                    type="text"
                    placeholder="Type a message (supports English, हिंदी, मराठी)..."
                    value={waInput}
                    onChange={(e) => setWaInput(e.target.value)}
                  />
                  <button type="submit" className="wa-send-btn">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ADMIN PANEL (Secured) */}
        {activeTab === 'admin' && (
          <>
            {!isAdminAuthenticated ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '75vh',
                padding: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  padding: '2.5rem',
                  maxWidth: '420px',
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#005c35',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Lock size={32} />
                  </div>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                    Admin Command Center
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Secured portal for Vasundhara Abhiyan coordinators. Please sign in to view volunteer leads, audit logs, and unanswered queries.
                  </p>

                  {adminLoginError && (
                    <div style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      marginBottom: '1rem',
                      border: '1px solid #fecaca'
                    }}>
                      {adminLoginError}
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (adminUsername.trim() === 'admin' && adminPassword === 'vasundhara@2026') {
                      setIsAdminAuthenticated(true);
                      sessionStorage.setItem('va_admin_auth', 'true');
                      setAdminLoginError('');
                    } else {
                      setAdminLoginError('Invalid credentials. Check the hint below.');
                    }
                  }}>
                    <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="admin"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#005c35',
                        color: '#ffffff',
                        fontWeight: 700,
                        border: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      Sign In to Portal
                    </button>
                  </form>

                  <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    border: '1px dashed #cbd5e1',
                    textAlign: 'left'
                  }}>
                    <div style={{ fontWeight: 600, color: '#005c35', marginBottom: '2px' }}>🔑 Default Demo Credentials:</div>
                    <div>Username: <code>admin</code></div>
                    <div>Password: <code>vasundhara@2026</code></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="admin-dashboard">
                <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2>Chatbot Command Center</h2>
                    <p>Real-time volunteer leads, donation links tracker, and NLP analytics overview.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      sessionStorage.removeItem('va_admin_auth');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.9rem',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <div className="dashboard-card">
                    <div className="card-info">
                      <h4>Total Volunteers</h4>
                      <h3>{volunteers.length}</h3>
                    </div>
                    <div className="card-icon">
                      <Users size={24} />
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-info">
                      <h4>Payment Clicks</h4>
                      <h3>{donationClicks}</h3>
                    </div>
                    <div className="card-icon">
                      <DollarSign size={24} />
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-info">
                      <h4>Total Queries</h4>
                      <h3>{logs.length}</h3>
                    </div>
                    <div className="card-icon">
                      <MessageSquare size={24} />
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-info">
                      <h4>Core Language</h4>
                      <h3>
                        {Object.entries(langStats).reduce((a, b) => (a[1] > b[1] ? a : b))[0].toUpperCase()}
                      </h3>
                    </div>
                    <div className="card-icon">
                      <Globe size={24} />
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-info">
                      <h4>Unanswered Queries</h4>
                      <h3 style={{ color: unansweredQueries.filter(q => !q.resolved).length > 0 ? '#ea580c' : '#005c35' }}>
                        {unansweredQueries.filter(q => !q.resolved).length}
                      </h3>
                    </div>
                    <div className="card-icon" style={{ backgroundColor: unansweredQueries.filter(q => !q.resolved).length > 0 ? '#fff7ed' : '#ecfdf5', color: unansweredQueries.filter(q => !q.resolved).length > 0 ? '#ea580c' : '#005c35' }}>
                      <HelpCircle size={24} />
                    </div>
                  </div>
                </div>

                <div className="dashboard-panels">
                  {/* Volunteers Data */}
                  <div className="panel-container">
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>
                        <Users size={20} color="#005c35" />
                        Volunteer Registrations Lead List ({volunteers.length})
                      </h3>
                      <button
                        onClick={exportVolunteersToCSV}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.4rem 0.85rem',
                          backgroundColor: '#005c35',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d8a54'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005c35'}
                        title="Download volunteer leads spreadsheet"
                      >
                        <Download size={14} />
                        Export to CSV
                      </button>
                    </div>

                    <div className="table-wrapper">
                      {volunteers.length === 0 ? (
                        <div className="empty-state">No volunteers registered yet.</div>
                      ) : (
                        <table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Address</th>
                              <th>Language</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {volunteers.map((vol) => (
                              <tr key={vol.id}>
                                <td style={{ fontWeight: 600 }}>{vol.name}</td>
                                <td>{vol.email}</td>
                                <td>{vol.phone}</td>
                                <td>{vol.address}</td>
                                <td>
                                  <span className={`td-badge ${vol.lang}`}>
                                    {vol.lang === 'mr' ? 'Marathi' : vol.lang === 'hi' ? 'Hindi' : 'English'}
                                  </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{vol.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Unanswered Queries Tracker */}
                  <div className="panel-container">
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>
                        <HelpCircle size={20} color="#ea580c" />
                        Auto-Tracked Unanswered Visitor Queries ({unansweredQueries.filter(q => !q.resolved).length} Pending)
                      </h3>
                      {unansweredQueries.length > 0 && (
                        <button
                          onClick={() => {
                            if (confirm('Clear all resolved queries?')) {
                              setUnansweredQueries(prev => prev.filter(q => !q.resolved));
                            }
                          }}
                          style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            background: 'transparent',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          Clear Resolved
                        </button>
                      )}
                    </div>

                    <div className="table-wrapper">
                      {unansweredQueries.length === 0 ? (
                        <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#10b981' }}>
                          🎉 Great job! No unanswered queries currently recorded.
                        </div>
                      ) : (
                        <table>
                          <thead>
                            <tr>
                              <th>Visitor Question</th>
                              <th>Language</th>
                              <th>Date & Time</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {unansweredQueries.map((uq) => (
                              <tr key={uq.id} style={{ opacity: uq.resolved ? 0.6 : 1 }}>
                                <td style={{ fontWeight: 600, maxWidth: '280px' }}>{uq.query}</td>
                                <td>
                                  <span className={`td-badge ${uq.lang}`}>
                                    {uq.lang.toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  {uq.date}, {uq.time}
                                </td>
                                <td>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    backgroundColor: uq.resolved ? '#dcfce7' : '#ffedd5',
                                    color: uq.resolved ? '#15803d' : '#c2410c'
                                  }}>
                                    {uq.resolved ? 'Resolved' : 'Needs FAQ'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setUnansweredQueries(prev =>
                                        prev.map(item =>
                                          item.id === uq.id ? { ...item, resolved: !item.resolved } : item
                                        )
                                      );
                                    }}
                                    style={{
                                      fontSize: '0.75rem',
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: uq.resolved ? '#f8fafc' : '#005c35',
                                      color: uq.resolved ? '#334155' : '#ffffff',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {uq.resolved ? 'Reopen' : 'Mark Done'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Standalone Embed Code Generator */}
                  <div className="panel-container">
                    <div className="panel-header">
                      <h3>
                        <ShieldCheck size={20} color="#005c35" />
                        Embeddable Chat Widget for External Websites (WordPress, Wix, Webflow)
                      </h3>
                    </div>

                    <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
                        To install this chatbot on the NGO's official WordPress, Wix, or custom website, copy and paste this single script tag right before the closing <code>&lt;/body&gt;</code> tag:
                      </p>

                      <div style={{
                        position: 'relative',
                        backgroundColor: '#0f172a',
                        color: '#38bdf8',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        overflowX: 'auto',
                        marginBottom: '0.75rem'
                      }}>
                        <code>&lt;script src="https://your-ngo-domain.org/widget.js" defer&gt;&lt;/script&gt;</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('<script src="https://your-ngo-domain.org/widget.js" defer></script>');
                            setEmbedCopied(true);
                            setTimeout(() => setEmbedCopied(false), 2500);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: embedCopied ? '#10b981' : '#334155',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {embedCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Code</>}
                        </button>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        💡 <strong>How it works:</strong> The script mounts a self-contained floating chat button and interactive window. It includes all Groq AI intelligence, volunteer registration, and local FAQ matching with zero conflicts.
                      </div>
                    </div>
                  </div>

                  {/* Languages & Logs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Languages breakdown */}
                    <div className="panel-container">
                      <div className="panel-header">
                        <h3>
                          <Globe size={20} color="#005c35" />
                          NLP Languages distribution
                        </h3>
                      </div>

                      <div className="chart-sim">
                        <div className="chart-bar-group">
                          <div className="chart-label-val">
                            <span>English</span>
                            <span>{langStats.en} messages</span>
                          </div>
                          <div className="chart-bar-track">
                            <div
                              className="chart-bar-fill"
                              style={{ width: `${(langStats.en / (langStats.en + langStats.hi + langStats.mr)) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="chart-bar-group">
                          <div className="chart-label-val">
                            <span>Hindi</span>
                            <span>{langStats.hi} messages</span>
                          </div>
                          <div className="chart-bar-track">
                            <div
                              className="chart-bar-fill secondary"
                              style={{ width: `${(langStats.hi / (langStats.en + langStats.hi + langStats.mr)) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="chart-bar-group">
                          <div className="chart-label-val">
                            <span>Marathi</span>
                            <span>{langStats.mr} messages</span>
                          </div>
                          <div className="chart-bar-track">
                            <div
                              className="chart-bar-fill accent"
                              style={{ width: `${(langStats.mr / (langStats.en + langStats.hi + langStats.mr)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Audit log list */}
                    <div className="panel-container" style={{ flex: 1 }}>
                      <div className="panel-header">
                        <h3>
                          <Clock size={20} color="#005c35" />
                          Live Chatbot Event Logs
                        </h3>
                      </div>

                      <div className="interaction-logs">
                        {logs.slice(0, 5).map((log) => (
                          <div key={log.id} className={`log-item ${log.type}`}>
                            <div className="log-icon">
                              {log.type === 'volunteer' && <Users size={16} />}
                              {log.type === 'donation' && <DollarSign size={16} />}
                              {log.type === 'qa' && <Info size={16} />}
                            </div>
                            <div className="log-text">
                              <h5>
                                {log.type === 'volunteer' && 'Volunteer registration'}
                                {log.type === 'donation' && 'Donation links requested'}
                                {log.type === 'qa' && 'NLP Q&A match'}
                              </h5>
                              <p>{log.detail}</p>
                            </div>
                            <span className="log-time">{log.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
