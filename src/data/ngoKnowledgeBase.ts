export type Language = 'en' | 'hi' | 'mr';

export interface FAQItem {
  id: string;
  category: 'volunteering' | 'conservation' | 'donations' | 'visiting' | 'csr' | 'general';
  tags: string[];
  question: {
    en: string;
    hi: string;
    mr: string;
  };
  answer: {
    en: string;
    hi: string;
    mr: string;
  };
  actionSuggestion?: {
    type: 'VOLUNTEER' | 'DONATE' | 'LOCATION' | 'CONTACT';
    label: {
      en: string;
      hi: string;
      mr: string;
    };
  };
}

export const NGO_KNOWLEDGE_BASE: FAQItem[] = [
  // 1. VOLUNTEERING
  {
    id: 'vol-timings',
    category: 'volunteering',
    tags: ['timing', 'time', 'hours', 'when', 'daily', 'morning', 'schedule', 'समय', 'वेळ', 'कधी'],
    question: {
      en: "What are the volunteer work timings and schedule?",
      hi: "स्वयंसेवा का समय और कार्यक्रम क्या है?",
      mr: "स्वयंसेवक कामाची वेळ आणि वेळापत्रक काय आहे?"
    },
    answer: {
      en: "We work every single day from 7:00 AM to 9:00 AM, 365 days a year, at Baner-Pashan Hills (Tukai Hill). You are welcome to join any day that suits you!",
      hi: "हम साल के 365 दिन हर सुबह 7:00 बजे से 9:00 बजे तक बानेर-पाषाण पहाड़ियों (तुकई हिल) पर काम करते हैं। आप किसी भी दिन अपनी सुविधानुसार जुड़ सकते हैं!",
      mr: "आम्ही वर्षाचे ३६५ दिवस दररोज सकाळी ७:०० ते ९:०० या वेळेत बाणेर-पाषाण टेकडीवर (तुकई टेकडी) श्रमदान करतो. तुम्हाला सोयीच्या कोणत्याही दिवशी तुम्ही येऊ शकता!"
    },
    actionSuggestion: {
      type: 'VOLUNTEER',
      label: {
        en: "Sign Up as Volunteer",
        hi: "स्वयंसेवक बनें",
        mr: "स्वयंसेवक म्हणून नोंदणी करा"
      }
    }
  },
  {
    id: 'vol-gear',
    category: 'volunteering',
    tags: ['wear', 'bring', 'clothes', 'shoes', 'tools', 'gloves', 'water', 'कपड़े', 'जूते', 'कपडे', 'साहित्य'],
    question: {
      en: "What should I wear and bring when coming to volunteer?",
      hi: "स्वयंसेवा के लिए आते समय मुझे क्या पहनना और साथ लाना चाहिए?",
      mr: "श्रमदानासाठी येताना काय परिधान करावे आणि काय सोबत आणावे?"
    },
    answer: {
      en: "Please wear comfortable sports/trekking shoes, full-length pants to protect from bushes, and a cap. Bring a reusable water bottle. Digging and gardening tools are provided by Vasundhara Abhiyan on the hill.",
      hi: "कृपया आरामदायक ट्रेकिंग या स्पोर्ट्स जूते, झाड़ियों से बचाव के लिए पूरी पैंट और टोपी पहनें। पीने के पानी की बोतल साथ लाएं। फावड़े, खुरपी और बागवानी के उपकरण पहाड़ी पर संस्था द्वारा प्रदान किए जाते हैं।",
      mr: "कृपया आरामदायक ट्रेकिंग किंवा स्पोर्ट्स शूज, काटेरी झुडपांपासून संरक्षणासाठी पूर्ण पँट आणि टोपी घाला. पिण्याच्या पाण्याची बाटली सोबत आणा. खुरपे, फावडे इत्यादी अवजारे टेकडीवर संस्थेकडून दिली जातात."
    }
  },
  {
    id: 'vol-certificate',
    category: 'volunteering',
    tags: ['certificate', 'college', 'student', 'internship', 'nss', 'hours', 'letter', 'प्रमाणपत्र', 'सर्टिफिकेट'],
    question: {
      en: "Do students get a certificate for volunteering or NSS hours?",
      hi: "क्या छात्रों को स्वयंसेवा या NSS घंटों के लिए प्रमाणपत्र मिलता है?",
      mr: "विद्यार्थ्यांना स्वयंसेवेचे किंवा NSS तासांचे प्रमाणपत्र मिळते का?"
    },
    answer: {
      en: "Yes! School and college students completing regular volunteer hours (minimum 15-20 hours) receive an official Social Service / Environmental Action Certificate from Vasundhara Abhiyan.",
      hi: "हाँ! नियमित स्वयंसेवा (न्यूनतम 15-20 घंटे) पूरी करने वाले स्कूल और कॉलेज के छात्रों को वसुंधरा अभियान की ओर से आधिकारिक पर्यावरण सेवा प्रमाणपत्र दिया जाता है।",
      mr: "होय! नियमित श्रमदान पूर्ण करणाऱ्या (किमान १५-२० तास) शाळा आणि महाविद्यालयीन विद्यार्थ्यांना वसुंधरा अभियानाकडून अधिकृत पर्यावरण संवर्धन प्रमाणपत्र दिले जाते."
    }
  },
  {
    id: 'vol-kids-family',
    category: 'volunteering',
    tags: ['kids', 'children', 'family', 'age', 'elderly', 'senior', 'बच्चे', 'परिवार', 'मुलं', 'कुटुंब'],
    question: {
      en: "Can children and seniors participate in volunteering?",
      hi: "क्या बच्चे और वरिष्ठ नागरिक स्वयंसेवा में भाग ले सकते हैं?",
      mr: "लहान मुले आणि ज्येष्ठ नागरिक श्रमदानात सहभागी होऊ शकतात का?"
    },
    answer: {
      en: "Absolutely! Volunteering is family-friendly. Children learn hands-on about nature, soil, and seeds. Seniors often help with lighter tasks like seed-ball making, sapling sorting, and mentoring.",
      hi: "बिल्कुल! हमारा अभियान परिवार-अनुकूल है। बच्चे मिट्टी, बीज और प्रकृति के बारे में प्रत्यक्ष सीखते हैं। वरिष्ठ नागरिक बीज-गेंद बनाने और पौधों की छंटाई जैसे हल्के कार्यों में योगदान देते हैं।",
      mr: "नक्कीच! हे संपूर्ण कुटुंबासाठी अनुकूल आहे. मुलांना निसर्ग, माती आणि बियांबद्दल शिकायला मिळते. ज्येष्ठ नागरिक सीड-बॉल्स तयार करणे आणि रोपांची निगा राखणे यासारख्या कामांमध्ये मदत करतात."
    }
  },

  // 2. CONSERVATION & TUKAI HILL
  {
    id: 'con-species',
    category: 'conservation',
    tags: ['trees', 'plants', 'species', 'native', 'neem', 'banyan', 'peepal', 'पेड़', 'पौधे', 'झाडे', 'झाड'],
    question: {
      en: "Which tree species do you plant on Baner-Pashan Hills?",
      hi: "आप बानेर-पाषाण पहाड़ियों पर कौन से पेड़ लगाते हैं?",
      mr: "तुम्ही बाणेर-पाषाण टेकडीवर कोणत्या प्रकारची झाडे लावता?"
    },
    answer: {
      en: "We exclusively plant native Indian species suited for the Deccan plateau: Neem, Banyan (Vad), Peepal, Karanj, Tamarind (Chinch), Amla, Palas, Kadamba, and Indian Coral Tree (Pangara). We avoid non-native species like Eucalyptus or Subabul that deplete groundwater.",
      hi: "हम केवल दक्कन के पठार के लिए उपयुक्त देशी पेड़ लगाते हैं: नीम, बरगद (वड), पीपल, करंज, इमली, आंवला, पलाश, और कदम। हम यूकेलिप्टस या सुबबूल जैसी विदेशी प्रजातियों से बचते हैं जो भूजल को नुकसान पहुंचाती हैं।",
      mr: "आम्ही केवळ दख्खनच्या पठारासाठी योग्य असणारी देशी झाडे लावतो: वड, पिंपळ, कडुनिंब, करंज, चिंच, आवळा, पळस, आणि कदंब. आम्ही निलगिरी किंवा सुबाभूळ यांसारखी भूजल शोषून घेणारी विदेशी झाडे लावत नाही."
    }
  },
  {
    id: 'con-history',
    category: 'conservation',
    tags: ['history', 'started', 'story', 'tukai', 'transformation', 'background', 'इतिहास', 'सुरुवात'],
    question: {
      en: "What is the history and story of Vasundhara Abhiyan?",
      hi: "वसुंधरा अभियान का इतिहास और कहानी क्या है?",
      mr: "वसुंधरा अभियानाचा इतिहास आणि पार्श्वभूमी काय आहे?"
    },
    answer: {
      en: "Started in 2006 by local citizen eco-warriors, Vasundhara Abhiyan transformed the once rocky, barren Tukai Hill into a vibrant green biodiversity park with over 40,000 thriving native trees and rich bird life.",
      hi: "2006 में स्थानीय नागरिकों द्वारा शुरू किया गया, वसुंधरा अभियान ने कभी बंजर और पथरीली रही तुकई पहाड़ी को 40,000 से अधिक देशी पेड़ों और समृद्ध पक्षी जीवन वाले एक हरे-भरे जैव विविधता पार्क में बदल दिया है।",
      mr: "२००६ मध्ये जागरूक नागरिकांनी सुरू केलेल्या वसुंधरा अभियानाने एकेकाळी उजाड आणि खडकाळ असणाऱ्या तुकई टेकडीचे रूपांतर ४०,००० हून अधिक देशी झाडे असलेल्या समृद्ध जैवविविधता पार्कमध्ये केले आहे."
    }
  },
  {
    id: 'con-water',
    category: 'conservation',
    tags: ['water', 'trench', 'cct', 'rainwater', 'groundwater', 'rain', 'पानी', 'जल', 'पाणी', 'चर'],
    question: {
      en: "How does the hill project conserve rainwater and soil?",
      hi: "यह पहाड़ी परियोजना वर्षा जल और मिट्टी का संरक्षण कैसे करती है?",
      mr: "हा प्रकल्प पावसाचे पाणी आणि मातीचे संवर्धन कसे करतो?"
    },
    answer: {
      en: "Volunteers have dug over 5,000 meters of Continuous Contour Trenches (CCT) and small check dams. These trap monsoon runoff, prevent soil erosion, and recharge groundwater bores for surrounding neighborhoods in Baner and Pashan.",
      hi: "स्वयंसेवकों ने 5,000 मीटर से अधिक कंटूर खाइयां (CCT) और छोटे चेक डैम बनाए हैं। ये बारिश के पानी को रोकते हैं, मिट्टी के कटाव को रोकते हैं और बानेर व पाषाण के भूजल को रिचार्ज करते हैं।",
      mr: "स्वयंसेवकांनी ५,००० मीटरपेक्षा जास्त समपातळी चर (CCT) आणि छोटे बंधारे बांधले आहेत. यामुळे पावसाचे पाणी वाहून न जाता जमिनीत मुरते आणि बाणेर-पाषाण परिसरातील भूजल पातळी वाढते."
    }
  },

  // 3. DONATIONS & TAX EXEMPTION
  {
    id: 'don-80g',
    category: 'donations',
    tags: ['80g', 'tax', 'receipt', 'deduction', 'exemption', 'it', 'टैक्स', 'आयकर', 'कर', 'पावती'],
    question: {
      en: "Are donations eligible for 80G income tax deduction?",
      hi: "क्या दान 80G आयकर छूट के लिए पात्र है?",
      mr: "देणगी ८०जी (80G) आयकर सवलतीसाठी पात्र आहे का?"
    },
    answer: {
      en: "Yes! Vasundhara Abhiyan Baner is a registered public charitable trust. Contributions are eligible for 50% tax deduction under Section 80G. Please email your transfer screenshot, PAN number, and full address to vasundharaabhiyan2006@gmail.com to receive your 80G receipt.",
      hi: "हाँ! वसुंधरा अभियान बानेर एक पंजीकृत सार्वजनिक धर्मार्थ ट्रस्ट है। धारा 80G के तहत 50% टैक्स छूट मिलती है। 80G रसीद पाने के लिए कृपया भुगतान स्क्रीनशॉट, पैन (PAN) नंबर और पता vasundharaabhiyan2006@gmail.com पर ईमेल करें।",
      mr: "होय! वसुंधरा अभियान बाणेर हा नोंदणीकृत चॅरिटेबल ट्रस्ट आहे. कलम ८०जी अंतर्गत देणगीवर ५०% आयकर सवलत मिळते. देणगीची पावती मिळवण्यासाठी ट्रान्झॅक्शन स्क्रीनशॉट, पॅन कार्ड आणि पत्ता vasundharaabhiyan2006@gmail.com वर ईमेल करा."
    },
    actionSuggestion: {
      type: 'DONATE',
      label: {
        en: "View Payment Options",
        hi: "भुगतान विकल्प देखें",
        mr: "पेमेंट पर्याय पहा"
      }
    }
  },
  {
    id: 'don-utilization',
    category: 'donations',
    tags: ['use', 'fund', 'money', 'utilize', 'where', 'transparency', 'पैसा', 'खर्च'],
    question: {
      en: "How are donated funds utilized?",
      hi: "दान किए गए पैसों का उपयोग कैसे किया जाता है?",
      mr: "देणगीच्या पैशांचा वापर कसा केला जातो?"
    },
    answer: {
      en: "Funds directly support: 1) Purchasing native saplings and organic compost, 2) Water tankers and drip-irrigation pipeline maintenance during summer, 3) Shovels, pickaxes and digging tools, and 4) Firebreak creation to prevent seasonal hill bushfires.",
      hi: "दान की राशि सीधे इन कार्यों में उपयोग की जाती है: 1) देशी पौधे और जैविक खाद, 2) गर्मियों में पानी के टैंकर और ड्रिप सिंचाई पाइप, 3) खुदाई के औजार और सुरक्षा उपकरण, और 4) गर्मियों में पहाड़ी पर आग लगने से बचाने के लिए फायर-लाइन बनाना।",
      mr: "निधी थेट खालील कामांसाठी वापरला जातो: १) देशी रोपे व सेंद्रिय खत खरेदी, २) उन्हाळ्यात पाण्याचे टँकर आणि ठिबक सिंचन पाइपलाइन, ३) खुरपे, टिकाव व अवजारे, आणि ४) उन्हाळ्यात वणवा लागू नये म्हणून फायर-लाइन तयार करणे."
    }
  },
  {
    id: 'don-adopt-tree',
    category: 'donations',
    tags: ['adopt', 'birthday', 'memorial', 'plant a tree', 'tree', 'पेड़ गोद', 'झाड दत्तक'],
    question: {
      en: "Can I sponsor or adopt a tree for birthdays or memorials?",
      hi: "क्या मैं जन्मदिन या स्मृति में एक पेड़ गोद ले सकता हूँ?",
      mr: "मी वाढदिवसानिमित्त किंवा स्मृतीप्रित्यर्थ झाड दत्तक घेऊ शकतो का?"
    },
    answer: {
      en: "Yes! Many Pune citizens sponsor and plant a native tree to celebrate birthdays, anniversaries, or in memory of loved ones. You can plant it yourself with our volunteers on Sunday mornings.",
      hi: "हाँ! कई नागरिक अपने जन्मदिन, वर्षगांठ या अपनों की याद में देशी पेड़ लगाते हैं और प्रायोजित करते हैं। आप रविवार की सुबह हमारे स्वयंसेवकों के साथ आकर स्वयं पौधा लगा सकते हैं।",
      mr: "होय! अनेक नागरिक वाढदिवस, लग्नाचा वाढदिवस किंवा प्रियजनांच्या स्मृतीप्रित्यर्थ देशी झाड दत्तक घेतात. तुम्ही रविवारी सकाळी येऊन स्वतःच्या हाताने झाड लावू शकता."
    }
  },

  // 4. VISITING & LOGISTICS
  {
    id: 'loc-directions',
    category: 'visiting',
    tags: ['reach', 'directions', 'bus', 'car', 'parking', 'map', 'how to reach', 'रास्ता', 'कसे यावे'],
    question: {
      en: "How do I reach Tukai Hill and where can I park?",
      hi: "तुकई पहाड़ी तक कैसे पहुँचें और पार्किंग कहाँ है?",
      mr: "तुकई टेकडीवर कसे पोहोचावे आणि पार्किंग कुठे आहे?"
    },
    answer: {
      en: "Location: Tukai Hill, Pan Card Club Road, Baner, Pune. Landmark: Next to Reelicon Alpine Ridge society. Two-wheeler and car parking is available along the road at the foothill base before the walking trail.",
      hi: "स्थान: तुकई हिल, पैन कार्ड क्लब रोड, बानेर, पुणे। लैंडमार्क: रीलिकॉन अल्पाइन रिज सोसायटी के पास। पहाड़ी के नीचे सड़क पर दोपहिया और चारपहिया वाहनों की पार्किंग उपलब्ध है।",
      mr: "पत्ता: तुकई टेकडी, पॅन कार्ड क्लब रोड, बाणेर, पुणे. लँडमार्क: रिलिकॉन अल्पाइन रिज सोसायटी शेजारी. टेकडीच्या पायथ्याशी दुचाकी व चारचाकी वाहनांसाठी पार्किंग उपलब्ध आहे."
    },
    actionSuggestion: {
      type: 'LOCATION',
      label: {
        en: "Get Google Map Info",
        hi: "स्थान विवरण देखें",
        mr: "ठिकाण माहिती पहा"
      }
    }
  },
  {
    id: 'loc-temple',
    category: 'visiting',
    tags: ['temple', 'tukai mata', 'devi', 'historic', 'sanctuary', 'मंदिर', 'देवी'],
    question: {
      en: "Is there a temple on the hill?",
      hi: "क्या पहाड़ी पर कोई मंदिर है?",
      mr: "टेकडीवर मंदिर आहे का?"
    },
    answer: {
      en: "Yes, the historic Tukai Devi Temple sits at the summit. It is an auspicious and peaceful cultural landmark that has watched over Baner for generations, surrounded by our conservation grove.",
      hi: "हाँ, पहाड़ी के शिखर पर ऐतिहासिक तुकई देवी मंदिर स्थित है। यह एक पवित्र और शांत सांस्कृतिक धरोहर है जो पीढ़ियों से बानेर की रक्षा कर रही है।",
      mr: "होय, टेकडीच्या माथ्यावर ऐतिहासिक तुकई देवीचे प्राचीन मंदिर आहे. हे अत्यंत शांत आणि पवित्र देवस्थान असून आमच्या संवर्धन क्षेत्राच्या कुशीत वसलेले आहे."
    }
  },

  // 5. CORPORATE CSR & SCHOOL VISITS
  {
    id: 'csr-drives',
    category: 'csr',
    tags: ['csr', 'corporate', 'company', 'company drive', 'team', 'weekend', 'कंपनी', 'सीएसआर'],
    question: {
      en: "How can corporate companies organize CSR plantation drives?",
      hi: "कंपनियां सीएसआर (CSR) वृक्षारोपण अभियान कैसे आयोजित कर सकती हैं?",
      mr: "कंपन्या सीएसआर (CSR) वृक्षारोपण मोहीम कशी आयोजित करू शकतात?"
    },
    answer: {
      en: "Companies can organize weekend green volunteering sessions for 20 to 100+ employees. We provide guidance, equipment, saplings, and orientation. Contact us 2 weeks in advance at vasundharaabhiyan2006@gmail.com or call +91 9882 501 501.",
      hi: "कंपनियां अपने कर्मचारियों (20 से 100+ लोग) के लिए सप्ताहांत पर्यावरण अभियान आयोजित कर सकती हैं। हम उपकरण, पौधे और मार्गदर्शन प्रदान करते हैं। कृपया 2 सप्ताह पहले vasundharaabhiyan2006@gmail.com पर ईमेल करें या +91 9882 501 501 पर संपर्क करें।",
      mr: "कंपन्या आपल्या कर्मचाऱ्यांसाठी (२० ते १००+ कर्मचारी) विकेंड श्रमदान मोहीम आयोजित करू शकतात. आम्ही अवजारे, रोपे आणि मार्गदर्शन पुरवतो. कृपया २ आठवडे आधी vasundharaabhiyan2006@gmail.com किंवा +91 9882 501 501 वर संपर्क साधा."
    },
    actionSuggestion: {
      type: 'CONTACT',
      label: {
        en: "Contact Coordinators",
        hi: "समन्वयक से संपर्क करें",
        mr: "समन्वयकांशी संपर्क साधा"
      }
    }
  },
  {
    id: 'csr-schools',
    category: 'csr',
    tags: ['school', 'field trip', 'students', 'nature trail', 'visit', 'education', 'स्कूल', 'शाळा'],
    question: {
      en: "Can schools organize nature trails and educational visits?",
      hi: "क्या स्कूल प्रकृति भ्रमण और शैक्षिक दौरे आयोजित कर सकते हैं?",
      mr: "शाळा निसर्ग सहल किंवा शैक्षणिक भेट आयोजित करू शकतात का?"
    },
    answer: {
      en: "Yes! We regularly host school field tours where children learn about biodiversity, soil conservation, composting, and native butterflies. Morning hours (7:30 AM to 9:30 AM) on weekdays or Saturdays are ideal.",
      hi: "हाँ! हम नियमित रूप से स्कूली बच्चों के लिए प्रकृति भ्रमण आयोजित करते हैं जहाँ वे तितलियों, पक्षियों, मिट्टी संरक्षण और खाद के बारे में सीखते हैं। सुबह 7:30 से 9:30 का समय सबसे उपयुक्त है।",
      mr: "होय! आम्ही शालेय विद्यार्थ्यांसाठी नियमित निसर्ग सहली आयोजित करतो. मुले जैवविविधता, फुलपाखरे, पक्षी आणि जलसंधारणाचे महत्त्व प्रत्यक्ष शिकतात."
    }
  }
];

/**
 * Fast, lightweight in-memory keyword & token scoring matcher.
 * Runs 100% locally in the browser with zero external dependencies and zero API cost.
 */
export function searchKnowledgeBase(query: string, lang: Language = 'en'): { item: FAQItem; score: number } | null {
  const cleanQuery = query.toLowerCase().trim();
  if (cleanQuery.length < 2) return null;

  // Split into individual query tokens
  const tokens = cleanQuery.split(/[\s,?.!:-]+/).filter(t => t.length > 1);
  if (tokens.length === 0) return null;

  let bestMatch: FAQItem | null = null;
  let highestScore = 0;

  for (const item of NGO_KNOWLEDGE_BASE) {
    let score = 0;

    // 1. Direct tag matches (very high weight)
    for (const tag of item.tags) {
      const lowerTag = tag.toLowerCase();
      if (cleanQuery.includes(lowerTag)) {
        score += 8;
      }
      for (const token of tokens) {
        if (lowerTag === token) {
          score += 5;
        } else if (lowerTag.includes(token) || token.includes(lowerTag)) {
          score += 2;
        }
      }
    }

    // 2. Question text matches in requested language
    const questionText = (item.question[lang] || item.question.en).toLowerCase();
    for (const token of tokens) {
      if (questionText.includes(token)) {
        score += 3;
      }
    }

    // 3. Question text matches in other languages (cross-language fallback)
    const otherQuestions = [item.question.en, item.question.hi, item.question.mr]
      .join(' ')
      .toLowerCase();
    for (const token of tokens) {
      if (otherQuestions.includes(token)) {
        score += 1.5;
      }
    }

    // 4. Full query substring match in question
    if (questionText.includes(cleanQuery)) {
      score += 10;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Minimum threshold to avoid irrelevant matches
  if (highestScore >= 3.5 && bestMatch) {
    return { item: bestMatch, score: highestScore };
  }

  return null;
}
