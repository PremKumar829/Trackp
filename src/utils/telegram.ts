// Auto-detect details from any pasted Telegram Link or text
export interface DetectedTelegramInfo {
  slug: string;
  telegramTarget: string;
  telegramUsername: string;
  type: 'channel_invite' | 'group_invite' | 'public_username' | 'direct_code';
  heading: string;
  group: string;
}

export function detectTelegramLinkDetails(input: string, fallbackGroup: string = 'Win03'): DetectedTelegramInfo {
  const text = (input || '').trim();

  // Pattern 1: Invite hash (+hash or joinchat/hash)
  const inviteHashMatch = text.match(/(?:t\.me\/(?:\+|joinchat\/)|tg:\/\/join\?invite=)([a-zA-Z0-9_-]+)/i);
  if (inviteHashMatch) {
    const hash = inviteHashMatch[1];
    const cleanSlug = hash.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16).toLowerCase() || `vip_${Date.now().toString().slice(-4)}`;
    return {
      slug: cleanSlug,
      telegramTarget: `https://t.me/+${hash}`,
      telegramUsername: `+${hash.slice(0, 8)}...`,
      type: 'group_invite',
      heading: "You're Just One Step Away!",
      group: fallbackGroup
    };
  }

  // Pattern 2: Public handle e.g. https://t.me/killershiv9876 or @killershiv9876
  const usernameMatch = text.match(/(?:https?:\/\/t\.me\/|@)([a-zA-Z0-9_]{3,32})/i);
  if (usernameMatch) {
    const uname = usernameMatch[1];
    const cleanSlug = uname.toLowerCase();
    return {
      slug: cleanSlug,
      telegramTarget: uname,
      telegramUsername: `@${uname}`,
      type: 'public_username',
      heading: "You're Just One Step Away!",
      group: fallbackGroup
    };
  }

  // Pattern 3: Raw invite ID e.g. ZiB8EiGBh4I0Yjc1
  if (text.length >= 10 && !text.includes(' ') && !text.includes('/')) {
    const cleanSlug = text.slice(0, 14).toLowerCase();
    return {
      slug: cleanSlug,
      telegramTarget: text,
      telegramUsername: `@${cleanSlug}`,
      type: 'direct_code',
      heading: "You're Just One Step Away!",
      group: fallbackGroup
    };
  }

  // Fallback generic
  const clean = text.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16).toLowerCase() || `link_${Date.now().toString().slice(-4)}`;
  return {
    slug: clean,
    telegramTarget: text || 'ZiB8EiGBh4I0Yjc1',
    telegramUsername: `@${clean}`,
    type: 'public_username',
    heading: "You're Just One Step Away!",
    group: fallbackGroup
  };
}

export interface TelegramLinkInfo {
  inviteId: string;
  tgLink: string;
  intentLink: string;
  webLink: string;
  finalAppLaunch: string;
  isInviteHash: boolean;
  usernameOrCode: string;
}

// Clean and parse Telegram input (invite code, @username, t.me link)
export function parseTelegramTarget(input: string, isIOS: boolean = false): TelegramLinkInfo {
  let raw = (input || '').trim();

  let inviteId = '';
  let username = '';
  let isInviteHash = true;

  if (raw.startsWith('https://t.me/+') || raw.startsWith('tg://join?invite=')) {
    inviteId = raw.replace('https://t.me/+', '').replace('tg://join?invite=', '').replace(/^https?:\/\/t\.me\/joinchat\//, '');
    isInviteHash = true;
  } else if (raw.startsWith('https://t.me/')) {
    const slug = raw.replace('https://t.me/', '').replace(/\/$/, '');
    if (slug.startsWith('+')) {
      inviteId = slug.replace('+', '');
      isInviteHash = true;
    } else {
      username = slug;
      isInviteHash = false;
    }
  } else if (raw.startsWith('@')) {
    username = raw.replace('@', '');
    isInviteHash = false;
  } else if (raw.includes('/') || raw.length > 25) {
    inviteId = raw.replace(/[^a-zA-Z0-9_-]/g, '');
    isInviteHash = true;
  } else if (/^[a-zA-Z0-9_]{4,32}$/.test(raw) && !raw.includes('+')) {
    // Looks like a username or invite code
    if (raw.length === 22 || raw.startsWith('ZiB') || raw.length > 18) {
      inviteId = raw;
      isInviteHash = true;
    } else {
      username = raw;
      isInviteHash = false;
    }
  } else {
    inviteId = raw;
    isInviteHash = true;
  }

  let tgLink = '';
  let intentLink = '';
  let webLink = '';

  if (isInviteHash) {
    const code = inviteId || 'ZiB8EiGBh4I0Yjc1';
    tgLink = `tg://join?invite=${code}`;
    intentLink = `intent://join?invite=${code}#Intent;scheme=tg;package=org.telegram.messenger;end`;
    webLink = `https://t.me/+${code}`;
  } else {
    const u = username || 'telegram';
    tgLink = `tg://resolve?domain=${u}`;
    intentLink = `intent://resolve?domain=${u}#Intent;scheme=tg;package=org.telegram.messenger;end`;
    webLink = `https://t.me/${u}`;
  }

  const finalAppLaunch = isIOS ? tgLink : intentLink;

  return {
    inviteId: isInviteHash ? inviteId : username,
    tgLink,
    intentLink,
    webLink,
    finalAppLaunch,
    isInviteHash,
    usernameOrCode: isInviteHash ? (inviteId || 'Invite') : `@${username}`
  };
}

// Trigger Auto-Bypass via Hidden iFrame and non-destructive deep link launch
export function triggerAutoBypass(finalAppLaunch: string, onTriggered?: () => void) {
  if (!finalAppLaunch) return;

  onTriggered?.();

  // 1. Hidden iframe injection (safe app trigger without unmounting web view)
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.src = finalAppLaunch;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      } catch (_) {}
    }, 3000);
  } catch (_) {}

  // 2. Safe window link trigger without destroying current document
  setTimeout(() => {
    try {
      // Use window.location.assign or hidden anchor click
      const a = document.createElement('a');
      a.href = finalAppLaunch;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          if (a && a.parentNode) a.parentNode.removeChild(a);
        } catch (_) {}
      }, 1000);
    } catch (_) {}
  }, 350);
}
