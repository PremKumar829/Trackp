import React, { useState, useEffect } from 'react';
import { Send, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Volume2, VolumeX, Flame, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CampaignConfig, DestinationLink } from '../types';
import { PerspectiveCard } from './3d/PerspectiveCard';
import { ProfessionalJoinCard } from './ProfessionalJoinCard';
import { GeoData } from '../utils/geo';
import { parseTelegramTarget, triggerAutoBypass } from '../utils/telegram';

interface AdLandingPageProps {
  campaign: CampaignConfig;
  activeLink: DestinationLink;
  geo: GeoData | null;
  onTrackClick: (buttonId: string, isAutoBypass?: boolean) => void;
  onTrackJoin: () => void;
}

export const AdLandingPage: React.FC<AdLandingPageProps> = ({
  campaign,
  activeLink,
  geo,
  onTrackClick,
  onTrackJoin,
}) => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 9,
    seconds: 55,
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState(campaign.enableSound);
  // Verification modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [hasConfirmedJoin, setHasConfirmedJoin] = useState(false);

  // Group Question Modal state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const isIOS = geo?.isIOS || (/iPad|iPhone|iPod/.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''));
  const tgInfo = parseTelegramTarget(activeLink.telegramTarget || campaign.telegramLink || 'ZiB8EiGBh4I0Yjc1', isIOS);

  // Sound generator helper
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (err) {
      // AudioContext not allowed before gesture
    }
  };

  // Live countdown timer logic
  useEffect(() => {
    let totalSec = campaign.timerSeconds || 595;

    const interval = setInterval(() => {
      if (totalSec <= 0) {
        totalSec = campaign.timerSeconds || 595;
      } else {
        totalSec--;
      }

      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = Math.floor(totalSec % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [campaign.timerSeconds]);

  // Handle Telegram Channel Join Click
  const handleTelegramClick = (buttonId: string) => {
    playClickSound();
    onTrackClick(buttonId, false);

    if (tgInfo.finalAppLaunch) {
      window.location.href = tgInfo.finalAppLaunch;
    } else if (campaign.telegramLink) {
      window.open(campaign.telegramLink, '_blank', 'noopener,noreferrer');
    }

    if (campaign.verifyJoinModal) {
      setShowVerifyModal(true);
    }
  };

  // Handle Telegram Group Click
  const handleGroupClick = () => {
    playClickSound();
    onTrackClick('vip_group_button', false);
    const groupLink = campaign.telegramGroupLink || campaign.telegramLink;
    if (groupLink) {
      window.open(groupLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Submit Question for VIP Group
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    playClickSound();

    try {
      await fetch('/api/track/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: questionInput,
          referrer: window.location.href,
          device: geo?.device || 'Mobile',
          browser: geo?.browser || navigator.userAgent,
          city: geo?.city,
          region: geo?.region,
          country: geo?.country,
          countryFlag: geo?.countryFlag,
          isp: geo?.isp,
          linkLabel: activeLink.label,
          telegramUsername: activeLink.telegramUsername,
        })
      });
    } catch (err) {
      // Ignore network errors
    }

    setQuestionSubmitted(true);
    const groupLink = campaign.telegramGroupLink || campaign.telegramLink;
    
    setTimeout(() => {
      if (groupLink) {
        window.open(groupLink, '_blank', 'noopener,noreferrer');
      }
      setShowQuestionModal(false);
      setQuestionSubmitted(false);
      setQuestionInput('');
    }, 1500);
  };

  // Confirm Telegram channel join
  const handleConfirmJoin = () => {
    playClickSound();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0088cc', '#22c55e', '#ef4444', '#f59e0b'],
    });
    setHasConfirmedJoin(true);
    onTrackJoin();

    setTimeout(() => {
      setShowVerifyModal(false);
    }, 2500);
  };

  // If cardStyle is 'professionalClean' (or requested post layout), render ProfessionalJoinCard directly!
  if (campaign.cardStyle === 'professionalClean' || !campaign.cardStyle) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-slate-100 relative">
        <ProfessionalJoinCard
          campaign={campaign}
          activeLink={activeLink}
          geo={geo}
          onTrackClick={onTrackClick}
          onTrackJoin={onTrackJoin}
        />
      </div>
    );
  }

  // 3D Theme-specific background
  const getPageBg = () => {
    switch (campaign.themePreset) {
      case 'dark3d':
        return 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white';
      case 'gold3d':
        return 'bg-gradient-to-b from-slate-950 via-stone-900 to-amber-950 text-amber-50';
      case 'telegramBlue':
        return 'bg-gradient-to-b from-sky-950 via-blue-900 to-sky-950 text-white';
      case 'sunsetGlow':
        return 'bg-gradient-to-b from-slate-950 via-rose-950 to-slate-900 text-rose-50';
      case 'cyberpunk':
        return 'bg-slate-950 text-cyan-300';
      case 'light3d':
      default:
        return 'bg-[#e5e5e5] text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-500 relative overflow-hidden ${getPageBg()}`}>
      
      {/* Sound toggle float */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-16 right-4 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform cursor-pointer"
        title={soundEnabled ? 'Mute Sounds' : 'Enable Interactive Sound'}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
      </button>

      {/* Main 3D Card Container */}
      <div className="w-full my-auto py-6">
        <PerspectiveCard themePreset={campaign.themePreset} enable3dPhysics={campaign.enable3dPhysics}>
          <div className="flex flex-col items-center text-center">
            
            {/* Top Badge Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wide mb-4 border border-rose-500/20"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{activeLink.badgeText || 'FREE VIP ACCESS TODAY'}</span>
            </motion.div>

            {/* Profile Avatar Image */}
            <div className="relative mb-5 group">
              <div
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1 transition-all duration-300 shadow-xl"
                style={{
                  background: campaign.avatarBorderColor || '#ef4444',
                  boxShadow: `0 0 25px ${campaign.avatarBorderColor || '#ef4444'}66`,
                }}
              >
                <img
                  src={campaign.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                  alt={activeLink.heading || campaign.title}
                  className="w-full h-full object-cover rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Verified Badge Icon */}
              <div className="absolute bottom-1 right-2 bg-blue-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 uppercase drop-shadow-sm font-sans">
              {activeLink.heading || campaign.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs font-medium mb-5 leading-relaxed">
              {activeLink.subtitle || campaign.subtitle}
            </p>

            {/* CTA Button 1 */}
            <motion.button
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTelegramClick('cta_button_1')}
              className="w-full py-3.5 px-6 rounded-full bg-[#1d70b8] hover:bg-[#155d9b] active:bg-[#0f497c] text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all mb-6 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Send className="w-5 h-5 fill-white rotate-[-20deg] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              <span>{activeLink.buttonText || campaign.ctaText1 || '🚀 Contact Receptionist'}</span>
            </motion.button>

            {/* Countdown Timer Block */}
            <div className="w-full my-1 py-3 px-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-red-500 font-extrabold text-2xl sm:text-3xl tracking-wider font-mono">
                <span>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-red-400 font-sans text-xl">:</span>
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-red-400 font-sans text-xl">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-red-400 font-sans text-xl">:</span>
                <span className="text-red-600 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>

              <div className="grid grid-cols-4 text-center mt-1 text-[10px] sm:text-[11px] font-bold text-pink-500 dark:text-pink-400 tracking-wider">
                <span>DAYS</span>
                <span>HOURS</span>
                <span>MINUTES</span>
                <span>SECONDS</span>
              </div>
            </div>

            {/* CTA Button 2 */}
            <motion.button
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTelegramClick('cta_button_2')}
              className="w-full mt-5 py-3.5 px-6 rounded-full bg-[#1d70b8] hover:bg-[#155d9b] active:bg-[#0f497c] text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Send className="w-5 h-5 fill-white rotate-[-20deg] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              <span>{activeLink.buttonText || campaign.ctaText2 || '🚀 Contact Receptionist'}</span>
            </motion.button>

            {/* Footer Text */}
            <div className="mt-7 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ads managed by{' '}
              <a
                href={campaign.adManagedByLink || 'https://t.me/+ec-4Jk1PY7w3Y2Vl'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-600 font-bold transition-colors underline decoration-rose-300"
              >
                {campaign.adManagedByText.replace(/^Ads managed by\s*/i, '') || 'VYRNXY ADS'}
              </a>
            </div>

          </div>
        </PerspectiveCard>
      </div>

    </div>
  );
};
