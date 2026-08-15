import React, { useState } from 'react';
import {
  Link as LinkIcon, Plus, Trash2, Edit2, Check, Copy, ExternalLink, Zap,
  Sparkles, AtSign, ArrowRight, ShieldCheck, Globe, RefreshCw, Send, Sliders
} from 'lucide-react';
import { CampaignConfig, DestinationLink, AnalyticsSummary } from '../types';

interface DestinationLinksManagerProps {
  campaign: CampaignConfig;
  analytics: AnalyticsSummary;
  onUpdateCampaign: (updated: Partial<CampaignConfig>) => void;
}

export const DestinationLinksManager: React.FC<DestinationLinksManagerProps> = ({
  campaign,
  analytics,
  onUpdateCampaign,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<DestinationLink | null>(null);
  const [copiedUrlKey, setCopiedUrlKey] = useState<string | null>(null);
  const [autoDetectInput, setAutoDetectInput] = useState<string>('');
  const [autoDetectGroup, setAutoDetectGroup] = useState<string>('Win03');
  const [autoDetectStatus, setAutoDetectStatus] = useState<string | null>(null);

  // Form State for new/edited link
  const [formData, setFormData] = useState<Partial<DestinationLink>>({
    label: '',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@prem',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Receptionist',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    googleWebhookUrl: 'https://script.google.com/macros/s/AKfycbw5UE-Gr3gA0qr8ildKaHAVCP0FrE9mf1xibKnDlK5xwgdpAjD9blnkjRyzQoFHf4WKCQ/exec',
    isActive: true,
  });

  const links = campaign.links || [];

  const handleQuickAutoDetect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoDetectInput.trim()) return;

    try {
      const res = await fetch('/api/telegram/autodetect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: autoDetectInput.trim(),
          defaultGroup: autoDetectGroup.trim() || 'Win03',
        }),
      });
      const data = await res.json();
      if (data.success && data.detected?.newLink) {
        const detectedLink = data.detected.newLink;
        const exists = links.some(l => l.label.toLowerCase() === detectedLink.label.toLowerCase());
        const updatedList = exists
          ? links.map(l => (l.label.toLowerCase() === detectedLink.label.toLowerCase() ? detectedLink : l))
          : [...links, detectedLink];

        onUpdateCampaign({
          links: updatedList,
          defaultLinkLabel: detectedLink.label,
        });

        setAutoDetectStatus(`✅ Auto-detected & registered as /${detectedLink.label} (${detectedLink.telegramUsername})`);
        setAutoDetectInput('');
        setTimeout(() => setAutoDetectStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrlKey(key);
    setTimeout(() => setCopiedUrlKey(null), 2000);
  };

  const handleOpenAdd = () => {
    setFormData({
      label: `link-${links.length + 1}`,
      group: 'Win03',
      telegramTarget: 'ZiB8EiGBh4I0Yjc1',
      telegramUsername: '@Receptionist_Help',
      heading: "You're Just One Step Away!",
      subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
      buttonText: '🚀 Contact Receptionist',
      badgeText: '180-380 Bonus Active',
      footerNote: 'Secure & Verified Direct Link',
      autoRedirect: true,
      autoRedirectDelayMs: 400,
      isActive: true,
    });
    setEditingLink(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (link: DestinationLink) => {
    setFormData({ ...link });
    setEditingLink(link);
    setShowAddModal(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label?.trim() || !formData.telegramTarget?.trim()) return;

    const cleanLabel = formData.label.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    let cleanUsername = (formData.telegramUsername || '').trim();
    if (cleanUsername && !cleanUsername.startsWith('@') && !cleanUsername.includes('/')) {
      cleanUsername = `@${cleanUsername}`;
    }

    const newLinkObj: DestinationLink = {
      id: editingLink ? editingLink.id : `link-${Date.now()}`,
      label: cleanLabel,
      group: formData.group?.trim() || 'Win03',
      telegramTarget: formData.telegramTarget.trim(),
      telegramUsername: cleanUsername || '@Receptionist_Help',
      heading: formData.heading || "You're Just One Step Away!",
      subtitle: formData.subtitle || 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
      buttonText: formData.buttonText || '🚀 Contact Receptionist',
      badgeText: formData.badgeText || '',
      footerNote: formData.footerNote || 'Secure & Verified Direct Link',
      autoRedirect: formData.autoRedirect ?? true,
      autoRedirectDelayMs: Number(formData.autoRedirectDelayMs) || 400,
      googleWebhookUrl: formData.googleWebhookUrl || '',
      isActive: formData.isActive ?? true,
      createdAt: editingLink ? editingLink.createdAt : Date.now(),
    };

    let updatedList: DestinationLink[];
    if (editingLink) {
      updatedList = links.map(l => (l.id === editingLink.id ? newLinkObj : l));
    } else {
      updatedList = [...links, newLinkObj];
    }

    onUpdateCampaign({
      links: updatedList,
      defaultLinkLabel: campaign.defaultLinkLabel || cleanLabel,
    });

    setShowAddModal(false);
  };

  const handleDeleteLink = (id: string) => {
    if (links.length <= 1) {
      alert('You must have at least one active destination link.');
      return;
    }
    const updated = links.filter(l => l.id !== id);
    onUpdateCampaign({
      links: updated,
      defaultLinkLabel: updated[0]?.label || 'receptionist',
    });
  };

  const handleSetDefault = (label: string) => {
    onUpdateCampaign({ defaultLinkLabel: label });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Multi-Link & Destination Management</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
            Create custom labeled links (e.g. <code>domain/?link=receptionist</code>, <code>domain/?link=vip-bonus</code>) with unique Telegram usernames, custom titles, auto-bypass redirects, and detailed tracking in analytics.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-600/30 whitespace-nowrap self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination Link</span>
        </button>
      </div>

      {/* Instant Group Link Auto-Detector Box */}
      <div className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-blue-950/40 border border-sky-500/30 rounded-3xl p-6 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Smart Auto-Detect Group Link / Username
            </h3>
          </div>
          <span className="text-[11px] text-sky-400 font-mono bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
            Auto-Parses Hash &amp; Handles
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Paste any Telegram link (e.g. <code>https://t.me/+AbCdEfGh123</code>, <code>https://t.me/prem</code>, or <code>@prem</code>) — the system will automatically parse the invite code, generate clean URLs, and configure instant bypass!
        </p>

        <form onSubmit={handleQuickAutoDetect} className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={autoDetectInput}
            onChange={(e) => setAutoDetectInput(e.target.value)}
            placeholder="Paste Telegram Link or @username (e.g. https://t.me/+ZiB8EiGBh4I0Yjc1 or @prem)..."
            className="flex-1 bg-black/40 border border-white/15 focus:border-sky-400 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none font-mono transition-all"
          />
          <div className="w-full sm:w-36">
            <input
              type="text"
              value={autoDetectGroup}
              onChange={(e) => setAutoDetectGroup(e.target.value)}
              placeholder="Team / Group"
              className="w-full bg-black/40 border border-white/15 focus:border-sky-400 rounded-2xl px-3 py-3 text-xs text-white placeholder-slate-500 outline-none text-center font-bold"
            />
          </div>
          <button
            type="submit"
            disabled={!autoDetectInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Auto-Detect &amp; Save</span>
          </button>
        </form>

        {autoDetectStatus && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{autoDetectStatus}</span>
          </div>
        )}
      </div>

      {/* Auto-Bypass Master Settings Bar */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Global Auto-Bypass & Card Presentation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card Presentation Style */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-white/70 block">Landing Page Card Style</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateCampaign({ cardStyle: 'professionalClean' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  (campaign.cardStyle === 'professionalClean' || !campaign.cardStyle)
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                ✨ User Join Post
              </button>
              <button
                type="button"
                onClick={() => onUpdateCampaign({ cardStyle: 'perspective3D' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  campaign.cardStyle === 'perspective3D'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                🕶 3D Glass Card
              </button>
            </div>
          </div>

          {/* Master Auto-Bypass Switch */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/70">Master Auto-Bypass</label>
              <input
                type="checkbox"
                checked={campaign.enableAutoBypass ?? true}
                onChange={(e) => onUpdateCampaign({ enableAutoBypass: e.target.checked })}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-white/40">
              Automatically launch Telegram App via deep-link protocol when visitor lands.
            </p>
          </div>

          {/* Auto-Bypass Delay ms */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-white/70 block">Auto-Bypass Delay (ms)</label>
            <input
              type="number"
              min={0}
              max={5000}
              step={50}
              value={campaign.autoBypassDelayMs ?? 400}
              onChange={(e) => onUpdateCampaign({ autoBypassDelayMs: Number(e.target.value) })}
              className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-sky-400 font-mono"
            />
          </div>

        </div>

        {/* Google Apps Script Webhook URL */}
        <div className="pt-2">
          <label className="text-xs font-bold text-white/50 block mb-1">
            Google Apps Script Webhook (Auto-Forwards Click Data)
          </label>
          <input
            type="text"
            value={campaign.googleWebhookUrl || ''}
            onChange={(e) => onUpdateCampaign({ googleWebhookUrl: e.target.value })}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-emerald-400 select-all"
          />
        </div>
      </div>

      {/* Destination Links List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-emerald-400" />
            <span>Configured Destination Links ({links.length})</span>
          </h3>
          <span className="text-xs font-mono text-white/40">
            Default Link: <b className="text-sky-400">{campaign.defaultLinkLabel || 'receptionist'}</b>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {links.map((link, idx) => {
            const isDefault = (campaign.defaultLinkLabel || 'receptionist') === link.label;
            const destStats = analytics.destinationBreakdown?.find(d => d.label === link.label) || {
              visits: 0,
              clicks: 0,
              joins: 0,
              ctr: '0.0'
            };

            const liveAppUrl = `${window.location.origin}/?link=${link.label}`;

            return (
              <div
                key={link.id || idx}
                className={`p-5 rounded-3xl border transition-all ${
                  isDefault
                    ? 'bg-blue-950/20 border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.15)]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Link Info */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 font-bold text-xs font-mono border border-sky-500/30">
                        ?link={link.label}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
                        <AtSign className="w-3.5 h-3.5 text-blue-400" />
                        <span>{link.telegramUsername || '@Receptionist_Help'}</span>
                      </span>

                      {isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          Primary Default
                        </span>
                      )}

                      {link.autoRedirect && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          ⚡ Auto-Bypass ({link.autoRedirectDelayMs || 400}ms)
                        </span>
                      )}
                    </div>

                    {/* Heading & Subtitle preview */}
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{link.heading}</h4>
                      <p className="text-xs text-white/50 truncate max-w-xl">{link.subtitle}</p>
                    </div>

                    {/* Live share URL */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={liveAppUrl}
                        className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] font-mono text-emerald-400 select-all max-w-md w-full"
                      />
                      <button
                        onClick={() => handleCopy(liveAppUrl, `live-${link.id}`)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedUrlKey === `live-${link.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrlKey === `live-${link.id}` ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <a
                        href={liveAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        title="Test link live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Middle Stats Mini-Grid */}
                  <div className="grid grid-cols-4 gap-2 bg-black/30 p-3 rounded-2xl border border-white/5 text-center font-mono shrink-0">
                    <div>
                      <span className="text-[10px] text-white/40 block">Visits</span>
                      <span className="text-xs font-bold text-white">{destStats.visits}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block">Clicks</span>
                      <span className="text-xs font-bold text-indigo-300">{destStats.clicks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block">Joins</span>
                      <span className="text-xs font-bold text-emerald-400">{destStats.joins}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block">CTR</span>
                      <span className="text-xs font-bold text-sky-400">{destStats.ctr}%</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    {!isDefault && (
                      <button
                        onClick={() => handleSetDefault(link.label)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        title="Make Default Link"
                      >
                        Set Default
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(link)}
                      className="p-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 rounded-xl cursor-pointer transition-colors"
                      title="Edit Link Settings"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl cursor-pointer transition-colors"
                      title="Delete Destination Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Destination Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{editingLink ? 'Edit Destination Link' : 'Add New Destination Link'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Link Label Slug */}
                <div>
                  <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                    Link Slug (e.g. prem) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40 text-xs font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="prem"
                      className="w-full pl-6 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-sky-400 font-mono focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Group */}
                <div>
                  <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                    Group / Team *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.group || ''}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="Win03"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-emerald-400 font-mono focus:border-sky-500"
                  />
                </div>

                {/* Telegram Username */}
                <div>
                  <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                    Telegram Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telegramUsername || ''}
                    onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    placeholder="@prem"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-blue-300 font-mono focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Telegram Target Link / Invite Code */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                  Telegram Target Link / Invite Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.telegramTarget || ''}
                  onChange={(e) => setFormData({ ...formData, telegramTarget: e.target.value })}
                  placeholder="ZiB8EiGBh4I0Yjc1 or https://t.me/+... or @username"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-emerald-400 font-mono focus:border-sky-500"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  Accepts invite codes like <code>ZiB8EiGBh4I0Yjc1</code>, <code>https://t.me/+...</code>, or <code>@username</code>
                </p>
              </div>

              {/* Custom Heading */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                  Card Heading
                </label>
                <input
                  type="text"
                  value={formData.heading || ''}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="You're Just One Step Away!"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:border-sky-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                  Card Subtitle (Task & Bonus Offer)
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Click the button below to get 180-380 welcome bonus by completing 1-5 task."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:border-sky-500"
                />
              </div>

              {/* Button Text & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText || ''}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="🚀 Contact Receptionist"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/70 uppercase block mb-1">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText || ''}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="180-380 Bonus Active"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-amber-300 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Auto Redirect Checkbox & Delay */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRedirect ?? true}
                    onChange={(e) => setFormData({ ...formData, autoRedirect: e.target.checked })}
                    className="w-4 h-4 accent-sky-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Auto-Bypass Trigger</span>
                    <span className="text-[10px] text-white/40">Launch Telegram App automatically</span>
                  </div>
                </label>

                <div className="flex items-center gap-1.5 text-xs font-mono text-white/70">
                  <span>Delay:</span>
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    step={50}
                    value={formData.autoRedirectDelayMs ?? 400}
                    onChange={(e) => setFormData({ ...formData, autoRedirectDelayMs: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-sky-400 font-mono text-center"
                  />
                  <span>ms</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLink ? 'Save Changes' : 'Create Destination Link'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
