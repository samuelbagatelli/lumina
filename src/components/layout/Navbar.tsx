import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Library, PlusCircle, Search, Menu, X, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithGoogle, logout } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: 'Library', path: '/', icon: Library },
    { name: 'Add Book', path: '/add', icon: PlusCircle },
    { name: 'Explore', path: '/explore', icon: Search },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-lumina-bg border-b border-lumina-slate-100 h-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-10 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-12">
            <NavLink to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold tracking-tight text-lumina-slate-900">Lumina</span>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "relative text-sm font-medium transition-colors hover:text-lumina-slate-900 py-1",
                      isActive ? "text-lumina-slate-900 border-b-2 border-lumina-slate-900" : "text-lumina-slate-400"
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.name}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-lumina-slate-50 flex items-center justify-center text-lumina-slate-600 hover:bg-lumina-slate-100 dark:hover:bg-lumina-slate-100/10 hover:scale-110 active:scale-95 transition-all outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {loading ? (
              <div className="w-10 h-10 rounded-full bg-lumina-slate-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={logout}
                  className="text-xs font-bold uppercase tracking-widest text-lumina-slate-400 hover:text-lumina-slate-900 hover:scale-105 active:scale-95 transition-all hidden md:block"
                >
                  Sign Out
                </button>
                <div 
                  className="w-10 h-10 rounded-full bg-lumina-slate-200 bg-cover border border-lumina-slate-100 shadow-sm hover:ring-2 hover:ring-lumina-slate-900 transition-all cursor-pointer"
                  style={{ backgroundImage: `url(${user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`})` }}
                ></div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-lumina-slate-600 hover:text-lumina-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-lumina-slate-100 transition-all"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lumina-primary text-lumina-primary-foreground text-xs font-bold uppercase tracking-widest hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <LogIn size={16} />
                  Register
                </a>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-lumina-slate-600 p-2 rounded-md hover:bg-lumina-slate-100 dark:hover:bg-lumina-slate-100/10 active:scale-90 transition-all"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-lumina-bg border-b border-lumina-slate-100 overflow-hidden"
          >
            <div className="px-10 py-6 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 text-sm font-medium transition-colors",
                      isActive ? "text-lumina-slate-900" : "text-lumina-slate-400"
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.name}
                </NavLink>
              ))}
              {!user && (
                <>
                  <div className="pt-4 border-t border-lumina-slate-50 space-y-2">
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-4 text-sm font-medium transition-colors",
                          isActive ? "text-lumina-slate-900" : "text-lumina-slate-400"
                        )
                      }
                    >
                      <LogIn size={18} />
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-4 text-sm font-medium transition-colors",
                          isActive ? "text-lumina-slate-900" : "text-lumina-slate-400"
                        )
                      }
                    >
                      <LogIn size={18} />
                      Register
                    </NavLink>
                  </div>
                </>
              )}
              <div className="pt-4 border-t border-lumina-slate-50 space-y-4">
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="flex items-center gap-4 text-sm font-medium text-lumina-slate-400 w-full"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                {user && (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-4 text-sm font-medium text-red-500 w-full"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
