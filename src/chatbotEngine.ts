import { searchKnowledgeBase } from './data/ngoKnowledgeBase';
import { queryLlamaWithContext, isLlamaAvailable } from './services/llamaService';

export type Language = 'en' | 'hi' | 'mr';

export type ChatState =
  | 'LANG_SELECT'
  | 'IDLE'
  | 'VOLUNTEER_NAME'
  | 'VOLUNTEER_EMAIL'
  | 'VOLUNTEER_PHONE'
  | 'VOLUNTEER_ADDRESS'
  | 'VOLUNTEER_CONFIRM';

export interface VolunteerData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ChatResponse {
  messages: string[];
  nextState: ChatState;
  detectedLanguage: Language;
  source?: 'form' | 'direct_faq' | 'llama_ai' | 'fallback';
  isUnanswered?: boolean;
  action?: {
    type: 'SEND_DONATION_LINKS' | 'REGISTER_VOLUNTEER';
    data?: any;
  };
}

// Translations for greeting, help and general prompts
const TRANSLATIONS = {
  en: {
    greeting: "Hello! Welcome to Vasundhara Abhiyan (Baner, Pune). 🌿\nI am your Smart Green Companion. How can I help you today?",
    helpText: "You can ask me to:\n1. 🤝 Sign up as a Volunteer\n2. 💳 Donate to support tree planting\n3. 📍 Find our location & work timings\n4. 📞 Get contact details",
    askName: "Wonderful! To register you as a volunteer, please enter your Full Name:",
    askEmail: "Thank you, {name}. Please enter your Email Address:",
    askPhone: "Got it. Please provide your Phone Number:",
    askAddress: "Almost done! Please enter your Address (or city):",
    confirmVolunteer: "Please confirm your details:\n📝 Name: {name}\n📧 Email: {email}\n📞 Phone: {phone}\n🏠 Address: {address}\n\nReply with 'Yes' to submit, or 'Cancel' to start over.",
    volunteerSuccess: "🎉 Thank you! You have been successfully registered as a volunteer. Our team will contact you soon. Join us daily between 7 AM and 9 AM at Baner-Pashan Hills! 🌳",
    volunteerCancel: "Registration cancelled. Let me know if you need anything else!",
    donationInfo: "Thank you for your generous support! 🙏 Your contribution will help us plant and nurture native trees on the Baner-Pashan Hills. Here are your payment options:",
    upiLabel: "📱 UPI (Google Pay, PhonePe, Paytm):",
    razorpayLabel: "💳 Razorpay Secured Portal:",
    bankLabel: "🏛 Bank Transfer Details:",
    bankDetails: "You can also transfer your contribution to Vasundhara Abhiyan Baner bank account.\n\nVasundhara Abhiyan Baner\n\nBank: ICICI Bank LTD\nBeneficiary Name: Vasundhara Abhiyan Baner\nAccount No.:  624001082227\nRTGS / NEFT / IFSC:  ICIC0006240\nAccount Type: Current\n\nWrite to us at vasundharaabhiyan2006@gmail.com after transferring your contribution.",
    invalidName: "Please enter a valid full name (at least 2 letters, no numbers or special symbols):",
    invalidEmail: "Please enter a valid email address (e.g., name@example.com):",
    invalidPhone: "Please enter a valid 10-digit phone number:",
    invalidAddress: "Please enter a valid address (at least 3 characters):",
    invalidConfirm: "Invalid response. Please reply with 'Yes' to confirm details, or 'Cancel' to abort.",
    locationInfo: "📍 Work Location: Baner-Pashan Hills (Tukai Hill), Pune.\n🕒 Timing: Every day from 7:00 AM to 9:00 AM.\n🏢 Office: Next to Reelicon Alpine Ridge, Pan Card Clubs Rd, Baner, Pune - 411045.",
    contactInfo: "📞 Contact Vasundhara Abhiyan:\nPhone: +91 9882 501 501\nEmail: vasundharaabhiyan2006@gmail.com\nFeel free to write or call us!",
    fallback: "I'm sorry, I didn't quite get that. You can type 'volunteer' to join us, 'donate' to make a contribution, or ask about our 'location' and 'contact'."
  },
  hi: {
    greeting: "नमस्ते! वसुंधरा अभियान (बानेर, पुणे) में आपका स्वागत है। 🌿\nमैं आपका स्मार्ट ग्रीन साथी हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
    helpText: "आप मुझसे पूछ सकते हैं:\n1. 🤝 स्वयंसेवक (Volunteer) बनने के लिए\n2. 💳 योगदान/दान (Donate) करने के लिए\n3. 📍 हमारा स्थान (Location) और काम का समय जानने के लिए\n4. 📞 संपर्क विवरण (Contact) पाने के लिए",
    askName: "बहुत बढ़िया! स्वयंसेवक के रूप में पंजीकरण के लिए, कृपया अपना पूरा नाम लिखें:",
    askEmail: "धन्यवाद, {name}। कृपया अपना ईमेल पता (Email) लिखें:",
    askPhone: "ठीक है। कृपया अपना फ़ोन नंबर (Phone Number) प्रदान करें:",
    askAddress: "बस एक आखिरी कदम! कृपया अपना पता (Address) या शहर दर्ज करें:",
    confirmVolunteer: "कृपया अपने विवरण की पुष्टि करें:\n📝 नाम: {name}\n📧 ईमेल: {email}\n📞 फ़ोन: {phone}\n🏠 पता: {address}\n\nपंजीकरण पूरा करने के लिए 'हाँ' या रद्द करने के लिए 'रद्द करें' लिखें।",
    volunteerSuccess: "🎉 धन्यवाद! आप सफलतापूर्वक स्वयंसेवक के रूप में पंजीकृत हो गए हैं। हमारी टीम जल्द ही आपसे संपर्क करेगी। बानेर-पाषाण पहाड़ियों पर प्रतिदिन सुबह 7 से 9 बजे के बीच हमसे जुड़ें! 🌳",
    volunteerCancel: "पंजीकरण रद्द कर दिया गया है। अगर आपको किसी और चीज़ की ज़रूरत हो तो बताएं!",
    donationInfo: "आपके उदार समर्थन के लिए धन्यवाद! 🙏 आपका योगदान बानेर-पाषाण पहाड़ियों पर देशी पेड़ लगाने और उनकी देखभाल करने में हमारी मदद करेगा। भुगतान के विकल्प नीचे दिए गए हैं:",
    upiLabel: "📱 यूपीआई (Google Pay, PhonePe, Paytm):",
    razorpayLabel: "💳 रेज़रपे (Razorpay) सुरक्षित पोर्टल:",
    bankLabel: "🏛 बैंक ट्रांसफर विवरण:",
    bankDetails: "आप वसुंधरा अभियान बानेर बैंक खाते में भी अपना योगदान ट्रांसफर कर सकते हैं।\n\nवसुंधरा अभियान बानेर\n\nबैंक: ICICI Bank LTD\nलाभार्थी का नाम: Vasundhara Abhiyan Baner\nखाता संख्या:  624001082227\nRTGS / NEFT / IFSC कोड:  ICIC0006240\nखाता प्रकार: Current\n\nअपना योगदान ट्रांसफर करने के बाद हमें vasundharaabhiyan2006@gmail.com पर लिखें।",
    invalidName: "कृपया एक वैध पूरा नाम दर्ज करें (कम से कम 2 अक्षर, कोई संख्या या विशेष वर्ण नहीं):",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें (जैसे, name@example.com):",
    invalidPhone: "कृपया 10 अंकों का एक वैध फ़ोन नंबर दर्ज करें:",
    invalidAddress: "कृपया एक वैध पता दर्ज करें (कम से कम 3 अक्षर):",
    invalidConfirm: "अमान्य उत्तर। विवरण की पुष्टि के लिए 'हाँ' लिखें, या रद्द करने के लिए 'रद्द करें' लिखें।",
    locationInfo: "📍 काम का स्थान: बानेर-पाषाण पहाड़ियां (तुकई हिल), पुणे।\n🕒 समय: हर दिन सुबह 7:00 बजे से 9:00 बजे तक।\n🏢 कार्यालय: रीलीकॉन अल्पाइन रिज के पास, पैन कार्ड क्लब रोड, बानेर, पुणे - 411045।",
    contactInfo: "📞 वसुंधरा अभियान से संपर्क करें:\nफ़ोन: +91 9882 501 501\nईमेल: vasundharaabhiyan2006@gmail.com\nहमें कभी भी कॉल या ईमेल करें!",
    fallback: "क्षमा करें, मैं समझ नहीं पाया। आप शामिल होने के लिए 'स्वयंसेवक' (volunteer), दान के लिए 'दान' (donate) लिख सकते हैं, या हमारे 'स्थान' और 'संपर्क' के बारे में पूछ सकते हैं।"
  },
  mr: {
    greeting: "नमस्कार! वसुंधरा अभियान (बाणेर, पुणे) मध्ये आपले स्वागत आहे. 🌿\nमी आपला स्मार्ट ग्रीन सोबती आहे. आज मी आपल्याला कशी मदत करू शकतो?",
    helpText: "आपण मला विचारू शकता:\n1. 🤝 स्वयंसेवक (Volunteer) म्हणून नोंदणी करण्यासाठी\n2. 💳 झाडे लावण्यासाठी देणगी (Donate) देण्यासाठी\n3. 📍 आमचे ठिकाण (Location) आणि कामाची वेळ जाणून घेण्यासाठी\n4. 📞 संपर्क माहिती (Contact) मिळवण्यासाठी",
    askName: "खूप छान! स्वयंसेवक म्हणून नोंदणी करण्यासाठी, कृपया आपले संपूर्ण नाव लिहा:",
    askEmail: "धन्यवाद, {name}. कृपया आपला ईमेल आयडी (Email) लिहा:",
    askPhone: "समजले. कृपया आपला फोन नंबर (Phone) द्या:",
    askAddress: "शेवटची पायरी! कृपया आपला पत्ता (Address) किंवा शहर लिहा:",
    confirmVolunteer: "कृपया आपल्या माहितीची खात्री करा:\n📝 नाव: {name}\n📧 ईमेल: {email}\n📞 फोन: {phone}\n🏠 पत्ता: {address}\n\nनोंदणी पूर्ण करण्यासाठी 'होय' किंवा रद्द करण्यासाठी 'रद्द' लिहा.",
    volunteerSuccess: "🎉 धन्यवाद! तुमची स्वयंसेवक म्हणून यशस्वी नोंदणी झाली आहे. आमची टीम लवकरच तुमच्याशी संपर्क साधेल. बाणेर-पाषाण टेकडीवर दररोज सकाळी ७ ते ९ या वेळेत नक्की या! 🌳",
    volunteerCancel: "नोंदणी रद्द केली आहे. आपल्याला इतर काही मदत हवी असल्यास नक्की सांगा!",
    donationInfo: "आपल्या मोलाच्या सहकार्याबद्दल धन्यवाद! 🙏 आपली देणगी बाणेर-पाषाण टेकड्यांवर देशी वृक्षारोपण आणि संवर्धनासाठी वापरली जाईल. पेमेंट पर्याय खालीलप्रमाणे आहेत:",
    upiLabel: "📱 यूपीआय (Google Pay, PhonePe, Paytm):",
    razorpayLabel: "💳 रेझरपे (Razorpay) सुरक्षित पोर्टल:",
    bankLabel: "🏛 बँक ट्रान्सफर तपशील:",
    bankDetails: "तुम्ही तुमचे योगदान वसुंधरा अभियान बाणेर बँक खात्यात देखील ट्रान्सफर करू शकता.\n\nवसुंधरा अभियान बाणेर\n\nबँक: ICICI Bank LTD\nलाभार्थीचे नाव: Vasundhara Abhiyan Baner\nखाते क्रमांक:  624001082227\nRTGS / NEFT / IFSC कोड:  ICIC0006240\nखाते प्रकार: Current\n\nतुमचे योगदान ट्रान्सफर केल्यानंतर आम्हाला vasundharaabhiyan2006@gmail.com वर लिहा.",
    invalidName: "कृपया वैध पूर्ण नाव प्रविष्ट करा (किमान २ अक्षरे, संख्या किंवा विशेष चिन्हे नकोत):",
    invalidEmail: "कृपया वैध ईमेल पत्ता प्रविष्ट करा (उदा., name@example.com):",
    invalidPhone: "कृपया वैध १०-अंकी फोन नंबर प्रविष्ट करा:",
    invalidAddress: "कृपया वैध पत्ता प्रविष्ट करा (किमान ३ अक्षरे):",
    invalidConfirm: "अवैध प्रतिसाद. माहितीची खात्री करण्यासाठी 'होय' किंवा रद्द करण्यासाठी 'रद्द' लिहा.",
    locationInfo: "📍 कामाचे ठिकाण: बाणेर-पाषाण टेकड्या (तुकई हिल), पुणे.\n🕒 वेळ: दररोज सकाळी ७:०० ते ९:००.\n🏢 कार्यालय: रिलिकॉन अल्पाइन रिज शेजारी, पॅन कार्ड क्लब्स रोड, बाणेर, पुणे - ४११०४५.",
    contactInfo: "📞 वसुंधरा अभियान संपर्क:\nफोन: +91 9882 501 501\nईमेल: vasundharaabhiyan2006@gmail.com\nआम्हाला कधीही संपर्क साधू शकता!",
    fallback: "क्षमस्व, मला नीट समजले नाही. आमच्यात सामील होण्यासाठी 'स्वयंसेवक' (volunteer), देणगीसाठी 'देणगी' (donate) लिहा, किंवा 'ठिकाण' आणि 'संपर्क' बद्दल विचारा."
  }
};

// Multilingual Intent Detection
function detectLanguageAndIntent(text: string): { lang: Language | null; intent: 'VOLUNTEER' | 'DONATE' | 'LOCATION' | 'CONTACT' | 'HI' | 'NONE' } {
  const clean = text.toLowerCase().trim();

  // Language indicators
  let lang: Language | null = null;
  if (
    clean.includes('नमस्ते') ||
    clean.includes('स्वयंसेवक') ||
    clean.includes('दान') ||
    clean.includes('पैसे') ||
    clean.includes('हाँ') ||
    clean.includes('समय') ||
    clean.includes('पता') ||
    clean.includes('कॉल') ||
    clean.includes('फोन') ||
    clean.includes('संपर्क') ||
    clean.includes('स्थान') ||
    clean.includes('पर्याय')
  ) {
    lang = 'hi';
  } else if (
    clean.includes('नमस्कार') ||
    clean.includes('मदत') ||
    clean.includes('झाड') ||
    clean.includes('झाडे') ||
    clean.includes('होय') ||
    clean.includes('वेळ') ||
    clean.includes('पत्ता') ||
    clean.includes('टेकडी') ||
    clean.includes('देणगी') ||
    clean.includes('कुठे')
  ) {
    lang = 'mr';
  } else if (
    clean.includes('volunteer') ||
    clean.includes('join') ||
    clean.includes('donate') ||
    clean.includes('donation') ||
    clean.includes('money') ||
    clean.includes('pay') ||
    clean.includes('razorpay') ||
    clean.includes('upi') ||
    clean.includes('location') ||
    clean.includes('where') ||
    clean.includes('address') ||
    clean.includes('contact') ||
    clean.includes('phone') ||
    clean.includes('email') ||
    clean.includes('call') ||
    clean.includes('hello') ||
    clean.includes('hi') ||
    clean.includes('hey')
  ) {
    lang = 'en';
  }

  // Match specific menu numbers first
  if (clean === '1' || clean === '१' || clean === 'one' || clean.includes('option 1') || clean.includes('पर्याय १')) {
    return { lang, intent: 'VOLUNTEER' };
  }
  if (clean === '2' || clean === '२' || clean === 'two' || clean.includes('option 2') || clean.includes('पर्याय २')) {
    return { lang, intent: 'DONATE' };
  }
  if (clean === '3' || clean === '३' || clean === 'three' || clean.includes('option 3') || clean.includes('पर्याय ३')) {
    return { lang, intent: 'LOCATION' };
  }
  if (clean === '4' || clean === '४' || clean === 'four' || clean.includes('option 4') || clean.includes('पर्याय ४')) {
    return { lang, intent: 'CONTACT' };
  }

  // Intent matchers
  if (
    clean.includes('volunteer') ||
    clean.includes('join') ||
    clean.includes('swayamsevak') ||
    clean.includes('स्वयंसेवक') ||
    clean.includes('सामील') ||
    clean.includes('जुड़ें')
  ) {
    return { lang, intent: 'VOLUNTEER' };
  }

  if (
    clean.includes('donate') ||
    clean.includes('donation') ||
    clean.includes('money') ||
    clean.includes('pay') ||
    clean.includes('razorpay') ||
    clean.includes('upi') ||
    clean.includes('dan') ||
    clean.includes('दान') ||
    clean.includes('देणगी') ||
    clean.includes('पैसे') ||
    clean.includes('रुपये')
  ) {
    return { lang, intent: 'DONATE' };
  }

  if (
    clean.includes('location') ||
    clean.includes('where') ||
    clean.includes('address') ||
    clean.includes('pune') ||
    clean.includes('hill') ||
    clean.includes('baner') ||
    clean.includes('स्थान') ||
    clean.includes('पता') ||
    clean.includes('पत्ता') ||
    clean.includes('कुठे')
  ) {
    return { lang, intent: 'LOCATION' };
  }

  if (
    clean.includes('contact') ||
    clean.includes('phone') ||
    clean.includes('email') ||
    clean.includes('call') ||
    clean.includes('संपर्क') ||
    clean.includes('फोन') ||
    clean.includes('कॉल')
  ) {
    return { lang, intent: 'CONTACT' };
  }

  if (
    clean.includes('hi') ||
    clean.includes('hello') ||
    clean.includes('hey') ||
    clean.includes('नमस्ते') ||
    clean.includes('नमस्कार')
  ) {
    return { lang, intent: 'HI' };
  }

  return { lang, intent: 'NONE' };
}

export async function handleUserMessage(
  message: string,
  state: ChatState,
  tempData: Partial<VolunteerData>,
  currentLang: Language = 'en'
): Promise<ChatResponse> {
  const { lang: detectedLang, intent } = detectLanguageAndIntent(message);
  const lang = (state === 'IDLE' && detectedLang !== null) ? detectedLang : currentLang; // keep current language unless a new language is strongly detected
  const t = TRANSLATIONS[lang];

  const clean = message.trim().toLowerCase();

  // If user wants to reset or start over
  if (clean === 'reset' || clean === 'restart') {
    return {
      messages: [
        "Welcome to Vasundhara Abhiyan (Baner, Pune). 🌿\n\nPlease select your preferred language / अपनी पसंदीदा भाषा चुनें / आपली पसंतीची भाषा निवडा:\n\n1. 🇬🇧 English\n2. 🇮🇳 Hindi (हिंदी)\n3. 🇮🇳 Marathi (मराठी)"
      ],
      nextState: 'LANG_SELECT',
      detectedLanguage: currentLang,
      source: 'form'
    };
  }

  if (clean === 'cancel' || clean === 'रद्द' || clean === 'रद्द करें') {
    return {
      messages: [t.volunteerCancel],
      nextState: 'IDLE',
      detectedLanguage: lang,
      source: 'form'
    };
  }

  // If user explicitly chooses language via language keywords or button clicks
  const isExplicitLangChoice =
    clean === 'lang:en' || clean === 'lang:hi' || clean === 'lang:mr' ||
    clean === 'english' || clean === 'en' || clean === 'इंग्रजी' || clean === 'अंग्रेजी' ||
    clean === 'hindi' || clean === 'hi' || clean === 'हिंदी' ||
    clean === 'marathi' || clean === 'mr' || clean === 'मराठी';

  if (isExplicitLangChoice) {
    let chosenLang: Language = 'en';
    if (clean === 'lang:hi' || clean.includes('hindi') || clean.includes('हिंदी') || clean === 'hi') chosenLang = 'hi';
    else if (clean === 'lang:mr' || clean.includes('marathi') || clean.includes('मराठी') || clean === 'mr') chosenLang = 'mr';

    const tSelected = TRANSLATIONS[chosenLang];
    const confirmMap = {
      en: "🇬🇧 Language switched to English. How can I assist you today? 🌿",
      hi: "🇮🇳 भाषा हिंदी में सेट की गई है। आज मैं आपकी क्या मदद कर सकता हूँ? 🌿",
      mr: "🇮🇳 भाषा मराठी निवडली गेली आहे. मी आज आपल्याला कशी मदत करू शकतो? 🌿"
    };

    return {
      messages: [confirmMap[chosenLang], tSelected.helpText],
      nextState: 'IDLE',
      detectedLanguage: chosenLang,
      source: 'form'
    };
  }

  // Treat LANG_SELECT transparently as IDLE so user questions are never rejected with "Invalid choice"
  const effectiveState: ChatState = state === 'LANG_SELECT' ? 'IDLE' : state;

  // State Machine logic
  switch (effectiveState) {
    case 'IDLE': {
      // 1. Direct navigation menu intents
      if (intent === 'VOLUNTEER') {
        return {
          messages: [t.askName],
          nextState: 'VOLUNTEER_NAME',
          detectedLanguage: lang,
          source: 'form'
        };
      }
      if (intent === 'DONATE') {
        return {
          messages: [
            t.donationInfo,
            `QR_CODE: ${t.upiLabel} eazypay.OPCH8Q0NYA45HZT@icici`,
            `${t.bankLabel}\n${t.bankDetails}`
          ],
          nextState: 'IDLE',
          detectedLanguage: lang,
          action: { type: 'SEND_DONATION_LINKS' },
          source: 'form'
        };
      }
      if (intent === 'LOCATION') {
        return {
          messages: [t.locationInfo],
          nextState: 'IDLE',
          detectedLanguage: lang,
          source: 'form'
        };
      }
      if (intent === 'CONTACT') {
        return {
          messages: [t.contactInfo],
          nextState: 'IDLE',
          detectedLanguage: lang,
          source: 'form'
        };
      }
      if (intent === 'HI') {
        return {
          messages: [t.greeting, t.helpText],
          nextState: 'IDLE',
          detectedLanguage: lang,
          source: 'form'
        };
      }

      // 2. Search Expanded Local Knowledge Base
      const searchResult = searchKnowledgeBase(message, lang);

      if (searchResult) {
        const faq = searchResult.item;
        const localAnswer = faq.answer[lang] || faq.answer.en;

        // Try Llama / Groq open-weight LLM synthesis if API key is present
        if (isLlamaAvailable()) {
          const groundingContext = `Topic: ${faq.category.toUpperCase()}
Question: ${faq.question[lang] || faq.question.en}
Verified NGO Fact: ${localAnswer}`;

          const aiAnswer = await queryLlamaWithContext(message, groundingContext, lang);
          if (aiAnswer) {
            return {
              messages: [aiAnswer],
              nextState: 'IDLE',
              detectedLanguage: lang,
              source: 'llama_ai'
            };
          }
        }

        // Return verified local FAQ answer (instant, 100% offline & zero cost)
        return {
          messages: [localAnswer],
          nextState: 'IDLE',
          detectedLanguage: lang,
          source: 'direct_faq'
        };
      }

      // 3. Fallback: If Llama is configured, try general NGO knowledge synthesis
      if (isLlamaAvailable()) {
        const generalContext = `Vasundhara Abhiyan is a citizen green trust at Tukai Hill, Baner-Pashan Hills, Pune, operating since 2006.
Daily volunteer shramadaan: Every morning 7:00 AM - 9:00 AM, 365 days a year.
Native afforestation: Over 40,000 trees planted (Neem, Banyan, Peepal, Tamarind, Karanj, Amla).
Rainwater harvesting: 5,000+ meters of continuous contour trenches (CCT) & check dams.
Donations: Eligible for Section 80G tax rebate. UPI: eazypay.OPCH8Q0NYA45HZT@icici.
Contact: +91 9882 501 501, vasundharaabhiyan2006@gmail.com.`;

        const generalAiAnswer = await queryLlamaWithContext(message, generalContext, lang);
        if (generalAiAnswer) {
          const isUncertain =
            generalAiAnswer.toLowerCase().includes("don't have") ||
            generalAiAnswer.toLowerCase().includes("do not have") ||
            generalAiAnswer.toLowerCase().includes("cannot answer") ||
            generalAiAnswer.toLowerCase().includes("माहिती नाही") ||
            generalAiAnswer.toLowerCase().includes("जानकारी नहीं");

          return {
            messages: [generalAiAnswer],
            nextState: 'IDLE',
            detectedLanguage: lang,
            source: 'llama_ai',
            isUnanswered: isUncertain
          };
        }
      }

      // 4. Default safe fallback & auto-track unanswered query
      return {
        messages: [t.fallback, t.helpText],
        nextState: 'IDLE',
        detectedLanguage: lang,
        source: 'fallback',
        isUnanswered: true
      };
    }

    case 'VOLUNTEER_NAME': {
      const nameTrimmed = message.trim();
      const isNameValid =
        nameTrimmed.length >= 2 &&
        !/\d/.test(nameTrimmed) &&
        !/[!@#\$%\^&\*\(\)\{\}\[\]:;"'<>\?\/\\|~`_\+=]/.test(nameTrimmed);

      if (!isNameValid) {
        return {
          messages: [t.invalidName],
          nextState: 'VOLUNTEER_NAME',
          detectedLanguage: lang
        };
      }

      tempData.name = nameTrimmed;
      return {
        messages: [t.askEmail.replace('{name}', nameTrimmed)],
        nextState: 'VOLUNTEER_EMAIL',
        detectedLanguage: lang
      };
    }

    case 'VOLUNTEER_EMAIL': {
      const emailTrimmed = message.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        return {
          messages: [t.invalidEmail],
          nextState: 'VOLUNTEER_EMAIL',
          detectedLanguage: lang
        };
      }

      tempData.email = emailTrimmed;
      return {
        messages: [t.askPhone],
        nextState: 'VOLUNTEER_PHONE',
        detectedLanguage: lang
      };
    }

    case 'VOLUNTEER_PHONE': {
      const cleanPhone = message.replace(/[\s\-\(\)\+]/g, '');
      const isPhoneValid =
        /^\d{10}$/.test(cleanPhone) ||
        /^0\d{10}$/.test(cleanPhone) ||
        /^91\d{10}$/.test(cleanPhone);

      if (!isPhoneValid) {
        return {
          messages: [t.invalidPhone],
          nextState: 'VOLUNTEER_PHONE',
          detectedLanguage: lang
        };
      }

      tempData.phone = message.trim();
      return {
        messages: [t.askAddress],
        nextState: 'VOLUNTEER_ADDRESS',
        detectedLanguage: lang
      };
    }

    case 'VOLUNTEER_ADDRESS': {
      const addressTrimmed = message.trim();
      if (addressTrimmed.length < 3) {
        return {
          messages: [t.invalidAddress],
          nextState: 'VOLUNTEER_ADDRESS',
          detectedLanguage: lang
        };
      }

      tempData.address = addressTrimmed;
      const confirmMsg = t.confirmVolunteer
        .replace('{name}', tempData.name || '')
        .replace('{email}', tempData.email || '')
        .replace('{phone}', tempData.phone || '')
        .replace('{address}', tempData.address || '');
      return {
        messages: [confirmMsg],
        nextState: 'VOLUNTEER_CONFIRM',
        detectedLanguage: lang
      };
    }

    case 'VOLUNTEER_CONFIRM': {
      const isYes =
        clean === 'yes' ||
        clean === 'y' ||
        clean === 'हाँ' ||
        clean === 'हा' ||
        clean === 'होय' ||
        clean === 'हो';

      const isCancel =
        clean === 'cancel' ||
        clean === 'no' ||
        clean === 'n' ||
        clean === 'रद्द' ||
        clean === 'रद्द करें' ||
        clean === 'नहीं' ||
        clean === 'नाही' ||
        clean === 'नको' ||
        clean === 'नकोय';

      if (isYes) {
        return {
          messages: [t.volunteerSuccess],
          nextState: 'IDLE',
          detectedLanguage: lang,
          action: {
            type: 'REGISTER_VOLUNTEER',
            data: { ...tempData }
          }
        };
      } else if (isCancel) {
        return {
          messages: [t.volunteerCancel],
          nextState: 'IDLE',
          detectedLanguage: lang
        };
      } else {
        return {
          messages: [t.invalidConfirm],
          nextState: 'VOLUNTEER_CONFIRM',
          detectedLanguage: lang
        };
      }
    }

    default:
      return {
        messages: [t.fallback],
        nextState: 'IDLE',
        detectedLanguage: lang
      };
  }
}

