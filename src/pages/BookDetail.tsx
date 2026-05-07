import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { useCollections } from '@/hooks/useCollections';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, updateBookDetails, deleteBook, loading } = useBooks();
  const { collections } = useCollections();

  const book = books.find(b => b.id === id);

  const [notes, setNotes] = React.useState('');
  const [synopsis, setSynopsis] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [collectionId, setCollectionId] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (book) {
      setNotes(book.notes || '');
      setSynopsis(book.synopsis || '');
      setRating(book.rating || 0);
      setCollectionId(book.collectionId || '');
    }
  }, [book]);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumina-slate-900" />
    </div>
  );

  if (!book) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Book not found</h2>
      <button 
        onClick={() => navigate('/')} 
        className="text-lumina-indigo mt-4 hover:underline hover:scale-105 active:scale-95 transition-all"
      >
        Back to Library
      </button>
    </div>
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBookDetails(book.id, { notes, rating, synopsis, collectionId: collectionId || null as any });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this book from your collection?')) {
      await deleteBook(book.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-lumina-slate-400 hover:text-lumina-slate-900 transition-all group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Library</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Cover Column */}
        <div className="md:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-lumina-slate-100 transition-transform"
          >
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="bg-lumina-slate-50 p-6 rounded-2xl border border-lumina-slate-100 space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lumina-slate-400">Personal Rating</span>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={cn(
                      "transition-all hover:scale-125 active:scale-90",
                      star <= rating ? "text-amber-400" : "text-lumina-slate-200 hover:text-amber-200"
                    )}
                  >
                    <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-8 space-y-10">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-lumina-slate-100 text-[10px] font-bold uppercase tracking-wide text-lumina-slate-900">
                {book.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-[10px] font-bold uppercase tracking-wide text-lumina-indigo">
                {book.genre || 'General'}
              </span>
            </div>
            <h1 className="text-5xl font-light tracking-tight text-lumina-slate-900 leading-tight">
              {book.title}
            </h1>
            <p className="text-xl text-lumina-slate-500">by {book.author}</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-lumina-slate-400">Archive Sector</h3>
              <select 
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full p-4 rounded-xl bg-lumina-slate-50 border border-lumina-slate-100 focus:border-lumina-slate-900 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="">Main Library (Root)</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-lumina-slate-400">Synopsis</h3>
            <textarea 
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Enter book description or summary..."
              className="w-full h-32 p-4 rounded-xl bg-lumina-slate-50 border border-lumina-slate-100 focus:border-lumina-slate-900 focus:outline-none transition-all text-sm leading-relaxed"
             />
          </section>

          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-lumina-slate-400">Personal Notes</h3>
                <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className={cn(
                     "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm",
                     "bg-lumina-primary text-lumina-primary-foreground hover:scale-105 active:scale-95 disabled:opacity-50"
                   )}
                >
                  <Save size={14} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
             </div>
             <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record your thoughts about this story..."
              className="w-full h-48 p-6 rounded-2xl bg-lumina-slate-50 border border-lumina-slate-100 focus:border-lumina-slate-900 focus:ring-0 transition-all text-sm leading-relaxed"
             />
          </section>

          <footer className="pt-10 flex border-t border-lumina-slate-100">
             <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all active:scale-95"
             >
               <Trash2 size={14} />
               Remove from Library
             </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
