import React, { useState, useEffect } from 'react';
import { Send, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Volume2, VolumeX, Flame, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CampaignConfig } from '../types';
import { PerspectiveCard } from './3d/PerspectiveCard';

interface AdLandingPageProps {
  campaign: CampaignConfig;
  onTrackClick: (buttonId: string) => void;
  onTrackJoin: () => void;
}

export const AdLandingPage: React.FC<AdLandingPageProps> = ({
  campaign,
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

  // Sound generator helper
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (err) {
      // AudioContext not allowed before user gesture
    }
  };

  // Live countdown timer logic
  useEffect(() => {
    // Convert timerSeconds to days, hours, minutes, seconds
    let totalSec = campaign.timerSeconds || 595;

    const interval = setInterval(() => {
      if (totalSec <= 0) {
        totalSec = campaign.timerSeconds || 595; // reset or loop timer for urgency
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
    onTrackClick(buttonId);

    // Open Telegram channel link in new tab
    if (campaign.telegramLink) {
      window.open(campaign.telegramLink, '_blank', 'noopener,noreferrer');
    }

    // Show verification modal to track joined members
    if (campaign.verifyJoinModal) {
      setShowVerifyModal(true);
    }
  };

  // Handle Telegram Group Click / Open
  const handleGroupClick = () => {
    playClickSound();
    onTrackClick('vip_group_button');
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
          device: /Mobile|Android|iP(hone|od)/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          browser: navigator.userAgent
        })
      });
    } catch (err) {
      // Ignore network errors gracefully
    }

    setQuestionSubmitted(true);
    const groupLink = campaign.telegramGroupLink || campaign.telegramLink;
    
    // Auto redirect to Telegram Group with question after 1.5s
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

  // Theme-specific background
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
        className="fixed top-16 right-4 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform"
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
              <span>FREE VIP ACCESS TODAY</span>
            </motion.div>

            {/* Profile Avatar Image with Red Border (Matches Screenshot) */}
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
                  alt={campaign.title}
                  className="w-full h-full object-cover rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Verified Badge Icon */}
              <div className="absolute bottom-1 right-2 bg-blue-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Title !! SELFIE !! */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 uppercase drop-shadow-sm font-sans">
              {campaign.title || '!! SELFIE !!'}
            </h1>

            {/* Optional Subtitle */}
            {campaign.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs font-medium mb-5 leading-relaxed">
                {campaign.subtitle}
              </p>
            )}

            {/* CTA Button 1 (Top Blue Button with Telegram Paper Plane) */}
            <motion.button
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTelegramClick('cta_button_1')}
              className="w-full py-3.5 px-6 rounded-full bg-[#1d70b8] hover:bg-[#155d9b] active:bg-[#0f497c] text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all mb-6 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Send className="w-5 h-5 fill-white rotate-[-20deg] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              <span>{campaign.ctaText1 || '✈ Join Free Telegram'}</span>
            </motion.button>

            {/* Countdown Timer Block (00 : 00 : 09 : 55) */}
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

              {/* Countdown Labels (DAYS, HOURS, MINUTES, SECONDS in magenta/pink) */}
              <div className="grid grid-cols-4 text-center mt-1 text-[10px] sm:text-[11px] font-bold text-pink-500 dark:text-pink-400 tracking-wider">
                <span>DAYS</span>
                <span>HOURS</span>
                <span>MINUTES</span>
                <span>SECONDS</span>
              </div>
            </div>

            {/* CTA Button 2 (Bottom Blue Button with Telegram Paper Plane) */}
            <motion.button
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTelegramClick('cta_button_2')}
              className="w-full mt-5 py-3.5 px-6 rounded-full bg-[#1d70b8] hover:bg-[#155d9b] active:bg-[#0f497c] text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Send className="w-5 h-5 fill-white rotate-[-20deg] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              <span>{campaign.ctaText2 || '✈ Join Free Telegram'}</span>
            </motion.button>

            {/* Ask Question in VIP Group Button */}
            <div className="w-full mt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setShowQuestionModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>💬</span>
                <span>{campaign.groupCtaText || 'Have a Question? Ask in VIP Group'}</span>
              </button>
            </div>

            {/* Footer Text "Ads managed by VYRNXY ADS" */}
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

      {/* Ask Question in VIP Group Modal */}
      <AnimatePresence>
        {showQuestionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-7 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative"
            >
              <button
                onClick={() => setShowQuestionModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50 dark:ring-emerald-950">
                <span className="text-2xl">💬</span>
              </div>

              {!questionSubmitted ? (
                <form onSubmit={handleSubmitQuestion} className="text-left">
                  <h3 className="text-lg font-extrabold text-center mb-1">Ask in Official VIP Group</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
                    {campaign.questionPromptText || 'Type your question below and connect directly with our support team in Telegram VIP Group!'}
                  </p>

                  <div className="mb-4">
                    <textarea
                      required
                      rows={3}
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      placeholder="e.g. Is this Telegram channel 100% free for daily signals & updates?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                  >
                    <Send className="w-4 h-4 fill-white" />
                    <span>Send Question & Open VIP Group</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGroupClick}
                    className="w-full mt-2 py-2 text-center text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                  >
                    Skip and join VIP Group directly ➔
                  </button>
                </form>
              ) : (
                <div className="py-4">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    Question Submitted!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Redirecting you to Prime X Earn VIP Group now...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Telegram Join Verification Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative"
            >
              <button
                onClick={() => setShowVerifyModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>

              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50 dark:ring-blue-950">
                <Send className="w-8 h-8 fill-current" />
              </div>

              {!hasConfirmedJoin ? (
                <>
                  <h3 className="text-xl font-extrabold mb-2">Did you Join the Telegram Channel?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Confirm your membership to record your spot and claim VIP access privileges!
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleConfirmJoin}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Yes, I Joined Channel!</span>
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        if (campaign.telegramLink) window.open(campaign.telegramLink, '_blank');
                      }}
                      className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
                    >
                      🔄 Re-open Telegram Link
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    Member Join Confirmed!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your Telegram join event has been successfully logged in the advertising analytics tracker.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
