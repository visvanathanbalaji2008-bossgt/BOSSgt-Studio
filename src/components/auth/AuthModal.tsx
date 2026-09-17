"use client";

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password Requirement Validation Rules (Sign Up policy)
  const passwordRules = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValidForRegister = useMemo(() => {
    return (
      passwordRules.hasMinLength &&
      passwordRules.hasUppercase &&
      passwordRules.hasLowercase &&
      passwordRules.hasNumber &&
      passwordRules.hasSpecial
    );
  }, [passwordRules]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onClose();
      } else if (mode === "register") {
        if (!isPasswordValidForRegister) {
          setError("Please satisfy all password requirements.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        setSuccessMessage("Success! Account created.");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setSuccessMessage("Password reset email sent! Check your inbox.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1523] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3.5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2">
              <Check size={14} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 ml-1">Email</label>
            <div className="relative flex items-center">
              <Mail size={14} className="absolute left-3 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-colors placeholder-zinc-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold text-zinc-300">Password</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); setSuccessMessage(null); }}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-9 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-colors placeholder-zinc-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {mode === "register" && (
            <div className="p-2.5 bg-black/30 border border-white/5 rounded-lg space-y-1 text-[11px]">
              <div className="font-semibold text-zinc-400 mb-1">PASSWORD REQUIREMENTS</div>
              <ModalReq satisfied={passwordRules.hasMinLength} label="8+ characters" />
              <ModalReq satisfied={passwordRules.hasUppercase} label="One uppercase letter (A-Z)" />
              <ModalReq satisfied={passwordRules.hasLowercase} label="One lowercase letter (a-z)" />
              <ModalReq satisfied={passwordRules.hasNumber} label="One number (0-9)" />
              <ModalReq satisfied={passwordRules.hasSpecial} label="One special character" />
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 ml-1">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3 text-zinc-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full bg-black/40 border rounded-lg pl-9 pr-9 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-colors placeholder-zinc-600 ${
                    !passwordsMatch && confirmPassword ? "border-red-500" : "border-white/10"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {!passwordsMatch && confirmPassword && (
                <p className="text-red-400 text-[10px] ml-1">Passwords do not match.</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading || 
              !email || 
              (mode !== "forgot" && !password) ||
              (mode === "register" && (!isPasswordValidForRegister || !passwordsMatch || !confirmPassword))
            }
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? "Please wait..." : (mode === 'login' ? "Sign In" : mode === 'register' ? "Create Account" : "Reset Password")}
          </button>
          
          <div className="text-center mt-1">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-indigo-400 hover:underline"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalReq({ satisfied, label }: { satisfied: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${satisfied ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>
      <span className="text-[10px]">{satisfied ? "✓" : "✗"}</span>
      <span>{label}</span>
    </div>
  );
}
