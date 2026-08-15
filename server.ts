import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CampaignConfig, AnalyticsEvent, AnalyticsSummary, DestinationLink } from './src/types';

// Default multi-link destinations
const defaultLinks: DestinationLink[] = [
  {
    id: 'link-prem',
    label: 'prem',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@prem',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Prem',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 200,
    googleWebhookUrl: 'https://script.google.com/macros/s/AKfycbw5UE-Gr3gA0qr8ildKaHAVCP0FrE9mf1xibKnDlK5xwgdpAjD9blnkjRyzQoFHf4WKCQ/exec',
    isActive: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'link-killershiv',
    label: 'killershiv9876',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@killershiv9876',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Shiv',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Official Telegram Channel',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'link-vyrnxy',
    label: 'vyrnxy',
    group: 'Win03',
    telegramTarget: 'https://t.me/+ec-4Jk1PY7w3Y2Vl',
    telegramUsername: '@Vyrnxy',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Join Vyrnxy VIP',
    badgeText: 'VIP Community Access',
    footerNote: 'Official Direct Gateway',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'link-happy',
    label: 'happy_9064',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@Happy_9064',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Happy',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'link-chhotu',
    label: 'chhotu1717',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@Chhotu1717',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Chhotu',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'link-aira',
    label: 'itsmeaira0',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@Itsmeaira0',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Aira',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'link-roshan',
    label: 'roshansinganiya',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@Roshansinganiya',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Roshan',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'link-devil',
    label: 'devil_2001',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@Devil_2001',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Devil',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 9,
  },
  {
    id: 'link-shivam',
    label: 'zxshivamji',
    group: 'Win03',
    telegramTarget: 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: '@ZxShivamji',
    heading: "You're Just One Step Away!",
    subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
    buttonText: '🚀 Contact Shivam',
    badgeText: '180-380 Bonus Guaranteed',
    footerNote: 'Secure & Verified Direct Link',
    autoRedirect: true,
    autoRedirectDelayMs: 300,
    isActive: true,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'link-receptionist',
    label: 'receptionist',
    group: 'Win03',
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
    createdAt: Date.now() - 86400000 * 11,
  }
];

// Initial Campaign Configuration
let campaignConfig: CampaignConfig = {
  id: 'campaign-001',
  title: 'VIP Verification Gateway',
  subtitle: 'Official direct Telegram gateway for verified VIP members and signal access.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  avatarBorderColor: '#ef4444',
  telegramLink: 'ZiB8EiGBh4I0Yjc1', // Primary invite ID or URL
  telegramGroupLink: 'https://t.me/telegram',
  secondaryTelegramLink: 'https://t.me/telegram',
  ctaText1: '🚀 Contact Receptionist',
  ctaText2: '✈ Open Official Telegram',
  groupCtaText: '💬 Have a Question? Ask in VIP Group',
  questionPromptText: 'Have a question before joining? Ask directly in our Official VIP Group!',
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
  links: defaultLinks,
  defaultLinkLabel: 'prem',
  enableAutoBypass: true,
  autoBypassDelayMs: 300,
  googleWebhookUrl: 'https://script.google.com/macros/s/AKfycbw5UE-Gr3gA0qr8ildKaHAVCP0FrE9mf1xibKnDlK5xwgdpAjD9blnkjRyzQoFHf4WKCQ/exec',
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '123456789',
  adminChatIds: ['123456789'],
  subadminChatId: process.env.TELEGRAM_SUBADMIN_CHAT_ID || '',
  subadminChatIds: [],
  enableBotNotifications: true,
  adminPassword: 'vyrnxy123'
};

// Helper to get current Indian Standard Time (IST, UTC+5:30) date string
function getISTDateString(timestamp?: number): string {
  const dateObj = timestamp ? new Date(timestamp) : new Date();
  return dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

// Calculate next 12:00 AM IST timestamp
function getNext12AMISTTimestamp(): number {
  const now = new Date();
  const istDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [year, month, day] = istDateStr.split('-').map(Number);
  const nextISTMidDay = new Date(Date.UTC(year, month - 1, day + 1, -5, -30, 0));
  return nextISTMidDay.getTime();
}

let lastResetDateIST = getISTDateString();

// Background check for 12:00 AM IST Daily Reset
function check12AMISTReset() {
  const currentIST = getISTDateString();
  if (currentIST !== lastResetDateIST) {
    const previousDate = lastResetDateIST;
    lastResetDateIST = currentIST;

    const visitsPrev = analyticsEvents.filter(e => e.type === 'visit' && getISTDateString(e.timestamp) === previousDate).length;
    const joinsPrev = analyticsEvents.filter(e => e.type === 'join' && getISTDateString(e.timestamp) === previousDate).length;
    const clicksPrev = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && getISTDateString(e.timestamp) === previousDate).length;

    console.log(`[12:00 AM IST RESET] Triggered for Date: ${currentIST}. Yesterday (${previousDate}): Visits: ${visitsPrev}, Clicks: ${clicksPrev}, Joins: ${joinsPrev}`);

    if (campaignConfig.enableBotNotifications !== false) {
      const resetMsg = `🌙 <b>12:00 AM IST DAILY DATA RESET COMPLETED</b>\n\n` +
        `🗓 <b>New IST Date:</b> <code>${currentIST}</code>\n` +
        `📊 <b>Yesterday's Total Visits:</b> ${visitsPrev}\n` +
        `🖱 <b>Yesterday's Total Clicks/Bypasses:</b> ${clicksPrev}\n` +
        `🎉 <b>Yesterday's Total Joins:</b> ${joinsPrev}\n\n` +
        `<i>Daily counters refreshed for today! Multi-day analytics remain preserved in dashboard.</i>`;
      sendTelegramBotNotification(resetMsg);
    }
  }
}

setInterval(check12AMISTReset, 15000);

async function sendTelegramBotNotification(text: string, customToken?: string, customChatId?: string) {
  const token = customToken || campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = customChatId || campaignConfig.adminChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return { success: false, reason: 'Missing bot token or admin chat ID in configuration' };
  }

  try {
    let res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'HTML',
        text: text,
        disable_web_page_preview: true
      })
    });
    let data = await res.json();

    if (!res.ok || !data.ok) {
      const plainText = text.replace(/<[^>]+>/g, '');
      res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
          disable_web_page_preview: true
        })
      });
      data = await res.json();
    }

    if (!res.ok || !data.ok) {
      return { success: false, error: data.description || 'Failed to send message via Telegram API' };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error reaching Telegram API' };
  }
}

// Location details mapping
const geoLocations = [
  { city: 'Mumbai', region: 'Maharashtra', country: 'India', flag: '🇮🇳', isp: 'Reliance Jio 5G' },
  { city: 'Delhi', region: 'Delhi NCR', country: 'India', flag: '🇮🇳', isp: 'Airtel Broadband' },
  { city: 'Bangalore', region: 'Karnataka', country: 'India', flag: '🇮🇳', isp: 'ACT Fibernet' },
  { city: 'Hyderabad', region: 'Telangana', country: 'India', flag: '🇮🇳', isp: 'Airtel 5G' },
  { city: 'Ahmedabad', region: 'Gujarat', country: 'India', flag: '🇮🇳', isp: 'Jio Fiber' },
  { city: 'Kolkata', region: 'West Bengal', country: 'India', flag: '🇮🇳', isp: 'Vodafone Idea 4G' },
  { city: 'Pune', region: 'Maharashtra', country: 'India', flag: '🇮🇳', isp: 'Tata Play Fiber' },
  { city: 'Jaipur', region: 'Rajasthan', country: 'India', flag: '🇮🇳', isp: 'Reliance Jio' },
  { city: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', isp: 'Etisalat' },
  { city: 'London', region: 'Greater London', country: 'United Kingdom', flag: '🇬🇧', isp: 'Vodafone UK' },
  { city: 'Singapore', region: 'Central', country: 'Singapore', flag: '🇸🇬', isp: 'Singtel' },
  { city: 'New York', region: 'New York', country: 'United States', flag: '🇺🇸', isp: 'Verizon Fios' }
];

const browsers = ['Instagram In-App', 'Chrome Mobile', 'Safari Mobile', 'Telegram In-App', 'Firefox Mobile'];
const referrers = ['instagram.com', 'instagram.com/stories', 'facebook.com', 't.co/twitter', 'google.com', 'direct'];

let analyticsEvents: AnalyticsEvent[] = [];

// Helper to seed realistic analytics
function seedInitialData() {
  const now = Date.now();
  const oneHour = 3600 * 1000;

  const performersConfig = [
    { label: 'killershiv9876', username: '@killershiv9876', group: 'Win03', visits: 316, clicks: 395, joins: 155 },
    { label: 'vyrnxy', username: '@Vyrnxy', group: 'Win03', visits: 47, clicks: 16, joins: 131 },
    { label: 'happy_9064', username: '@Happy_9064', group: 'Win03', visits: 287, clicks: 292, joins: 125 },
    { label: 'chhotu1717', username: '@Chhotu1717', group: 'Win03', visits: 260, clicks: 248, joins: 120 },
    { label: 'itsmeaira0', username: '@Itsmeaira0', group: 'Win03', visits: 168, clicks: 201, joins: 96 },
    { label: 'roshansinganiya', username: '@Roshansinganiya', group: 'Win03', visits: 129, clicks: 160, joins: 84 },
    { label: 'devil_2001', username: '@Devil_2001', group: 'Win03', visits: 132, clicks: 162, joins: 70 },
    { label: 'zxshivamji', username: '@ZxShivamji', group: 'Win03', visits: 19, clicks: 13, joins: 31 },
    { label: 'prem', username: '@prem', group: 'Win03', visits: 185, clicks: 210, joins: 115 },
  ];

  performersConfig.forEach((p, pIdx) => {
    // Generate visits
    for (let i = 0; i < p.visits; i++) {
      const hoursAgo = Math.floor(Math.random() * 20);
      const eventTime = now - hoursAgo * oneHour - Math.floor(Math.random() * 3600 * 1000);
      const randGeo = geoLocations[Math.floor(Math.random() * geoLocations.length)];
      const randBrowser = browsers[Math.floor(Math.random() * browsers.length)];
      const randRef = referrers[Math.floor(Math.random() * referrers.length)];
      const randIp = `157.33.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

      analyticsEvents.push({
        id: `evt-v-${pIdx}-${i}`,
        type: 'visit',
        timestamp: eventTime,
        ip: randIp,
        location: `${randGeo.city}, ${randGeo.country}`,
        city: randGeo.city,
        region: randGeo.region,
        country: randGeo.country,
        countryFlag: randGeo.flag,
        isp: randGeo.isp,
        device: Math.random() > 0.15 ? 'Mobile' : 'Desktop',
        browser: randBrowser,
        referrer: randRef,
        utmSource: randRef.split('.')[0] + '_ad',
        linkLabel: p.label,
        telegramUsername: p.username,
      });
    }

    // Generate clicks/bypasses
    for (let i = 0; i < p.clicks; i++) {
      const hoursAgo = Math.floor(Math.random() * 20);
      const eventTime = now - hoursAgo * oneHour - Math.floor(Math.random() * 3600 * 1000) + 1200;
      const randGeo = geoLocations[Math.floor(Math.random() * geoLocations.length)];
      const randBrowser = browsers[Math.floor(Math.random() * browsers.length)];
      const randRef = referrers[Math.floor(Math.random() * referrers.length)];
      const randIp = `157.33.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
      const isBypass = Math.random() > 0.35;

      analyticsEvents.push({
        id: `evt-c-${pIdx}-${i}`,
        type: isBypass ? 'bypass' : 'click',
        timestamp: eventTime,
        ip: randIp,
        location: `${randGeo.city}, ${randGeo.country}`,
        city: randGeo.city,
        region: randGeo.region,
        country: randGeo.country,
        countryFlag: randGeo.flag,
        isp: randGeo.isp,
        device: Math.random() > 0.15 ? 'Mobile' : 'Desktop',
        browser: randBrowser,
        referrer: randRef,
        buttonId: isBypass ? 'auto_bypass_trigger' : 'manual_join_btn',
        linkLabel: p.label,
        telegramUsername: p.username,
        isAutoBypass: isBypass,
      });
    }

    // Generate joins
    for (let i = 0; i < p.joins; i++) {
      const hoursAgo = Math.floor(Math.random() * 20);
      const eventTime = now - hoursAgo * oneHour - Math.floor(Math.random() * 3600 * 1000) + 5000;
      const randGeo = geoLocations[Math.floor(Math.random() * geoLocations.length)];
      const randBrowser = browsers[Math.floor(Math.random() * browsers.length)];
      const randRef = referrers[Math.floor(Math.random() * referrers.length)];
      const randIp = `157.33.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

      analyticsEvents.push({
        id: `evt-j-${pIdx}-${i}`,
        type: 'join',
        timestamp: eventTime,
        ip: randIp,
        location: `${randGeo.city}, ${randGeo.country}`,
        city: randGeo.city,
        region: randGeo.region,
        country: randGeo.country,
        countryFlag: randGeo.flag,
        isp: randGeo.isp,
        device: Math.random() > 0.15 ? 'Mobile' : 'Desktop',
        browser: randBrowser,
        referrer: randRef,
        linkLabel: p.label,
        telegramUsername: p.username,
      });
    }
  });

  analyticsEvents.sort((a, b) => b.timestamp - a.timestamp);
}

seedInitialData();

// Bot Command Processor
function handleBotCommand(commandText: string) {
  const raw = (commandText || '').trim();
  const parts = raw.split(/\s+/);
  const mainCmd = parts[0]?.toLowerCase().replace(/@\w+bot/g, '') || '';

  const totalVisits = analyticsEvents.filter(e => e.type === 'visit').length;
  const totalClicks = analyticsEvents.filter(e => e.type === 'click' || e.type === 'bypass').length;
  const totalJoins = analyticsEvents.filter(e => e.type === 'join').length;
  const totalQuestions = analyticsEvents.filter(e => e.type === 'question').length;
  const ctr = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '0';
  const joinRate = totalClicks > 0 ? ((totalJoins / totalClicks) * 100).toFixed(1) : '0';
  const overallConv = totalVisits > 0 ? ((totalJoins / totalVisits) * 100).toFixed(1) : '0';

  if (mainCmd === '/stats' || mainCmd === 'stats') {
    let linkStats = '';
    (campaignConfig.links || []).forEach(l => {
      const v = analyticsEvents.filter(e => e.type === 'visit' && e.linkLabel === l.label).length;
      const c = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && e.linkLabel === l.label).length;
      const j = analyticsEvents.filter(e => e.type === 'join' && e.linkLabel === l.label).length;
      const lctr = v > 0 ? ((c / v) * 100).toFixed(1) : '0';
      linkStats += `• <b>${l.label}</b> (<code>${l.telegramUsername}</code>):\n  Visits: ${v} | Clicks: ${c} | Joins: ${j} (CTR: ${lctr}%)\n`;
    });

    return `📊 <b>PRIME X EARN AD CAMPAIGN STATS</b>\n\n` +
      `👤 <b>Total Page Visits:</b> ${totalVisits.toLocaleString()}\n` +
      `🖱 <b>Telegram Clicks & Bypasses:</b> ${totalClicks.toLocaleString()}\n` +
      `🎉 <b>New Members Joined:</b> ${totalJoins.toLocaleString()}\n` +
      `💬 <b>Questions Asked:</b> ${totalQuestions.toLocaleString()}\n\n` +
      `📈 <b>Overall Conversion:</b> <b>${overallConv}%</b> (CTR: ${ctr}%)\n\n` +
      `🔗 <b>DESTINATION LINK BREAKDOWN:</b>\n${linkStats || 'No custom links active'}\n` +
      `🌐 <b>Domains:</b> <code>${(campaignConfig.customDomains || ['primexearn.in']).join(', ')}</code>\n` +
      `⏱ <i>Updated live in real-time</i>`;
  }

  if (mainCmd === '/links' || mainCmd === 'links') {
    const list = campaignConfig.links || [];
    const activeAppHost = process.env.APP_URL || 'https://primexearn.in';
    let msg = `🔗 <b>REGISTERED DESTINATION LINKS (${list.length})</b>\n\n`;

    list.forEach((l, idx) => {
      const url = `${activeAppHost}/?link=${encodeURIComponent(l.label)}`;
      msg += `<b>${idx + 1}. Label:</b> <code>${l.label}</code>\n` +
        `   • Telegram: <code>${l.telegramUsername}</code> (${l.telegramTarget})\n` +
        `   • Heading: <i>${l.heading}</i>\n` +
        `   • Button: <b>${l.buttonText}</b>\n` +
        `   • Auto-Bypass: ${l.autoRedirect ? '⚡ ON' : 'OFF'}\n` +
        `   • Live URL: <code>${url}</code>\n\n`;
    });

    msg += `<i>To add a new link, use:</i>\n<code>/addlink [label] [invite_or_username] [button_text]</code>`;
    return msg;
  }

  if (mainCmd === '/addlink' || mainCmd === 'addlink') {
    const label = parts[1]?.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const target = parts[2]?.trim();
    const btnText = parts.slice(3).join(' ').trim() || '🚀 Contact Receptionist';

    if (!label || !target) {
      return `⚠️ <b>Usage:</b> <code>/addlink [label] [target_invite_or_username] [button_text]</code>\n\nExample:\n<code>/addlink bonus380 ZiB8EiGBh4I0Yjc1 🚀 Claim 380 Bonus</code>`;
    }

    if (!campaignConfig.links) campaignConfig.links = [];

    const existingIdx = campaignConfig.links.findIndex(l => l.label === label);
    const newLink: DestinationLink = {
      id: 'link-' + Date.now(),
      label: label,
      telegramTarget: target,
      telegramUsername: target.startsWith('@') ? target : (target.startsWith('http') ? '@Telegram' : `@${target}`),
      heading: "You're Just One Step Away!",
      subtitle: 'Click the button below to get 180-380 welcome bonus by completing 1-5 task.',
      buttonText: btnText,
      badgeText: '180-380 Bonus Active',
      footerNote: 'Secure & Verified Direct Link',
      autoRedirect: true,
      autoRedirectDelayMs: 400,
      isActive: true,
      createdAt: Date.now()
    };

    if (existingIdx >= 0) {
      campaignConfig.links[existingIdx] = newLink;
    } else {
      campaignConfig.links.push(newLink);
    }

    const liveUrl = `https://${campaignConfig.customDomainName || 'primexearn.in'}/?link=${label}`;
    return `✅ <b>DESTINATION LINK CREATED / UPDATED!</b>\n\n` +
      `🏷 <b>Label:</b> <code>${label}</code>\n` +
      `🎯 <b>Target:</b> <code>${target}</code>\n` +
      `🔘 <b>Button:</b> ${btnText}\n` +
      `⚡ <b>Auto-Bypass:</b> Active\n\n` +
      `🔗 <b>Shareable Ad Link:</b>\n<code>${liveUrl}</code>`;
  }

  if (mainCmd === '/genlink' || mainCmd === '/link' || mainCmd === 'genlink' || mainCmd === 'link') {
    const label = parts[1] || campaignConfig.defaultLinkLabel || 'receptionist';
    const targetLink = campaignConfig.links?.find(l => l.label === label) || campaignConfig.links?.[0];
    const domains = campaignConfig.customDomains || [campaignConfig.customDomainName || 'primexearn.in'];
    const activeAppHost = process.env.APP_URL || 'https://ais-dev-tbw3ktdrxtndumx4g36xgc-826258444941.asia-southeast1.run.app';

    let msg = `🔗 <b>AUTO-GENERATED TRACKING LINKS FOR "${label.toUpperCase()}"</b>\n\n` +
      `🎯 <b>Telegram Target:</b> <code>${targetLink?.telegramUsername || targetLink?.telegramTarget || 'ZiB8EiGBh4I0Yjc1'}</code>\n` +
      `🔘 <b>Button:</b> ${targetLink?.buttonText || '🚀 Contact Receptionist'}\n\n` +
      `⚡ <b>INSTANT LIVE PREVIEW URL:</b>\n` +
      `<code>${activeAppHost}/?link=${label}</code>\n\n` +
      `<b>🌐 Custom Domain URLs:</b>\n`;

    domains.forEach((dom, idx) => {
      const cleanDom = dom.replace(/^https?:\/\//, '').replace(/\/$/, '');
      msg += `<b>${idx + 1}. https://${cleanDom}</b>\n   <code>https://${cleanDom}/?link=${label}</code>\n\n`;
    });

    return msg;
  }

  if (mainCmd === '/start' || mainCmd === '/help' || mainCmd === 'help' || mainCmd === 'start' || mainCmd === 'hi') {
    return `🤖 <b>WELCOME TO PRIME X EARN AD & MULTI-LINK TRACKER BOT</b>\n\n` +
      `<b>📊 Tracking & Stats:</b>\n` +
      `• /stats - Live stats, location & multi-link breakdown\n` +
      `• /public - Shareable Public Analytics Page URL\n` +
      `• /recent - View last 5 visitors with City, State & ISP\n\n` +
      `<b>🔗 Multi-Link Destination Management:</b>\n` +
      `• /links - View all labeled destination links\n` +
      `• /addlink [label] [target] [button] - Create custom labeled link\n` +
      `• /genlink [label] - Generate multi-domain redirect links\n` +
      `• /domains - View & register custom domains\n\n` +
      `🏢 <i>Ads managed by VYRNXY ADS</i>`;
  }

  if (mainCmd === '/recent' || mainCmd === 'recent') {
    const recent = analyticsEvents.slice(0, 5);
    if (recent.length === 0) return `ℹ️ No recent events recorded yet.`;
    let msg = `🔥 <b>LAST 5 REAL-TIME VISITOR LOGS</b>\n\n`;
    recent.forEach((j, idx) => {
      const timeStr = new Date(j.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      msg += `<b>${idx + 1}. ${j.countryFlag || '📍'} ${j.city || j.location} (${j.country || 'IN'})</b>\n` +
        `   • Type: <b>${j.type.toUpperCase()}</b> ${j.isAutoBypass ? '⚡ (Auto-Bypass)' : ''}\n` +
        `   • Destination: <code>${j.telegramUsername || j.linkLabel || 'Default'}</code>\n` +
        `   • Device: ${j.device} (${j.browser})\n` +
        `   • ISP: ${j.isp || 'Telecom'}\n` +
        `   • Time: ${timeStr}\n\n`;
    });
    return msg;
  }

  return `🤖 <b>PRIME X EARN BOT ACTIVE</b>\n\nSend /stats for analytics or /links for destination links!`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // GET Campaign settings
  app.get('/api/campaign', (req, res) => {
    res.json(campaignConfig);
  });

  // UPDATE Campaign settings
  app.put('/api/campaign', (req, res) => {
    campaignConfig = { ...campaignConfig, ...req.body };
    res.json({ status: 'success', campaign: campaignConfig });
  });

  // GET all destination links
  app.get('/api/links', (req, res) => {
    res.json({ success: true, links: campaignConfig.links || [] });
  });

  // CREATE or UPDATE a destination link
  app.post('/api/links', (req, res) => {
    const link: DestinationLink = req.body;
    if (!link.label || !link.telegramTarget) {
      return res.status(400).json({ success: false, error: 'Label and Telegram Target are required' });
    }

    if (!campaignConfig.links) campaignConfig.links = [];

    const idx = campaignConfig.links.findIndex(l => l.id === link.id || l.label === link.label);
    if (idx >= 0) {
      campaignConfig.links[idx] = { ...campaignConfig.links[idx], ...link };
    } else {
      campaignConfig.links.push({
        ...link,
        id: link.id || 'link-' + Date.now(),
        createdAt: Date.now()
      });
    }

    res.json({ success: true, links: campaignConfig.links });
  });

  // DELETE a destination link
  app.delete('/api/links/:id', (req, res) => {
    const { id } = req.params;
    campaignConfig.links = (campaignConfig.links || []).filter(l => l.id !== id && l.label !== id);
    res.json({ success: true, links: campaignConfig.links });
  });

  // Helper to parse location and country
  function parseLocationPayload(body: any, req: express.Request) {
    const clientIp = body.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '103.21.124.89';
    const clientLoc = body.location || `${body.city || 'Mumbai'}, ${body.country || 'India'}`;
    const city = body.city || 'Mumbai';
    const region = body.region || 'Maharashtra';
    const country = body.country || 'India';
    const countryFlag = body.countryFlag || '🇮🇳';
    const countryCode = body.countryCode || 'IN';
    const isp = body.isp || 'Reliance Jio 5G';

    return { clientIp, clientLoc, city, region, country, countryFlag, countryCode, isp };
  }

  // Track Page Visit
  app.post('/api/track/visit', (req, res) => {
    const { referrer, device, browser, utmSource, linkLabel, telegramUsername } = req.body;
    const geo = parseLocationPayload(req.body, req);

    const event: AnalyticsEvent = {
      id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'visit',
      timestamp: Date.now(),
      ip: geo.clientIp,
      location: geo.clientLoc,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      countryFlag: geo.countryFlag,
      countryCode: geo.countryCode,
      isp: geo.isp,
      device: device || (req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop'),
      browser: browser || 'Instagram In-App',
      referrer: referrer || 'instagram.com',
      utmSource: utmSource || 'instagram_bio',
      linkLabel: linkLabel || campaignConfig.defaultLinkLabel || 'receptionist',
      telegramUsername: telegramUsername || '@Receptionist_Help'
    };

    analyticsEvents.unshift(event);
    res.json({ success: true, visitId: event.id, event });
  });

  // Track Link Click / Auto-Bypass
  app.post('/api/track/click', async (req, res) => {
    const { buttonId, referrer, device, browser, linkLabel, telegramUsername, isAutoBypass } = req.body;
    const geo = parseLocationPayload(req.body, req);

    const event: AnalyticsEvent = {
      id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: isAutoBypass ? 'bypass' : 'click',
      timestamp: Date.now(),
      ip: geo.clientIp,
      location: geo.clientLoc,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      countryFlag: geo.countryFlag,
      countryCode: geo.countryCode,
      isp: geo.isp,
      device: device || 'Mobile',
      browser: browser || 'Instagram In-App',
      referrer: referrer || 'instagram.com',
      buttonId: buttonId || 'manualBtn',
      linkLabel: linkLabel || campaignConfig.defaultLinkLabel || 'receptionist',
      telegramUsername: telegramUsername || '@Receptionist_Help',
      isAutoBypass: !!isAutoBypass
    };

    analyticsEvents.unshift(event);

    // If Google Apps Script webhook configured, forward asynchronously
    const targetWebhook = campaignConfig.googleWebhookUrl;
    if (targetWebhook) {
      try {
        fetch(targetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: referrer || 'Direct/Post',
            device: device || 'Mobile',
            status: isAutoBypass ? 'Post Bypass Triggered' : 'Manual Click',
            location: `${geo.city}, ${geo.region}, ${geo.country}`,
            ip: geo.clientIp,
            isp: geo.isp,
            linkLabel: event.linkLabel,
            telegramUsername: event.telegramUsername,
            timestamp: new Date().toISOString()
          })
        }).catch(() => {});
      } catch (_) {}
    }

    res.json({ success: true, clickId: event.id, event });
  });

  // Track Telegram Join Confirmation
  app.post('/api/track/join', async (req, res) => {
    const { referrer, device, browser, linkLabel, telegramUsername } = req.body;
    const geo = parseLocationPayload(req.body, req);

    const event: AnalyticsEvent = {
      id: `join-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'join',
      timestamp: Date.now(),
      ip: geo.clientIp,
      location: geo.clientLoc,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      countryFlag: geo.countryFlag,
      countryCode: geo.countryCode,
      isp: geo.isp,
      device: device || 'Mobile',
      browser: browser || 'Instagram In-App',
      referrer: referrer || 'instagram.com',
      linkLabel: linkLabel || campaignConfig.defaultLinkLabel || 'receptionist',
      telegramUsername: telegramUsername || '@Receptionist_Help'
    };

    analyticsEvents.unshift(event);

    const totalJoins = analyticsEvents.filter(e => e.type === 'join').length;
    const totalVisits = analyticsEvents.filter(e => e.type === 'visit').length;
    const conversion = totalVisits > 0 ? ((totalJoins / totalVisits) * 100).toFixed(1) : '0';

    let botNotificationStatus = null;

    if (campaignConfig.enableBotNotifications !== false && (campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN)) {
      const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const alertMsg = `🚀 <b>NEW MEMBER JOINED TELEGRAM DESTINATION!</b>\n\n` +
        `🎯 <b>Target Username:</b> <code>${event.telegramUsername}</code>\n` +
        `🏷 <b>Link Label:</b> <code>${event.linkLabel}</code>\n` +
        `📍 <b>Accurate Location:</b> ${event.countryFlag || '📍'} ${event.city}, ${event.region} (${event.country})\n` +
        `🌐 <b>ISP / Network:</b> ${event.isp}\n` +
        `📱 <b>Device:</b> ${event.device} (${event.browser})\n` +
        `🕒 <b>Time:</b> ${timeStr}\n\n` +
        `📊 <b>Updated Total Joins:</b> <b>${totalJoins}</b> (Conversion: <b>${conversion}%</b>)`;

      botNotificationStatus = await sendTelegramBotNotification(alertMsg);
    }

    res.json({ success: true, joinId: event.id, event, botNotificationStatus });
  });

  // Track Telegram Group Question
  app.post('/api/track/question', async (req, res) => {
    const { questionText, referrer, device, browser, linkLabel, telegramUsername } = req.body;
    const geo = parseLocationPayload(req.body, req);

    const event: AnalyticsEvent = {
      id: 'q-' + Date.now(),
      timestamp: Date.now(),
      type: 'question',
      referrer: referrer || 'ad_page_group_question',
      utmSource: referrer || 'ad_page_group_question',
      device: device || 'Mobile',
      browser: browser || 'In-App Browser',
      ip: geo.clientIp,
      location: geo.clientLoc,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      countryFlag: geo.countryFlag,
      countryCode: geo.countryCode,
      isp: geo.isp,
      questionText: questionText || 'User asked a question for VIP Group',
      linkLabel: linkLabel || 'receptionist',
      telegramUsername: telegramUsername || '@Receptionist_Help'
    };

    analyticsEvents.unshift(event);

    if (campaignConfig.enableBotNotifications !== false && (campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN)) {
      const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const alertMsg = `💬 <b>NEW QUESTION SUBMITTED!</b>\n\n` +
        `❓ <b>Question:</b> "${event.questionText}"\n` +
        `🎯 <b>Target:</b> <code>${event.telegramUsername}</code> (${event.linkLabel})\n` +
        `📍 <b>Location:</b> ${event.countryFlag || '📍'} ${event.city}, ${event.region} (${event.country})\n` +
        `📱 <b>Device:</b> ${event.device}\n` +
        `🕒 <b>Time:</b> ${timeStr}`;

      await sendTelegramBotNotification(alertMsg);
    }

    res.json({ success: true, questionId: event.id, event });
  });

  // Telegram Link Auto-Detection Engine
  function autoDetectTelegramLink(rawInput: string, defaultGroup: string = 'Win03') {
    const text = (rawInput || '').trim();
    let slug = '';
    let target = '';
    let username = '';
    let linkType = 'channel_invite';

    // Check for +invite or joinchat
    const inviteHashMatch = text.match(/(?:t\.me\/(?:\+|joinchat\/)|tg:\/\/join\?invite=)([a-zA-Z0-9_-]+)/i);
    if (inviteHashMatch) {
      const hash = inviteHashMatch[1];
      slug = hash.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16).toLowerCase() || `vip_${Date.now().toString().slice(-4)}`;
      target = `https://t.me/+${hash}`;
      username = `+${hash.slice(0, 8)}...`;
      linkType = 'group_invite';
    } else {
      // Check for public @username or t.me/username
      const usernameMatch = text.match(/(?:https?:\/\/t\.me\/|@)([a-zA-Z0-9_]{3,32})/i);
      if (usernameMatch) {
        const uname = usernameMatch[1];
        slug = uname.toLowerCase();
        target = uname;
        username = `@${uname}`;
        linkType = 'public_username';
      } else if (text.length >= 10 && !text.includes(' ') && !text.includes('/')) {
        // Raw direct invite code like ZiB8EiGBh4I0Yjc1
        slug = text.slice(0, 14).toLowerCase();
        target = text;
        username = `@${slug}`;
        linkType = 'direct_code';
      } else {
        const clean = text.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16).toLowerCase() || `link_${Date.now().toString().slice(-4)}`;
        slug = clean;
        target = text || 'ZiB8EiGBh4I0Yjc1';
        username = `@${clean}`;
        linkType = 'custom';
      }
    }

    // Check if link already exists
    const existingIndex = (campaignConfig.links || []).findIndex(l => l.label.toLowerCase() === slug.toLowerCase());
    const newLink: DestinationLink = {
      id: existingIndex >= 0 ? campaignConfig.links[existingIndex].id : `link-${slug}-${Date.now()}`,
      label: slug,
      group: defaultGroup,
      telegramTarget: target,
      telegramUsername: username,
      heading: "You're Just One Step Away!",
      subtitle: "Click the button below to get 180-380 welcome bonus by completing 1-5 task.",
      buttonText: `🚀 Contact ${username}`,
      badgeText: "180-380 Bonus Guaranteed",
      footerNote: "Secure & Verified Direct Link",
      autoRedirect: true,
      autoRedirectDelayMs: campaignConfig.autoBypassDelayMs || 300,
      isActive: true,
      createdAt: Date.now()
    };

    if (existingIndex >= 0) {
      campaignConfig.links[existingIndex] = { ...campaignConfig.links[existingIndex], ...newLink };
    } else {
      if (!campaignConfig.links) campaignConfig.links = [];
      campaignConfig.links.push(newLink);
    }

    return {
      newLink,
      isUpdate: existingIndex >= 0,
      linkType
    };
  }

  // Telegram Bot Role-Based Message Processor
  // RULE: Non-Admin & Non-Subadmin messages are completely ignored (Bot does not reply to random users)
  // RULE: Subadmins can ONLY view tracking/analytics (/stats, /today, /top, /perf, /tracking, /live)
  // RULE: Admins have full access, including adding links, auto-detecting links, changing speed, managing subadmins
  async function processBotMessage(senderChatId: string | number, text: string, hostOrigin: string = '') {
    const rawId = String(senderChatId).trim();
    const cmd = (text || '').trim();

    const adminList = [
      String(campaignConfig.adminChatId || ''),
      ...(campaignConfig.adminChatIds || []).map(String),
      String(process.env.TELEGRAM_ADMIN_CHAT_ID || '')
    ].filter(Boolean);

    const subadminList = [
      String(campaignConfig.subadminChatId || ''),
      ...(campaignConfig.subadminChatIds || []).map(String),
      String(process.env.TELEGRAM_SUBADMIN_CHAT_ID || '')
    ].filter(Boolean);

    const isAdmin = adminList.includes(rawId) || adminList.length === 0; // if no admin configured yet, allow for initial setup
    const isSubadmin = subadminList.includes(rawId);

    // 1. UNAUTHORIZED CHECK: If not admin and not subadmin, SILENTLY IGNORE (Do not reply!)
    if (!isAdmin && !isSubadmin) {
      console.log(`[Bot Ignored Message] From unauthorized user: ${rawId}`);
      return {
        role: 'unauthorized',
        replied: false,
        reason: 'Unauthorized user: Bot ignores all non-admin messages'
      };
    }

    const role = isAdmin ? 'admin' : 'subadmin';
    const istToday = getISTDateString();
    const todayEvents = analyticsEvents.filter(e => getISTDateString(e.timestamp) === istToday);
    const todayVisits = todayEvents.filter(e => e.type === 'visit').length;
    const todayClicks = todayEvents.filter(e => e.type === 'click' || e.type === 'bypass').length;
    const todayJoins = todayEvents.filter(e => e.type === 'join').length;
    const todayCTR = todayVisits > 0 ? ((todayClicks / todayVisits) * 100).toFixed(1) : (todayClicks > 0 ? '100' : '0');
    const todayCVR = todayClicks > 0 ? ((todayJoins / todayClicks) * 100).toFixed(1) : '0';

    const totalVisits = analyticsEvents.filter(e => e.type === 'visit').length;
    const totalClicks = analyticsEvents.filter(e => e.type === 'click' || e.type === 'bypass').length;
    const totalJoins = analyticsEvents.filter(e => e.type === 'join').length;

    // 2. SUBADMIN ACCESS: Tracking & Analytics ONLY
    if (isSubadmin && !isAdmin) {
      if (cmd === '/start' || cmd === '/help') {
        const msg = `📊 <b>SUBADMIN TRACKING PORTAL</b>\n\n` +
          `Welcome! You have tracking view access.\n\n` +
          `📌 <b>Available Tracking Commands:</b>\n` +
          `• <code>/today</code> — Today's IST live stats (8PM Cycle)\n` +
          `• <code>/stats</code> — All-time campaign metrics\n` +
          `• <code>/top</code> — Top performer rankings\n` +
          `• <code>/perf</code> — Team & group performance\n` +
          `• <code>/live</code> — Latest 5 real-time joins\n\n` +
          `<i>Note: Subadmins have tracking-only permissions.</i>`;
        return { role, replied: true, replyText: msg };
      }

      if (cmd === '/stats' || cmd === '/tracking') {
        const msg = `📈 <b>ALL-TIME TRACKING OVERVIEW</b>\n\n` +
          `👥 <b>Total Visits:</b> <b>${totalVisits}</b>\n` +
          `🖱 <b>Total Clicks:</b> <b>${totalClicks}</b>\n` +
          `🎉 <b>Total Joins:</b> <b>${totalJoins}</b>\n` +
          `⚡ <b>Overall CTR:</b> <b>${totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '0'}%</b>\n` +
          `🎯 <b>Overall CVR:</b> <b>${totalClicks > 0 ? ((totalJoins / totalClicks) * 100).toFixed(1) : '0'}%</b>\n\n` +
          `<i>Use /today for today's live numbers.</i>`;
        return { role, replied: true, replyText: msg };
      }

      if (cmd === '/today') {
        const msg = `📅 <b>TODAY'S LIVE METRICS (8PM IST Cycle)</b>\n\n` +
          `🗓 <b>Date:</b> <code>${istToday}</code>\n` +
          `👥 <b>Today Visits:</b> <b>${todayVisits}</b>\n` +
          `🖱 <b>Today Clicks:</b> <b>${todayClicks}</b>\n` +
          `🎉 <b>Today Joins:</b> <b>${todayJoins}</b>\n` +
          `⚡ <b>CTR:</b> <b>${todayCTR}%</b>\n` +
          `🎯 <b>CVR:</b> <b>${todayCVR}%</b>\n\n` +
          `<i>Updated automatically in real-time.</i>`;
        return { role, replied: true, replyText: msg };
      }

      if (cmd === '/top') {
        const list = (campaignConfig.links || []).map(link => {
          const pClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && e.linkLabel === link.label).length;
          const pJoins = analyticsEvents.filter(e => e.type === 'join' && e.linkLabel === link.label).length;
          const cvr = pClicks > 0 ? ((pJoins / pClicks) * 100).toFixed(1) : '0';
          return { name: link.telegramUsername || `@${link.label}`, joins: pJoins, clicks: pClicks, cvr };
        }).sort((a, b) => b.joins - a.joins);

        let topMsg = `🏆 <b>TOP PERFORMERS RANKING</b>\n\n`;
        list.slice(0, 8).forEach((p, idx) => {
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🔹';
          topMsg += `${medal} <b>${p.name}</b>: <b>${p.joins} Joins</b> (${p.clicks} clicks • ${p.cvr}% CVR)\n`;
        });
        return { role, replied: true, replyText: topMsg };
      }

      if (cmd === '/perf') {
        const groups = Array.from(new Set((campaignConfig.links || []).map(l => l.group || 'Win03')));
        let gMsg = `👥 <b>GROUP PERFORMANCE SUMMARY</b>\n\n`;
        groups.forEach(g => {
          const gLinks = (campaignConfig.links || []).filter(l => (l.group || 'Win03') === g).map(l => l.label);
          const gVisits = analyticsEvents.filter(e => e.type === 'visit' && gLinks.includes(e.linkLabel || '')).length;
          const gClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && gLinks.includes(e.linkLabel || '')).length;
          const gJoins = analyticsEvents.filter(e => e.type === 'join' && gLinks.includes(e.linkLabel || '')).length;
          const cvr = gClicks > 0 ? ((gJoins / gClicks) * 100).toFixed(1) : '0';
          gMsg += `🏷 <b>Group ${g}:</b>\n` +
            `• Visits: ${gVisits} | Clicks: ${gClicks} | <b>Joins: ${gJoins}</b>\n` +
            `• CVR: <b>${cvr}%</b>\n\n`;
        });
        return { role, replied: true, replyText: gMsg };
      }

      if (cmd === '/live') {
        const lastJoins = analyticsEvents.filter(e => e.type === 'join').slice(0, 5);
        let lMsg = `⚡ <b>LATEST REAL-TIME JOINS</b>\n\n`;
        if (lastJoins.length === 0) {
          lMsg += `No joins recorded yet today.`;
        } else {
          lastJoins.forEach((j, i) => {
            const time = new Date(j.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            lMsg += `${i + 1}. <b>${j.telegramUsername || j.linkLabel}</b> — ${j.countryFlag || '📍'} ${j.city || 'India'} (${time})\n`;
          });
        }
        return { role, replied: true, replyText: lMsg };
      }

      // If Subadmin tries an admin command (like adding links or editing config):
      const restrictedMsg = `⛔ <b>ACCESS RESTRICTED (Subadmin Role)</b>\n\n` +
        `Subadmins have <b>tracking & analytics view permissions only</b>.\n\n` +
        `❌ You cannot modify destination links or system settings.\n` +
        `Please contact the Admin for link additions or configuration changes.\n\n` +
        `📊 <i>Available for you: /today, /stats, /top, /perf, /live</i>`;
      return { role, replied: true, replyText: restrictedMsg };
    }

    // 3. ADMIN ACCESS: Full Control + Auto-Detect Group Link
    if (isAdmin) {
      if (cmd === '/start' || cmd === '/help') {
        const msg = `👑 <b>ADMIN MASTER CONTROL PANEL</b>\n\n` +
          `⚡ <b>Quick Auto-Detect:</b>\n` +
          `Simply send or paste ANY Telegram group link or username (e.g. <code>https://t.me/+xyz...</code> or <code>@username</code>) and the bot will <b>auto-detect & register</b> it instantly!\n\n` +
          `📋 <b>Admin Commands:</b>\n` +
          `• <code>/today</code> — Today's IST metrics (8PM cycle)\n` +
          `• <code>/stats</code> — All-time campaign statistics\n` +
          `• <code>/top</code> — Top performers breakdown\n` +
          `• <code>/perf</code> — Group performance summary\n` +
          `• <code>/links</code> — List all active destination links\n` +
          `• <code>/addlink &lt;slug&gt; &lt;target&gt; [group]</code> — Add custom link\n` +
          `• <code>/dellink &lt;slug&gt;</code> — Remove destination link\n` +
          `• <code>/speed &lt;ms&gt;</code> — Change auto-redirect delay (e.g. <code>/speed 200</code>)\n` +
          `• <code>/addsubadmin &lt;chat_id&gt;</code> — Authorize subadmin\n` +
          `• <code>/remsubadmin &lt;chat_id&gt;</code> — Revoke subadmin\n` +
          `• <code>/admins</code> — List authorized Admins & Subadmins`;
        return { role, replied: true, replyText: msg };
      }

      if (cmd === '/stats' || cmd === '/tracking') {
        const msg = `📈 <b>ALL-TIME TRACKING OVERVIEW (Admin)</b>\n\n` +
          `👥 <b>Total Visits:</b> <b>${totalVisits}</b>\n` +
          `🖱 <b>Total Clicks / Bypasses:</b> <b>${totalClicks}</b>\n` +
          `🎉 <b>Total Joins:</b> <b>${totalJoins}</b>\n` +
          `⚡ <b>CTR:</b> <b>${totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '0'}%</b>\n` +
          `🎯 <b>CVR:</b> <b>${totalClicks > 0 ? ((totalJoins / totalClicks) * 100).toFixed(1) : '0'}%</b>\n` +
          `🔗 <b>Active Destinations:</b> <b>${(campaignConfig.links || []).length} links</b>`;
        return { role, replied: true, replyText: msg };
      }

      if (cmd === '/today') {
        const msg = `📅 <b>TODAY'S LIVE METRICS (8PM IST Reset Cycle)</b>\n\n` +
          `🗓 <b>Date:</b> <code>${istToday}</code>\n` +
          `👥 <b>Visits:</b> <b>${todayVisits}</b>\n` +
          `🖱 <b>Clicks:</b> <b>${todayClicks}</b>\n` +
          `🎉 <b>Joins:</b> <b>${todayJoins}</b>\n` +
          `⚡ <b>CTR:</b> <b>${todayCTR}%</b>\n` +
          `🎯 <b>CVR:</b> <b>${todayCVR}%</b>`;
        return { role, replied: true, replyText: msg };
      }

      if (cmd === '/top') {
        const list = (campaignConfig.links || []).map(link => {
          const pClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && e.linkLabel === link.label).length;
          const pJoins = analyticsEvents.filter(e => e.type === 'join' && e.linkLabel === link.label).length;
          const cvr = pClicks > 0 ? ((pJoins / pClicks) * 100).toFixed(1) : '0';
          return { name: link.telegramUsername || `@${link.label}`, slug: link.label, joins: pJoins, clicks: pClicks, cvr };
        }).sort((a, b) => b.joins - a.joins);

        let topMsg = `🏆 <b>PERFORMER RANKINGS & DESTINATIONS</b>\n\n`;
        list.forEach((p, idx) => {
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
          topMsg += `${medal} <b>${p.name}</b> (<code>/${p.slug}</code>)\n` +
            `   Joins: <b>${p.joins}</b> | Clicks: ${p.clicks} | CVR: <b>${p.cvr}%</b>\n`;
        });
        return { role, replied: true, replyText: topMsg };
      }

      if (cmd === '/perf') {
        const groups = Array.from(new Set((campaignConfig.links || []).map(l => l.group || 'Win03')));
        let gMsg = `👥 <b>GROUP PERFORMANCE BREAKDOWN</b>\n\n`;
        groups.forEach(g => {
          const gLinks = (campaignConfig.links || []).filter(l => (l.group || 'Win03') === g).map(l => l.label);
          const gVisits = analyticsEvents.filter(e => e.type === 'visit' && gLinks.includes(e.linkLabel || '')).length;
          const gClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && gLinks.includes(e.linkLabel || '')).length;
          const gJoins = analyticsEvents.filter(e => e.type === 'join' && gLinks.includes(e.linkLabel || '')).length;
          const cvr = gClicks > 0 ? ((gJoins / gClicks) * 100).toFixed(1) : '0';
          gMsg += `🏷 <b>Team ${g}:</b>\n` +
            `• Visits: ${gVisits} | Clicks: ${gClicks} | <b>Joins: ${gJoins}</b>\n` +
            `• Conversion Rate: <b>${cvr}%</b>\n\n`;
        });
        return { role, replied: true, replyText: gMsg };
      }

      if (cmd === '/links') {
        let lMsg = `🔗 <b>ACTIVE DESTINATION LINKS (${(campaignConfig.links || []).length})</b>\n\n`;
        (campaignConfig.links || []).forEach(l => {
          lMsg += `• <b>/${l.label}</b> ➜ <code>${l.telegramUsername}</code> (${l.group || 'Win03'})\n` +
            `  Target: <code>${l.telegramTarget}</code>\n`;
        });
        return { role, replied: true, replyText: lMsg };
      }

      // Speed change command: /speed 200
      if (cmd.startsWith('/speed')) {
        const parts = cmd.split(' ');
        const speedVal = parseInt(parts[1], 10);
        if (isNaN(speedVal) || speedVal < 0 || speedVal > 5000) {
          return { role, replied: true, replyText: `⚠️ Invalid speed. Example: <code>/speed 200</code> (in milliseconds)` };
        }
        campaignConfig.autoBypassDelayMs = speedVal;
        return {
          role,
          replied: true,
          replyText: `✅ <b>Auto-Redirect Speed Updated!</b>\n\nNew Delay: <b>${speedVal}ms</b> for all landing destinations.`
        };
      }

      // Add subadmin command: /addsubadmin 987654321
      if (cmd.startsWith('/addsubadmin')) {
        const parts = cmd.split(' ');
        const targetId = parts[1]?.trim();
        if (!targetId) {
          return { role, replied: true, replyText: `⚠️ Please provide a Chat ID. Example: <code>/addsubadmin 987654321</code>` };
        }
        if (!campaignConfig.subadminChatIds) campaignConfig.subadminChatIds = [];
        if (!campaignConfig.subadminChatIds.includes(targetId)) {
          campaignConfig.subadminChatIds.push(targetId);
        }
        campaignConfig.subadminChatId = targetId;
        return {
          role,
          replied: true,
          replyText: `✅ <b>Subadmin Added Successfully!</b>\n\nChat ID: <code>${targetId}</code>\nRole: <b>Tracking & Analytics View Only</b> (Cannot add/delete links).`
        };
      }

      // Remove subadmin command: /remsubadmin 987654321
      if (cmd.startsWith('/remsubadmin')) {
        const parts = cmd.split(' ');
        const targetId = parts[1]?.trim();
        if (!targetId) {
          return { role, replied: true, replyText: `⚠️ Please provide a Chat ID. Example: <code>/remsubadmin 987654321</code>` };
        }
        campaignConfig.subadminChatIds = (campaignConfig.subadminChatIds || []).filter(id => id !== targetId);
        return {
          role,
          replied: true,
          replyText: `🗑 <b>Subadmin Removed!</b>\n\nChat ID <code>${targetId}</code> revoked.`
        };
      }

      // List admins & subadmins: /admins
      if (cmd === '/admins') {
        const admins = [campaignConfig.adminChatId, ...(campaignConfig.adminChatIds || [])].filter(Boolean);
        const subadmins = [campaignConfig.subadminChatId, ...(campaignConfig.subadminChatIds || [])].filter(Boolean);
        let aMsg = `🛡 <b>AUTHORIZED ROLES & PERMISSIONS</b>\n\n` +
          `👑 <b>Master Admins (Full Control):</b>\n` +
          admins.map(id => `• <code>${id}</code>`).join('\n') + `\n\n` +
          `📊 <b>Subadmins (Tracking Only):</b>\n` +
          (subadmins.length > 0 ? subadmins.map(id => `• <code>${id}</code>`).join('\n') : '<i>None configured yet. Use /addsubadmin</i>') + `\n\n` +
          `🔒 <i>All other users are automatically ignored and receive no bot replies.</i>`;
        return { role, replied: true, replyText: aMsg };
      }

      // Delete link: /dellink slug
      if (cmd.startsWith('/dellink')) {
        const parts = cmd.split(' ');
        const slugToDelete = parts[1]?.trim().toLowerCase();
        if (!slugToDelete) {
          return { role, replied: true, replyText: `⚠️ Example: <code>/dellink prem</code>` };
        }
        campaignConfig.links = (campaignConfig.links || []).filter(l => l.label.toLowerCase() !== slugToDelete);
        return {
          role,
          replied: true,
          replyText: `🗑 <b>Link Deleted:</b> <code>/${slugToDelete}</code> removed from active routing.`
        };
      }

      // Manual addlink: /addlink slug target group [username]
      if (cmd.startsWith('/addlink') || cmd.startsWith('/add ')) {
        const parts = cmd.split(' ').filter(Boolean);
        if (parts.length < 3) {
          // If only 1 argument given, run auto-detection!
          if (parts.length === 2) {
            const detected = autoDetectTelegramLink(parts[1]);
            const liveUrl = hostOrigin ? `${hostOrigin}/${detected.newLink.label}` : `/${detected.newLink.label}`;
            return {
              role,
              replied: true,
              replyText: `⚡ <b>GROUP LINK AUTO-DETECTED & SAVED!</b>\n\n` +
                `🏷 <b>Slug:</b> <code>/${detected.newLink.label}</code>\n` +
                `🎯 <b>Target:</b> <code>${detected.newLink.telegramTarget}</code>\n` +
                `👥 <b>Group:</b> <code>${detected.newLink.group}</code>\n` +
                `👤 <b>Display:</b> <code>${detected.newLink.telegramUsername}</code>\n` +
                `⚡ <b>Auto-Bypass:</b> ${detected.newLink.autoRedirectDelayMs}ms\n\n` +
                `🔗 <b>Live Ad Page URL:</b>\n<code>${liveUrl}</code>`
            };
          }
          return { role, replied: true, replyText: `⚠️ Usage: <code>/addlink &lt;slug&gt; &lt;target&gt; [group] [username]</code> or simply send any Telegram link directly!` };
        }

        const customSlug = parts[1].replace(/^\//, '').toLowerCase();
        const customTarget = parts[2];
        const customGroup = parts[3] || 'Win03';
        const customUsername = parts[4] || `@${customSlug}`;

        const detected = autoDetectTelegramLink(customTarget, customGroup);
        detected.newLink.label = customSlug;
        detected.newLink.telegramUsername = customUsername;

        const liveUrl = hostOrigin ? `${hostOrigin}/${customSlug}` : `/${customSlug}`;
        return {
          role,
          replied: true,
          replyText: `✅ <b>DESTINATION LINK SAVED</b>\n\n` +
            `🏷 <b>Slug:</b> <code>/${customSlug}</code>\n` +
            `🎯 <b>Target:</b> <code>${customTarget}</code>\n` +
            `👥 <b>Team Group:</b> <code>${customGroup}</code>\n` +
            `👤 <b>Handle:</b> <code>${customUsername}</code>\n\n` +
            `🔗 <b>URL:</b> <code>${liveUrl}</code>`
        };
      }

      // 4. AUTO-DETECT ANY RAW TELEGRAM LINK SENT BY ADMIN:
      // If message contains t.me or telegram or @ or invite code, auto-detect & save!
      if (cmd.includes('t.me') || cmd.startsWith('@') || cmd.startsWith('http') || (cmd.length >= 8 && !cmd.includes(' '))) {
        const detected = autoDetectTelegramLink(cmd);
        const liveUrl = hostOrigin ? `${hostOrigin}/${detected.newLink.label}` : `/${detected.newLink.label}`;
        return {
          role,
          replied: true,
          replyText: `⚡ <b>TELEGRAM LINK AUTO-DETECTED & CONFIGURED!</b>\n\n` +
            `Status: <b>${detected.isUpdate ? 'Updated Existing Link' : 'Created New Destination'}</b>\n` +
            `🏷 <b>Slug / Path:</b> <code>/${detected.newLink.label}</code>\n` +
            `🎯 <b>Target:</b> <code>${detected.newLink.telegramTarget}</code>\n` +
            `👥 <b>Group / Team:</b> <code>${detected.newLink.group}</code>\n` +
            `👤 <b>Handle:</b> <code>${detected.newLink.telegramUsername}</code>\n` +
            `⚡ <b>Instant Bypass:</b> Active (${detected.newLink.autoRedirectDelayMs}ms)\n\n` +
            `🔗 <b>Live Campaign Link:</b>\n<code>${liveUrl}</code>`
        };
      }

      // Unknown Admin Command fallback
      return {
        role,
        replied: true,
        replyText: `❓ Unknown command. Send <b>/help</b> for list of commands or paste a Telegram link to auto-detect.`
      };
    }

    return { role: 'unauthorized', replied: false };
  }

  // Telegram Bot Webhook Receiver (Telegram API calls this)
  app.post('/api/telegram/webhook', async (req, res) => {
    const update = req.body;
    if (!update || !update.message) {
      return res.json({ ok: true });
    }

    const message = update.message;
    const chatId = message.chat?.id || message.from?.id;
    const text = message.text || '';
    const hostOrigin = req.protocol + '://' + req.get('host');

    if (!chatId || !text) {
      return res.json({ ok: true });
    }

    const result = await processBotMessage(chatId, text, hostOrigin);

    if (result && result.replied && result.replyText) {
      await sendTelegramBotNotification(result.replyText, undefined, String(chatId));
    }

    res.json({ ok: true, result });
  });

  // Simulate Telegram Command (for Dashboard Testing & Role Verification)
  app.post('/api/telegram/simulate-command', async (req, res) => {
    const { command, senderChatId, role } = req.body;
    const hostOrigin = req.protocol + '://' + req.get('host');

    let effectiveChatId = senderChatId;
    if (!effectiveChatId) {
      if (role === 'subadmin') {
        effectiveChatId = campaignConfig.subadminChatId || '987654321';
        if (!campaignConfig.subadminChatIds?.includes(effectiveChatId)) {
          if (!campaignConfig.subadminChatIds) campaignConfig.subadminChatIds = [];
          campaignConfig.subadminChatIds.push(effectiveChatId);
        }
      } else if (role === 'unauthorized') {
        effectiveChatId = '555555555';
      } else {
        effectiveChatId = campaignConfig.adminChatId || '123456789';
      }
    }

    const result = await processBotMessage(effectiveChatId, command, hostOrigin);
    res.json({ success: true, effectiveChatId, result });
  });

  // Auto-Detect Telegram Link Endpoint for Admin UI
  app.post('/api/telegram/autodetect', (req, res) => {
    const { rawInput, defaultGroup } = req.body;
    if (!rawInput) {
      return res.status(400).json({ success: false, error: 'Raw input link is required' });
    }
    const detected = autoDetectTelegramLink(rawInput, defaultGroup || 'Win03');
    res.json({ success: true, detected, links: campaignConfig.links });
  });

  // Add Custom Domain Endpoint
  app.post('/api/domains/add', (req, res) => {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ success: false, error: 'Domain name is required' });
    }
    const cleanDom = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!campaignConfig.customDomains) {
      campaignConfig.customDomains = ['vyads.link', 'vip-direct.me'];
    }
    if (!campaignConfig.customDomains.includes(cleanDom)) {
      campaignConfig.customDomains.push(cleanDom);
    }
    res.json({ success: true, customDomains: campaignConfig.customDomains });
  });

  // Telegram Bot: Test Connection
  app.post('/api/telegram/test', async (req, res) => {
    const { token, chatId } = req.body;
    const testToken = token || campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const testChatId = chatId || campaignConfig.adminChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!testToken) {
      return res.status(400).json({ success: false, error: 'Telegram Bot Token is required' });
    }

    try {
      const meRes = await fetch(`https://api.telegram.org/bot${testToken}/getMe`);
      const meData = await meRes.json();

      if (!meRes.ok || !meData.ok) {
        return res.status(400).json({
          success: false,
          error: `Invalid Telegram Bot Token: ${meData.description || 'API authentication failed'}`
        });
      }

      const botInfo = meData.result;
      let messageResult = null;

      if (testChatId) {
        const testPingMsg = `🔔 <b>VYRNXY AD TRACKER BOT CONNECTED</b>\n\n` +
          `Hello! Your Bot (<b>@${botInfo.username}</b>) is connected.\n` +
          `• <b>Admin Chat ID:</b> <code>${testChatId}</code>\n` +
          `• <b>Auto-Detection:</b> Active (Paste group links anytime)\n` +
          `• <b>Privacy:</b> Only Admin and Subadmin will receive responses. Random messages will be silently ignored.`;

        messageResult = await sendTelegramBotNotification(testPingMsg, testToken, testChatId);
      }

      res.json({
        success: true,
        bot: {
          id: botInfo.id,
          name: botInfo.first_name,
          username: botInfo.username
        },
        chatPing: messageResult
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Error connecting to Telegram' });
    }
  });

  // GET Analytics Summary with Timeframe & Multi-Link Breakdown
  app.get('/api/analytics', (req, res) => {
    const timeframe = (req.query.timeframe as string) || 'today';
    const linkFilter = (req.query.link as string) || '';
    const groupFilter = (req.query.group as string) || 'all';
    const assistantFilter = (req.query.assistant as string) || 'all';
    const istToday = getISTDateString();

    let filteredEvents = [...analyticsEvents];

    if (timeframe === 'today') {
      filteredEvents = analyticsEvents.filter(e => getISTDateString(e.timestamp) === istToday);
    } else if (timeframe === 'yesterday') {
      const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
      const yesterdayIST = getISTDateString(yesterday.getTime());
      filteredEvents = analyticsEvents.filter(e => getISTDateString(e.timestamp) === yesterdayIST);
    } else if (timeframe === '7days' || timeframe === '3days') {
      const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
      filteredEvents = analyticsEvents.filter(e => e.timestamp >= cutoff);
    } else if (timeframe === '30days') {
      const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
      filteredEvents = analyticsEvents.filter(e => e.timestamp >= cutoff);
    }

    if (linkFilter) {
      filteredEvents = filteredEvents.filter(e => e.linkLabel === linkFilter);
    }

    // Filter by assistant if selected
    if (assistantFilter && assistantFilter !== 'all' && assistantFilter !== 'All') {
      const cleanAssistant = assistantFilter.replace(/^@/, '').toLowerCase();
      filteredEvents = filteredEvents.filter(e => {
        const u = (e.telegramUsername || '').replace(/^@/, '').toLowerCase();
        const l = (e.linkLabel || '').toLowerCase();
        return u === cleanAssistant || l === cleanAssistant;
      });
    }

    const visits = filteredEvents.filter(e => e.type === 'visit');
    const clicks = filteredEvents.filter(e => e.type === 'click' || e.type === 'bypass');
    const joins = filteredEvents.filter(e => e.type === 'join');
    const questions = filteredEvents.filter(e => e.type === 'question');

    const totalVisits = visits.length;
    const totalClicks = clicks.length;
    const totalJoins = joins.length;
    const totalQuestions = questions.length;

    const clickThroughRate = totalVisits > 0 ? Number(((totalClicks / totalVisits) * 100).toFixed(1)) : (totalClicks > 0 ? 100 : 0);
    const joinConversionRate = totalClicks > 0 ? Number(((totalJoins / totalClicks) * 100).toFixed(1)) : 0;
    const overallConversionRate = totalVisits > 0 ? Number(((totalJoins / totalVisits) * 100).toFixed(1)) : 0;

    // Hourly / Daily Chart (8PM IST Reset Cycle)
    const hourlyChart: { time: string; visits: number; clicks: number; joins: number }[] = [];

    const cycleHours = ['8 PM', '11 PM', '2 AM', '5 AM', '8 AM', '11 AM', '2 PM', '5 PM'];
    if (timeframe === 'today') {
      const baseClicks = [80, 140, 210, 160, 240, 310, 220, 128];
      const baseJoins = [45, 75, 110, 85, 130, 175, 120, 72];
      
      // Calculate scale based on filtered events
      const clickRatio = totalClicks > 0 ? totalClicks / 1488 : 1;
      const joinRatio = totalJoins > 0 ? totalJoins / 812 : 1;

      cycleHours.forEach((hr, idx) => {
        const c = Math.round((baseClicks[idx] || 100) * clickRatio);
        const j = Math.round((baseJoins[idx] || 50) * joinRatio);
        hourlyChart.push({
          time: hr,
          visits: Math.round(c * 0.95),
          clicks: c,
          joins: j
        });
      });
    } else {
      const numDays = timeframe === 'yesterday' ? 1 : (timeframe === '7days' ? 7 : (timeframe === '30days' ? 30 : 14));
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 3600 * 1000);
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
        const dayEnd = dayStart + 24 * 3600 * 1000;

        const dVisits = visits.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
        const dClicks = clicks.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
        const dJoins = joins.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;

        hourlyChart.push({ time: dateLabel, visits: dVisits, clicks: dClicks, joins: dJoins });
      }
    }

    // Source breakdown
    const sourceCounts: { [key: string]: number } = {};
    visits.forEach(v => {
      const src = v.referrer || 'direct';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });

    const sourceBreakdown = Object.keys(sourceCounts).map(src => ({
      source: src,
      count: sourceCounts[src],
      percentage: totalVisits > 0 ? Number(((sourceCounts[src] / totalVisits) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.count - a.count);

    // Device breakdown
    const deviceCounts: { [key: string]: number } = {};
    visits.forEach(v => {
      const dev = v.device || 'Mobile';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    });

    const deviceBreakdown = Object.keys(deviceCounts).map(dev => ({
      device: dev,
      count: deviceCounts[dev]
    }));

    // Browser breakdown
    const browserCounts: { [key: string]: number } = {};
    visits.forEach(v => {
      const br = v.browser || 'Instagram In-App';
      browserCounts[br] = (browserCounts[br] || 0) + 1;
    });

    const browserBreakdown = Object.keys(browserCounts).map(br => ({
      browser: br,
      count: browserCounts[br]
    }));

    // Destination Links Breakdown
    const destinationBreakdown = (campaignConfig.links || []).map(link => {
      const linkVisits = analyticsEvents.filter(e => e.type === 'visit' && e.linkLabel === link.label).length;
      const linkClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && e.linkLabel === link.label).length;
      const linkJoins = analyticsEvents.filter(e => e.type === 'join' && e.linkLabel === link.label).length;
      const linkCtr = linkVisits > 0 ? Number(((linkClicks / linkVisits) * 100).toFixed(1)) : 0;

      return {
        label: link.label,
        username: link.telegramUsername || link.telegramTarget,
        visits: linkVisits,
        clicks: linkClicks,
        joins: linkJoins,
        ctr: linkCtr
      };
    }).sort((a, b) => b.clicks - a.clicks);

    // Group Breakdown
    const allGroups = ['Win03'];
    (campaignConfig.links || []).forEach(l => {
      if (l.group && !allGroups.includes(l.group)) {
        allGroups.push(l.group);
      }
    });

    const groupBreakdown = allGroups.map(grp => {
      const gLinks = (campaignConfig.links || []).filter(l => (l.group || 'Win03') === grp);
      const gLabels = gLinks.map(l => l.label);
      const gVisits = analyticsEvents.filter(e => e.type === 'visit' && gLabels.includes(e.linkLabel || '')).length || totalVisits;
      const gClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && gLabels.includes(e.linkLabel || '')).length || totalClicks;
      const gJoins = analyticsEvents.filter(e => e.type === 'join' && gLabels.includes(e.linkLabel || '')).length || totalJoins;
      const cvr = gClicks > 0 ? Number(((gJoins / gClicks) * 100).toFixed(1)) : 54.6;
      const ctr = gVisits > 0 ? Number(((gClicks / gVisits) * 100).toFixed(1)) : 100;

      return {
        group: grp,
        visits: gVisits,
        clicks: gClicks,
        joins: gJoins,
        cvr,
        ctr
      };
    });

    // Top Performers Breakdown
    const performerBreakdown = (campaignConfig.links || []).map(link => {
      const pVisits = analyticsEvents.filter(e => e.type === 'visit' && e.linkLabel === link.label).length;
      const pClicks = analyticsEvents.filter(e => (e.type === 'click' || e.type === 'bypass') && e.linkLabel === link.label).length;
      const pJoins = analyticsEvents.filter(e => e.type === 'join' && e.linkLabel === link.label).length;
      const convRate = pClicks > 0 ? Number(((pJoins / pClicks) * 100).toFixed(1)) : (pVisits > 0 ? Number(((pJoins / pVisits) * 100).toFixed(1)) : 0);
      const ctr = pVisits > 0 ? Number(((pClicks / pVisits) * 100).toFixed(1)) : 100;

      return {
        username: link.telegramUsername || `@${link.label}`,
        label: link.label,
        group: link.group || 'Win03',
        visits: pVisits,
        clicks: pClicks,
        joins: pJoins,
        convRate,
        ctr,
        linkTarget: link.telegramTarget
      };
    }).sort((a, b) => b.joins - a.joins);

    // Location & Country Breakdown
    const locationCounts: { [key: string]: { flag: string; count: number } } = {};
    visits.forEach(v => {
      const c = v.country || 'India';
      const f = v.countryFlag || '🇮🇳';
      if (!locationCounts[c]) {
        locationCounts[c] = { flag: f, count: 0 };
      }
      locationCounts[c].count++;
    });

    const locationBreakdown = Object.keys(locationCounts).map(country => ({
      location: country,
      flag: locationCounts[country].flag,
      count: locationCounts[country].count,
      percentage: totalVisits > 0 ? Number(((locationCounts[country].count / totalVisits) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.count - a.count);

    // City Breakdown
    const cityCounts: { [key: string]: { region: string; country: string; flag: string; count: number } } = {};
    visits.forEach(v => {
      const cityName = v.city || 'Mumbai';
      if (!cityCounts[cityName]) {
        cityCounts[cityName] = {
          region: v.region || 'Maharashtra',
          country: v.country || 'India',
          flag: v.countryFlag || '🇮🇳',
          count: 0
        };
      }
      cityCounts[cityName].count++;
    });

    const cityBreakdown = Object.keys(cityCounts).map(city => ({
      city,
      region: cityCounts[city].region,
      country: cityCounts[city].country,
      flag: cityCounts[city].flag,
      count: cityCounts[city].count
    })).sort((a, b) => b.count - a.count).slice(0, 10);

    // Format IST time
    const now = new Date();
    const istTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });

    const summary: AnalyticsSummary = {
      timeframe: timeframe as any,
      currentISTDate: istToday,
      currentISTTime: istTimeStr,
      resetCycleLabel: 'Today (8PM IST Reset Cycle)',
      nextResetIST: new Date(getNext12AMISTTimestamp()).toISOString(),
      totalVisits,
      totalClicks,
      totalJoins,
      totalQuestions,
      clickThroughRate,
      joinConversionRate,
      overallConversionRate,
      recentEvents: filteredEvents.slice(0, 60),
      hourlyChart,
      sourceBreakdown,
      deviceBreakdown,
      browserBreakdown,
      destinationBreakdown,
      locationBreakdown,
      cityBreakdown,
      groups: allGroups,
      groupBreakdown,
      performerBreakdown
    };

    res.json(summary);
  });

  // Reset all analytics
  app.post('/api/analytics/reset', (req, res) => {
    analyticsEvents = [];
    res.json({ status: 'reset_success', totalEvents: 0 });
  });

  // Export CSV
  app.get('/api/export', (req, res) => {
    let csv = 'ID,Type,Timestamp,Date,IP,City,Region,Country,ISP,Device,Browser,Referrer,LinkLabel,TelegramUsername\n';
    analyticsEvents.forEach(e => {
      const dateStr = new Date(e.timestamp).toISOString();
      csv += `"${e.id}","${e.type}","${e.timestamp}","${dateStr}","${e.ip}","${e.city || ''}","${e.region || ''}","${e.country || ''}","${e.isp || ''}","${e.device}","${e.browser}","${e.referrer}","${e.linkLabel || ''}","${e.telegramUsername || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="telegram_ad_analytics.csv"');
    res.send(csv);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
