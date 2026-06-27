export interface BetaReader {
  id: string;
  name: string;
  email: string;
  phone?: string;
  reason: string;
  createdAt: string;
}

export interface Quote {
  id: number;
  text: string;
  context: string;
}

export interface LandingTexts {
  upperTag: string;
  secretTitle: string;
  mainHookLine1: string;
  mainHookItalic: string;
  mainHookLine2: string;
  cursiveVibe: string;
  betaTitle: string;
  betaDesc: string;
  launchText: string;
  publisherName: string;
  formNameLabel: string;
  formEmailLabel: string;
  formPhoneLabel: string;
  formReasonLabel: string;
  formBtnText: string;
  countdownLabel: string;
  insyallahText: string;
  mistMessage?: string;
  
  // Customizable H-J-M-S Countdown Labels
  countdownDaysLabel?: string;
  countdownHoursLabel?: string;
  countdownMinutesLabel?: string;
  countdownSecondsLabel?: string;

  // Baru: Teks dan imej tambahan di atas/bawah logo
  aboveLogoText?: string;
  aboveLogoImageUrl?: string;
  belowLogoText?: string;
  belowLogoImageUrl?: string;
  successTitle?: string;
  successDesc?: string;
  successBtnText?: string;
}

export interface WebsiteStyles {
  serifFont: string; // 'EB Garamond' | 'Playfair Display' | 'Cinzel' | 'Georgia' | 'Inter'
  bodyFont: string;  // 'EB Garamond' | 'Inter' | 'JetBrains Mono' | 'Georgia'
  bgColor: string;     // Hex color (default: #430400)
  textColor: string;   // Hex color (default: #ffffff)
  accentColor: string; // Hex color (default: #d7b9b9)
  formBgColor: string; // Hex color (default: #5a0600)
  quoteSize: string;   // 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl'
  hookSize: string;    // 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl'
  showCountdown: boolean;
  showBorderFrame: boolean;
  showCursiveVibe: boolean;
  borderThickness: string; // '8px' | '12px' | '18px' | '24px' | '0px'
  logoText: string;
  logoType: 'text' | 'image';
  logoImageUrl: string;
  logoSize: string;
  logoWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  logoStyle: 'normal' | 'italic';
  
  // Advanced typography & size settings for all individual text components
  upperTagFont: string;
  upperTagSize: string;
  upperTagColor: string;
  
  countdownFont: string;
  countdownSize: string;
  countdownColor: string;
  countdownLabelFont?: string;
  countdownLabelSize?: string;
  countdownLabelColor?: string;
  
  logoFont: string;
  logoColor: string;
  
  quoteFont: string;
  quoteColor: string;
  
  cursiveFont: string;
  cursiveSize: string;
  cursiveColor: string;
  
  formTitleFont: string;
  formTitleSize: string;
  formTitleColor: string;
  
  formDescFont: string;
  formDescSize: string;
  formDescColor: string;
  
  footerFont: string;
  footerSize: string;
  footerColor: string;

  // Additional element styling fields
  aboveLogoFont?: string;
  aboveLogoSize?: string;
  aboveLogoColor?: string;
  
  belowLogoFont?: string;
  belowLogoSize?: string;
  belowLogoColor?: string;
  
  launchFont?: string;
  launchSize?: string;
  launchColor?: string;
  launchIcon?: string;
  launchIconUrl?: string;
  launchIconSize?: string;
  launchIconYOffset?: string;
  
  publisherFont?: string;
  publisherSize?: string;
  publisherColor?: string;
  publisherIcon?: string;
  publisherIconUrl?: string;
  publisherIconSize?: string;
  publisherIconYOffset?: string;

  // New features
  headerBgColor?: string;
  globalAlignment?: 'left' | 'center' | 'right';

  // Jarak Antara Elemen (Spacing)
  spacingPageTop?: string;
  spacingAboveLogo?: string;
  spacingLogo?: string;
  spacingBelowLogo?: string;
  spacingQuotes?: string;
  spacingCursive?: string;
  spacingBlocks?: string;

  // Logo under Cursive Vibe
  logoUnderCursiveUrl?: string;
  logoUnderCursiveSize?: string;

  // Background Audio
  audioUrl?: string;
  audioTitle?: string;
  audioEnabled?: boolean;

  // Google Sheets integration
  googleSheetsWebhookUrl?: string;

  // Iframe Embed Integration
  embedIframeEnabled?: boolean;
  embedIframeCode?: string;
  embedIframeTitle?: string;
  embedIframeWidth?: string; // e.g., 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-full'
  embedIframeHeight?: string; // e.g., '320px', '400px', '480px', '600px'
  embedIframePlayOnly?: boolean;

  // Footer and Copyright styling
  footerBgColor?: string;
  footerShowBorder?: boolean;
  copyrightFont?: string;
  copyrightSize?: string;
  copyrightColor?: string;

  // Nama pada tab pelayar
  tabTitle?: string;

  // Tetapan Khusus Skrin Telefon (Mobile Overrides)
  mobileSerifFont?: string;
  mobileBodyFont?: string;
  mobileBgColor?: string;
  mobileTextColor?: string;
  mobileAccentColor?: string;
  mobileFormBgColor?: string;
  mobileQuoteSize?: string;
  mobileHookSize?: string;
  mobileBorderThickness?: string;
  mobileLogoSize?: string;
  mobileUpperTagFont?: string;
  mobileUpperTagSize?: string;
  mobileUpperTagColor?: string;
  mobileCountdownFont?: string;
  mobileCountdownSize?: string;
  mobileCountdownColor?: string;
  mobileCountdownLabelFont?: string;
  mobileCountdownLabelSize?: string;
  mobileCountdownLabelColor?: string;
  mobileLogoFont?: string;
  mobileLogoColor?: string;
  mobileQuoteFont?: string;
  mobileQuoteColor?: string;
  mobileCursiveFont?: string;
  mobileCursiveSize?: string;
  mobileCursiveColor?: string;
  mobileFormTitleFont?: string;
  mobileFormTitleSize?: string;
  mobileFormTitleColor?: string;
  mobileFormDescFont?: string;
  mobileFormDescSize?: string;
  mobileFormDescColor?: string;
  mobileFooterFont?: string;
  mobileFooterSize?: string;
  mobileFooterColor?: string;
  mobileAboveLogoFont?: string;
  mobileAboveLogoSize?: string;
  mobileAboveLogoColor?: string;
  mobileBelowLogoFont?: string;
  mobileBelowLogoSize?: string;
  mobileBelowLogoColor?: string;
  mobileLaunchFont?: string;
  mobileLaunchSize?: string;
  mobileLaunchColor?: string;
  mobileLaunchIconSize?: string;
  mobileLaunchIconYOffset?: string;
  mobilePublisherFont?: string;
  mobilePublisherSize?: string;
  mobilePublisherColor?: string;
  mobilePublisherIconSize?: string;
  mobilePublisherIconYOffset?: string;
  mobileHeaderBgColor?: string;
  mobileGlobalAlignment?: 'left' | 'center' | 'right';
  mobileSpacingPageTop?: string;
  mobileSpacingAboveLogo?: string;
  mobileSpacingLogo?: string;
  mobileSpacingBelowLogo?: string;
  mobileSpacingQuotes?: string;
  mobileSpacingCursive?: string;
  mobileSpacingBlocks?: string;
  mobileLogoUnderCursiveSize?: string;
  mobileFooterBgColor?: string;
  mobileCopyrightFont?: string;
  mobileCopyrightSize?: string;
  mobileCopyrightColor?: string;
  mobileSpotlightEnabled?: boolean;
  mobileOverlayOpacity?: number;
  mobileCarouselSpeed?: number;
}

export interface CustomBlock {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'text' | 'image' | 'both';
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderThickness?: string; // '0px' | '1px' | '2px'
  borderRadius?: string;    // 'none' | 'sm' | 'md' | 'lg' | 'full'
  padding?: string;         // 'p-2' | 'p-4' | 'p-6' | 'p-8'
  alignment?: 'left' | 'center' | 'right';
  titleFont?: string;
  titleSize?: string;
  titleColor?: string;
  contentFont?: string;
  contentSize?: string;
  isSlider?: boolean;
  sliderInterval?: number; // e.g. 5000 for 5 seconds
  isCarousel?: boolean;
  carouselInterval?: number; // e.g. 7 for 7 seconds
  mobileTitleSize?: string;
  mobileContentSize?: string;
  mobilePadding?: string;
}
