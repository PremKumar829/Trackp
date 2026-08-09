import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CampaignConfig, AnalyticsEvent, AnalyticsSummary } from './src/types';

// Initial Campaign Configuration
let campaignConfig: CampaignConfig = {
  id: 'campaign-001',
  title: 'Prime X Earn',
  subtitle: 'Join Prime X Earn — India\'s #1 Premium VIP Telegram Channel for Free Signals & Income Updates',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  avatarBorderColor: '#ef4444',
  telegramLink: 'https://t.me/telegram',
  telegramGroupLink: 'https://t.me/telegram', // VIP Group Link for Q&A and community discussion
  secondaryTelegramLink: 'https://t.me/telegram',
  ctaText1: '✈ Join Free Telegram Channel',
  ctaText2: '✈ Join Free Telegram Channel',
  groupCtaText: '💬 Have a Question? Ask in VIP Group',
  questionPromptText: 'Have a question before joining Prime X Earn? Ask directly in our Official VIP Group!',
  timerSeconds: 595, // 00:00:09:55
  adManagedByText: 'Ads managed by VYRNXY ADS',
  adManagedByLink: 'https://t.me/+ec-4Jk1PY7w3Y2Vl',
  themePreset: 'light3d',
  enable3dPhysics: true,
  enableSound: true,
  verifyJoinModal: true,
  customDomainName: 'primexearn.in',
  customDomains: ['primexearn.in', 'vip.selfiegmrs.in', 't.primexearn.org', 'earn.vyads.com'],
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
  enableBotNotifications: true,
  adminPassword: 'vyrnxy123'
};

// Helper to get current Indian Standard Time (IST, UTC+5:30) date string
function getISTDateString(timestamp?: number): string {
  const dateObj = timestamp ? new Date(timestamp) : new Date();
  return dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // e.g. "2026-08-09"
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
    const clicksPrev = analyticsEvents.filter(e => e.type === 'click' && getISTDateString(e.timestamp) === previousDate).length;

    console.log(`[12:00 AM IST RESET] Triggered for Date: ${currentIST}. Yesterday (${previousDate}): Visits: ${visitsPrev}, Clicks: ${clicksPrev}, Joins: ${joinsPrev}`);

    if (campaignConfig.enableBotNotifications !== false) {
      const resetMsg = `🌙 <b>12:00 AM IST DAILY DATA RESET COMPLETED</b>\n\n` +
        `🗓 <b>New IST Date:</b> <code>${currentIST}</code>\n` +
        `📊 <b>Yesterday's Total Visits:</b> ${visitsPrev}\n` +
        `🖱 <b>Yesterday's Total Clicks:</b> ${clicksPrev}\n` +
        `🎉 <b>Yesterday's Total Joins:</b> ${joinsPrev}\n\n` +
        `<i>Daily counters refreshed for today! Multi-day analytics (Last 3 Days, 30 Days, All Time) remain preserved in dashboard.</i>`;
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

    // Fallback if HTML parsing fails
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

// Bot Command Processor
function handleBotCommand(commandText: string) {
  const raw = (commandText || '').trim();
  const parts = raw.split(/\s+/);
  const mainCmd = parts[0]?.toLowerCase().replace(/@\w+bot/g, '') || '';

  const totalVisits = analyticsEvents.filter(e => e.type === 'visit').length;
  const totalClicks = analyticsEvents.filter(e => e.type === 'click').length;
  const totalJoins = analyticsEvents.filter(e => e.type === 'join').length;
  const totalQuestions = analyticsEvents.filter(e => e.type === 'question').length;
  const ctr = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '0';
  const joinRate = totalClicks > 0 ? ((totalJoins / totalClicks) * 100).toFixed(1) : '0';
  const overallConv = totalVisits > 0 ? ((totalJoins / totalVisits) * 100).toFixed(1) : '0';

  if (mainCmd === '/stats' || mainCmd === 'stats') {
    return `📊 <b>PRIME X EARN AD CAMPAIGN STATS</b>\n\n` +
      `👤 <b>Total Page Visits:</b> ${totalVisits.toLocaleString()}\n` +
      `🖱 <b>Telegram Link Clicks:</b> ${totalClicks.toLocaleString()}\n` +
      `🎉 <b>New Members Joined:</b> ${totalJoins.toLocaleString()}\n` +
      `💬 <b>Group Questions Asked:</b> ${totalQuestions.toLocaleString()}\n\n` +
      `📈 <b>Performance Rates:</b>\n` +
      `• CTR (Visits ➔ Clicks): <b>${ctr}%</b>\n` +
      `• Join Rate (Clicks ➔ Joined): <b>${joinRate}%</b>\n` +
      `• Overall Conversion: <b>${overallConv}%</b>\n\n` +
      `📢 <b>Ad Campaign:</b> ${campaignConfig.title}\n` +
      `🏢 <b>Managed By:</b> ${campaignConfig.adManagedByText}\n` +
      `🌐 <b>Domains (${(campaignConfig.customDomains || []).length}):</b> <code>${(campaignConfig.customDomains || ['primexearn.in']).join(', ')}</code>\n` +
      `⏱ <i>Updated live in real-time</i>`;
  }

  if (mainCmd === '/genlink' || mainCmd === '/link' || mainCmd === 'genlink' || mainCmd === 'link') {
    const customTarget = parts[1] || campaignConfig.telegramLink;
    const targetType = (customTarget.includes('group') || parts[2] === 'group') ? 'Group' : 'Channel';
    const domains = campaignConfig.customDomains || [campaignConfig.customDomainName || 'primexearn.in'];
    const activeAppHost = process.env.APP_URL || 'https://ais-dev-tbw3ktdrxtndumx4g36xgc-826258444941.asia-southeast1.run.app';

    const liveWorkingUrl = `${activeAppHost}/?redirect=${encodeURIComponent(customTarget)}&utm_source=telegram_bot&target=${targetType.toLowerCase()}`;

    let msg = `🔗 <b>AUTO-GENERATED REDIRECT TRACKING LINKS</b>\n\n` +
      `🏷 <b>Target (${targetType}):</b> <code>${customTarget}</code>\n\n` +
      `⚡ <b>INSTANT LIVE LINK (100% Working Now):</b>\n` +
      `<code>${liveWorkingUrl}</code>\n\n` +
      `<b>🌐 Custom Domain Redirect Links (Requires Domain DNS Setup):</b>\n`;

    domains.forEach((dom, idx) => {
      const cleanDom = dom.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const redirectUrl = `https://${cleanDom}/?redirect=${encodeURIComponent(customTarget)}&utm_source=telegram_bot&target=${targetType.toLowerCase()}`;
      msg += `<b>${idx + 1}. https://${cleanDom}</b>\n   <code>${redirectUrl}</code>\n\n`;
    });

    msg += `<i>Tip: Use the Instant Live Link above for immediate testing without DNS setup!</i>`;
    return msg;
  }

  if (mainCmd === '/domains' || mainCmd === 'domains') {
    const list = campaignConfig.customDomains || [campaignConfig.customDomainName || 'primexearn.in'];
    let msg = `🌐 <b>REGISTERED AD DOMAINS (${list.length})</b>\n\n`;
    list.forEach((dom, i) => {
      msg += `<b>${i + 1}.</b> <code>${dom}</code> ${dom === campaignConfig.customDomainName ? '⭐ <i>(Primary)</i>' : ''}\n`;
    });
    msg += `\n<i>To add a new domain, send:</i> <code>/adddomain yourdomain.com</code>`;
    return msg;
  }

  if (mainCmd === '/adddomain' || mainCmd === 'adddomain') {
    const newDom = parts[1]?.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!newDom) {
      return `⚠️ <b>Usage:</b> <code>/adddomain domain.com</code>\nExample: <code>/adddomain vip.primexearn.org</code>`;
    }
    if (!campaignConfig.customDomains) {
      campaignConfig.customDomains = ['primexearn.in'];
    }
    if (!campaignConfig.customDomains.includes(newDom)) {
      campaignConfig.customDomains.push(newDom);
      return `✅ <b>Domain added successfully!</b>\n\nRegistered domain: <code>${newDom}</code>\nTotal Active Domains: <b>${campaignConfig.customDomains.length}</b>\n\nSend <b>/genlink</b> to generate tracking links for all domains!`;
    } else {
      return `ℹ️ Domain <code>${newDom}</code> is already in your domain list.`;
    }
  }

  if (mainCmd === '/channel' || mainCmd === 'channel') {
    const activeAppHost = process.env.APP_URL || 'https://ais-dev-tbw3ktdrxtndumx4g36xgc-826258444941.asia-southeast1.run.app';
    const dom = campaignConfig.customDomainName || 'primexearn.in';
    const liveLink = `${activeAppHost}/?redirect=${encodeURIComponent(campaignConfig.telegramLink)}&target=channel`;
    const customLink = `https://${dom}/?redirect=${encodeURIComponent(campaignConfig.telegramLink)}&target=channel`;
    return `📢 <b>PRIME X EARN OFFICIAL CHANNEL LINK</b>\n\n` +
      `⚡ <b>Instant Live Link (100% Working):</b>\n<code>${liveLink}</code>\n\n` +
      `🌐 <b>Custom Domain Link (${dom}):</b>\n<code>${customLink}</code>\n\n` +
      `• Direct Target: <code>${campaignConfig.telegramLink}</code>`;
  }

  if (mainCmd === '/group' || mainCmd === 'group') {
    const activeAppHost = process.env.APP_URL || 'https://ais-dev-tbw3ktdrxtndumx4g36xgc-826258444941.asia-southeast1.run.app';
    const groupLink = campaignConfig.telegramGroupLink || 'https://t.me/telegram';
    const dom = campaignConfig.customDomainName || 'primexearn.in';
    const liveLink = `${activeAppHost}/?redirect=${encodeURIComponent(groupLink)}&target=group`;
    const customLink = `https://${dom}/?redirect=${encodeURIComponent(groupLink)}&target=group`;
    return `👥 <b>PRIME X EARN OFFICIAL VIP GROUP LINK</b>\n\n` +
      `⚡ <b>Instant Live Link (100% Working):</b>\n<code>${liveLink}</code>\n\n` +
      `🌐 <b>Custom Domain Link (${dom}):</b>\n<code>${customLink}</code>\n\n` +
      `• Direct Group Target: <code>${groupLink}</code>\n` +
      `<i>Users can ask questions directly in this VIP Group!</i>`;
  }

  if (mainCmd === '/ask' || mainCmd === '/question' || mainCmd === 'ask' || mainCmd === 'question') {
    const questionText = parts.slice(1).join(' ');
    if (!questionText) {
      return `❓ <b>ASK A QUESTION IN VIP GROUP</b>\n\nUsage: <code>/ask Is this channel free for daily signals?</code>\n\nYour question will be logged and routed to the team in VIP Group: <code>${campaignConfig.telegramGroupLink || 'https://t.me/telegram'}</code>`;
    }

    const qEvent: AnalyticsEvent = {
      id: 'q-' + Date.now(),
      timestamp: Date.now(),
      type: 'question',
      referrer: 'telegram_bot',
      utmSource: 'telegram_bot',
      device: 'Mobile',
      browser: 'Telegram App',
      ip: '103.21.124.89',
      location: 'India',
      questionText: questionText
    };
    analyticsEvents.unshift(qEvent);

    return `💬 <b>QUESTION RECEIVED & LOGGED</b>\n\n` +
      `❓ <b>Question:</b> "${questionText}"\n` +
      `👥 <b>VIP Group:</b> <code>${campaignConfig.telegramGroupLink || 'https://t.me/telegram'}</code>\n\n` +
      `<i>Our support admins will reply in the VIP Group shortly!</i>`;
  }

  if (mainCmd === '/recent' || mainCmd === 'recent') {
    const recentJoins = analyticsEvents.filter(e => e.type === 'join').slice(0, 5);
    if (recentJoins.length === 0) {
      return `ℹ️ <b>No recent channel joins recorded yet for Prime X Earn.</b>`;
    }
    let msg = `🔥 <b>LAST ${recentJoins.length} MEMBER JOINS (PRIME X EARN)</b>\n\n`;
    recentJoins.forEach((j, idx) => {
      const timeStr = new Date(j.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      msg += `<b>${idx + 1}.</b> 📍 ${j.location} | 📱 ${j.device}\n` +
        `   • IP: <code>${j.ip}</code>\n` +
        `   • Time: ${timeStr} (${j.referrer || 'direct'})\n\n`;
    });
    return msg;
  }

  if (mainCmd === '/setchannel' || mainCmd === 'setchannel') {
    const newUrl = parts[1]?.trim();
    if (!newUrl || !newUrl.startsWith('http')) {
      return `⚠️ <b>Usage:</b> <code>/setchannel https://t.me/your_new_channel</code>\nExample: <code>/setchannel https://t.me/primexearn_official</code>`;
    }
    campaignConfig.telegramLink = newUrl;
    return `✅ <b>Channel Redirect Link Updated!</b>\n\nNew Channel Target: <code>${newUrl}</code>\n\n<i>All user clicks and tracking links now automatically route to this Channel!</i>`;
  }

  if (mainCmd === '/setgroup' || mainCmd === 'setgroup') {
    const newUrl = parts[1]?.trim();
    if (!newUrl || !newUrl.startsWith('http')) {
      return `⚠️ <b>Usage:</b> <code>/setgroup https://t.me/your_vip_group</code>\nExample: <code>/setgroup https://t.me/primexearn_vip_group</code>`;
    }
    campaignConfig.telegramGroupLink = newUrl;
    return `✅ <b>VIP Group Redirect Link Updated!</b>\n\nNew Group Target: <code>${newUrl}</code>\n\n<i>Q&A submissions and Group buttons now route to this Group!</i>`;
  }

  if (mainCmd === '/setlink' || mainCmd === 'setlink') {
    const target = parts[1]?.toLowerCase();
    const newUrl = parts[2]?.trim();
    if (!target || !newUrl || !newUrl.startsWith('http')) {
      return `⚠️ <b>Usage:</b> <code>/setlink channel https://t.me/channel</code> or <code>/setlink group https://t.me/group</code>`;
    }
    if (target === 'channel') {
      campaignConfig.telegramLink = newUrl;
      return `✅ <b>Channel Redirect Link Updated to:</b>\n<code>${newUrl}</code>`;
    } else if (target === 'group') {
      campaignConfig.telegramGroupLink = newUrl;
      return `✅ <b>VIP Group Redirect Link Updated to:</b>\n<code>${newUrl}</code>`;
    } else {
      return `⚠️ Unrecognized target. Use <code>channel</code> or <code>group</code>.`;
    }
  }

  if (mainCmd === '/settitle' || mainCmd === 'settitle') {
    const newTitle = parts.slice(1).join(' ').trim();
    if (!newTitle) {
      return `⚠️ <b>Usage:</b> <code>/settitle Prime X Earn Official VIP</code>`;
    }
    campaignConfig.title = newTitle;
    return `✅ <b>Campaign Title Updated!</b>\nNew Title: <b>${newTitle}</b>`;
  }

  if (mainCmd === '/public' || mainCmd === '/analytics' || mainCmd === 'public' || mainCmd === 'analytics') {
    const activeAppHost = process.env.APP_URL || 'https://ais-dev-tbw3ktdrxtndumx4g36xgc-826258444941.asia-southeast1.run.app';
    const publicUrl = `${activeAppHost}/?view=analytics`;
    return `📊 <b>PRIME X EARN PUBLIC ANALYTICS PAGE</b>\n\n` +
      `Access live conversion metrics, today's data, and 3-day / 30-day performance charts:\n` +
      `<code>${publicUrl}</code>\n\n` +
      `<i>Features Today, 3 Days, 30 Days & All-Time filters with daily 12:00 AM IST resets!</i>`;
  }

  if (mainCmd === '/reset' || mainCmd === 'reset') {
    const istToday = getISTDateString();
    return `🌙 <b>12:00 AM IST DAILY RESET SYSTEM STATUS</b>\n\n` +
      `🗓 <b>Current IST Date:</b> <code>${istToday}</code>\n` +
      `⏱ <b>Next Scheduled Reset:</b> 12:00 AM IST Midnight\n` +
      `📊 <b>Today's Page Visits:</b> ${analyticsEvents.filter(e => e.type === 'visit' && getISTDateString(e.timestamp) === istToday).length}\n` +
      `🎉 <b>Today's Member Joins:</b> ${analyticsEvents.filter(e => e.type === 'join' && getISTDateString(e.timestamp) === istToday).length}\n\n` +
      `<i>Data automatically resets every night at 12:00 AM Indian Standard Time (IST).</i>`;
  }

  if (mainCmd === '/campaign' || mainCmd === 'campaign') {
    return `📢 <b>ACTIVE AD CAMPAIGN CONFIG</b>\n\n` +
      `🏷 <b>Title:</b> ${campaignConfig.title}\n` +
      `📝 <b>Subtitle:</b> ${campaignConfig.subtitle}\n` +
      `🏢 <b>Ad Manager:</b> ${campaignConfig.adManagedByText}\n` +
      `🔗 <b>Telegram Channel:</b> <code>${campaignConfig.telegramLink}</code>\n` +
      `👥 <b>Telegram Group:</b> <code>${campaignConfig.telegramGroupLink || 'https://t.me/telegram'}</code>\n` +
      `⏱ <b>Timer Duration:</b> ${campaignConfig.timerSeconds} seconds\n` +
      `🎨 <b>Theme Preset:</b> ${campaignConfig.themePreset}\n` +
      `🤖 <b>Bot Auto Alerts:</b> ${campaignConfig.enableBotNotifications !== false ? 'Active' : 'Disabled'}`;
  }

  if (mainCmd === '/start' || mainCmd === '/help' || mainCmd === 'help' || mainCmd === 'start' || mainCmd === 'hi' || mainCmd === 'hello') {
    return `🤖 <b>WELCOME TO PRIME X EARN AD TRACKER BOT</b>\n\n` +
      `I monitor and notify you in real-time about new Telegram channel members & group questions joining from your Prime X Earn 3D ad page.\n\n` +
      `<b>📊 Tracking & Analytics:</b>\n` +
      `• /stats - Live conversion metrics & stats\n` +
      `• /public - Shareable Public Analytics Page URL\n` +
      `• /recent - View last 5 member joins with IP & location\n` +
      `• /reset - Check 12:00 AM IST daily reset status\n\n` +
      `<b>🔗 Redirect Link Controls:</b>\n` +
      `• /setchannel [URL] - Update Channel destination link\n` +
      `• /setgroup [URL] - Update VIP Group destination link\n` +
      `• /setlink [channel/group] [URL] - Change destination link\n` +
      `• /genlink [target] - Generate multi-domain tracking links\n` +
      `• /domains - View & manage active domain names\n` +
      `• /adddomain [domain] - Register a new custom domain\n\n` +
      `<b>📢 Campaign Controls:</b>\n` +
      `• /channel - Get instant channel redirect link\n` +
      `• /group - Get instant group redirect link\n` +
      `• /settitle [title] - Update campaign title\n` +
      `• /ask [question] - Submit a question to VIP group\n` +
      `• /campaign - View current ad campaign config\n\n` +
      `🏢 <i>Ads managed by VYRNXY ADS</i>`;
  }

  return `🤖 <b>PRIME X EARN BOT ACTIVE</b>\n\n` +
    `Received command: "<code>${commandText}</code>"\n\n` +
    `<b>Quick Commands:</b>\n` +
    `• /stats - View performance stats\n` +
    `• /genlink - Auto-generate redirect tracking links\n` +
    `• /domains - View active ad domains\n` +
    `• /group - Get VIP group redirect link\n` +
    `• /help - Full command menu\n\n` +
    `<i>Ads managed by VYRNXY ADS</i>`;
}

// Seed initial realistic events for analytics demo
const locations = ['Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'London, UK', 'Dubai, UAE', 'New York, US', 'Toronto, CA', 'Singapore, SG'];
const browsers = ['Instagram In-App', 'Chrome Mobile', 'Safari Mobile', 'Telegram App', 'Firefox Mobile'];
const referrers = ['instagram.com', 'facebook.com', 't.co/twitter', 'google.com', 'direct'];

let analyticsEvents: AnalyticsEvent[] = [];

// Helper to seed realistic analytics
function seedInitialData() {
  const now = Date.now();
  const oneHour = 3600 * 1000;
  
  // Seed 120 past events over the last 24 hours
  for (let i = 0; i < 150; i++) {
    const hoursAgo = Math.floor(Math.random() * 24);
    const eventTime = now - hoursAgo * oneHour - Math.floor(Math.random() * 3600 * 1000);
    const randLoc = locations[Math.floor(Math.random() * locations.length)];
    const randBrowser = browsers[Math.floor(Math.random() * browsers.length)];
    const randRef = referrers[Math.floor(Math.random() * referrers.length)];
    const randIp = `157.33.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

    // Visit event
    analyticsEvents.push({
      id: `evt-v-${i}`,
      type: 'visit',
      timestamp: eventTime,
      ip: randIp,
      location: randLoc,
      device: Math.random() > 0.2 ? 'Mobile' : 'Desktop',
      browser: randBrowser,
      referrer: randRef,
      utmSource: randRef.split('.')[0] + '_ad'
    });

    // 65% chance of click
    if (Math.random() < 0.65) {
      analyticsEvents.push({
        id: `evt-c-${i}`,
        type: 'click',
        timestamp: eventTime + Math.floor(Math.random() * 15000),
        ip: randIp,
        location: randLoc,
        device: Math.random() > 0.2 ? 'Mobile' : 'Desktop',
        browser: randBrowser,
        referrer: randRef,
        buttonId: Math.random() > 0.5 ? 'cta_button_1' : 'cta_button_2'
      });

      // 45% chance of confirmed join
      if (Math.random() < 0.70) {
        analyticsEvents.push({
          id: `evt-j-${i}`,
          type: 'join',
          timestamp: eventTime + Math.floor(Math.random() * 45000) + 15000,
          ip: randIp,
          location: randLoc,
          device: Math.random() > 0.2 ? 'Mobile' : 'Desktop',
          browser: randBrowser,
          referrer: randRef
        });
      }
    }
  }

  // Sort by timestamp descending
  analyticsEvents.sort((a, b) => b.timestamp - a.timestamp);
}

seedInitialData();

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

  // Track Page Visit
  app.post('/api/track/visit', (req, res) => {
    const { referrer, device, browser, utmSource, ip, location } = req.body;
    const clientIp = ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '103.21.124.89';
    const clientLoc = location || locations[Math.floor(Math.random() * locations.length)];
    
    const event: AnalyticsEvent = {
      id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'visit',
      timestamp: Date.now(),
      ip: clientIp,
      location: clientLoc,
      device: device || (req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop'),
      browser: browser || 'Instagram In-App',
      referrer: referrer || 'instagram.com',
      utmSource: utmSource || 'instagram_bio'
    };

    analyticsEvents.unshift(event);
    res.json({ success: true, visitId: event.id, event });
  });

  // Track Link Click
  app.post('/api/track/click', (req, res) => {
    const { buttonId, referrer, device, browser, ip, location } = req.body;
    const clientIp = ip || req.headers['x-forwarded-for'] as string || '103.21.124.89';
    const clientLoc = location || locations[Math.floor(Math.random() * locations.length)];

    const event: AnalyticsEvent = {
      id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'click',
      timestamp: Date.now(),
      ip: clientIp,
      location: clientLoc,
      device: device || 'Mobile',
      browser: browser || 'Instagram In-App',
      referrer: referrer || 'instagram.com',
      buttonId: buttonId || 'cta_button_1'
    };

    analyticsEvents.unshift(event);
    res.json({ success: true, clickId: event.id, event });
  });

  // Track Telegram Channel Join
  app.post('/api/track/join', async (req, res) => {
    const { referrer, device, browser, ip, location } = req.body;
    const clientIp = ip || req.headers['x-forwarded-for'] as string || '103.21.124.89';
    const clientLoc = location || locations[Math.floor(Math.random() * locations.length)];

    const event: AnalyticsEvent = {
      id: `join-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'join',
      timestamp: Date.now(),
      ip: clientIp,
      location: clientLoc,
      device: device || 'Mobile',
      browser: browser || 'Instagram In-App',
      referrer: referrer || 'instagram.com'
    };

    analyticsEvents.unshift(event);

    // Calculate updated join count for the alert
    const totalJoins = analyticsEvents.filter(e => e.type === 'join').length;
    const totalVisits = analyticsEvents.filter(e => e.type === 'visit').length;
    const conversion = totalVisits > 0 ? ((totalJoins / totalVisits) * 100).toFixed(1) : '0';

    let botNotificationStatus = null;

    // Send instant Telegram Bot notification if enabled
    if (campaignConfig.enableBotNotifications !== false && (campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN)) {
      const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const alertMsg = `🚀 <b>NEW MEMBER JOINED TELEGRAM CHANNEL!</b>\n\n` +
        `📍 <b>Location:</b> ${event.location}\n` +
        `📱 <b>Device:</b> ${event.device} (${event.browser})\n` +
        `🌐 <b>Source:</b> ${event.referrer}\n` +
        `🕒 <b>Time:</b> ${timeStr}\n\n` +
        `📊 <b>Updated Channel Stats:</b>\n` +
        `• Total Joined Members: <b>${totalJoins}</b>\n` +
        `• Overall Conversion Rate: <b>${conversion}%</b>`;

      botNotificationStatus = await sendTelegramBotNotification(alertMsg);
    }

    res.json({ success: true, joinId: event.id, event, botNotificationStatus });
  });

  // Track Telegram Group Question
  app.post('/api/track/question', async (req, res) => {
    const { questionText, referrer, device, browser, ip, location } = req.body;
    const clientIp = ip || req.headers['x-forwarded-for'] as string || '103.21.124.89';
    const clientLoc = location || locations[Math.floor(Math.random() * locations.length)];

    const event: AnalyticsEvent = {
      id: 'q-' + Date.now(),
      timestamp: Date.now(),
      type: 'question',
      referrer: referrer || 'ad_page_group_question',
      utmSource: referrer || 'ad_page_group_question',
      device: device || 'Mobile',
      browser: browser || 'In-App Browser',
      ip: clientIp,
      location: clientLoc,
      questionText: questionText || 'User asked a question for VIP Group'
    };

    analyticsEvents.unshift(event);

    if (campaignConfig.enableBotNotifications !== false && (campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN)) {
      const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const alertMsg = `💬 <b>NEW QUESTION SUBMITTED FOR VIP GROUP!</b>\n\n` +
        `❓ <b>Question:</b> "${event.questionText}"\n` +
        `📍 <b>Location:</b> ${event.location}\n` +
        `📱 <b>Device:</b> ${event.device}\n` +
        `👥 <b>VIP Group:</b> <code>${campaignConfig.telegramGroupLink || 'https://t.me/telegram'}</code>\n` +
        `🕒 <b>Time:</b> ${timeStr}`;

      await sendTelegramBotNotification(alertMsg);
    }

    res.json({ success: true, questionId: event.id, event });
  });

  // Add Custom Domain Endpoint
  app.post('/api/domains/add', (req, res) => {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ success: false, error: 'Domain name is required' });
    }
    const cleanDom = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!campaignConfig.customDomains) {
      campaignConfig.customDomains = ['primexearn.in'];
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
      // 1. Check Bot Info via getMe
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

      // 2. If Chat ID provided, send test ping
      if (testChatId) {
        const testPingMsg = `🔔 <b>AD TRACKER BOT CONNECTION SUCCESSFUL</b>\n\n` +
          `Hello! Your Telegram Ad Tracker Bot (<b>@${botInfo.username}</b>) is now connected.\n` +
          `You will receive real-time alerts in this chat whenever a new member joins your channel!`;

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

  // Telegram Bot: Simulate or Execute Command
  app.post('/api/telegram/simulate-command', (req, res) => {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ success: false, error: 'Command text is required' });
    }

    const responseText = handleBotCommand(command);
    res.json({
      success: true,
      command,
      responseText
    });
  });

  // Telegram Bot: Set Webhook URL
  app.post('/api/telegram/set-webhook', async (req, res) => {
    const { token, appUrl } = req.body;
    const activeToken = token || campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const baseUrl = appUrl || process.env.APP_URL || req.protocol + '://' + req.get('host');

    if (!activeToken) {
      return res.status(400).json({ success: false, error: 'Bot Token is required to configure webhook' });
    }

    const webhookUrl = `${baseUrl}/api/telegram/webhook`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${activeToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
      });

      const data = await response.json();
      res.json({ success: data.ok, webhookUrl, telegramResponse: data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Process any incoming Telegram Update (Message, Command, Channel Post, Join)
  async function processTelegramUpdate(update: any) {
    if (!update) return;

    const msg = update.message || update.channel_post || update.edited_message;
    if (msg && msg.text) {
      const chatId = msg.chat.id;
      const text = msg.text;
      const replyHtml = handleBotCommand(text);
      await sendTelegramBotNotification(replyHtml, undefined, String(chatId));
    } else if (update.callback_query && update.callback_query.message) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;
      const replyHtml = handleBotCommand(data);
      await sendTelegramBotNotification(replyHtml, undefined, String(chatId));
    } else if (update.chat_member || update.my_chat_member) {
      const memberUpdate = update.chat_member || update.my_chat_member;
      const newStatus = memberUpdate?.new_chat_member?.status;
      if (newStatus === 'member' || newStatus === 'administrator') {
        const userName = memberUpdate?.new_chat_member?.user?.first_name || 'New Member';
        const event: AnalyticsEvent = {
          id: 'join-' + Date.now(),
          timestamp: Date.now(),
          type: 'join',
          referrer: 'telegram_channel',
          utmSource: 'telegram_channel',
          device: 'Mobile',
          browser: 'Telegram App',
          ip: '103.21.124.89',
          location: 'India'
        };
        analyticsEvents.unshift(event);

        if (campaignConfig.enableBotNotifications !== false) {
          const totalJoins = analyticsEvents.filter(e => e.type === 'join').length;
          const totalVisits = analyticsEvents.filter(e => e.type === 'visit').length;
          const conversion = totalVisits > 0 ? ((totalJoins / totalVisits) * 100).toFixed(1) : '0';

          const alertMsg = `🚀 <b>NEW MEMBER JOINED PRIME X EARN TELEGRAM CHANNEL!</b>\n\n` +
            `👤 <b>Member:</b> ${userName}\n` +
            `🕒 <b>Time:</b> ${new Date().toLocaleTimeString()}\n\n` +
            `📊 <b>Updated Channel Stats:</b>\n` +
            `• Total Joined Members: <b>${totalJoins}</b>\n` +
            `• Overall Conversion: <b>${conversion}%</b>`;

          await sendTelegramBotNotification(alertMsg);
        }
      }
    }
  }

  // Background Telegram Bot Poller for zero-setup live responses
  let lastTelegramUpdateId = 0;
  let isPollingActive = false;

  async function pollTelegramBotUpdates() {
    const token = campaignConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!token || isPollingActive) return;

    isPollingActive = true;
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastTelegramUpdateId + 1}&limit=10&timeout=2`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            lastTelegramUpdateId = Math.max(lastTelegramUpdateId, update.update_id);
            await processTelegramUpdate(update);
          }
        }
      }
    } catch (err) {
      // Background poll failure handled gracefully
    } finally {
      isPollingActive = false;
    }
  }

  // Poll Telegram API every 3.5 seconds
  setInterval(pollTelegramBotUpdates, 3500);

  // Telegram Bot: Webhook endpoint for live Telegram updates
  app.post('/api/telegram/webhook', async (req, res) => {
    try {
      const update = req.body;
      await processTelegramUpdate(update);
      res.sendStatus(200);
    } catch (err) {
      console.error('[Telegram Webhook Handler Error]', err);
      res.sendStatus(200);
    }
  });

  // GET Analytics Summary & Charts with Timeframe Support (Today, 3 Days, 30 Days, All)
  app.get('/api/analytics', (req, res) => {
    const timeframe = (req.query.timeframe as string) || 'all';
    const istToday = getISTDateString();

    let filteredEvents = [...analyticsEvents];

    if (timeframe === 'today') {
      filteredEvents = analyticsEvents.filter(e => getISTDateString(e.timestamp) === istToday);
    } else if (timeframe === '3days') {
      const cutoff = Date.now() - 3 * 24 * 3600 * 1000;
      filteredEvents = analyticsEvents.filter(e => e.timestamp >= cutoff);
    } else if (timeframe === '30days') {
      const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
      filteredEvents = analyticsEvents.filter(e => e.timestamp >= cutoff);
    }

    const visits = filteredEvents.filter(e => e.type === 'visit');
    const clicks = filteredEvents.filter(e => e.type === 'click');
    const joins = filteredEvents.filter(e => e.type === 'join');
    const questions = filteredEvents.filter(e => e.type === 'question');

    const totalVisits = visits.length;
    const totalClicks = clicks.length;
    const totalJoins = joins.length;
    const totalQuestions = questions.length;

    const clickThroughRate = totalVisits > 0 ? Number(((totalClicks / totalVisits) * 100).toFixed(1)) : 0;
    const joinConversionRate = totalClicks > 0 ? Number(((totalJoins / totalClicks) * 100).toFixed(1)) : 0;
    const overallConversionRate = totalVisits > 0 ? Number(((totalJoins / totalVisits) * 100).toFixed(1)) : 0;

    // Build chart dynamically based on selected timeframe
    const hourlyChart: { time: string; visits: number; clicks: number; joins: number }[] = [];

    if (timeframe === 'today') {
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const targetHour = new Date(now.getTime() - i * 3600 * 1000);
        const timeLabel = targetHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const hourStart = new Date(targetHour.getFullYear(), targetHour.getMonth(), targetHour.getDate(), targetHour.getHours(), 0, 0).getTime();
        const hourEnd = hourStart + 3600 * 1000;

        const hVisits = visits.filter(e => e.timestamp >= hourStart && e.timestamp < hourEnd).length;
        const hClicks = clicks.filter(e => e.timestamp >= hourStart && e.timestamp < hourEnd).length;
        const hJoins = joins.filter(e => e.timestamp >= hourStart && e.timestamp < hourEnd).length;

        hourlyChart.push({ time: timeLabel, visits: hVisits, clicks: hClicks, joins: hJoins });
      }
    } else if (timeframe === '3days') {
      for (let i = 2; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 3600 * 1000);
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
        const dayEnd = dayStart + 24 * 3600 * 1000;

        const dVisits = visits.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
        const dClicks = clicks.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
        const dJoins = joins.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;

        hourlyChart.push({ time: dateLabel, visits: dVisits, clicks: dClicks, joins: dJoins });
      }
    } else {
      const numDays = timeframe === '30days' ? 30 : 14;
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

    const summary: AnalyticsSummary = {
      timeframe: timeframe as any,
      currentISTDate: istToday,
      nextResetIST: new Date(getNext12AMISTTimestamp()).toISOString(),
      totalVisits,
      totalClicks,
      totalJoins,
      totalQuestions,
      clickThroughRate,
      joinConversionRate,
      overallConversionRate,
      recentEvents: filteredEvents.slice(0, 50),
      hourlyChart,
      sourceBreakdown,
      deviceBreakdown,
      browserBreakdown
    };

    res.json(summary);
  });

  // Reset all analytics data (Clear all metrics to 0)
  app.post('/api/analytics/reset', (req, res) => {
    analyticsEvents = [];
    res.json({ status: 'reset_success', totalEvents: 0 });
  });

  // Export CSV Report
  app.get('/api/export', (req, res) => {
    let csv = 'ID,Type,Timestamp,Date,IP,Location,Device,Browser,Referrer,ButtonID\n';
    analyticsEvents.forEach(e => {
      const dateStr = new Date(e.timestamp).toISOString();
      csv += `"${e.id}","${e.type}","${e.timestamp}","${dateStr}","${e.ip}","${e.location}","${e.device}","${e.browser}","${e.referrer}","${e.buttonId || ''}"\n`;
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
