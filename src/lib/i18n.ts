import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      continue: "Continue",
      next: "Next",
      back: "Back",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
      filter: "Filter",
      
      // Navigation
      home: "Home",
      browse: "Browse Parts",
      request: "Request Part",
      messages: "Messages",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Sign In",
      signOut: "Sign Out",
      signUp: "Sign Up",
      
      // Hero Section
      heroTitle: "Find & Sell Car Parts in Ghana",
      heroSubtitle: "The easiest way to find and order car parts in Ghana. Compare prices from trusted sellers and get quality parts delivered to your door.",
      requestCarParts: "Request Car Parts",
      findCarParts: "Find Car Parts",
      sellCarParts: "Sell Car Parts",
      
      // Quick Actions & Navigation
      quickActions: "Quick Actions",
      findAvailableParts: "Find available parts",
      cantFindAskHere: "Can't find it? Ask here",
      listPartsForSale: "List your parts for sale",
      
      // Categories
      popularCategories: "Popular Categories",
      engineParts: "Engine Parts",
      brakeSystem: "Brake System",
      suspension: "Suspension",
      bodyParts: "Body Parts",
      parts: "parts",
      
      // Stats
      fastReliable: "Fast & Reliable",
      connectWithSellers: "Connect with verified sellers across Ghana",
      activeParts: "Active Parts",
      sellers: "Sellers",
      users: "Users",
      regions: "Regions",
      
      // Authentication
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone/WhatsApp",
      location: "Location",
      city: "City",
      country: "Country",
      language: "Language",
      currency: "Currency",
      
      // User Types
      buyer: "Buyer",
      seller: "Seller",
      admin: "Administrator",
      
      // Country & Location
      selectCountry: "Select your country",
      autoDetectLocation: "Auto-detect my location",
      detecting: "Detecting...",
      
      // Form Validation
      required: "Required",
      invalidEmail: "Invalid email address",
      passwordTooShort: "Password must be at least 6 characters",
      
      // Success Messages
      profileUpdated: "Profile updated successfully",
      registrationSuccessful: "Registration successful!",
      
      // Error Messages
      error: "Error",
      somethingWentWrong: "Something went wrong",
      tryAgain: "Please try again",
    }
  },
  fr: {
    translation: {
      // Common (French)
      welcome: "Bienvenue",
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler",
      continue: "Continuer",
      next: "Suivant",
      back: "Retour",
      edit: "Modifier",
      delete: "Supprimer",
      search: "Rechercher",
      filter: "Filtrer",
      
      // Navigation
      home: "Accueil",
      browse: "Parcourir les pièces",
      request: "Demander une pièce",
      messages: "Messages",
      dashboard: "Tableau de bord",
      profile: "Profil",
      signIn: "Se connecter",
      signOut: "Se déconnecter",
      signUp: "S'inscrire",
      
      // Hero Section
      heroTitle: "Trouver et vendre des pièces auto au Ghana",
      heroSubtitle: "Le moyen le plus simple de trouver et commander des pièces auto au Ghana. Comparez les prix de vendeurs de confiance.",
      requestCarParts: "Demander des pièces auto",
      findCarParts: "Trouver des pièces auto",
      sellCarParts: "Vendre des pièces auto",
      
      // Quick Actions & Navigation
      quickActions: "Actions rapides",
      findAvailableParts: "Trouver les pièces disponibles",
      cantFindAskHere: "Vous ne trouvez pas? Demandez ici",
      listPartsForSale: "Lister vos pièces à vendre",
      
      // Categories
      popularCategories: "Catégories populaires",
      engineParts: "Pièces moteur",
      brakeSystem: "Système de freinage",
      suspension: "Suspension",
      bodyParts: "Pièces de carrosserie",
      parts: "pièces",
      
      // Stats
      fastReliable: "Rapide et fiable",
      connectWithSellers: "Connectez-vous avec des vendeurs vérifiés au Ghana",
      activeParts: "Pièces actives",
      sellers: "Vendeurs",
      users: "Utilisateurs",
      regions: "Régions",
      
      // Authentication
      email: "Email",
      password: "Mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Téléphone/WhatsApp",
      location: "Localisation",
      city: "Ville",
      country: "Pays",
      language: "Langue",
      currency: "Devise",
      
      // User Types
      buyer: "Acheteur",
      seller: "Vendeur",
      admin: "Administrateur",
      
      // Country & Location
      selectCountry: "Sélectionner votre pays",
      autoDetectLocation: "Détecter automatiquement ma position",
      detecting: "Détection...",
      
      // Form Validation
      required: "Requis",
      invalidEmail: "Adresse email invalide",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
      
      // Success Messages
      profileUpdated: "Profil mis à jour avec succès",
      registrationSuccessful: "Inscription réussie!",
      
      // Error Messages
      error: "Erreur",
      somethingWentWrong: "Quelque chose s'est mal passé",
      tryAgain: "Veuillez réessayer",
    }
  },
  sw: {
    translation: {
      // Common (Swahili)
      welcome: "Karibu",
      loading: "Inapakia...",
      save: "Hifadhi",
      cancel: "Ghairi",
      continue: "Endelea",
      next: "Ifuatayo",
      back: "Rudi",
      edit: "Hariri",
      delete: "Futa",
      search: "Tafuta",
      filter: "Chuja",
      
      // Navigation
      home: "Nyumbani",
      browse: "Angalia Vipengee",
      request: "Omba Kipengee",
      messages: "Ujumbe",
      dashboard: "Dashibodi",
      profile: "Wasifu",
      signIn: "Ingia",
      signOut: "Toka",
      signUp: "Jisajili",
      
      // Hero Section
      heroTitle: "Pata na Uze Vipengee vya Magari Kenya",
      heroSubtitle: "Njia rahisi ya kupata na kuagiza vipengee vya magari Kenya. Linganisha bei kutoka kwa wachuuzi waaminifu na upate vipengee vya ubora vililetwe mlangoni mwako.",
      requestCarParts: "Omba Vipengee vya Gari",
      findCarParts: "Pata Vipengee vya Gari",
      sellCarParts: "Uza Vipengee vya Gari",
      
      // Quick Actions & Navigation
      quickActions: "Vitendo vya Haraka",
      findAvailableParts: "Pata vipengee vinavyopatikana",
      cantFindAskHere: "Huwezi kupata? Uliza hapa",
      listPartsForSale: "Orodhesha vipengee vyako vya kuuza",
      
      // Categories
      popularCategories: "Makundi Maarufu",
      engineParts: "Vipengee vya Injini",
      brakeSystem: "Mfumo wa Breki",
      suspension: "Kusimamisha",
      bodyParts: "Vipengee vya Mwili",
      parts: "vipengee",
      
      // Stats
      fastReliable: "Haraka na Kuaminika",
      connectWithSellers: "Unganishwa na wachuuzi waliohakikishwa nchini Kenya",
      activeParts: "Vipengee hai",
      sellers: "Wachuuzi",
      users: "Watumiaji",
      regions: "Mikoa",
      
      // Authentication
      email: "Barua pepe",
      password: "Nywila",
      firstName: "Jina la Kwanza",
      lastName: "Jina la Mwisho",
      phone: "Simu/WhatsApp",
      location: "Mahali",
      city: "Mji",
      country: "Nchi",
      language: "Lugha",
      currency: "Sarafu",
      
      // User Types
      buyer: "Mnunuzi",
      seller: "Muuzaji",
      admin: "Msimamizi",
      
      // Country & Location
      selectCountry: "Chagua nchi yako",
      autoDetectLocation: "Gundua mahali pangu kiotomatiki",
      detecting: "Inapata...",
      
      // Form Validation
      required: "Inahitajika",
      invalidEmail: "Anwani ya barua pepe si sahihi",
      passwordTooShort: "Nywila lazima iwe na angalau herufi 6",
      
      // Success Messages
      profileUpdated: "Wasifu umebadilishwa kwa mafanikio",
      registrationSuccessful: "Usajili umefanikiwa!",
      
      // Error Messages
      error: "Hitilafu",
      somethingWentWrong: "Kuna kitu kimekwenda vibaya",
      tryAgain: "Tafadhali jaribu tena",
    }
  },
  tw: {
    translation: {
      // Common (Twi)
      welcome: "Akwaaba",
      loading: "Ɛreloading...",
      save: "Koraa",
      cancel: "Gyae",
      continue: "Kɔ so",
      next: "Ɛdi hɔ",
      back: "Bɛsan",
      edit: "Sesa",
      delete: "Yi fi",
      search: "Hwehwɛ",
      filter: "Susuw",
      
      // Navigation
      home: "Fie",
      browse: "Hwɛ Nneɛma",
      request: "Bisa Nneɛma",
      messages: "Nkrasɛm",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Wuraa mu",
      signOut: "Fi adi",
      signUp: "Kyerɛw wo din",
      
      // Hero Section
      heroTitle: "Hwehwɛ na Tɔn Kar Nneɛma wɔ Ghana",
      heroSubtitle: "Ɔkwan a ɛyɛ mmerɛw sen biara a wobɛfa so ahwehwɛ na woatɔ kar nneɛma wɔ Ghana. Ka bo ahodoɔ ho asɛm kyerɛ adetɔnfoɔ a wogye wɔn di na nya nneɛma pa a wɔde bɛba wo nkyɛn.",
      requestCarParts: "Bisa Kar Nneɛma",
      findCarParts: "Hwehwɛ Kar Nneɛma",
      sellCarParts: "Tɔn Kar Nneɛma",
      
      // Quick Actions & Navigation
      quickActions: "Ntɛm Dwumadie",
      findAvailableParts: "Hwehwɛ nneɛma a ɛwɔ hɔ",
      cantFindAskHere: "Woanhu? Bisa wɔ ha",
      listPartsForSale: "Kyerɛw wo nneɛma a wobɛtɔn",
      
      // Categories
      popularCategories: "Nneɛma a Agye Din",
      engineParts: "Injin Nneɛma",
      brakeSystem: "Breki Nhyehyɛe",
      suspension: "Ntwentwɛn",
      bodyParts: "Nipadua Nneɛma",
      parts: "nneɛma",
      
      // Stats
      fastReliable: "Ntɛm & Ahotoso",
      connectWithSellers: "Fa wo ho ka adetɔnfoɔ a wɔahwɛ wɔn ho wɔ Ghana",
      activeParts: "Nneɛma a Ɛreyɛ Adwuma",
      sellers: "Adetɔnfoɔ",
      users: "Adefoofoɔ",
      regions: "Mpɔtam",
      
      // Authentication
      email: "Email",
      password: "Password",
      firstName: "Din a ɛdi kan",
      lastName: "Din a etwa to",
      phone: "Telefon/WhatsApp",
      location: "Baabi",
      city: "Kuropɔn",
      country: "Ɔman",
      language: "Kasa",
      currency: "Sika",
      
      // User Types
      buyer: "Otɔni",
      seller: "Odetɔnni",
      admin: "Ɔsoadwumayɛni",
      
      // Country & Location
      selectCountry: "Paw wo man",
      autoDetectLocation: "Hu me baabi ankasa",
      detecting: "Ɛrehwehwɛ...",
      
      // Form Validation
      required: "Ɛho hia",
      invalidEmail: "Email address no nyɛ",
      passwordTooShort: "Password no sua koraa ɛsɛ sɛ ɛyɛ nkyerɛwde 6",
      
      // Success Messages
      profileUpdated: "Wɔasesa profile no yiye",
      registrationSuccessful: "Wɔde wo din akyerɛw yiye!",
      
      // Error Messages
      error: "Mfomso",
      somethingWentWrong: "Biribi ankasa nyɛ yiye",
      tryAgain: "Yɛ srɛ wo sɔ bio",
    }
  },
  yo: {
    translation: {
      // Common (Yoruba)
      welcome: "Eku abo",
      loading: "N gbagbe...",
      save: "Fi pamo",
      cancel: "Fagilee",
      continue: "Tesiwaju",
      next: "To ba",
      back: "Pada sẹhin",
      edit: "Tunse",
      delete: "Pa rẹ",
      search: "Wa",
      filter: "Se ayẹwo",
      
      // Navigation
      home: "Ile",
      browse: "Wo awọn ẹya",
      request: "Beere ẹya",
      messages: "Ifiranṣẹ",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Wọle",
      signOut: "Jade",
      signUp: "Forukọsilẹ",
      
      // Hero Section
      heroTitle: "Wa ati Ta Awọn Ẹya Ọkọ ni Nigeria",
      heroSubtitle: "Ọna ti o rọrun julọ lati wa ati gba awọn ẹya ọkọ ni Nigeria. Ṣe afiwe awọn idiyele lati ọdọ awọn oluta ti o gbẹkẹle ati gba awọn ẹya didara ti a gbe de ẹnu-ọna rẹ.",
      requestCarParts: "Beere Awọn Ẹya Ọkọ",
      findCarParts: "Wa Awọn Ẹya Ọkọ",
      sellCarParts: "Ta Awọn Ẹya Ọkọ",
      
      // Quick Actions & Navigation
      quickActions: "Awọn Iṣe Kiakia",
      findAvailableParts: "Wa awọn ẹya ti o wa",
      cantFindAskHere: "Ko le ri? Beere nibi",
      listPartsForSale: "Ṣe akojọ awọn ẹya rẹ fun tita",
      
      // Categories
      popularCategories: "Awọn Ẹka Olokiki",
      engineParts: "Awọn Ẹya Enjini",
      brakeSystem: "Eto Breki",
      suspension: "Duduro",
      bodyParts: "Awọn Ẹya Ara",
      parts: "awọn ẹya",
      
      // Stats
      fastReliable: "Kiakia & Gbẹkẹle",
      connectWithSellers: "Sopọ pẹlu awọn oluta ti a ti rii daju ni gbogbo Nigeria",
      activeParts: "Awọn Ẹya Lilo",
      sellers: "Awọn Oluta",
      users: "Awọn Olumulo",
      regions: "Awọn Agbegbe",
      
      // Authentication
      email: "Email",
      password: "Ọrọ aṣina",
      firstName: "Orukọ akọkọ",
      lastName: "Orukọ idile",
      phone: "Fonu/WhatsApp",
      location: "Ipo",
      city: "Ilu",
      country: "Orilẹ-ede",
      language: "Ede",
      currency: "Owọ",
      
      // User Types
      buyer: "Oniranu",
      seller: "Oluta",
      admin: "Alakoso",
      
      // Country & Location
      selectCountry: "Yan orilẹ-ede rẹ",
      autoDetectLocation: "Ṣe ayẹwo ipo mi laifọwọyi",
      detecting: "N wa...",
      
      // Form Validation
      required: "O nilo",
      invalidEmail: "Adirẹsi email ti ko tọ",
      passwordTooShort: "Ọrọ aṣina gbọdọ jẹ o kere ju awọn kikọ 6",
      
      // Success Messages
      profileUpdated: "Profaili ti di imudojuiwọn ni aṣeyọri",
      registrationSuccessful: "Iforukọsilẹ aṣeyọri!",
      
      // Error Messages
      error: "Aṣiṣe",
      somethingWentWrong: "Nkankan ti lọ aṣiṣe",
      tryAgain: "Jọwọ gbiyanju lẹẹkansi",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('selectedLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;