import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { 
  BarChart3, Calendar, Clock, RefreshCw, Copy, Check, ExternalLink, Download, 
  TrendingUp, Users, MousePointerClick, MessageSquare, ShieldCheck, ArrowLeft,
  Sparkles, Globe, Smartphone, Monitor, ChevronRight
} from 'lucide-react';
import { AnalyticsSummary, TimeframeFilter, AnalyticsEvent } from '../types';

interface PublicAnalyticsProps {
  onBack?: () => void;
}

export const PublicAnalytics: React.FC<PublicAnalyticsProps> = ({ onBack }) => {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('today');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<string>('');

  const fetchAnalytics = async (tf: TimeframeFilter) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?timeframe=${tf}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json: AnalyticsSummary = await res.json();
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Error loading live analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  // Auto-refresh interval (every 10 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalytics(timeframe);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, timeframe]);

  // Countdown timer to 12:00 AM IST
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // IST offset +5:30
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istNow = new Date(utc + (3600000 * 5.5));
      
      const nextMid = new Date(istNow);
      nextMid.setHours(24, 0, 0, 0);

      const diff = nextMid.getTime() - istNow.getTime();
      if (diff <= 0) {
        setCountdown('00:00:00 (Resetting...)');
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(
          `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const publicPageUrl = `${window.location.origin}/?view=analytics`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicPageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-sky-500 selection:text-white">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Top Navbar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer flex items-center justify-center group"
                title="Back to App"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-indigo-300">
                  PRIME X EARN — Public Campaign Analytics
                </h1>
              </div>
              <p className="text-xs text-white/60 mt-1 flex items-center gap-2">
                <span>Real-time conversion metrics & ad performance tracking</span>
                <span>•</span>
                <span className="text-sky-300 font-mono">IST Date: {data?.currentISTDate || '2026-08-09'}</span>
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={copyPublicLink}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <a
              href="/api/export"
              download="primexearn_analytics.csv"
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={() => fetchAnalytics(timeframe)}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-2xl text-[11px] text-white/70">
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span>Auto 10s</span>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="rounded accent-sky-500 cursor-pointer ml-1"
              />
            </div>
          </div>
        </div>

        {/* Timeframe Selector & 12:00 AM IST Reset Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Timeframe Filter Buttons */}
          <div className="lg:col-span-7 p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-wrap items-center gap-2">
            {[
              { id: 'today', label: '🗓 Today', desc: 'Resets daily at 12:00 AM IST' },
              { id: '3days', label: '⏳ Last 3 Days', desc: 'Past 72 Hours' },
              { id: '30days', label: '📅 Last 30 Days', desc: 'Monthly Performance' },
              { id: 'all', label: '♾ All Time', desc: 'Total Cumulative' }
            ].map(tf => {
              const active = timeframe === tf.id;
              return (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id as TimeframeFilter)}
                  className={`flex-1 min-w-[130px] px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    active
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 border border-sky-300/30 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                  }`}
                >
                  <span className="text-xs">{tf.label}</span>
                  <span className={`text-[10px] font-normal ${active ? 'text-sky-100' : 'text-white/40'}`}>
                    {tf.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 12:00 AM IST Countdown Box */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/60 border border-indigo-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  12:00 AM IST Daily Data Reset
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Daily counters auto-reset at midnight Indian Standard Time
              </p>
            </div>

            <div className="text-right">
              <div className="text-base sm:text-lg font-mono font-bold text-amber-400 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                {countdown || 'Calculating...'}
              </div>
              <span className="text-[10px] text-white/40 block mt-1">Countdown to Midnight</span>
            </div>
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Visits */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-sky-500/40 transition-all">
            <div className="flex items-center justify-between text-sky-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">Visits</span>
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {data?.totalVisits.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-white/40 mt-1">Unique Ad Page Hits</p>
          </div>

          {/* Card 2: Clicks */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">Link Clicks</span>
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-300 font-mono">
              {data?.totalClicks.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-white/40 mt-1">Telegram CTR Action</p>
          </div>

          {/* Card 3: Joins */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">New Joins</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
              {data?.totalJoins.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-emerald-400/70 mt-1">Joined Channel / Group</p>
          </div>

          {/* Card 4: Questions */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">Questions</span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
              {data?.totalQuestions || 0}
            </div>
            <p className="text-[10px] text-white/40 mt-1">Asked in VIP Group</p>
          </div>

          {/* Card 5: CTR % */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">CTR %</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              {data?.clickThroughRate || 0}%
            </div>
            <p className="text-[10px] text-white/40 mt-1">Visit ➔ Click CTR</p>
          </div>

          {/* Card 6: Join Conv % */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between text-indigo-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Join Rate %</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
              {data?.joinConversionRate || 0}%
            </div>
            <p className="text-[10px] text-indigo-300/70 mt-1">Click ➔ Joined %</p>
          </div>
        </div>

        {/* Charts & Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Traffic Trend Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span>Conversion Trend Breakdown ({timeframe.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-white/50 mt-0.5">Visits, Link Clicks, and Member Joins tracked over time</p>
              </div>
              <span className="text-[11px] font-mono bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-500/30">
                Live Area Graph
              </span>
            </div>

            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.hourlyChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorJoins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="time" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                  <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="visits" name="Visits" stroke="#38bdf8" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
                  <Area type="monotone" dataKey="clicks" name="Link Clicks" stroke="#818cf8" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
                  <Area type="monotone" dataKey="joins" name="Joins" stroke="#34d399" fillOpacity={1} fill="url(#colorJoins)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Source Breakdown */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Traffic Source Channels</span>
            </h3>

            <div className="space-y-3 pt-2">
              {(data?.sourceBreakdown || []).length === 0 ? (
                <p className="text-xs text-white/40 italic">No traffic sources recorded yet.</p>
              ) : (
                (data?.sourceBreakdown || []).slice(0, 6).map((src, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/80 font-bold truncate max-w-[180px]">{src.source}</span>
                      <span className="text-emerald-300 font-bold">{src.count} ({src.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full"
                        style={{ width: `${Math.min(src.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Activity Log Table */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Live Event Stream ({timeframe.toUpperCase()})</span>
              </h3>
              <p className="text-xs text-white/50">Recent visits, clicks, member joins & VIP question logs</p>
            </div>
            <span className="text-xs font-mono text-white/40">
              Showing last {data?.recentEvents.length || 0} logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest text-[10px]">
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Time</th>
                  <th className="pb-3 px-3">Location</th>
                  <th className="pb-3 px-3">Device / Browser</th>
                  <th className="pb-3 px-3">IP Address</th>
                  <th className="pb-3 px-3">Details / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {(data?.recentEvents || []).map((evt) => {
                  const dateStr = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  
                  return (
                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-block ${
                          evt.type === 'join' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          evt.type === 'click' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                          evt.type === 'question' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        }`}>
                          {evt.type === 'join' ? '🎉 Join' : evt.type === 'click' ? '🖱 Click' : evt.type === 'question' ? '💬 Question' : '👁 Visit'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white/60">{dateStr}</td>
                      <td className="py-3 px-3 text-sky-300 font-sans font-medium">📍 {evt.location || 'India'}</td>
                      <td className="py-3 px-3 text-white/70">
                        {evt.device} <span className="text-white/40">({evt.browser})</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {evt.ip ? evt.ip.replace(/\.\d+$/, '.***') : '103.21.124.***'}
                      </td>
                      <td className="py-3 px-3 text-white/80 max-w-[250px] truncate">
                        {evt.questionText ? (
                          <span className="text-purple-300 font-sans italic">"{evt.questionText}"</span>
                        ) : (
                          evt.referrer || 'direct'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-4 text-xs text-white/40 border-t border-white/5">
          <p>
            PRIME X EARN Telegram Analytics System • Powered by Real-Time Webhook Engine • Ads managed by{' '}
            <a href="https://t.me/+ec-4Jk1PY7w3Y2Vl" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-bold">
              VYRNXY ADS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
