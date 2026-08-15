import React, { useState, useEffect } from 'react';
import { CampaignConfig, AnalyticsSummary, DestinationLink } from './types';
import { AdLandingPage } from './components/AdLandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicAnalytics } from './components/PublicAnalytics';
import { BrowserHeader } from './components/BrowserHeader';
import { ParticleBackground } from './components/3d/ParticleBackground';
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { detectAccurateLocation, GeoData } from './utils/geo';

const DEFAULT_LINKS: DestinationLink[] = [
  {
    id: 'link-receptionist',
    label: 'receptionist',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@Receptionist_Help',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Receptionist',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 400,
    googleWebhookUrl: 'https://script.google.com/macros/s/AKfycbw5UE-Gr3gA0qr8ildKaHAVCP0FrE9mf1xibKnDlK5xwgdpAjD9blnkjRyzQoFHf4WKCQ/exec',
    isActive: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'link-vip-bonus',
    label: 'vip-bonus',
    telegramTarget: 'https://t.me/telegram',
    telegramUsername: '@PrimeXEarn_VIP',
    heading: 'Instant ₹180-₹380 Welcome Reward',
    subtitle: 'Complete 1-5 daily tasks and withdraw directly to UPI/Bank account.',
    buttonText: '💰 Claim ₹380 Reward',
    badgeText: 'Instant Payout Verified',
    footerNote: 'Official Direct Gateway',
    autoRedirect: false,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'link-signals',
    label: 'signals',
    telegramTarget: 'https://t.me/telegram',
    telegramUsername: '@PrimeX_FreeSignals',
    heading: "India's #1 VIP Signals Channel",
    subtitle: 'Get 95%+ accuracy daily market signals and income tips for free.',
    buttonText: '✈ Join Free Signals Channel',
    badgeText: '45,000+ Active Members',
    footerNote: 'Official Telegram Channel',
    autoRedirect: false,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 3,
  }
];

const DEFAULT_CAMPAIGN: CampaignConfig = {
  id: 'campaign-001',
  title: 'VIP Verification Gateway',
  subtitle: 'Official direct Telegram gateway for verified VIP members and signal access.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  avatarBorderColor: '#ef4444',
  telegramLink: 'ZiB8EiGBh4I0Yjc1',
  secondaryTelegramLink: 'https://t.me/telegram',
  telegramGroupLink: 'https://t.me/telegram',
  ctaText1: '🚀 Contact Receptionist',
  ctaText2: '✈ Open Official Telegram',
  groupCtaText: '💬 Ask Question in VIP Group',
  questionPromptText: 'Ask a question directly to our team in VIP Telegram Group!',
  timerSeconds: 595,
  adManagedByText: 'Ads managed by VYRNXY ADS',
  adManagedByLink: 'https://t.me/+ec-4Jk1PY7w3Y2Vl',
  themePreset: 'light3d',
  cardStyle: 'professionalClean',
  enable3dPhysics: true,
  enableSound: true,
  verifyJoinModal: true,
  customDomainName: '',
  customDomains: ['vyads.link', 'vip-direct.me', 'secure-gateway.in'],
  links: DEFAULT_LINKS,
  defaultLinkLabel: 'prem',
  enableAutoBypass: true,
  autoBypassDelayMs: 300,
  googleWebhookUrl: 'https://script.google.com/macros/s/AKfycbw5UE-Gr3gA0qr8ildKaHAVCP0FrE9mf1xibKnDlK5xwgdpAjD9blnkjRyzQoFHf4WKCQ/exec',
  adminPassword: 'vyrnxy123',
};

const DEFAULT_ANALYTICS: AnalyticsSummary = {
  timeframe: 'today',
  currentISTDate: '2026-08-15',
  nextResetIST: new Date().toISOString(),
  totalVisits: 142,
  totalClicks: 94,
  totalJoins: 62,
  totalQuestions: 15,
  clickThroughRate: 66.2,
  joinConversionRate: 66.0,
  overallConversionRate: 43.7,
  recentEvents: [],
  hourlyChart: [],
  sourceBreakdown: [],
  deviceBreakdown: [],
  browserBreakdown: [],
  destinationBreakdown: [],
  locationBreakdown: [],
  cityBreakdown: []
};

export default function App() {
  const [viewMode, setViewMode] = useState<'ad' | 'admin' | 'public-analytics'>('ad');
  const [campaign, setCampaign] = useState<CampaignConfig>(DEFAULT_CAMPAIGN);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(DEFAULT_ANALYTICS);
  const [showInAppHeader, setShowInAppHeader] = useState<boolean>(false);
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string>('prem');

  // Admin Auth Password State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(
    () => sessionStorage.getItem('vyrnxy_admin_authed') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Determine active link based on URL params or campaign links
  const getActiveLink = (): DestinationLink => {
    const list = campaign.links || DEFAULT_LINKS;
    const found = list.find(l => l.label.toLowerCase() === currentSlug.toLowerCase());
    if (found) return found;

    const defaultFound = list.find(l => l.label === (campaign.defaultLinkLabel || 'receptionist'));
    if (defaultFound) return defaultFound;

    return list[0] || DEFAULT_LINKS[0];
  };

  const activeLink = getActiveLink();

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = campaign.adminPassword || 'vyrnxy123';
    if (passwordInput === correctPassword) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('vyrnxy_admin_authed', 'true');
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Incorrect admin password. Please try again.');
    }
  };

  // Check URL query parameters and pathname on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'analytics' || viewParam === 'stats' || viewParam === 'public') {
      setViewMode('public-analytics');
    } else if (viewParam === 'admin') {
      setViewMode('admin');
    }

    // Check link slug from query param or pathname
    const linkParam = params.get('link') || params.get('l') || params.get('ref') || params.get('target');
    if (linkParam) {
      setCurrentSlug(linkParam);
    } else {
      // Check pathname (e.g. /receptionist or /vip-bonus)
      const pathSlug = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
      if (pathSlug && pathSlug !== 'index.html' && !pathSlug.includes('.')) {
        setCurrentSlug(pathSlug);
      }
    }
  }, []);

  // Detect accurate location on mount
  useEffect(() => {
    detectAccurateLocation().then(data => {
      setGeo(data);
    });
  }, []);

  // Fetch campaign settings
  const fetchCampaign = async () => {
    try {
      const res = await fetch('/api/campaign');
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
        localStorage.setItem('vyrnxy_campaign_data', JSON.stringify(data));
      } else {
        const saved = localStorage.getItem('vyrnxy_campaign_data');
        if (saved) setCampaign(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Backend server connecting, using local campaign defaults');
      const saved = localStorage.getItem('vyrnxy_campaign_data');
      if (saved) {
        try {
          setCampaign(JSON.parse(saved));
        } catch (_) {}
      }
    }
  };

  // Fetch analytics summary
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Backend server connecting, using local analytics defaults');
    }
  };

  // Track initial page visit on load
  const trackVisit = async (clientGeo?: GeoData) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || 'instagram_ads';
      const activeL = getActiveLink();
      const effectiveGeo = clientGeo || geo;

      await fetch('/api/track/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: document.referrer || 'instagram.com',
          device: effectiveGeo?.device || (window.innerWidth < 768 ? 'Mobile' : 'Desktop'),
          browser: effectiveGeo?.browser || 'Instagram In-App',
          utmSource,
          city: effectiveGeo?.city,
          region: effectiveGeo?.region,
          country: effectiveGeo?.country,
          countryFlag: effectiveGeo?.countryFlag,
          countryCode: effectiveGeo?.countryCode,
          isp: effectiveGeo?.isp,
          ip: effectiveGeo?.ip,
          linkLabel: activeL.label,
          telegramUsername: activeL.telegramUsername,
        }),
      });
      fetchAnalytics();
    } catch (err) {
      // ignore
    }
  };

  // Track Telegram button click or auto-bypass
  const handleTrackClick = async (buttonId: string, isAutoBypass?: boolean) => {
    try {
      const activeL = getActiveLink();
      await fetch('/api/track/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buttonId,
          referrer: document.referrer || 'instagram.com',
          device: geo?.device || (window.innerWidth < 768 ? 'Mobile' : 'Desktop'),
          browser: geo?.browser || 'Instagram In-App',
          city: geo?.city,
          region: geo?.region,
          country: geo?.country,
          countryFlag: geo?.countryFlag,
          countryCode: geo?.countryCode,
          isp: geo?.isp,
          ip: geo?.ip,
          linkLabel: activeL.label,
          telegramUsername: activeL.telegramUsername,
          isAutoBypass: !!isAutoBypass
        }),
      });
      fetchAnalytics();
    } catch (err) {
      // ignore
    }
  };

  // Track Telegram confirmed join
  const handleTrackJoin = async () => {
    try {
      const activeL = getActiveLink();
      await fetch('/api/track/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: document.referrer || 'instagram.com',
          device: geo?.device || (window.innerWidth < 768 ? 'Mobile' : 'Desktop'),
          browser: geo?.browser || 'Instagram In-App',
          city: geo?.city,
          region: geo?.region,
          country: geo?.country,
          countryFlag: geo?.countryFlag,
          countryCode: geo?.countryCode,
          isp: geo?.isp,
          ip: geo?.ip,
          linkLabel: activeL.label,
          telegramUsername: activeL.telegramUsername,
        }),
      });
      fetchAnalytics();
    } catch (err) {
      // ignore
    }
  };

  // Update campaign
  const handleUpdateCampaign = async (updated: Partial<CampaignConfig>) => {
    const newConfig = { ...campaign, ...updated };
    setCampaign(newConfig);
    localStorage.setItem('vyrnxy_campaign_data', JSON.stringify(newConfig));

    try {
      await fetch('/api/campaign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
    } catch (err) {
      // ignore
    }
  };

  // Reset demo analytics
  const handleResetAnalytics = async () => {
    try {
      await fetch('/api/analytics/reset', { method: 'POST' });
      fetchAnalytics();
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchAnalytics();
    detectAccurateLocation().then(d => {
      setGeo(d);
      trackVisit(d);
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-900 selection:bg-sky-500 selection:text-white">
      
      {/* 3D Particle ambient background when viewing Ad Landing page */}
      {viewMode === 'ad' && <ParticleBackground themePreset={campaign.themePreset} />}

      {/* Mode 1: Public Ad Landing Page */}
      {viewMode === 'ad' && (
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Simulated In-App Instagram Header Bar */}
          <BrowserHeader
            domainName={campaign.customDomainName}
            sourceApp="Instagram"
            showInAppHeader={showInAppHeader}
            setShowInAppHeader={setShowInAppHeader}
          />

          <AdLandingPage
            campaign={campaign}
            activeLink={activeLink}
            geo={geo}
            onTrackClick={handleTrackClick}
            onTrackJoin={handleTrackJoin}
          />
        </div>
      )}

      {/* Mode 2: Advertiser Admin Control Dashboard */}
      {viewMode === 'admin' && (
        !isAdminUnlocked ? (
          <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 mb-4">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    <Lock className="w-8 h-8 text-sky-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">VYRNXY ADS Admin Gate</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your admin password to access control dashboard
                </p>
              </div>

              <form onSubmit={handleAdminUnlock} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="Enter admin password..."
                      className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-rose-400 font-medium mt-2 flex items-center gap-1">
                      ⚠️ {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('ad')}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer underline decoration-slate-600"
                  >
                    ← Return to Live Ad Page
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <AdminDashboard
            campaign={campaign}
            analytics={analytics}
            onUpdateCampaign={handleUpdateCampaign}
            onRefreshAnalytics={fetchAnalytics}
            onResetAnalytics={handleResetAnalytics}
            onViewLiveAd={() => setViewMode('ad')}
          />
        )
      )}

      {/* Mode 3: Public Analytics Page */}
      {viewMode === 'public-analytics' && (
        <PublicAnalytics
          onBack={() => setViewMode('ad')}
          initialAssistant={currentSlug ? `@${currentSlug}` : 'All'}
          onSelectAssistant={(slug) => {
            setCurrentSlug(slug);
            setViewMode('ad');
          }}
        />
      )}

    </div>
  );
}
