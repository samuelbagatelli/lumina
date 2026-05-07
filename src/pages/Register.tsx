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
import { register } from '@/lib/firebase';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !displayName) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await register(email, password, displayName);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-lumina-slate-900">Create an account</h1>
              <p className="text-lumina-slate-500 text-sm">Start your reading journey with Lumina</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-lumina-slate-400">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-primary transition-all text-lumina-slate-900 placeholder:text-lumina-slate-400"
                disabled={loading}
              />
            </div>

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
                placeholder="Create a password"
                className="w-full px-4 py-3 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-primary transition-all text-lumina-slate-900 placeholder:text-lumina-slate-400"
                disabled={loading}
              />
              <p className="text-xs text-lumina-slate-400">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-lumina-primary text-lumina-primary-foreground font-bold tracking-widest uppercase hover:bg-lumina-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-lumina-primary/20"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-lumina-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-lumina-primary hover:text-lumina-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-lumina-slate-100">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-sm font-medium text-lumina-slate-500 hover:text-lumina-slate-900 transition-colors"
            >
              <LogIn size={16} />
              Sign in with Google instead
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
