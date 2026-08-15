export interface GeoData {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  isp: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  isIOS: boolean;
  isAndroid: boolean;
  browser: string;
}

// Convert country code to emoji flag
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '📍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Client-side accurate location & device detector
export async function detectAccurateLocation(): Promise<GeoData> {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /Android/i.test(ua);
  const isTablet = /iPad|Tablet|PlayBook/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobile/i.test(ua);

  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Mobile';

  // Detect browser/in-app context
  let browser = 'Chrome Mobile';
  if (ua.includes('Instagram')) browser = 'Instagram In-App';
  else if (ua.includes('FBAN') || ua.includes('FBAV')) browser = 'Facebook In-App';
  else if (ua.includes('Telegram')) browser = 'Telegram In-App';
  else if (isIOS && ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari Mobile';
  else if (ua.includes('Chrome')) browser = isMobile ? 'Chrome Mobile' : 'Chrome Desktop';
  else if (ua.includes('Safari')) browser = 'Safari Desktop';
  else if (ua.includes('Firefox')) browser = 'Firefox';

  // Check cached geo in sessionStorage
  try {
    const cached = sessionStorage.getItem('vyrnxy_client_geo');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, isIOS, isAndroid, device: deviceType, browser };
    }
  } catch (_) {}

  // Fallback default
  let result: GeoData = {
    ip: '103.21.124.89',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    isp: 'Reliance Jio 5G',
    device: deviceType,
    isIOS,
    isAndroid,
    browser
  };

  // Fast Geolocation Fetch with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        result.ip = data.ip || result.ip;
        result.city = data.city || result.city;
        result.region = data.region || result.region;
        result.country = data.country || result.country;
        result.countryCode = data.country_code || 'IN';
        result.countryFlag = data.flag?.emoji || getFlagEmoji(result.countryCode);
        result.isp = data.connection?.isp || data.connection?.org || 'Telecom / Broadband';

        try {
          sessionStorage.setItem('vyrnxy_client_geo', JSON.stringify(result));
        } catch (_) {}
        return result;
      }
    }
  } catch (err) {
    // Secondary fallback to freeipapi
    try {
      const res2 = await fetch('https://freeipapi.com/api/json');
      if (res2.ok) {
        const d2 = await res2.json();
        if (d2 && d2.cityName) {
          result.ip = d2.ipAddress || result.ip;
          result.city = d2.cityName || result.city;
          result.region = d2.regionName || result.region;
          result.country = d2.countryName || result.country;
          result.countryCode = d2.countryCode || 'IN';
          result.countryFlag = getFlagEmoji(result.countryCode);
          try {
            sessionStorage.setItem('vyrnxy_client_geo', JSON.stringify(result));
          } catch (_) {}
          return result;
        }
      }
    } catch (_) {}
  }

  return result;
}
