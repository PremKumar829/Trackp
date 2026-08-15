import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Check, Send, Sparkles, Zap, MapPin, Globe, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CampaignConfig, DestinationLink } from '../types';
import { parseTelegramTarget, triggerAutoBypass } from '../utils/telegram';
import { GeoData } from '../utils/geo';

interface ProfessionalJoinCardProps {
  campaign: CampaignConfig;
  activeLink: DestinationLink;
  geo: GeoData | null;
  onTrackClick: (buttonId: string, isAutoBypass?: boolean) => void;
  onTrackJoin: () => void;
}

export const ProfessionalJoinCard: React.FC<ProfessionalJoinCardProps> = ({
  campaign,
  activeLink,
  geo,
  onTrackClick,
  onTrackJoin,
}) => {
  const [bypassed, setBypassed] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [hasConfirmedJoin, setHasConfirmedJoin] = useState<boolean>(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const isIOS = geo?.isIOS || (/iPad|iPhone|iPod/.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''));
  const tgInfo = parseTelegramTarget(activeLink.telegramTarget || campaign.telegramLink || 'ZiB8EiGBh4I0Yjc1', isIOS);

  // Auto-Bypass & Deep Linking Execution on Page Load
  useEffect(() => {
    const autoRedirectEnabled = activeLink.autoRedirect ?? campaign.enableAutoBypass ?? true;
    if (!autoRedirectEnabled || hasTriggeredRef.current) return;

    const delayMs = activeLink.autoRedirectDelayMs || campaign.autoBypassDelayMs || 400;

    // Track bypass trigger
    const timer = setTimeout(() => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setBypassed(true);

      // Track click event with isAutoBypass flag
      onTrackClick('auto_bypass_trigger', true);

      // Execute deep link launch
      triggerAutoBypass(tgInfo.finalAppLaunch, () => {
        console.log('[Auto-Bypass Triggered]', tgInfo.finalAppLaunch);
      });
    }, delayMs);

    return () => clearTimeout(timer);
  }, [activeLink, campaign, tgInfo.finalAppLaunch]);

  // Handle Manual Join Click
  const handleManualClick = (e: React.MouseEvent) => {
    onTrackClick('manual_join_btn', false);
    setBypassed(true);

    // Show verify join modal if enabled
    if (campaign.verifyJoinModal !== false) {
      setShowVerifyModal(true);
    }
  };

  // Confirm Telegram channel join
  const handleConfirmJoin = () => {
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#0088cc', '#22c55e', '#ef4444', '#f59e0b'],
    });
    setHasConfirmedJoin(true);
    onTrackJoin();

    setTimeout(() => {
      setShowVerifyModal(false);
    }, 2400);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      
      {/* Top Verified Gateway Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Official Gateway</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-300 font-mono">Verified</span>
        </span>

        {geo && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 backdrop-blur-sm">
            <span>{geo.countryFlag || '📍'}</span>
            <span>{geo.city}, {geo.countryCode}</span>
          </span>
        )}
      </motion.div>

      {/* Main Professional Card */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full bg-white text-slate-800 rounded-[22px] p-6 sm:p-8 text-center relative border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
      >
        
        {/* Floating Pill Badge on Card */}
        {activeLink.badgeText && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{activeLink.badgeText}</span>
            </span>
          </div>
        )}

        {/* Telegram Shield Icon with Glow */}
        <div className="relative w-18 h-18 mx-auto mb-4 mt-1">
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-sky-500 to-[#0088cc] text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-sky-500/25 ring-4 ring-sky-100">
            <Send className="w-9 h-9 fill-white rotate-[-15deg] -translate-y-0.5" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-3 ring-white shadow-md">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Dynamic Handle Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono mb-3 border border-slate-200">
          <span>{activeLink.telegramUsername || `@${activeLink.label}`}</span>
          {activeLink.group && (
            <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-sans font-semibold">
              {activeLink.group}
            </span>
          )}
        </div>

        {/* Heading */}
        <h2 className="text-[22px] sm:text-[25px] font-extrabold text-slate-900 leading-tight mb-2 font-sans tracking-tight">
          {activeLink.heading || "You're Just One Step Away!"}
        </h2>

        {/* Subtitle */}
        <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed max-w-sm mx-auto mb-6 font-normal">
          {activeLink.subtitle || "Click the button below to get 180-380 welcome bonus by completing 1-5 task."}
        </p>

        {/* Join Button */}
        <a
          id="manualBtn"
          href={tgInfo.finalAppLaunch}
          onClick={handleManualClick}
          className="w-full bg-gradient-to-r from-[#0088cc] to-[#0077b5] hover:from-[#0077b5] hover:to-[#00669c] active:from-[#00669c] text-white text-[16px] sm:text-[17px] font-bold py-4 px-6 rounded-xl block shadow-[0_8px_24px_rgba(0,136,204,0.32)] transition-all transform active:scale-[0.98] cursor-pointer text-center relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Send className="w-5 h-5 fill-white rotate-[-10deg]" />
            <span>{activeLink.buttonText || `🚀 Contact ${activeLink.telegramUsername || 'Telegram'}`}</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </a>

        {/* Auto-Bypass Trigger Feedback */}
        {bypassed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-xl p-2.5"
          >
            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>Telegram App opened automatically. If not redirected, click button above!</span>
          </motion.div>
        )}

        {/* Security & Verification Footer Note */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-2 text-[12px] text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{activeLink.footerNote || "100% Verified & Secure Telegram Gateway"}</span>
        </div>

      </motion.div>

      {/* Campaign Ad Manager Credit */}
      <div className="mt-5 text-center text-xs font-medium text-slate-400">
        Ads managed by{' '}
        <a
          href={campaign.adManagedByLink || 'https://t.me/+ec-4Jk1PY7w3Y2Vl'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 font-bold underline decoration-sky-500/50"
        >
          {campaign.adManagedByText.replace(/^Ads managed by\s*/i, '') || 'VYRNXY ADS'}
        </a>
      </div>

      {/* Confirmation / Joined Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="bg-white text-slate-900 p-6 sm:p-7 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 text-center relative"
            >
              <button
                onClick={() => setShowVerifyModal(false)}
                className="absolute top-3.5 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="w-14 h-14 bg-sky-50 text-[#0088cc] rounded-full flex items-center justify-center mx-auto mb-3.5 ring-4 ring-sky-100">
                <Send className="w-7 h-7 fill-current" />
              </div>

              {!hasConfirmedJoin ? (
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    Did you open Telegram?
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    Confirm your contact with <b>{activeLink.telegramUsername || '@Receptionist'}</b> to unlock bonus eligibility!
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleConfirmJoin}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Yes, I Contacted / Joined!</span>
                    </button>

                    <a
                      href={tgInfo.finalAppLaunch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors block"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Re-open Telegram</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="py-3">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-600 mb-1">
                    Joined Successfully!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your visit has been confirmed and logged in real-time.
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
