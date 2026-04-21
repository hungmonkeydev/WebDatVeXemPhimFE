// src/components/ui/Modal.tsx
import React from 'react';
import useScrollLock from '../../hooks/useScrollLock';
interface ModalProps {
  isOpen: boolean;             
  onClose: () => void;         
  children: React.ReactNode;   
  maxWidth?: string;           
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md'
}: ModalProps) {

  useScrollLock(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-start overflow-y-auto overscroll-contain backdrop-blur-sm px-4">
      <div className={`bg-white rounded-lg w-full ${maxWidth} relative animate-[fadeIn_0.2s_ease-out]`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Nơi chứa nội dung truyền vào từ bên ngoài */}
        {children}

      </div>
    </div>
  );
}