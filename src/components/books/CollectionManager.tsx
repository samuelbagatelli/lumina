import React from 'react';
import { ArchiveCollection } from '@/types';
import { FolderPlus, Folder, ChevronRight, MoreVertical, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface CollectionManagerProps {
  collections: ArchiveCollection[];
  currentParentId: string | null;
  onNavigate: (id: string | null) => void;
  onAdd: (name: string, parentId: string | null) => void;
  onDelete: (id: string) => void;
}

export default function CollectionManager({ 
  collections, 
  currentParentId, 
  onNavigate, 
  onAdd, 
  onDelete 
}: CollectionManagerProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');

  const currentCollections = collections.filter(c => c.parentId === currentParentId);
  const parentCollection = currentParentId 
    ? collections.find(c => c.id === currentParentId) 
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName, currentParentId);
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentParentId && (
            <button 
              onClick={() => onNavigate(parentCollection?.parentId || null)}
              className="p-2 hover:bg-lumina-slate-100 rounded-full transition-colors text-lumina-slate-400 hover:text-lumina-slate-900"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-lumina-slate-400">
            {parentCollection ? parentCollection.name : 'Collections'}
          </h2>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 text-lumina-indigo hover:bg-indigo-50 rounded-lg transition-all"
        >
          <FolderPlus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-2"
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Folder name..."
                  className="flex-1 px-4 py-2 bg-lumina-slate-50 border border-lumina-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lumina-slate-900"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => !newName && setIsAdding(false)}
                />
                <button type="submit" className="px-4 py-2 bg-lumina-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                  Create
                </button>
              </form>
            </motion.div>
          )}

          {currentCollections.map((col) => (
            <motion.div
              layout
              key={col.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group relative"
            >
              <div 
                onClick={() => onNavigate(col.id)}
                className="p-4 rounded-2xl bg-lumina-slate-50 border border-lumina-slate-100 hover:border-lumina-slate-900 transition-all cursor-pointer flex flex-col items-center gap-3 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-lumina-slate-100 flex items-center justify-center text-lumina-slate-400 group-hover:bg-lumina-slate-900 group-hover:text-white transition-colors">
                  <Folder size={24} />
                </div>
                <span className="text-xs font-medium text-lumina-slate-700 truncate w-full">{col.name}</span>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(col.id); }}
                className="absolute top-2 right-2 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-md transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
