// src/components/ui/Toast.tsx
import { useEffect } from 'react';

// Định nghĩa các loại thông báo
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isOpen: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  isOpen, 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000 
}: ToastProps) {
  
  // Hiệu ứng tự động tắt sau 'duration' giây
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <>
      {/* Kẹp thêm xíu CSS để làm hiệu ứng trượt từ phải sang */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>

      <div className="fixed top-24 right-5 z-[9999] animate-slide-in">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[250px] max-w-sm ${styles[type]}`}>
          
          <span className="text-xl">{icons[type]}</span>
          <p className="text-[14px] font-medium flex-1 leading-snug">{message}</p>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            ✕
          </button>
          
        </div>
      </div>
    </>
  );
}