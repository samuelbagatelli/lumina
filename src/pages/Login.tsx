/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, BookOpen, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-lumina-bg border border-lumina-slate-100 rounded-2xl p-8 shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-lumina-slate-400 hover:text-lumina-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-lumina-primary flex items-center justify-center text-lumina-primary-foreground">
              <LogIn size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-lumina-slate-900">Welcome back</h1>
              <p className="text-lumina-slate-500 text-sm">Sign in to continue your reading journey</p>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-lumina-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., john@example.com"
                className="w-full px-4 py-3 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-primary transition-all text-lumina-slate-900 placeholder:text-lumina-slate-400"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-lumina-slate-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-primary transition-all text-lumina-slate-900 placeholder:text-lumina-slate-400"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-lumina-primary text-lumina-primary-foreground font-bold tracking-widest uppercase hover:bg-lumina-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-lumina-primary/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-lumina-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-lumina-primary hover:text-lumina-primary/80 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-lumina-slate-100">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-lumina-slate-200 hover:bg-lumina-slate-50 dark:hover:bg-lumina-slate-100/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={16} />
              <span className="text-sm font-medium text-lumina-slate-700 dark:text-lumina-slate-200">
                Sign in with Google
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
