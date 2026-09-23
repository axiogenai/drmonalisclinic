'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminLogin() {
  const { signInWithEmail } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9F9] via-[#FAF0DD]/30 to-[#EBF5F5] flex flex-col justify-center items-center p-4 sm:p-6 font-['Source_Sans_3']">
      
      {/* Background Decorative Rings */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#108283]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        
        {/* Branding Card Top */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#108283] to-[#0a5e5f] shadow-lg shadow-[#108283]/20 border border-white/40 mb-4 p-3">
            <Image
              src="/clinic-logo-icon.png"
              alt="Dr. Monali's Clinic"
              width={48}
              height={48}
              className="object-contain drop-shadow"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#108283]/10 text-[#108283] text-xs font-bold uppercase tracking-wider mb-2 border border-[#108283]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Staff &amp; CMS Portal</span>
          </div>

          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Dr. Monali&apos;s Clinic
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Homeopathy, Skin Care &amp; Trichology Management
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/80 shadow-[0_20px_60px_rgba(16,130,131,0.08)] p-6 sm:p-8 relative">
          
          <div className="mb-6">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">
              Administrative Sign In
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter your authorized Supabase clinical credentials to access patient appointments and website controls.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong>Authentication Failed:</strong> {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Staff Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@drmonalisclinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Password <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all font-medium text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Badge Info */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Live Auth Active</span>
              </div>
              <span className="font-mono text-gray-400">SSL 256-bit</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#108283] hover:bg-[#0c6b6c] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#108283]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Clinical Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Clinical Security Disclaimer */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Confidential Medical Data: Access is strictly monitored and logged for clinical integrity and patient privacy.
            </p>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center mt-5">
          <Link
            href="https://drmonalisclinic.com"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#108283] transition-colors"
          >
            <span>Return to Public Clinic Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
