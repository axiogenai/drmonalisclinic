'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AlertTriangle, Trash2, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type DialogType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
}

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface AlertOptions {
  title?: string;
  message: string;
  type?: DialogType;
  buttonText?: string;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface DialogContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions | string) => Promise<void>;
  toast: (options: ToastOptions | string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  // Alert Dialog State
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    options: AlertOptions;
    resolve: () => void;
  } | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        options: {
          title: options.title || 'Please Confirm',
          message: options.message,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          type: options.type || 'danger',
        },
        resolve,
      });
    });
  }, []);

  const alert = useCallback((options: AlertOptions | string): Promise<void> => {
    const opts: AlertOptions = typeof options === 'string' 
      ? { title: 'Notice', message: options, type: 'info' }
      : { ...options, title: options.title || 'Notice', type: options.type || 'info' };

    return new Promise((resolve) => {
      setAlertDialog({
        isOpen: true,
        options: opts,
        resolve,
      });
    });
  }, []);

  const toast = useCallback((options: ToastOptions | string) => {
    const opts: ToastOptions = typeof options === 'string'
      ? { message: options, type: 'success', duration: 3500 }
      : { ...options, type: options.type || 'success', duration: options.duration || 3500 };

    const id = `toast-${++toastIdRef.current}`;
    setToasts((prev) => [...prev, { ...opts, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, opts.duration || 3500);
  }, []);

  const handleConfirmClose = (result: boolean) => {
    if (confirmDialog) {
      confirmDialog.resolve(result);
      setConfirmDialog(null);
    }
  };

  const handleAlertClose = () => {
    if (alertDialog) {
      alertDialog.resolve();
      setAlertDialog(null);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <DialogContext.Provider value={{ confirm, alert, toast }}>
      {children}

      {/* =========================================================================
          CUSTOM CONFIRMATION MODAL (Replaces ugly browser window.confirm)
          ========================================================================= */}
      {confirmDialog && confirmDialog.isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overscroll-none animate-in fade-in duration-200"
          onClick={() => handleConfirmClose(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Icon Badge & Close Button */}
            <div className="flex items-start justify-between">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                  confirmDialog.options.type === 'danger'
                    ? 'bg-rose-50 border border-rose-100 text-rose-600'
                    : confirmDialog.options.type === 'warning'
                    ? 'bg-amber-50 border border-amber-100 text-amber-600'
                    : 'bg-teal-50 border border-teal-100 text-[#108283]'
                }`}
              >
                {confirmDialog.options.type === 'danger' ? (
                  <Trash2 className="w-5 h-5 stroke-[2.2]" />
                ) : confirmDialog.options.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <Info className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dialog Text */}
            <div className="mt-4">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-950 tracking-tight">
                {confirmDialog.options.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 font-['Source_Sans_3'] leading-relaxed">
                {confirmDialog.options.message}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs sm:text-sm font-semibold transition-all cursor-pointer font-['Source_Sans_3']"
              >
                {confirmDialog.options.cancelText}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                className={`px-5 py-2.5 rounded-xl text-white shadow-xs active:scale-95 text-xs sm:text-sm font-semibold transition-all cursor-pointer font-['Source_Sans_3'] ${
                  confirmDialog.options.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/25'
                    : confirmDialog.options.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 hover:shadow-amber-600/25'
                    : 'bg-[#108283] hover:bg-[#0c6b6c] hover:shadow-teal-600/25'
                }`}
              >
                {confirmDialog.options.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOM ALERT MODAL (Replaces ugly browser window.alert)
          ========================================================================= */}
      {alertDialog && alertDialog.isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overscroll-none animate-in fade-in duration-200"
          onClick={handleAlertClose}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                  alertDialog.options.type === 'danger'
                    ? 'bg-rose-50 border border-rose-100 text-rose-600'
                    : alertDialog.options.type === 'warning'
                    ? 'bg-amber-50 border border-amber-100 text-amber-600'
                    : 'bg-teal-50 border border-teal-100 text-[#108283]'
                }`}
              >
                {alertDialog.options.type === 'danger' ? (
                  <AlertCircle className="w-5 h-5 stroke-[2.2]" />
                ) : alertDialog.options.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <Info className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              <button
                type="button"
                onClick={handleAlertClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-950 tracking-tight">
                {alertDialog.options.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 font-['Source_Sans_3'] leading-relaxed">
                {alertDialog.options.message}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={handleAlertClose}
                className="px-6 py-2.5 rounded-xl bg-[#108283] hover:bg-[#0c6b6c] text-white shadow-xs active:scale-95 text-xs sm:text-sm font-semibold transition-all cursor-pointer font-['Source_Sans_3']"
              >
                {alertDialog.options.buttonText || 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROFESSIONAL FLOATING TOAST NOTIFICATIONS
          ========================================================================= */}
      <div 
        aria-live="polite" 
        className="fixed top-5 right-5 z-[10000] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-3 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] border border-gray-100 animate-in slide-in-from-top-4 fade-in duration-300 transition-all hover:shadow-lg"
          >
            <div 
              className={`p-2 rounded-xl shrink-0 ${
                t.type === 'error'
                  ? 'bg-rose-50 text-rose-600'
                  : t.type === 'warning'
                  ? 'bg-amber-50 text-amber-600'
                  : t.type === 'info'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 stroke-[2.4]" />
              ) : t.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 stroke-[2.4]" />
              ) : t.type === 'info' ? (
                <Info className="w-4 h-4 stroke-[2.4]" />
              ) : (
                <CheckCircle2 className="w-4 h-4 stroke-[2.4]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {t.title && (
                <h4 className="text-xs font-bold text-gray-900 font-['Source_Sans_3']">
                  {t.title}
                </h4>
              )}
              <p className="text-xs text-gray-600 font-['Source_Sans_3'] leading-relaxed mt-0.5">
                {t.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
