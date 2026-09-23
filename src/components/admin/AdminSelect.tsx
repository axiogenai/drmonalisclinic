'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface AdminSelectOption {
  value: string;
  label: string;
  badge?: string;
  sublabel?: string;
}

interface AdminSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  align?: 'left' | 'right';
  width?: string;
}

export default function AdminSelect({
  value,
  onChange,
  options,
  label,
  required,
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  align = 'left',
  width,
}: AdminSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${width || 'w-full'} ${className}`} ref={containerRef}>
      {label && (
        <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
          {label} {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-50/80 hover:bg-white border rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] transition-all cursor-pointer text-left ${
          isOpen
            ? 'border-[#108283] ring-2 ring-[#108283]/20 bg-white shadow-xs'
            : 'border-gray-200 hover:border-gray-300'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          <span className={`truncate ${selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#108283]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1.5 z-50 min-w-full bg-white rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-gray-100 py-1 max-h-60 overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
          data-lenis-prevent
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 mx-0 text-xs sm:text-sm text-left font-['Source_Sans_3'] cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-teal-50 text-[#108283] font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <div className="truncate">
                    <span className="truncate block">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10px] text-gray-400 block truncate">{opt.sublabel}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {opt.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#108283]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
