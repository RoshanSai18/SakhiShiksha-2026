export const MODULE = {
  id: 'digital-payments',
  iconEmoji: '💳',
  gradient: 'from-violet-500 to-purple-600',
  titleEn: 'Introduction to Digital Payments',
  titleHi: 'डिजिटल भुगतान का परिचय',
  descEn: 'Learn how UPI, mobile wallets, and QR codes can grow your business.',
  descHi: 'जानें कैसे UPI, मोबाइल वॉलेट और QR कोड आपका व्यवसाय बढ़ा सकते हैं।',
  duration: '12 min',
  level: 'Beginner',
  slides: [
    {
      emoji: '📱',
      titleEn: 'What is UPI?',
      titleHi: 'UPI क्या है?',
      bodyEn:
        'Unified Payments Interface (UPI) lets you send & receive money instantly using your mobile phone — no cash needed! Over 300 million Indian women now use UPI for their small businesses.',
      bodyHi:
        'यूनिफाइड पेमेंट्स इंटरफेस (UPI) आपको मोबाइल फोन से तुरंत पैसे भेजने और पाने की सुविधा देता है — बिना नकद के! 30 करोड़ से अधिक भारतीय महिलाएं अब अपने व्यवसाय के लिए UPI का उपयोग करती हैं।',
      tipEn: 'Tip: You can download your UPI QR code from your bank app for free and display it at your shop!',
      tipHi: 'टिप: अपने बैंक ऐप से मुफ्त में UPI QR कोड डाउनलोड करें और दुकान पर लगाएं!',
    },
    {
      emoji: '🔷',
      titleEn: 'QR Code Payments',
      titleHi: 'QR कोड भुगतान',
      bodyEn:
        'A QR code on your shop allows customers to pay with any UPI app — PhonePe, Google Pay, Paytm, or BHIM — in under 5 seconds. No machine needed, just print and display!',
      bodyHi:
        'आपकी दुकान पर QR कोड से ग्राहक किसी भी UPI ऐप — PhonePe, Google Pay, Paytm या BHIM — से 5 सेकंड में भुगतान कर सकते हैं। कोई मशीन नहीं चाहिए, बस प्रिंट करें और दिखाएं!',
      tipEn: 'Tip: Ask customers to scan your QR code — payments arrive in your bank within seconds.',
      tipHi: 'टिप: ग्राहकों से QR कोड स्कैन कराएं — भुगतान सेकंडों में आपके बैंक में आ जाएगा।',
    },
    {
      emoji: '🛡️',
      titleEn: 'Stay Safe Online',
      titleHi: 'ऑनलाइन सुरक्षित रहें',
      bodyEn:
        'Never share your UPI PIN with anyone. Banks and payment apps will NEVER ask for your PIN. Use a 6-digit PIN that is hard to guess and change it every 3 months.',
      bodyHi:
        'अपना UPI PIN कभी किसी को न बताएं। बैंक और पेमेंट ऐप कभी भी आपका PIN नहीं मांगेंगे। कठिन 6-अंकीय PIN बनाएं और हर 3 महीने में बदलें।',
      tipEn: 'Tip: Set up two-factor authentication on your phone for extra security.',
      tipHi: 'टिप: अतिरिक्त सुरक्षा के लिए अपने फोन पर टू-फैक्टर ऑथेंटिकेशन सेट करें।',
    },
  ],
}

export const QUIZ = [
  {
    qEn: 'What does UPI stand for?',
    qHi: 'UPI का पूरा नाम क्या है?',
    options: [
      { en: 'Unified Payments Interface', hi: 'यूनिफाइड पेमेंट्स इंटरफेस' },
      { en: 'Universal Purchase Integration', hi: 'यूनिवर्सल परचेज़ इंटीग्रेशन' },
      { en: 'United Payment Index', hi: 'यूनाइटेड पेमेंट इंडेक्स' },
    ],
    correct: 0,
  },
  {
    qEn: 'Which of these should you NEVER share with anyone?',
    qHi: 'आपको कौन सी बात कभी किसी को नहीं बतानी चाहिए?',
    options: [
      { en: 'Your shop name', hi: 'आपकी दुकान का नाम' },
      { en: 'Your UPI PIN', hi: 'आपका UPI PIN' },
      { en: 'Your QR code', hi: 'आपका QR कोड' },
    ],
    correct: 1,
  },
]

export const MOCK_MODULES = [
  { id: 'digital-payments', iconEmoji: '💳', titleEn: 'Digital Payments',           titleHi: 'डिजिटल भुगतान',              gradient: 'from-violet-500 to-purple-600', locked: false },
  { id: 'social-media',    iconEmoji: '📣', titleEn: 'Social Media Marketing',     titleHi: 'सोशल मीडिया मार्केटिंग',      gradient: 'from-pink-500 to-rose-500',     locked: true  },
  { id: 'gst-basics',      iconEmoji: '📊', titleEn: 'GST Basics for Sellers',     titleHi: 'विक्रेताओं के लिए GST',         gradient: 'from-amber-500 to-orange-500',  locked: true  },
  { id: 'ecommerce',       iconEmoji: '🛒', titleEn: 'Sell on Meesho & Amazon',    titleHi: 'Meesho & Amazon पर बेचें',     gradient: 'from-emerald-500 to-teal-500',  locked: true  },
  { id: 'cybersecurity',   iconEmoji: '🛡️', titleEn: 'Cyber Safety & Scam Guard', titleHi: 'साइबर सुरक्षा',               gradient: 'from-blue-500 to-indigo-500',   locked: true  },
]

export const DASHBOARD_METRICS = [
  { key: 'enrolled',  value: 12480, labelEn: 'Women Enrolled',    labelHi: 'महिलाएं पंजीकृत',  color: 'bg-purple-500',  pct: 83 },
  { key: 'completed', value: 8942,  labelEn: 'Modules Completed', labelHi: 'मॉड्यूल पूर्ण',    color: 'bg-emerald-500', pct: 71 },
  { key: 'active',    value: 4210,  labelEn: 'Active This Week',  labelHi: 'इस सप्ताह सक्रिय', color: 'bg-pink-500',    pct: 57 },
  { key: 'quizPass',  value: 87,    labelEn: 'Avg Quiz Pass %',   labelHi: 'औसत क्विज़ पास %',  color: 'bg-amber-500',   pct: 87 },
]

export const AI_INSIGHTS = [
  {
    icon: '🚀',
    en: "Based on your quiz strength in payments, we recommend 'Social Media Marketing' next — 78% of similar learners saw revenue growth after this module.",
    hi: "भुगतान क्विज़ में आपकी ताकत के आधार पर, हम 'सोशल मीडिया मार्केटिंग' की सिफ़ारिश करते हैं — इस मॉड्यूल के बाद 78% समान शिक्षार्थियों की आय बढ़ी।",
  },
  {
    icon: '⏰',
    en: 'You learn best in the morning (9–11 AM). Schedule your next 15-min session before your shop opens for best retention.',
    hi: 'आप सुबह (9–11 बजे) सबसे अच्छा सीखते हैं। बेहतर याददाश्त के लिए अगली 15 मिनट की सत्र दुकान खुलने से पहले करें।',
  },
]

export const LEADERBOARD = [
  { nameEn: 'Sunita Devi',  nameHi: 'सुनीता देवी',  pts: 980, emoji: '🥇' },
  { nameEn: 'Meera Singh',  nameHi: 'मीरा सिंह',    pts: 875, emoji: '🥈' },
  { nameEn: 'Priya (You)',  nameHi: 'प्रिया (आप)',   pts: 720, emoji: '🥉' },
  { nameEn: 'Rani Yadav',   nameHi: 'रानी यादव',    pts: 660, emoji: '4️⃣' },
]

export const WEEKLY_BARS = [40, 65, 50, 80, 72, 90, 60]
export const WEEK_DAYS = {
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  hi: ['सो', 'मं', 'बु', 'गु', 'शु', 'श', 'र'],
}

export const LEARNING_MODULE = {
  module: {
    id: 'mod_01_digital_payments',
    title: {
      en: 'Introduction to UPI & Digital Payments',
      hi: 'UPI और डिजिटल भुगतान का परिचय',
    },
    video_url: '/14.mp4',
    notes: {
      en: 'UPI allows instant money transfer using a simple virtual ID or QR code. You do not need to share your bank account details. It is safe, secure, and available 24/7 directly from your mobile phone.',
      hi: 'UPI आपको एक साधारण वर्चुअल आईडी या क्यूआर कोड का उपयोग करके तुरंत पैसे भेजने की सुविधा देता है। आपको अपने बैंक खाते का विवरण साझा करने की आवश्यकता नहीं है। यह सुरक्षित है और सीधे आपके मोबाइल फोन से 24/7 उपलब्ध है।',
    },
  },
}

export const MODULE_QUIZ = {
  quiz: [
    {
      id: 'q1',
      question: {
        en: 'What do you need to receive money using UPI?',
        hi: 'UPI का उपयोग करके पैसे प्राप्त करने के लिए आपको क्या चाहिए?',
      },
      options: {
        en: ['My ATM PIN', 'A Virtual ID or QR Code', 'My full bank account statement'],
        hi: ['मेरा एटीएम पिन', 'एक वर्चुअल आईडी या क्यूआर कोड', 'मेरा पूरा बैंक खाता विवरण'],
      },
      correct_answer_index: 1,
    },
    {
      id: 'q2',
      question: {
        en: 'Is it safe to share your UPI PIN with customers?',
        hi: 'क्या ग्राहकों के साथ अपना UPI पिन साझा करना सुरक्षित है?',
      },
      options: {
        en: ['Yes, if they are paying me', 'No, never share your UPI PIN', 'Yes, but only during the day'],
        hi: ['हाँ, यदि वे मुझे भुगतान कर रहे हैं', 'नहीं, अपना UPI पिन कभी साझा न करें', 'हाँ, लेकिन केवल दिन के दौरान'],
      },
      correct_answer_index: 1,
    },
  ],
}
