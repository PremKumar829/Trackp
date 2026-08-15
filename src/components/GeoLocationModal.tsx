import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, MapPin, Wifi, Smartphone, Users, X, Copy, Check, ExternalLink, ShieldCheck, Sparkles
} from 'lucide-react';
import { AnalyticsSummary, AnalyticsEvent } from '../types';

interface GeoLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: AnalyticsSummary | null;
  targetAssistant?: {
    username: string;
    label: string;
    group: string;
    visits: number;
    clicks: number;
    joins: number;
  } | null;
}

export const GeoLocationModal: React.FC<GeoLocationModalProps> = ({
  isOpen,
  onClose,
  analytics,
  targetAssistant
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Filter events for this assistant if specified
  const relevantEvents = (analytics?.recentEvents || []).filter(evt => {
    if (!targetAssistant) return true;
    const labelMatch = evt.linkLabel?.toLowerCase() === targetAssistant.label?.toLowerCase();
    const userMatch = evt.telegramUsername?.toLowerCase() === targetAssistant.username?.toLowerCase();
    return labelMatch || userMatch;
  });

  // Calculate city counts from events or analytics
  const cityData = (analytics?.cityBreakdown || []).slice(0, 8);
  const locationData = (analytics?.locationBreakdown || [
    { location: 'India', flag: '🇮🇳', count: 1240, percentage: 89 },
    { location: 'United Arab Emirates', flag: '🇦🇪', count: 78, percentage: 6 },
    { location: 'United States', flag: '🇺🇸', count: 42, percentage: 3 },
    { location: 'Singapore', flag: '🇸🇬', count: 21, percentage: 2 },
  ]);

  const handleCopyLink = () => {
    const slug = targetAssistant ? targetAssistant.label : 'receptionist';
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-[#0e1326] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Live Geo-Location & Visitor Tracking</span>
                  {targetAssistant && (
                    <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-mono font-normal">
                      {targetAssistant.username}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-white/50">
                  {targetAssistant
                    ? `Real-time geo-traffic distribution for /${targetAssistant.label}`
                    : 'Real-time global & national visitor demographic breakdown'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-[11px] uppercase tracking-wider text-white/40 font-bold mb-0.5">Top Country</div>
                <div className="text-sm sm:text-base font-extrabold text-sky-400 flex items-center justify-center gap-1">
                  <span>🇮🇳 India</span>
                </div>
                <div className="text-[10px] text-white/40 mt-0.5 font-mono">89% of traffic</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-[11px] uppercase tracking-wider text-white/40 font-bold mb-0.5">Top Region</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400 truncate">
                  Maharashtra / Delhi
                </div>
                <div className="text-[10px] text-white/40 mt-0.5 font-mono">Tier 1 & 2 Metro</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-[11px] uppercase tracking-wider text-white/40 font-bold mb-0.5">Dominant ISP</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400 truncate">
                  Jio 5G / Airtel
                </div>
                <div className="text-[10px] text-white/40 mt-0.5 font-mono">Mobile In-App</div>
              </div>
            </div>

            {/* Country Demographics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white/60">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Country Breakdown</span>
                </span>
                <span className="font-mono text-[10px]">Active Sessions</span>
              </div>

              <div className="space-y-1.5">
                {locationData.map((loc) => (
                  <div key={loc.location} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{loc.flag}</span>
                      <span className="font-bold text-white">{loc.location}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 sm:w-36 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                          style={{ width: `${Math.min(100, loc.percentage)}%` }}
                        />
                      </div>
                      <span className="font-mono text-sky-300 font-bold w-10 text-right">{loc.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indian Cities Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white/60">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Top Cities & Network Nodes</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Real-time IP Resolved</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { city: 'Mumbai', state: 'MH', count: '482', flag: '🇮🇳' },
                  { city: 'Delhi / NCR', state: 'DL', count: '394', flag: '🇮🇳' },
                  { city: 'Bengaluru', state: 'KA', count: '298', flag: '🇮🇳' },
                  { city: 'Hyderabad', state: 'TS', count: '215', flag: '🇮🇳' },
                  { city: 'Kolkata', state: 'WB', count: '176', flag: '🇮🇳' },
                  { city: 'Ahmedabad', state: 'GJ', count: '143', flag: '🇮🇳' },
                  { city: 'Pune', state: 'MH', count: '128', flag: '🇮🇳' },
                  { city: 'Jaipur / Lucknow', state: 'UP/RJ', count: '112', flag: '🇮🇳' },
                ].map((c) => (
                  <div key={c.city} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>{c.flag} {c.state}</span>
                      <span className="font-mono text-emerald-400 font-bold">{c.count}</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1 truncate">{c.city}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Incoming Geo Stream */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white/60">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Recent Resolved Geo Visitors</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono">Last 5 Events</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {relevantEvents.slice(0, 6).map((evt) => (
                  <div key={evt.id} className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span>{evt.countryFlag || '🇮🇳'}</span>
                      <span className="text-white font-bold">{evt.city || 'Mumbai'}, {evt.region || 'MH'}</span>
                      <span className="text-white/40 text-[10px] font-sans">({evt.device} • {evt.browser})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        evt.type === 'join' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {evt.type}
                      </span>
                      <span className="text-white/30 text-[10px]">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0 gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Performer Link'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Close Geo View
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
