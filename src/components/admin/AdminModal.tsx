'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  contentClassName?: string;
}

export default function AdminModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-lg',
  contentClassName
}: AdminModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. Stop Lenis smooth scroll if active
    const lenis = typeof window !== 'undefined' ? (window as any).__lenis : null;
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    // 2. Measure scrollbar width to prevent layout jump
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // 3. Completely lock background scroll on BOTH html and body
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');

    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // 4. Escape key listener to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Restore Lenis
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }

      // Restore overflows and padding
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
      document.body.style.paddingRight = originalBodyPaddingRight;

      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overscroll-none"
      onWheel={(e) => e.stopPropagation()}
      data-lenis-prevent
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[88vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-gray-100 overscroll-contain z-10`}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 shrink-0 bg-gray-50/50">
          <h2 className="font-['Playfair_Display'] text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{title}</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-200/60 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div 
          className={`overflow-y-auto overscroll-contain ${contentClassName || 'p-4 sm:p-5'}`}
          data-lenis-prevent
        >
          {children}
        </div>
      </div>
    </div>
  );
}
