'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (val: string) => void;
  required?: boolean;
  minDate?: string; // default today
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CustomDatePicker({
  value,
  onChange,
  required = false,
  minDate,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timezone-safe date parser
  const parseYMD = (str: string): Date | null => {
    if (!str) return null;
    const parts = str.split('-').map(Number);
    if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const toYMD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedSelected = parseYMD(value);

  // Active viewing month / year in the calendar
  const [viewYear, setViewYear] = useState<number>(
    parsedSelected ? parsedSelected.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    parsedSelected ? parsedSelected.getMonth() : today.getMonth()
  );

  // Synchronize calendar view when value changes from outside
  useEffect(() => {
    if (parsedSelected) {
      setViewYear(parsedSelected.getFullYear());
      setViewMonth(parsedSelected.getMonth());
    }
  }, [value]);

  // Click outside listener to close instantly
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDate = (day: number) => {
    const chosen = new Date(viewYear, viewMonth, day);
    onChange(toYMD(chosen));
    setIsOpen(false);
  };

  const selectQuickPreset = (offsetDays: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = new Date();
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + offsetDays);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    onChange(toYMD(target));
    setIsOpen(false);
  };

  // Calendar matrix calculation
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const minAllowed = minDate ? parseYMD(minDate) || today : today;

  // Format readable display label
  const formatDisplay = (val: string) => {
    if (!val) return '';
    const d = parseYMD(val);
    if (!d) return val;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if prev button should be disabled (preventing past months)
  const isCurrentMonthOrPast =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for HTML form validation & submission */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        value={value}
        onChange={() => {}}
        className="opacity-0 absolute pointer-events-none w-0 h-0"
      />

      {/* Main Trigger Input Box */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-2 text-left cursor-pointer select-none bg-white ${
          isOpen
            ? 'border-[#108283] ring-2 ring-[#108283]/20 shadow-sm'
            : 'border-gray-200 hover:border-[#108283]/60 focus:border-[#108283]'
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-[#108283] shrink-0" />
          <span className={`truncate text-sm font-['Source_Sans_3'] ${value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            {value ? formatDisplay(value) : 'Select consultation date...'}
          </span>
        </div>

        {value && (
          <span className="text-[11px] font-semibold text-[#108283] bg-[#108283]/10 px-2 py-0.5 rounded-md shrink-0">
            Selected
          </span>
        )}
      </button>

      {/* Fast & Smooth Custom Calendar Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-full sm:w-[320px] bg-white rounded-2xl border border-gray-200 shadow-[0_20px_45px_rgba(0,0,0,0.12)] p-4 transition-all duration-150 animate-in fade-in zoom-in-95"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Quick Presets Bar */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              Quick:
            </span>
            <button
              type="button"
              onClick={(e) => selectQuickPreset(0, e)}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#108283]/15 hover:text-[#108283] text-gray-700 font-medium transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={(e) => selectQuickPreset(1, e)}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#108283]/15 hover:text-[#108283] text-gray-700 font-medium transition-colors cursor-pointer"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={(e) => selectQuickPreset(2, e)}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#108283]/15 hover:text-[#108283] text-gray-700 font-medium transition-colors cursor-pointer"
            >
              In 2 Days
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="font-['Playfair_Display'] font-bold text-gray-900 text-base">
              {MONTHS[viewMonth]} <span className="font-['Source_Sans_3'] font-normal text-gray-500 text-sm">{viewYear}</span>
            </h4>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={isCurrentMonthOrPast}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of the Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d, i) => (
              <span
                key={d}
                className={`text-[11px] font-semibold py-1 ${i === 0 ? 'text-amber-600' : 'text-gray-400'}`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 w-8" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(viewYear, viewMonth, day);
              dateObj.setHours(0, 0, 0, 0);

              const isPast = dateObj < minAllowed;
              const isToday = dateObj.getTime() === today.getTime();
              const isSelected = parsedSelected && dateObj.getTime() === parsedSelected.getTime();
              const isSunday = dateObj.getDay() === 0;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDate(day)}
                  className={`h-8 w-8 mx-auto rounded-xl text-xs flex items-center justify-center transition-colors font-medium ${
                    isSelected
                      ? 'bg-[#108283] text-white font-bold shadow-sm'
                      : isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : isToday
                      ? 'border border-[#108283] text-[#108283] hover:bg-[#108283]/10 font-bold'
                      : isSunday
                      ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                      : 'text-gray-700 hover:bg-[#108283]/10 hover:text-[#108283]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Clinic Note at Bottom */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-['Source_Sans_3']">
            <span>Clinic: Mon–Sat 10AM–9PM</span>
            <span className="text-[#108283] font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Same-day care
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
