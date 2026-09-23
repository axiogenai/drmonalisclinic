'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  ExternalLink,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

export default function AdminLogin() {
  const { 
    signInWithEmail, 
    resetPasswordForEmail, 
    updatePassword, 
    isPasswordRecovery 
  } = useAdminAuth();

  const [mode, setMode] = useState<'login' | 'forgot_password' | 'update_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isPasswordRecovery) {
      setMode('update_password');
    } else if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setMode('update_password');
    }
  }, [isPasswordRecovery]);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered staff email address.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await resetPasswordForEmail(email);

    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
    } else {
      setSuccessMessage('Password reset link sent! Please check your email inbox (and check your spam folder if not visible).');
      setIsSubmitting(false);
    }
  };

  // Handle Update Password Submit
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await updatePassword(password);

    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
    } else {
      setSuccessMessage('Password updated successfully! Logging you in...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9F9] via-[#FAF0DD]/30 to-[#EBF5F5] flex flex-col justify-center items-center p-4 sm:p-6 font-['Source_Sans_3']">
      
      {/* Background Decorative Rings */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#108283]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        
        {/* Branding Card Top */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Image
              src="/clinic-logo.png"
              alt="Dr. Monali's Clinic"
              width={44}
              height={44}
              className="h-10 sm:h-11 w-auto object-contain"
              priority
            />
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              Dr. Monali&apos;s Clinic
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Homeopathy, Skin Care &amp; Trichology Management
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/80 shadow-[0_20px_60px_rgba(16,130,131,0.08)] p-6 sm:p-8 relative">
          
          {/* Header depending on mode */}
          <div className="mb-6">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">
              {mode === 'login' && 'Administrative Sign In'}
              {mode === 'forgot_password' && 'Reset Password'}
              {mode === 'update_password' && 'Set New Password'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'login' && 'Enter your authorized Supabase clinical credentials to access the admin portal.'}
              {mode === 'forgot_password' && 'Enter your registered staff email to receive a secure password recovery link.'}
              {mode === 'update_password' && 'Enter your new password to regain access to your admin dashboard.'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong>Error:</strong> {errorMessage}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {successMessage}
              </div>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setMode('forgot_password');
                    }}
                    className="text-[11px] font-semibold text-[#108283] hover:text-[#0c6b6c] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
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
          )}

          {/* 2. FORGOT PASSWORD FORM */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enter Your Staff Email <span className="text-rose-500">*</span>
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

              {/* Spam folder reminder notice */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Tip:</strong> If the email is not visible in your inbox, please <strong>check your Spam / Junk folder</strong>.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#108283] hover:bg-[#0c6b6c] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#108283]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Password Reset Link</span>
                    <KeyRound className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode('login');
                }}
                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* 3. UPDATE PASSWORD FORM */}
          {mode === 'update_password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
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

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all font-medium text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#108283] hover:bg-[#0c6b6c] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#108283]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving New Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save Password &amp; Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

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
