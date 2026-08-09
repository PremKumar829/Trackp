export type ThemePreset = 'light3d' | 'dark3d' | 'gold3d' | 'telegramBlue' | 'sunsetGlow' | 'cyberpunk';

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
  enable3dPhysics: boolean;
  enableSound: boolean;
  verifyJoinModal: boolean;
  customDomainName: string;
  customDomains?: string[]; // Multiple domains for link generation
  // Telegram Bot Integration Config
  botToken?: string;
  adminChatId?: string;
  enableBotNotifications?: boolean;
  questionPromptText?: string;
  adminPassword?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'visit' | 'click' | 'join' | 'question';
  timestamp: number;
  ip: string;
  location: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  referrer: string;
  utmSource?: string;
  buttonId?: string;
  questionText?: string;
}

export type TimeframeFilter = 'today' | '3days' | '30days' | 'all';

export interface AnalyticsSummary {
  timeframe: TimeframeFilter;
  currentISTDate: string;
  nextResetIST: string;
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
}

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
}
