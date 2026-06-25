import { Quote, LandingTexts, WebsiteStyles } from "./types";

export const DEFAULT_WEBSITE_STYLES: WebsiteStyles = {
  serifFont: "EB Garamond", // Google Fonts: EB Garamond, Playfair Display, Cinzel, Georgia
  bodyFont: "Inter",       // Inter, JetBrains Mono, Georgia
  bgColor: "#430400",
  textColor: "#ffffff",
  accentColor: "#d7b9b9",
  formBgColor: "#5a0600",
  quoteSize: "text-xl sm:text-2xl lg:text-3xl",
  hookSize: "text-2xl sm:text-3xl",
  showCountdown: true,
  showBorderFrame: true,
  showCursiveVibe: true,
  borderThickness: "18px",
  logoText: "Maktabah Alkutawi",
  logoType: 'text',
  logoImageUrl: "",
  logoSize: "36px",
  logoWeight: "semibold",
  logoStyle: "normal",
  
  // New granular styles default to empty strings to fall back on core values, or explicitly defined
  upperTagFont: "EB Garamond",
  upperTagSize: "11px",
  upperTagColor: "#d7b9b9",
  
  countdownFont: "EB Garamond",
  countdownSize: "16px",
  countdownColor: "#ffffff",
  
  logoFont: "EB Garamond",
  logoColor: "#ffffff",
  
  quoteFont: "EB Garamond",
  quoteColor: "#ffffff",
  
  cursiveFont: "Allison",
  cursiveSize: "36px",
  cursiveColor: "#d7b9b9",
  
  formTitleFont: "EB Garamond",
  formTitleSize: "24px",
  formTitleColor: "#d7b9b9",
  
  formDescFont: "Inter",
  formDescSize: "14px",
  formDescColor: "#ffffff",
  
  footerFont: "EB Garamond",
  footerSize: "12px",
  footerColor: "#ffffff",

  // Defaults for additional fields
  aboveLogoFont: "EB Garamond",
  aboveLogoSize: "14px",
  aboveLogoColor: "#ffffff",

  belowLogoFont: "EB Garamond",
  belowLogoSize: "16px",
  belowLogoColor: "#ffffff",

  launchFont: "Inter",
  launchSize: "11px",
  launchColor: "#ffffff",
  launchIcon: "Scroll",
  launchIconUrl: "",
  launchIconSize: "14px",
  launchIconYOffset: "0px",

  publisherFont: "Inter",
  publisherSize: "10px",
  publisherColor: "#ffffff",
  publisherIcon: "Library",
  publisherIconUrl: "https://i.postimg.cc/GmXHQzTZ/maktabah-kutawiyyah-(1).png",
  publisherIconSize: "24px",
  publisherIconYOffset: "0px",

  headerBgColor: "#430400",
  globalAlignment: "center",

  // Defaults for layout spacing
  spacingPageTop: "112px",
  spacingAboveLogo: "24px",
  spacingLogo: "48px",
  spacingBelowLogo: "24px",
  spacingQuotes: "24px",
  spacingCursive: "24px",
  spacingBlocks: "32px",

  // Logo under Cursive Vibe
  logoUnderCursiveUrl: "",
  logoUnderCursiveSize: "64px",

  // Background Audio
  audioUrl: "",
  audioTitle: "Latar Suasana (Ambient Audio)",
  audioEnabled: false,

  // Google Sheets integration
  googleSheetsWebhookUrl: "",

  // Iframe Embed Integration
  embedIframeEnabled: true,
  embedIframeCode: '<iframe src="https://drive.google.com/file/d/17YVkud6uAqE8cwNiNY5O2vQ6jP3qqRYf/preview" width="640" height="480"></iframe>',
  embedIframeTitle: "Pratonton Karya",
  embedIframeWidth: "max-w-2xl",
  embedIframeHeight: "480px",
  embedIframePlayOnly: true,
};

export const DEFAULT_LANDING_TEXTS: LandingTexts = {
  upperTag: "",
  secretTitle: "Sebuah Rahsia Yang Belum Bernama",
  mainHookLine1: "Setiap lembaran adalah",
  mainHookItalic: "jiwa",
  mainHookLine2: "yang dipinjamkan.",
  cursiveVibe: "Iman. Cinta. Sastera.",
  betaTitle: "pembaca beta",
  betaDesc: "Daftar nama anda untuk menjadi sebahagian daripada 10 orang pembaca beta yang berpeluang membaca sebahagian draf novel ini.",
  launchText: "sah.malians.group",
  publisherName: "Maktabah Kutawiyyah",
  formNameLabel: "Nama Penuh",
  formEmailLabel: "Alamat E-mel",
  formPhoneLabel: "No. Telefon",
  formReasonLabel: "Hasrat Pembaca",
  formBtnText: "Sertai Kami",
  countdownLabel: "mahakarya dalam pembinaan",
  insyallahText: "Insyah-Allah",
  
  countdownDaysLabel: "hari",
  countdownHoursLabel: "jam",
  countdownMinutesLabel: "minit",
  countdownSecondsLabel: "saat",

  aboveLogoText: "",
  aboveLogoImageUrl: "",
  belowLogoText: "",
  belowLogoImageUrl: "",
};

export const NOVEL_QUOTES: Quote[] = [
  {
    id: 1,
    text: "Sebelum itu, ana pinta surat ini tidak dibaca melainkan ketika ustaz dalam keadaan damai, lapang dan berseorang...",
    context: "Surat Pertama • Aisha Hamdan"
  },
  {
    id: 2,
    text: "kerana sesulit-sulit mata yang cuba memerhati ketika sedang silau, lebih sulit hati yang cuba mengerti ketika sedang galau.",
    context: "Surat #1 • Bicara tentang Hati"
  },
  {
    id: 3,
    text: "Bagaimanakah cara untuk memperlihatkan kecantikan tanpa mendedahkannya?",
    context: "Surat #1 • Pertanyaan Cepumas"
  },
  {
    id: 4,
    text: "Sastera adalah suatu alat yang boleh menggubah air mata menjadi cerita dan mengubah cerita menjadi air mata.",
    context: "Surat #5 • Cita-cita Kedua"
  },
  {
    id: 5,
    text: "Sesuatu yang dibina di atas kepalsuan tidak diberkati, dan sesuatu yang tidak diberkati tidak akan bertahan lama...",
    context: "Surat #7 • Lampiran Kebenaran"
  },
  {
    id: 6,
    text: "Sebagaimana kita memerlukan sedikit jarak untuk memahami sebuah lukisan, begitulah kita memerlukan sedikit masa untuk memahami sebuah ketentuan.",
    context: "Surat #7 • Titian Takdir"
  },
  {
    id: 7,
    text: "Dan bilamana pertemuan dan perpisahan ini diatur oleh Allah secara 'jaga' dan 'sengaja', maka kita hanya perlu jeda dan reda untuk memahami hikmah-Nya.",
    context: "Surat #2 • Jeda dan Reda"
  },
  {
    id: 8,
    text: "Setiap manusia berjalan di atas titian takdir tanpa mengetahui apa di hujungnya. Tetapi kita harus tetap berjalan.",
    context: "Surat #7 • Sebuah Penutup"
  }
];
