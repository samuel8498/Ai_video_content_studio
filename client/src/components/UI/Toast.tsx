import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl glass-panel border transition-all duration-300 transform translate-y-0 ${
        toast.type === 'success'
          ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
          : toast.type === 'error'
          ? 'border-red-500/40 bg-red-950/40 text-red-200'
          : 'border-purple-500/40 bg-purple-950/40 text-purple-200'
      }`}
    >
      {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0" />}
      <p className="text-sm font-medium flex-1">{toast.text}</p>
      <button onClick={() => onDismiss(toast.id)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
