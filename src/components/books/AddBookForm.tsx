import React from 'react';
import { motion } from 'motion/react';
import { BookStatus, BookFormData } from '@/types';
import { Plus, X, Book as BookIcon, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '@/hooks/useCollections';

interface AddBookFormProps {
  onAdd: (title: string, author: string, pages: number, status: BookStatus, genre?: string, collectionId?: string) => void;
}

export default function AddBookForm({ onAdd }: AddBookFormProps) {
  const navigate = useNavigate();
  const { collections } = useCollections();
  const [formData, setFormData] = React.useState<BookFormData & { collectionId?: string }>({
    title: '',
    author: '',
    pages: 0,
    status: 'Want to Read',
    genre: '',
    collectionId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || formData.pages <= 0) return;
    
    onAdd(formData.title, formData.author, formData.pages, formData.status, formData.genre, formData.collectionId);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-lumina-bg rounded-2xl p-10 shadow-sm border border-lumina-slate-100 transition-colors">
        <h2 className="text-xs font-bold uppercase tracking-widest text-lumina-slate-400 mb-8">Add to Collection</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium text-lumina-slate-700">
              Book Title
            </label>
            <input
              id="title"
              required
              type="text"
              placeholder="e.g. The Midnight Library"
              className="w-full px-4 py-2.5 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lumina-slate-900 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="author" className="text-sm font-medium text-lumina-slate-700">
              Author
            </label>
            <input
              id="author"
              required
              type="text"
              placeholder="e.g. Matt Haig"
              className="w-full px-4 py-2.5 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lumina-slate-900 transition-all"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="genre" className="text-sm font-medium text-lumina-slate-700">
              Genre
            </label>
            <input
              id="genre"
              type="text"
              placeholder="e.g. Science Fiction, Memoir, History"
              className="w-full px-4 py-2.5 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lumina-slate-900 transition-all"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="collection" className="text-sm font-medium text-lumina-slate-700">
              Assigned Archive Sector (Optional)
            </label>
            <div className="relative">
              <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-lumina-slate-400" size={16} />
              <select
                id="collection"
                className="w-full pl-10 pr-4 py-2.5 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg text-sm focus:outline-none appearance-none cursor-pointer"
                value={formData.collectionId}
                onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
              >
                <option value="">Main Library (Root)</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="pages" className="text-sm font-medium text-lumina-slate-700">
                Pages
              </label>
              <input
                id="pages"
                required
                type="number"
                min="1"
                className="w-full px-4 py-2.5 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lumina-slate-900 transition-all"
                value={formData.pages || ''}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="status" className="text-sm font-medium text-lumina-slate-700">
                Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-2.5 bg-lumina-slate-50 border border-lumina-slate-200 rounded-lg text-sm focus:outline-none appearance-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
              >
                <option value="Want to Read">To Be Read</option>
                <option value="Reading">Currently Reading</option>
                <option value="Completed">Finished</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-lumina-primary text-lumina-primary-foreground py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-lumina-slate-100"
          >
            Add to Library
          </button>
        </form>
      </div>
    </div>
  );
}
