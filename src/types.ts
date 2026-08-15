export type ThemePreset = 'light3d' | 'dark3d' | 'gold3d' | 'telegramBlue' | 'sunsetGlow' | 'cyberpunk';
export type CardStyle = 'professionalClean' | 'glass3d' | 'classic3d';

export interface DestinationLink {
  id: string;
  label: string; // Slug/Label e.g. "prem", "killershiv9876", "Vyrnxy", "receptionist"
  group?: string; // Group tag e.g. "Win03"
  telegramTarget: string; // Invite ID e.g. "ZiB8EiGBh4I0Yjc1" or username e.g. "@prem" or full url "https://t.me/..."
  telegramUsername: string; // Clean display handle or invite code e.g. "@prem" or "ZiB8EiGBh4I0Yjc1"
  heading: string; // e.g. "You're Just One Step Away!"
  subtitle: string; // e.g. "Click the button below to get 180-380 welcome bonus by completing 1-5 task."
  buttonText: string; // e.g. "🚀 Contact Prem"
  badgeText?: string; // e.g. "180-380 Bonus Guaranteed"
  footerNote?: string; // e.g. "Secure & Verified Direct Link"
  autoRedirect: boolean;
  autoRedirectDelayMs: number; // e.g. 0ms, 200ms, 400ms
  googleWebhookUrl?: string;
  isActive: boolean;
  createdAt: number;
}

export interface GeneratedTrackingLink {
  id: string;
  domain: string;
  targetType: 'channel' | 'group' | 'custom';
  targetUrl: string;
  utmSource: string;
  utmCampaign?: string;
  title?: string;
  fullUrl: string;
  createdAt: number;
  linkLabel?: string;
}

export interface CampaignConfig {
  id: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
  avatarBorderColor: string;
  telegramLink: string; // Primary Channel Link
  telegramGroupLink?: string; // VIP Group Link for Q&A
  secondaryTelegramLink?: string;
  ctaText1: string;
  ctaText2: string;
  groupCtaText?: string;
  timerSeconds: number; // total duration in seconds for countdown
  adManagedByText: string;
  adManagedByLink: string;
  themePreset: ThemePreset;
  cardStyle?: CardStyle;
  enable3dPhysics: boolean;
  enableSound: boolean;
  verifyJoinModal: boolean;
  customDomainName: string;
  customDomains?: string[]; // Multiple domains for link generation
  // Multi-Link Destinations
  links: DestinationLink[];
  defaultLinkLabel?: string;
  // Auto-Bypass & Deep Linking
  enableAutoBypass?: boolean;
  autoBypassDelayMs?: number; // delay in ms
  googleWebhookUrl?: string; // Google Apps Script URL
  // Telegram Bot Integration Config
  botToken?: string;
  adminChatId?: string;
  adminChatIds?: string[];
  subadminChatId?: string;
  subadminChatIds?: string[];
  enableBotNotifications?: boolean;
  questionPromptText?: string;
  adminPassword?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'visit' | 'click' | 'join' | 'question' | 'bypass';
  timestamp: number;
  ip: string;
  location: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  region?: string;
  city?: string;
  isp?: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  referrer: string;
  utmSource?: string;
  buttonId?: string;
  questionText?: string;
  linkLabel?: string;
  telegramUsername?: string;
  isAutoBypass?: boolean;
}

export type TimeframeFilter = 'today' | 'yesterday' | '7days' | '30days' | 'all';

export interface AnalyticsSummary {
  timeframe: TimeframeFilter;
  currentISTDate: string;
  currentISTTime?: string;
  nextResetIST: string;
  resetCycleLabel?: string; // e.g. "Today (8PM IST Reset Cycle)"
  totalVisits: number;
  totalClicks: number;
  totalJoins: number;
  totalQuestions: number;
  clickThroughRate: number; // (clicks / visits) * 100
  joinConversionRate: number; // (joins / clicks) * 100
  overallConversionRate: number; // (joins / visits) * 100
  recentEvents: AnalyticsEvent[];
  hourlyChart: { time: string; visits: number; clicks: number; joins: number }[];
  sourceBreakdown: { source: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  destinationBreakdown: { label: string; username: string; visits: number; clicks: number; joins: number; ctr: number }[];
  locationBreakdown: { location: string; flag: string; count: number; percentage: number }[];
  cityBreakdown: { city: string; region: string; country: string; flag: string; count: number }[];
  groups?: string[];
  groupBreakdown?: { group: string; visits: number; clicks: number; joins: number; cvr: number; ctr: number }[];
  performerBreakdown?: {
    username: string;
    label: string;
    group: string;
    visits: number;
    clicks: number;
    joins: number;
    convRate: number;
    ctr: number;
    linkTarget?: string;
  }[];
}

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
}
