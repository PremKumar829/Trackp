import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, MousePointerClick, UserCheck, TrendingUp, RefreshCw, Download, Settings, Link as LinkIcon,
  Palette, Eye, ExternalLink, Copy, Check, Filter, ShieldCheck, Sparkles, Smartphone, Globe, Clock,
  ArrowRight, Flame, Layers, Play, RotateCcw, Bot, Send, MessageSquare, CheckCircle2, AlertCircle,
  Terminal, Zap, Lock, EyeOff, MessageCircle, BellRing
} from 'lucide-react';
import { CampaignConfig, AnalyticsSummary, AvatarPreset, ThemePreset } from '../types';

interface AdminDashboardProps {
  campaign: CampaignConfig;
  analytics: AnalyticsSummary;
  onUpdateCampaign: (updated: Partial<CampaignConfig>) => void;
  onRefreshAnalytics: () => void;
  onResetAnalytics: () => void;
  onViewLiveAd: () => void;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'selfie_guy',
    name: 'Selfie Guy (Original)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'crypto_trader',
    name: 'Crypto & Forex Trader',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fitness_coach',
    name: 'Fitness & VIP Coach',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'tech_influencer',
    name: 'Tech Influencer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'growth_expert',
    name: 'Growth & Business Analyst',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
  }
];

const BORDER_COLORS = [
  { label: 'Red (#ef4444)', value: '#ef4444' },
  { label: 'Telegram Blue (#0088cc)', value: '#0088cc' },
  { label: 'Emerald Green (#10b981)', value: '#10b981' },
  { label: 'Gold Amber (#f59e0b)', value: '#f59e0b' },
  { label: 'Purple Neon (#a855f7)', value: '#a855f7' },
  { label: 'Rose Pink (#f43f5e)', value: '#f43f5e' }
];

const THEME_OPTIONS: { id: ThemePreset; name: string; desc: string }[] = [
  { id: 'light3d', name: 'Light 3D (Original)', desc: 'Clean white shadow card matching screenshot' },
  { id: 'dark3d', name: 'Dark Slate 3D', desc: 'Premium sleek dark mode with soft glow' },
  { id: 'gold3d', name: 'Royal Gold 3D', desc: 'Luxury dark amber & gold VIP finish' },
  { id: 'telegramBlue', name: 'Telegram Ocean Blue', desc: 'Official Telegram brand blue gradient' },
  { id: 'sunsetGlow', name: 'Sunset Glow', desc: 'Vibrant crimson & rose gradient background' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Futuristic cyan and pink neon highlights' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  campaign,
  analytics,
  onUpdateCampaign,
  onRefreshAnalytics,
  onResetAnalytics,
  onViewLiveAd,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaign' | 'links' | 'feed' | 'bot'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedBotCmd, setCopiedBotCmd] = useState(false);
  const [utmSource, setUtmSource] = useState('instagram_ads');

  // Multi-Domain & Link Generator State
  const [newDomainInput, setNewDomainInput] = useState('');
  const [targetType, setTargetType] = useState<'channel' | 'group' | 'custom'>('channel');
  const [customTargetUrl, setCustomTargetUrl] = useState('');
  const [copiedDomainIndex, setCopiedDomainIndex] = useState<number | null>(null);

  // Telegram Bot State
  const [showBotToken, setShowBotToken] = useState(false);
  const [testBotLoading, setTestBotLoading] = useState(false);
  const [testBotResult, setTestBotResult] = useState<{ success: boolean; message: string; botInfo?: any } | null>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Simulated Telegram Chat Terminal
  const [simulatedCommand, setSimulatedCommand] = useState('/stats');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '🤖 <b>TELEGRAM AD TRACKER BOT READY</b>\n\nI am connected to your ad platform. Send <b>/stats</b> to check live performance or <b>/recent</b> to view new channel members!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isSendingCmd, setIsSendingCmd] = useState(false);

  const appUrl = window.location.origin;
  const trackingUrl = `${appUrl}/?utm_source=${utmSource}`;
  const embedCode = `<iframe src="${appUrl}" width="100%" height="700" frameborder="0" style="border:0; border-radius: 24px;" allow="accelerometer; autoplay; encrypted-media; gyroscope;"></iframe>`;

  const handleCopy = (text: string, type: 'link' | 'embed') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  const handleAddDomain = () => {
    if (!newDomainInput.trim()) return;
    const cleanDom = newDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const currentList = campaign.customDomains || ['primexearn.in'];
    if (!currentList.includes(cleanDom)) {
      onUpdateCampaign({ customDomains: [...currentList, cleanDom] });
    }
    setNewDomainInput('');
  };

  const handleRemoveDomain = (domToRemove: string) => {
    const currentList = campaign.customDomains || ['primexearn.in'];
    const updated = currentList.filter(d => d !== domToRemove);
    onUpdateCampaign({ customDomains: updated.length > 0 ? updated : ['primexearn.in'] });
  };

  // Test Telegram Bot Connection
  const handleTestBotConnection = async () => {
    setTestBotLoading(true);
    setTestBotResult(null);
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: campaign.botToken,
          chatId: campaign.adminChatId
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestBotResult({
          success: true,
          message: `Connected to Bot @${data.bot.username} (${data.bot.name})! ${data.chatPing?.success ? 'Test ping message sent to your admin chat!' : ''}`,
          botInfo: data.bot
        });
      } else {
        setTestBotResult({
          success: false,
          message: data.error || 'Failed to connect to Telegram Bot API.'
        });
      }
    } catch (err: any) {
      setTestBotResult({
        success: false,
        message: err.message || 'Network error testing Telegram Bot'
      });
    } finally {
      setTestBotLoading(false);
    }
  };

  // Set Telegram Webhook
  const handleSetWebhook = async () => {
    setWebhookLoading(true);
    setWebhookResult(null);
    try {
      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: campaign.botToken,
          appUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setWebhookResult({
          success: true,
          message: `Webhook registered successfully at: ${data.webhookUrl}`
        });
      } else {
        setWebhookResult({
          success: false,
          message: data.error || 'Failed to set webhook.'
        });
      }
    } catch (err: any) {
      setWebhookResult({
        success: false,
        message: err.message || 'Error registering webhook'
      });
    } finally {
      setWebhookLoading(false);
    }
  };

  // Execute or Simulate Telegram Command
  const handleSimulateCommand = async (customCmd?: string) => {
    const cmd = customCmd || simulatedCommand;
    if (!cmd.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: 'user', text: cmd, time: userTime }]);
    setSimulatedCommand('');
    setIsSendingCmd(true);

    try {
      const res = await fetch('/api/telegram/simulate-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.responseText || 'Error processing command',
          time: botTime
        }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Error reaching server bot endpoint',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSendingCmd(false);
    }
  };

  // Trigger Simulated Member Join Alert
  const handleSimulateJoinAlert = async () => {
    try {
      const locations = ['Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'London, UK', 'Dubai, UAE'];
      const randLoc = locations[Math.floor(Math.random() * locations.length)];
      
      const res = await fetch('/api/track/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: 'instagram_ad',
          device: 'Mobile',
          browser: 'Instagram App',
          location: randLoc
        })
      });
      const data = await res.json();
      onRefreshAnalytics();

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const alertText = `🚀 <b>NEW MEMBER JOINED TELEGRAM CHANNEL!</b>\n\n` +
        `📍 <b>Location:</b> ${randLoc}\n` +
        `📱 <b>Device:</b> Mobile (Instagram App)\n` +
        `🌐 <b>Source:</b> instagram_ad\n` +
        `🕒 <b>Time:</b> ${timeStr}\n\n` +
        `📊 <i>Instant notification sent to Telegram admin chat!</i>`;

      setChatHistory(prev => [...prev, { sender: 'bot', text: alertText, time: timeStr }]);
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Admin Navigation Header (Sleek Interface Theme) */}
      <header className="bg-[#08090D]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center text-white font-extrabold text-xl">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                AD·TRACKER <span className="text-blue-500">PRO</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-semibold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ● OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-white/40">
              Ad Domain: <code className="text-blue-400 font-mono">{campaign.customDomainName || 'selfiegmrs.in'}</code>
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Sleek Interface Pill Header) */}
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('campaign')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'campaign'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            3D Customizer
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'links'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Tracking Links
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Live Stream ({analytics.recentEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bot'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-sky-400/80 hover:text-sky-300'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>Telegram Bot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onRefreshAnalytics}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl transition-all border border-white/10 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Live Analytics"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href="/api/export"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl transition-all border border-white/10 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Download CSV Report"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">CSV Report</span>
          </a>

          <button
            onClick={onViewLiveAd}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-[0_10px_30px_rgba(37,99,235,0.3)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View 3D Ad Page</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards (Sleek Glassmorphism Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Total Page Visits */}
              <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Page Visits</p>
                <h2 className="text-4xl font-bold tracking-tighter text-white mb-2">{analytics.totalVisits.toLocaleString()}</h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md text-xs font-bold">+100%</span>
                  <span className="text-white/30 text-xs">live impressions</span>
                </div>
              </div>

              {/* Card 2: Telegram Link Clicks */}
              <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Total Link Clicks</p>
                <h2 className="text-4xl font-bold tracking-tighter text-white mb-2">{analytics.totalClicks.toLocaleString()}</h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-md text-xs font-bold">{analytics.clickThroughRate}% CTR</span>
                  <span className="text-white/30 text-xs">click conversion</span>
                </div>
              </div>

              {/* Card 3: Telegram Joins */}
              <div className="bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-1">Telegram Joins</p>
                <h2 className="text-4xl font-bold tracking-tighter text-blue-100 mb-2">{analytics.totalJoins.toLocaleString()}</h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md text-xs font-bold">{analytics.joinConversionRate}%</span>
                  <span className="text-white/30 text-xs">conversion rate</span>
                </div>
              </div>

              {/* Card 4: Overall Funnel % */}
              <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Overall Conversion %</p>
                <h2 className="text-4xl font-bold tracking-tighter text-rose-300 mb-2">{analytics.overallConversionRate}%</h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md text-xs font-bold">End-to-End</span>
                  <span className="text-white/30 text-xs">visits ➔ joined</span>
                </div>
              </div>

            </div>

            {/* Conversion Funnel Bar */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>Conversion Funnel Performance Matrix</span>
              </h2>

              <div className="space-y-5">
                {/* Step 1: Page Visits */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/70">1. Total Ad Page Visits</span>
                    <span className="text-white font-mono">{analytics.totalVisits} (100%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Step 2: Clicks */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/70">2. Clicked Telegram Channel Link</span>
                    <span className="text-sky-400 font-mono">{analytics.totalClicks} ({analytics.clickThroughRate}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(analytics.clickThroughRate, 100)}%` }} />
                  </div>
                </div>

                {/* Step 3: Joins */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white/70">3. Confirmed Telegram Channel Joined</span>
                    <span className="text-emerald-400 font-mono">{analytics.totalJoins} ({analytics.overallConversionRate}% of Visits)</span>
                  </div>
                  <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(analytics.overallConversionRate, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">Real-time Traffic Flow Visualization</h2>
                  <p className="text-xs text-white/40">24-Hour live stream of pageviews, link clicks, and member channel joins</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> Visits</span>
                  <span className="flex items-center gap-1.5 text-sky-400"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Clicks</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Joins</span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.hourlyChart}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorJoins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#08090D', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" name="Page Visits" />
                    <Area type="monotone" dataKey="clicks" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" name="Link Clicks" />
                    <Area type="monotone" dataKey="joins" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorJoins)" name="Members Joined" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Sources & Device Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sources */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Traffic Sources (Ad Channels)</span>
                </h3>

                <div className="space-y-3">
                  {analytics.sourceBreakdown.map((src, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-semibold text-slate-200 capitalize">{src.source}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/40">{src.count} visits</span>
                        <span className="font-bold text-blue-400 font-mono">{src.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device breakdown */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Device & Browser Distribution</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Devices</span>
                    {analytics.deviceBreakdown.map((d, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-300">{d.device}</span>
                        <span className="font-bold text-emerald-400 font-mono">{d.count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Browsers</span>
                    {analytics.browserBreakdown.map((b, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs truncate">
                        <span className="text-slate-300 truncate">{b.browser}</span>
                        <span className="font-bold text-sky-400 ml-1 font-mono">{b.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Reset Simulation Data Footer Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onResetAnalytics}
                className="text-xs text-white/40 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Analytics Data</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: 3D AD PAGE CUSTOMIZER */}
        {activeTab === 'campaign' && (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-400" />
                <span>Visual 3D Ad Page Customizer</span>
              </h2>
              <p className="text-xs text-white/40">
                Customize avatar, title, buttons, countdown timer, theme, and ad manager footer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Avatar Selector & Presets */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block">
                  Profile Avatar Image
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => onUpdateCampaign({ avatarUrl: preset.url })}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center cursor-pointer ${
                        campaign.avatarUrl === preset.url
                          ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-12 h-12 rounded-full object-cover mb-1 border-2 border-slate-700" />
                      <span className="text-[10px] text-center font-semibold text-slate-300 truncate w-full">{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Custom Avatar Image URL</label>
                  <input
                    type="text"
                    value={campaign.avatarUrl}
                    onChange={(e) => onUpdateCampaign({ avatarUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>

                {/* Avatar Ring Border Color */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">
                    Avatar Ring Border Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BORDER_COLORS.map((col) => (
                      <button
                        key={col.value}
                        onClick={() => onUpdateCampaign({ avatarBorderColor: col.value })}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${
                          campaign.avatarBorderColor === col.value ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: col.value }}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1">
                    Ad Page Title
                  </label>
                  <input
                    type="text"
                    value={campaign.title}
                    onChange={(e) => onUpdateCampaign({ title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-hidden focus:border-blue-500"
                    placeholder="Prime X Earn"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1">
                    Subtitle / Description (Optional)
                  </label>
                  <textarea
                    value={campaign.subtitle}
                    onChange={(e) => onUpdateCampaign({ subtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
                    placeholder="Join Prime X Earn — India's #1 Premium VIP Telegram Channel..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1">
                      Telegram Channel Destination URL
                    </label>
                    <input
                      type="text"
                      value={campaign.telegramLink}
                      onChange={(e) => onUpdateCampaign({ telegramLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-sky-400 font-mono focus:outline-hidden focus:border-blue-500"
                      placeholder="https://t.me/your_telegram_channel"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1">
                      Telegram VIP Group Destination URL (Q&A)
                    </label>
                    <input
                      type="text"
                      value={campaign.telegramGroupLink || ''}
                      onChange={(e) => onUpdateCampaign({ telegramGroupLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-emerald-400 font-mono focus:outline-hidden focus:border-blue-500"
                      placeholder="https://t.me/your_telegram_group"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Top Button Label</label>
                    <input
                      type="text"
                      value={campaign.ctaText1}
                      onChange={(e) => onUpdateCampaign({ ctaText1: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Bottom Button Label</label>
                    <input
                      type="text"
                      value={campaign.ctaText2}
                      onChange={(e) => onUpdateCampaign({ ctaText2: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Group Button Label</label>
                    <input
                      type="text"
                      value={campaign.groupCtaText || ''}
                      onChange={(e) => onUpdateCampaign({ groupCtaText: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-emerald-300"
                      placeholder="💬 Ask Question in VIP Group"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Ad Managed By Footer Text</label>
                  <input
                    type="text"
                    value={campaign.adManagedByText}
                    onChange={(e) => onUpdateCampaign({ adManagedByText: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-rose-400"
                    placeholder="Ads managed by VYRNXY ADS"
                  />
                </div>
              </div>

            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-3">
                3D Theme Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateCampaign({ themePreset: theme.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      campaign.themePreset === theme.id
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-1">{theme.name}</div>
                    <div className="text-[10px] text-white/40 leading-tight">{theme.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Physics & Features Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaign.enable3dPhysics}
                  onChange={(e) => onUpdateCampaign({ enable3dPhysics: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Interactive 3D Tilt</span>
                  <span className="text-[10px] text-white/40">Mouse/Touch card perspective</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaign.enableSound}
                  onChange={(e) => onUpdateCampaign({ enableSound: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Click Sound FX</span>
                  <span className="text-[10px] text-white/40">Audible button press feedback</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaign.verifyJoinModal}
                  onChange={(e) => onUpdateCampaign({ verifyJoinModal: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Track Member Joins</span>
                  <span className="text-[10px] text-white/40">Confirm popup to count joins</span>
                </div>
              </label>
            </div>

          </div>
        )}

        {/* TAB 3: MULTI-DOMAIN TRACKING LINKS & BOT LINK GENERATOR */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            
            {/* 1. DOMAINS MANAGEMENT CARD */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-400" />
                    <span>Multiple Domain Management</span>
                  </h2>
                  <p className="text-xs text-white/40">
                    Register multiple custom domains or subdomains to route ad traffic and generate instant tracking links.
                  </p>
                </div>
                <div className="text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full self-start sm:self-auto">
                  {campaign.customDomains?.length || 1} Active Domains
                </div>
              </div>

              {/* Add New Domain Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                  placeholder="e.g. vip.selfiegmrs.in or t.primexearn.org"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-blue-500"
                />
                <button
                  onClick={handleAddDomain}
                  className="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-600/30 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>+ Add Domain</span>
                </button>
              </div>

              {/* Active Domains List Chips */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {(campaign.customDomains || ['primexearn.in']).map((dom) => {
                  const isPrimary = dom === (campaign.customDomainName || 'primexearn.in');
                  return (
                    <div
                      key={dom}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
                        isPrimary
                          ? 'bg-blue-600/20 border-blue-500 text-sky-300 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-400" />
                      <span>{dom}</span>
                      {isPrimary ? (
                        <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-md font-sans uppercase font-bold">
                          Primary
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRemoveDomain(dom)}
                          className="text-white/40 hover:text-rose-400 cursor-pointer text-xs ml-1 font-bold"
                          title="Remove domain"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. MULTI-DOMAIN LINK GENERATOR FOR CHANNEL & GROUP */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-emerald-400" />
                    <span>Auto Multi-Domain Link Generator (Channel & Group)</span>
                  </h2>
                  <p className="text-xs text-white/40">
                    Generate tracking links across all active domains for Telegram Channel or Telegram VIP Group.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const botCmd = `/genlink ${targetType === 'channel' ? campaign.telegramLink : (campaign.telegramGroupLink || campaign.telegramLink)} ${targetType}`;
                    navigator.clipboard.writeText(botCmd);
                    setCopiedBotCmd(true);
                    setTimeout(() => setCopiedBotCmd(false), 2000);
                  }}
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>{copiedBotCmd ? 'Bot Command Copied!' : 'Copy Telegram Bot /genlink'}</span>
                </button>
              </div>

              {/* Target & UTM Selector Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Target Type Selector */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">
                    1. Select Telegram Destination Target
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTargetType('channel')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        targetType === 'channel'
                          ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5 mb-1">
                        <Send className="w-3.5 h-3.5 text-sky-400" />
                        <span>Telegram Channel</span>
                      </div>
                      <div className="text-[10px] text-white/40 truncate font-mono">
                        {campaign.telegramLink || 'https://t.me/...'}
                      </div>
                    </button>

                    <button
                      onClick={() => setTargetType('group')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        targetType === 'group'
                          ? 'bg-emerald-600/20 border-emerald-500 text-white ring-2 ring-emerald-500'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>VIP Group (Q&A)</span>
                      </div>
                      <div className="text-[10px] text-white/40 truncate font-mono">
                        {campaign.telegramGroupLink || campaign.telegramLink}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Campaign UTM Source Selector */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">
                    2. Select Campaign Traffic Source / UTM
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['instagram_ads', 'facebook_ads', 'telegram_promo', 'google_ads', 'influencer_vip', 'bio_link'].map((src) => (
                      <button
                        key={src}
                        onClick={() => setUtmSource(src)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          utmSource === src
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-white/50 hover:text-white border border-white/10'
                        }`}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Instant Live Deployment Link (100% Working) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-blue-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      ⚡ Instant Live App Link (100% Working Now - No DNS Setup Needed)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                    Active Preview URL
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?utm_source=${utmSource}&target=${targetType}&redirect=${encodeURIComponent(targetType === 'channel' ? campaign.telegramLink : (campaign.telegramGroupLink || campaign.telegramLink))}`}
                    className="flex-1 px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-emerald-300 select-all"
                  />
                  <button
                    onClick={() => {
                      const liveUrl = `${window.location.origin}/?utm_source=${utmSource}&target=${targetType}&redirect=${encodeURIComponent(targetType === 'channel' ? campaign.telegramLink : (campaign.telegramGroupLink || campaign.telegramLink))}`;
                      navigator.clipboard.writeText(liveUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Live Link'}</span>
                  </button>
                  <a
                    href={`${window.location.origin}/?utm_source=${utmSource}&target=${targetType}&redirect=${encodeURIComponent(targetType === 'channel' ? campaign.telegramLink : (campaign.telegramGroupLink || campaign.telegramLink))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    title="Open Live Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[11px] text-white/50">
                  Use this link immediately in browser, ads, or testing to bypass domain DNS requirements!
                </p>
              </div>

              {/* Generated Links for Custom Domains */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest block">
                    Custom Domain Tracking Links ({(campaign.customDomains || ['primexearn.in']).length})
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium">
                    ⚠️ Custom domains require DNS setup at domain registrar
                  </span>
                </div>

                <div className="space-y-3">
                  {(campaign.customDomains || ['primexearn.in']).map((dom, idx) => {
                    const cleanDom = dom.replace(/^https?:\/\//, '').replace(/\/$/, '');
                    const targetUrl = targetType === 'channel' ? campaign.telegramLink : (campaign.telegramGroupLink || campaign.telegramLink);
                    const generatedLink = `https://${cleanDom}/?utm_source=${utmSource}&target=${targetType}&redirect=${encodeURIComponent(targetUrl)}`;

                    return (
                      <div
                        key={dom}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-sky-400 flex items-center justify-center shrink-0 font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-mono">{cleanDom}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                targetType === 'channel' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {targetType}
                              </span>
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-sans">
                                Custom Domain
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-sky-300/80 truncate mt-0.5">
                              {generatedLink}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedLink);
                              setCopiedDomainIndex(idx);
                              setTimeout(() => setCopiedDomainIndex(null), 2000);
                            }}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                          >
                            {copiedDomainIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedDomainIndex === idx ? 'Copied!' : 'Copy'}</span>
                          </button>

                          <a
                            href={generatedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                            title="Test Link in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DNS Setup & Troubleshooting Guide */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/20 text-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>💡</span>
                  <span>Why do I see "DNS_PROBE_FINISHED_NXDOMAIN" for primexearn.in?</span>
                </div>
                <p className="text-white/70 leading-relaxed">
                  If you click a custom domain link like <b>primexearn.in</b> before configuring DNS, your browser shows <code>DNS_PROBE_FINISHED_NXDOMAIN</code> because the domain name has not been linked to an active hosting server yet.
                </p>
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/10 space-y-2 font-mono text-[11px]">
                  <p className="text-sky-300 font-bold font-sans">How to set up custom domain DNS (e.g. GoDaddy, Cloudflare, Namecheap):</p>
                  <p className="text-slate-300">1. Go to your DNS Manager in GoDaddy / Cloudflare.</p>
                  <p className="text-slate-300">2. Add a <b>CNAME Record</b>: Name: <code>@</code> or <code>www</code> ➔ Value: <code>{window.location.host}</code></p>
                  <p className="text-slate-300">3. Save and wait 5-10 minutes for DNS propagation.</p>
                </div>
                <p className="text-emerald-400 font-medium">
                  ✅ <b>Instant Fix:</b> Use the <b>Instant Live App Link</b> at the top of this page! It works 100% immediately without any DNS setup required.
                </p>
              </div>

              {/* Embed Code */}
              <div className="pt-2 border-t border-white/10">
                <label className="text-xs text-white/40 mb-1 block">iFrame Embed Code for External Websites</label>
                <div className="flex items-center gap-2">
                  <textarea
                    readOnly
                    rows={2}
                    value={embedCode}
                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 select-all"
                  />
                  <button
                    onClick={() => handleCopy(embedCode, 'embed')}
                    className="py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedEmbed ? 'Copied!' : 'Copy iFrame'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: LIVE MEMBER STREAM */}
        {activeTab === 'feed' && (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span>Live Channel Stream & Conversion Log</span>
                </h2>
                <p className="text-xs text-white/40">Real-time stream of member page visits, clicks, and channel joins</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-semibold">Total Events Logged: {analytics.recentEvents.length}</span>
            </div>

            <div className="space-y-3">
              {analytics.recentEvents.slice(0, 15).map((evt) => (
                <div key={evt.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                    evt.type === 'join' ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                    evt.type === 'click' ? 'bg-gradient-to-tr from-sky-500 to-blue-400' :
                    'bg-gradient-to-tr from-indigo-500 to-purple-400'
                  }`}>
                    {evt.type === 'join' ? 'JOIN' : evt.type === 'click' ? 'CLICK' : 'VISIT'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {evt.type === 'join' ? 'New Member Joined Channel' : evt.type === 'click' ? 'Clicked Telegram Button' : 'Page Visit Recorded'}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">({evt.location})</span>
                    </div>
                    <p className="text-xs text-white/40 truncate">
                      Via Campaign: <span className="text-sky-400 font-mono">{evt.utmSource || evt.referrer}</span> • Device: {evt.device} ({evt.browser})
                    </p>
                  </div>

                  <p className="text-[11px] text-white/30 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TELEGRAM BOT INTEGRATION & LIVE TERMINAL */}
        {activeTab === 'bot' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Telegram Bot Integration Engine</span>
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Automated Channel Member Alerts & Command Bot
                </h2>
                <p className="text-xs text-white/60 max-w-2xl">
                  Connect your Telegram Bot to automatically notify your admin channel whenever a new member joins from the 3D ad page, and inspect live stats with commands like <code className="text-sky-300 font-mono">/stats</code> and <code className="text-sky-300 font-mono">/recent</code>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSimulateJoinAlert}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Simulate Join Alert</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (7 cols): Bot Configuration & Webhook Settings */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Bot Credentials Box */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-sky-400" />
                      <h3 className="text-base font-bold text-white uppercase tracking-wide">Telegram Bot Configuration</h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      ● API Ready
                    </span>
                  </div>

                  {/* Bot Token Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center justify-between">
                      <span>Bot API Token (from @BotFather)</span>
                      <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-[11px] normal-case flex items-center gap-1">
                        <span>Get Token from @BotFather</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="relative">
                      <input
                        type={showBotToken ? "text" : "password"}
                        value={campaign.botToken || ''}
                        onChange={(e) => onUpdateCampaign({ botToken: e.target.value })}
                        placeholder="e.g. 7123456789:AAFg8_xK9... (or configure in .env)"
                        className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowBotToken(!showBotToken)}
                        className="absolute right-3 top-3 text-white/40 hover:text-white cursor-pointer"
                      >
                        {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-white/40">
                      Token provided by Telegram's @BotFather when creating your bot. Can also be set in <code className="text-blue-300">.env</code> as <code className="text-blue-300">TELEGRAM_BOT_TOKEN</code>.
                    </p>
                  </div>

                  {/* Admin Chat ID Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center justify-between">
                      <span>Admin Chat / Channel ID for Alerts</span>
                      <span className="text-[11px] text-white/40 font-normal">e.g. -100123456789 or @channelusername</span>
                    </label>
                    <input
                      type="text"
                      value={campaign.adminChatId || ''}
                      onChange={(e) => onUpdateCampaign({ adminChatId: e.target.value })}
                      placeholder="-100123456789 or user ID"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-sky-400 focus:outline-hidden focus:border-blue-500"
                    />
                    <p className="text-[11px] text-white/40">
                      Add your bot as an Admin in your channel/group or message it directly to receive instant member join alerts.
                    </p>
                  </div>

                  {/* Auto Notification Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={campaign.enableBotNotifications !== false}
                        onChange={(e) => onUpdateCampaign({ enableBotNotifications: e.target.checked })}
                        className="w-4 h-4 rounded-md accent-blue-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Auto-Send Telegram Alert on New Channel Join</span>
                        <span className="text-[11px] text-white/40">Dispatches real-time location, device & campaign stats to your admin chat whenever a user joins</span>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={handleTestBotConnection}
                      disabled={testBotLoading}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{testBotLoading ? 'Testing API...' : 'Test Connection & Send Ping'}</span>
                    </button>
                  </div>

                  {/* Test Result Feedback */}
                  {testBotResult && (
                    <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                      testBotResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      {testBotResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold">{testBotResult.success ? 'Telegram Bot Operational!' : 'Connection Warning'}</p>
                        <p className="mt-0.5 leading-relaxed">{testBotResult.message}</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Webhook Settings Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Live Telegram Webhook Endpoint</h3>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed">
                    Setting up a Webhook allows your Telegram Bot to receive live updates when members send commands like <code className="text-sky-300 font-mono">/stats</code> or <code className="text-sky-300 font-mono">/recent</code> directly inside Telegram chats.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-white/40 uppercase">Webhook URL Endpoint</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${appUrl}/api/telegram/webhook`}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-sky-400 select-all"
                      />
                      <button
                        onClick={handleSetWebhook}
                        disabled={webhookLoading}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${webhookLoading ? 'animate-spin' : ''}`} />
                        <span>Register Webhook</span>
                      </button>
                    </div>
                  </div>

                  {webhookResult && (
                    <div className={`p-3.5 rounded-xl border text-xs ${
                      webhookResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    }`}>
                      {webhookResult.message}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column (5 cols): Interactive Telegram Bot Command Terminal */}
              <div className="lg:col-span-5">
                <div className="bg-[#0e1621] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
                  
                  {/* Telegram Chat Header */}
                  <div className="bg-[#17212b] border-b border-white/10 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          Ad Tracker Bot <span className="text-blue-400 font-mono text-xs">@adtracker_bot</span>
                        </h4>
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          bot is online • interactive mode
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateJoinAlert}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-medium cursor-pointer transition-colors"
                      title="Test Join Alert"
                    >
                      <BellRing className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preset Command Quick Chips */}
                  <div className="bg-[#17212b]/50 px-4 py-2.5 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
                    <span className="text-[10px] uppercase font-mono text-white/40 shrink-0">Commands:</span>
                    {['/stats', '/recent', '/campaign', '/help'].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => handleSimulateCommand(cmd)}
                        className="px-2.5 py-1 rounded-full bg-blue-500/15 hover:bg-blue-500/30 text-sky-300 border border-blue-500/30 text-xs font-mono cursor-pointer whitespace-nowrap transition-all"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>

                  {/* Chat Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[88%] p-3.5 rounded-2xl shadow-md ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-[#182533] border border-white/10 text-slate-200 rounded-tl-none'
                        }`}>
                          <div
                            className="whitespace-pre-wrap font-sans leading-relaxed text-xs"
                            dangerouslySetInnerHTML={{ __html: msg.text }}
                          />
                          <p className={`text-[10px] mt-1.5 text-right font-mono ${
                            msg.sender === 'user' ? 'text-blue-200/70' : 'text-white/30'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Command Input Bar */}
                  <div className="p-3.5 bg-[#17212b] border-t border-white/10 flex items-center gap-2">
                    <input
                      type="text"
                      value={simulatedCommand}
                      onChange={(e) => setSimulatedCommand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSimulateCommand()}
                      placeholder="Type bot command e.g. /stats, /recent..."
                      className="flex-1 px-4 py-2.5 bg-[#0e1621] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSimulateCommand()}
                      disabled={isSendingCmd}
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer disabled:opacity-50 transition-colors"
                      title="Send Command"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
