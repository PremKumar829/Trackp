import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Send, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  public handleOpenTelegram = () => {
    try {
      window.open('https://t.me/+ZiB8EiGBh4I0Yjc1', '_blank', 'noopener,noreferrer');
    } catch (_) {
      window.location.href = 'https://t.me/+ZiB8EiGBh4I0Yjc1';
    }
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-slate-100 relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-500 to-[#0088cc] flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Send className="w-8 h-8 rotate-[-15deg] -translate-y-0.5" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct VIP Access Active</span>
            </span>

            <h2 className="text-xl font-black text-slate-900 mt-2 mb-1">
              You're Just One Step Away!
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Click the button below to get 180-380 welcome bonus by completing 1-5 task.
            </p>

            <button
              onClick={this.handleOpenTelegram}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-sky-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>🚀 Contact Receptionist</span>
            </button>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

