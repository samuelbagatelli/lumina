import React from 'react';
import BookCard from '@/components/books/BookCard';
import { useBooks } from '@/hooks/useBooks';
import { Search, Filter, BookIcon, Star, LogIn, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { BookStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithGoogle } from '@/lib/firebase';
import { useCollections } from '@/hooks/useCollections';
import CollectionManager from '@/components/books/CollectionManager';

export default function Home() {
  const { books, loading, updateBookProgress, updateStatus, deleteBook } = useBooks();
  const { collections, addCollection, deleteCollection } = useCollections();
  const { user, loading: authLoading } = useAuth();
  
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<BookStatus | 'All'>('All');
  const [genreFilter, setGenreFilter] = React.useState<string>('All');
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null);

  const genres = ['All', ...new Set(books.map(b => b.genre).filter(Boolean) as string[])];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                         book.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
    const matchesGenre = genreFilter === 'All' || book.genre === genreFilter;
    const matchesFolder = book.collectionId === (currentFolderId || undefined) || (!currentFolderId && !book.collectionId);
    
    return matchesSearch && matchesStatus && matchesGenre && matchesFolder;
  });

  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'Reading').length,
    completed: books.filter(b => b.status === 'Completed').length,
  };

  if (authLoading || (user && loading)) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumina-slate-900" />
    </div>
  );

  if (!user) return (
    <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
      <div className="w-24 h-24 bg-lumina-slate-100 rounded-full flex items-center justify-center mx-auto text-lumina-slate-400">
        <Compass size={48} />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-lumina-slate-900 tracking-tight">Your library awaits</h1>
        <p className="text-lumina-slate-500 max-w-md mx-auto">Sign in to start cataloging your literary journey and tracking your reading progress across volumes.</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={loginWithGoogle}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-lumina-primary text-lumina-primary-foreground font-bold tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-lumina-slate-200"
        >
          <LogIn size={20} />
          Start Your Catalog with Google
        </button>
        <a
          href="/login"
          className="text-lumina-slate-500 hover:text-lumina-slate-900 font-medium transition-colors"
        >
          Sign in with email instead
        </a>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-light text-lumina-slate-900 tracking-tight">My Library</h1>
          <p className="text-lumina-slate-500 mt-2">
            You have <span className="font-medium text-lumina-slate-900">{stats.total} books</span> in your digital collection.
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-lumina-slate-100 p-1 rounded-lg">
            {['All', 'Reading', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f as any)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-md transition-all hover:text-lumina-slate-900",
                  (statusFilter === f || (f === 'All' && statusFilter === 'All'))
                    ? "bg-lumina-bg text-lumina-slate-900 shadow-sm"
                    : "text-lumina-slate-400"
                )}
              >
                {f === 'Reading' ? 'In Progress' : f}
              </button>
            ))}
          </div>

          <select 
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-4 py-1.5 bg-lumina-slate-100 text-lumina-slate-900 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer hover:bg-lumina-slate-200 transition-colors"
          >
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Books Cataloged', value: stats.total, color: 'bg-lumina-bg' },
          { label: 'Active Progress', value: stats.reading, color: 'bg-lumina-bg' },
          { label: 'Archive Goal', value: `${stats.completed}/10`, color: 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -5, scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-2xl border border-lumina-slate-100 shadow-sm flex flex-col justify-between transition-colors",
              stat.color
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-lumina-slate-400">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-semibold text-lumina-slate-900">{stat.value}</h3>
              {stat.label.includes('Goal') && (
                <div className="w-24 h-1 bg-indigo-200 rounded-full overflow-hidden">
                  <div className="h-full bg-lumina-indigo" style={{ width: `${Math.min(100, (stats.completed / 10) * 100)}%` }} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      <CollectionManager 
         collections={collections}
         currentParentId={currentFolderId}
         onNavigate={setCurrentFolderId}
         onAdd={addCollection}
         onDelete={deleteCollection}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-lumina-slate-400" size={18} />
        <input
          type="text"
          placeholder="Filter by title or author..."
          className="w-full pl-8 py-4 bg-transparent border-b border-lumina-slate-100 focus:border-lumina-slate-900 focus:outline-none transition-all text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onUpdateProgress={updateBookProgress}
            onUpdateStatus={updateStatus}
            onDelete={deleteBook}
          />
        ))}
        
        {filteredBooks.length === 0 && (
          <div className="col-span-full py-32 text-center">
             <p className="text-lumina-slate-400 text-sm font-medium">Your search returned no volumes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
