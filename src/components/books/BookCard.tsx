import React from 'react';
import { Book, BookStatus } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Edit3, Trash2, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onUpdateProgress: (id: string, pages: number) => void;
  onUpdateStatus: (id: string, status: BookStatus) => void;
  onDelete: (id: string) => void;
  key?: string | number;
}

export default function BookCard({ book, onUpdateProgress, onUpdateStatus, onDelete }: BookCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempReadPages, setTempReadPages] = React.useState(book.readPages || 0);

  const statuses: BookStatus[] = ['Want to Read', 'Reading', 'Completed'];

  return (
    <motion.div
      layout
      className="group cursor-pointer"
    >
      <Link to={`/book/${book.id}`}>
        <div className="aspect-[3/4] bg-lumina-slate-50 rounded-2xl mb-4 relative overflow-hidden shadow-sm group-hover:shadow-xl transition-all border border-lumina-slate-100">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div className={cn(
              "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur bg-lumina-bg/80 text-lumina-slate-900 border border-lumina-slate-100",
              book.status === 'Completed' ? "text-indigo-600" : "text-lumina-slate-900"
            )}>
              {book.status}
            </div>
          </div>

          {/* Update Progress Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex gap-2">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(!isEditing); }}
              className="flex-1 bg-lumina-primary text-lumina-primary-foreground py-2 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg"
            >
              {isEditing ? 'Cancel' : 'Update Progress'}
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(book.id); }}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-90 transition-all shadow-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </Link>

      <Link to={`/book/${book.id}`}>
        <h3 className="font-medium text-lumina-slate-900 leading-tight line-clamp-1">{book.title}</h3>
        <p className="text-sm text-lumina-slate-500 mt-1">{book.author}</p>
      </Link>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-1 bg-lumina-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${book.progress}%` }}
            className="h-full bg-lumina-slate-900"
          />
        </div>
        <span className="text-[10px] font-bold text-lumina-slate-400">{Math.round(book.progress)}%</span>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-lumina-slate-100"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={book.pages}
                value={tempReadPages}
                onChange={(e) => setTempReadPages(parseInt(e.target.value))}
                className="flex-1 accent-lumina-indigo"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateProgress(book.id, tempReadPages);
                  setIsEditing(false);
                }}
                className="bg-lumina-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Save
              </button>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-lumina-slate-400">Status:</span>
              <div className="flex gap-2">
                {statuses.map(s => (
                  <button 
                    key={s}
                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(book.id, s); }}
                    className={cn("text-[9px] font-bold uppercase py-0.5 px-1 rounded", book.status === s ? "bg-lumina-slate-900 text-white" : "text-lumina-slate-400 hover:text-lumina-slate-900")}
                  >
                    {s.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
