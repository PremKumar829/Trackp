import React from 'react';
import { Lock, MoreVertical, Clock, X, ShieldCheck } from 'lucide-react';

interface BrowserHeaderProps {
  domainName: string;
  sourceApp?: string;
  onClose?: () => void;
  showInAppHeader: boolean;
  setShowInAppHeader: (val: boolean) => void;
}

export const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  domainName,
  sourceApp = 'Instagram',
  showInAppHeader,
  setShowInAppHeader,
}) => {
  if (!showInAppHeader) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowInAppHeader(false)}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          title="Dismiss In-App Browser Simulation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 mx-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-600 inline" />
          <span>{domainName || 'selfiegmrs.in'}</span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium">
          {sourceApp}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer" title="In-App Timer">
          <Clock className="w-4 h-4" />
        </div>
        <div className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer" title="Options">
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
