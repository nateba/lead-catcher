import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { HypeLeadsLogo } from '../BrandLogo';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignupSuccess(false);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error: signInError } = await signIn(email.trim(), password);
        if (signInError) setError(signInError);
      } else {
        const { error: signUpError, needsEmailConfirmation } = await signUp(email.trim(), password);
        if (signUpError) {
          setError(signUpError);
        } else if (needsEmailConfirmation) {
          setSignupSuccess(true);
        }
        // Otherwise a session was created immediately — AuthProvider picks it up
        // and the app renders past this screen on its own.
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
      <div className="app-ambient-glow pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl border border-[#25123A] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(129,38,194,0.18)] p-6 sm:p-8">
        {/* Brand */}
        <div className="mb-6">
          <HypeLeadsLogo size="md" />
          <p className="text-[13px] font-medium text-slate-500 mt-1.5">
            {mode === 'signin' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {signupSuccess && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Conta criada! Verifique seu e-mail para confirmar antes de entrar.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 transition-all disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{mode === 'signin' ? 'Entrar' : 'Criar Conta'}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signin' ? (
            <>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSignupSuccess(false);
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
