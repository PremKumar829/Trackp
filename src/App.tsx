import React, { useState, useEffect } from 'react';
import { CampaignConfig, AnalyticsSummary } from './types';
import { AdLandingPage } from './components/AdLandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicAnalytics } from './components/PublicAnalytics';
import { BrowserHeader } from './components/BrowserHeader';
import { ParticleBackground } from './components/3d/ParticleBackground';
import { LayoutDashboard, Eye, BarChart3 } from 'lucide-react';

const DEFAULT_CAMPAIGN: CampaignConfig = {
  id: 'campaign-001',
  title: 'Prime X Earn',
  subtitle: 'Join Prime X Earn — India\'s #1 Premium VIP Telegram Channel for Free Signals & Income Updates',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  avatarBorderColor: '#ef4444',
  telegramLink: 'https://t.me/telegram',
  secondaryTelegramLink: 'https://t.me/telegram',
  telegramGroupLink: 'https://t.me/telegram',
  ctaText1: '✈ Join Free Telegram',
  ctaText2: '✈ Join Free Telegram',
  groupCtaText: '💬 Ask Question in VIP Group',
  questionPromptText: 'Ask a question directly to our team in Prime X Earn VIP Telegram Group!',
  timerSeconds: 595,
  adManagedByText: 'Ads managed by VYRNXY ADS',
  adManagedByLink: 'https://vyrnxyads.com',
  themePreset: 'light3d',
  enable3dPhysics: true,
  enableSound: true,
  verifyJoinModal: true,
  customDomainName: 'primexearn.in',
  customDomains: ['primexearn.in', 'vip.selfiegmrs.in', 't.primexearn.org', 'earn.vyads.com'],
};

const DEFAULT_ANALYTICS: AnalyticsSummary = {
  timeframe: 'today',
  currentISTDate: '2026-08-09',
  nextResetIST: new Date().toISOString(),
  totalVisits: 120,
  totalClicks: 78,
  totalJoins: 54,
  totalQuestions: 12,
  clickThroughRate: 65.0,
  joinConversionRate: 69.2,
  overallConversionRate: 45.0,
  recentEvents: [],
  hourlyChart: [],
  sourceBreakdown: [],
  deviceBreakdown: [],
  browserBreakdown: [],
};

export default function App() {
  const [viewMode, setViewMode] = useState<'ad' | 'admin' | 'public-analytics'>('ad');
  const [campaign, setCampaign] = useState<CampaignConfig>(DEFAULT_CAMPAIGN);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(DEFAULT_ANALYTICS);
  const [showInAppHeader, setShowInAppHeader] = useState<boolean>(true);

  // Check URL query parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'analytics' || viewParam === 'stats' || viewParam === 'public') {
      setViewMode('public-analytics');
    } else if (viewParam === 'admin') {
      setViewMode('admin');
    }
  }, []);

  // Fetch campaign settings
  const fetchCampaign = async () => {
    try {
      const res = await fetch('/api/campaign');
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      }
    } catch (err) {
      console.warn('Backend server connecting, using local campaign defaults');
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
  const trackVisit = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || 'instagram_ads';

      await fetch('/api/track/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: document.referrer || 'instagram.com',
          device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
          browser: 'Instagram In-App',
          utmSource,
        }),
      });
      fetchAnalytics();
    } catch (err) {
      // ignore
    }
  };

  // Track Telegram button click
  const handleTrackClick = async (buttonId: string) => {
    try {
      await fetch('/api/track/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buttonId,
          referrer: document.referrer || 'instagram.com',
          device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
          browser: 'Instagram In-App',
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
      await fetch('/api/track/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: document.referrer || 'instagram.com',
          device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
          browser: 'Instagram In-App',
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
    trackVisit();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-900 selection:bg-rose-500 selection:text-white">
      
      {/* 3D Particle ambient background when viewing Ad Landing page */}
      {viewMode === 'ad' && <ParticleBackground themePreset={campaign.themePreset} />}

      {/* Mode Switcher Floating Toggle Bar hidden by default for clean end-user presentation */}

      {/* Mode 1: Public 3D Ad Landing Page */}
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
            onTrackClick={handleTrackClick}
            onTrackJoin={handleTrackJoin}
          />
        </div>
      )}

      {/* Mode 2: Advertiser Admin Control Dashboard */}
      {viewMode === 'admin' && (
        <AdminDashboard
          campaign={campaign}
          analytics={analytics}
          onUpdateCampaign={handleUpdateCampaign}
          onRefreshAnalytics={fetchAnalytics}
          onResetAnalytics={handleResetAnalytics}
          onViewLiveAd={() => setViewMode('ad')}
        />
      )}

      {/* Mode 3: Public Analytics Page */}
      {viewMode === 'public-analytics' && (
        <PublicAnalytics onBack={() => setViewMode('ad')} />
      )}

    </div>
  );
}
