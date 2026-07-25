import React, { useState, useEffect } from 'react';
import { toast, ToastMessage } from '../lib/toast';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-top-2 duration-200 text-xs font-mono ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : isError
                ? 'bg-red-950/90 border-red-500/50 text-red-200'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-zinc-900/90 border-amber-500/40 text-zinc-200'
            }`}
          >
            <div className="mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Bell className="w-4 h-4 text-amber-400" />}
            </div>

            <div className="flex-1">
              <div className="font-bold uppercase tracking-wider text-[10px] opacity-75">
                BARKSDALE STUDIO NOTIFICATION
              </div>
              <p className="mt-0.5 text-xs leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-black/40 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
