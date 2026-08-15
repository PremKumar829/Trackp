import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  LogOut, Eye, Globe, Check, Copy, RefreshCw, ChevronDown, Calendar,
  ArrowRight, ShieldCheck, Zap, ExternalLink, Filter, Sparkles
} from 'lucide-react';
import { AnalyticsSummary, TimeframeFilter } from '../types';

interface PublicAnalyticsProps {
  onBack?: () => void;
  initialAssistant?: string;
  onSelectAssistant?: (slug: string) => void;
}

export const PublicAnalytics: React.FC<PublicAnalyticsProps> = ({
  onBack,
  initialAssistant,
  onSelectAssistant
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('today');
  const [selectedGroup, setSelectedGroup] = useState<string>('All Groups');
  const [selectedAssistant, setSelectedAssistant] = useState<string>(initialAssistant || 'All');
  const [chartMode, setChartMode] = useState<'daily' | 'live'>('daily');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [istTime, setIstTime] = useState<string>('');
  const [showCustomDateModal, setShowCustomDateModal] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-15');

  // Update live IST time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setIstTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('timeframe', timeframe);
      if (selectedGroup !== 'All Groups' && selectedGroup !== 'all') {
        params.append('group', selectedGroup);
      }
      if (selectedAssistant !== 'All' && selectedAssistant !== 'all') {
        params.append('assistant', selectedAssistant);
      }

      const res = await fetch(`/api/analytics?${params.toString()}`);
      if (res.ok) {
        const json: AnalyticsSummary = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, selectedGroup, selectedAssistant]);

  // Handle Assistant parameter from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const asstParam = params.get('assistant') || params.get('performer') || params.get('link');
    if (asstParam) {
      setSelectedAssistant(asstParam.startsWith('@') ? asstParam : `@${asstParam}`);
    }
  }, []);

  const handleCopyLink = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}/${label}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePreviewAd = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectAssistant) {
      onSelectAssistant(label);
    } else {
      window.open(`/${label}`, '_blank');
    }
  };

  // Performers list filtered by group and assistant
  const performers = (data?.performerBreakdown || []).filter(p => {
    if (selectedGroup !== 'All Groups' && p.group !== selectedGroup) return false;
    if (selectedAssistant !== 'All' && p.username.toLowerCase() !== selectedAssistant.toLowerCase() && p.label.toLowerCase() !== selectedAssistant.toLowerCase().replace(/^@/, '')) return false;
    return true;
  });

  const allAssistantsList = (data?.performerBreakdown || []).map(p => p.username);
  const uniqueAssistants = Array.from(new Set(allAssistantsList));

  return (
    <div className="min-h-screen bg-[#070913] text-white p-3 sm:p-5 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-4 sm:space-y-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Analytics</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-medium text-white/80">
              <span className="text-sm">🕒</span>
              <span className="font-mono">IST: {istTime || '04:25 PM'} <span className="text-white/40">(8PM Reset)</span></span>
            </div>

            {onBack && (
              <button
                onClick={onBack}
                className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
                title="Exit / Back"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Group & Assistant Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Group Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-1">
              Group
            </label>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full appearance-none bg-[#101426] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-inner"
              >
                <option value="All Groups">All Groups</option>
                <option value="Win03">Win03</option>
                {(data?.groups || []).filter(g => g !== 'Win03' && g !== 'All Groups').map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Assistant Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-1">
              Assistant
            </label>
            <div className="relative">
              <select
                value={selectedAssistant}
                onChange={(e) => setSelectedAssistant(e.target.value)}
                className="w-full appearance-none bg-[#101426] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-inner"
              >
                <option value="All">All</option>
                {uniqueAssistants.map(uname => (
                  <option key={uname} value={uname}>{uname}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id as TimeframeFilter)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                timeframe === tab.id
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#101426] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => setShowCustomDateModal(true)}
            className="px-3.5 py-2 rounded-xl font-bold whitespace-nowrap bg-[#101426] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-white/60" />
            <span>Custom</span>
          </button>
        </div>

        {/* Primary Metrics: 3 Top Stat Boxes */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          {/* Visits */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-lg text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
              Visits
            </div>
            <div className="text-xl sm:text-3xl font-black text-white font-mono">
              {(data?.totalVisits ?? 1363).toLocaleString()}
            </div>
          </div>

          {/* Clicks */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-lg text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
              Clicks
            </div>
            <div className="text-xl sm:text-3xl font-black text-white font-mono">
              {(data?.totalClicks ?? 1488).toLocaleString()}
            </div>
          </div>

          {/* Joins */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-lg text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
              Joins
            </div>
            <div className="text-xl sm:text-3xl font-black text-[#10b981] font-mono">
              {(data?.totalJoins ?? 812).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Conversion Rate Metrics: 2 Boxes */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {/* CTR */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-lg text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
              Visits → Clicks (CTR)
            </div>
            <div className="text-lg sm:text-2xl font-black text-white font-mono">
              {data?.clickThroughRate ?? 100}%
            </div>
          </div>

          {/* CVR */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-lg text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
              Clicks → Joins (CVR)
            </div>
            <div className="text-lg sm:text-2xl font-black text-white font-mono">
              {data?.joinConversionRate ?? 54.6}%
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {data?.resetCycleLabel || 'Today (8PM IST Reset Cycle)'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                  <span className="text-white/70">Clicks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span className="text-white/70">Joins</span>
                </div>
              </div>

              {/* Sub-tab Toggle */}
              <div className="flex items-center p-0.5 bg-black/40 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setChartMode('daily')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    chartMode === 'daily'
                      ? 'bg-[#7c3aed] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  📅 Daily (24h)
                </button>
                <button
                  onClick={() => setChartMode('live')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    chartMode === 'live'
                      ? 'bg-[#10b981] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  🟢 Live Joins
                </button>
              </div>
            </div>
          </div>

          {/* Area Graph */}
          {chartMode === 'daily' ? (
            <div className="h-[210px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.hourlyChart || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradientJoins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 11 }} />
                  <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1124',
                      borderColor: '#ffffff20',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientClicks)"
                  />
                  <Area
                    type="monotone"
                    dataKey="joins"
                    name="Joins"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradientJoins)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="space-y-2 pt-1 max-h-[220px] overflow-y-auto pr-1">
              {(data?.recentEvents || []).slice(0, 8).map((evt) => (
                <div key={evt.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${evt.type === 'join' ? 'bg-[#10b981] animate-ping' : 'bg-[#6366f1]'}`} />
                    <span className="font-bold text-white/90">{evt.telegramUsername || '@Receptionist_Help'}</span>
                    <span className="text-white/40">({evt.city || 'Mumbai'})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">{evt.type}</span>
                    <span className="text-white/40 text-[10px]">{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group Performance Section */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>🗂️</span>
            <span>Group Performance</span>
          </h3>

          <div className="space-y-2">
            {(data?.groupBreakdown || [{ group: 'Win03', visits: 1363, clicks: 1488, joins: 812, cvr: 54.6 }]).map((grp) => (
              <div
                key={grp.group}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#101426]/90 border border-white/10 shadow-lg"
              >
                <div>
                  <div className="text-base font-bold text-white tracking-tight">
                    {grp.group}
                  </div>
                  <div className="text-xs text-white/50 font-mono mt-0.5">
                    {grp.visits.toLocaleString()} visits • {grp.clicks.toLocaleString()} clicks
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-[#10b981] font-mono">
                    {grp.joins.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/50 font-mono">
                    {grp.cvr}% CVR
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>🏆</span>
              <span>Top Performers</span>
            </h3>
            <span className="text-xs text-white/40 font-mono">
              {performers.length} active assistants
            </span>
          </div>

          <div className="space-y-2">
            {performers.map((performer) => {
              const isCopied = copiedId === performer.label;

              return (
                <div
                  key={performer.label}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#101426]/90 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                        {performer.username}
                      </span>
                    </div>
                    <div className="text-xs text-white/50 font-mono mt-0.5 truncate">
                      {performer.group} • {performer.visits} visits • {performer.clicks} clicks
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-[#10b981] font-mono">
                        {performer.joins}
                      </div>
                      <div className="text-xs text-white/50 font-mono">
                        {performer.convRate}% Conv
                      </div>
                    </div>

                    {/* Action buttons matching screenshot (Eye + Globe) */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                      {/* Eye Button: Preview Landing Page */}
                      <button
                        onClick={(e) => handlePreviewAd(performer.label, e)}
                        className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] text-white/80 hover:text-white transition-all cursor-pointer"
                        title={`Preview ad page for ${performer.username} (/${performer.label})`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Globe Button: Copy Link */}
                      <button
                        onClick={(e) => handleCopyLink(performer.label, e)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/[0.06] hover:bg-white/[0.15] text-white/80 hover:text-white'
                        }`}
                        title={`Copy URL (domain/${performer.label})`}
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Globe className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#101426] border border-white/15 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Custom Date Range</span>
              </h3>
              <button
                onClick={() => setShowCustomDateModal(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomDateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCustomDateModal(false);
                  fetchAnalytics();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
