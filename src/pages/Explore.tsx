import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, Quote, Library, BookText } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useBooks } from '@/hooks/useBooks';
import BookCard from '@/components/books/BookCard';
import { cn } from '@/lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function Explore() {
  const { books, updateBookProgress, updateStatus, deleteBook } = useBooks();
  const [prompt, setPrompt] = React.useState('');
  const [result, setResult] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  const handleAskAI = async () => {
    if (!prompt || !process.env.GEMINI_API_KEY) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As a literary expert for Lumina Book Tracker, provide a short, atmospheric recommendation or description based on: ${prompt}. Keep it within 3-4 sentences in a sophisticated tone.`
      });
      setResult(response.text || "The archives provide no clarity on this matter.");
    } catch (error) {
      console.error('AI Error:', error);
      setResult("The library archives are currently inaccessible. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const featuredTopics = [
    { id: 'classics', title: "The Classics", desc: "Timeless tales that shaped humanity.", icon: BookOpen, keyword: 'Classic' },
    { id: 'noir', title: "Modern Noir", desc: "Dark plots and sharp shadows.", icon: ArrowRight, keyword: 'Noir' },
    { id: 'contemporary', title: "Contemporary", desc: "Voices of the present age.", icon: BookText, keyword: 'Contemporary' },
  ];

  const filteredBooks = React.useMemo(() => {
    if (!selectedTopic) return [];
    const topic = featuredTopics.find(t => t.id === selectedTopic);
    if (!topic) return [];
    return books.filter(book => 
      book.genre?.toLowerCase().includes(topic.keyword.toLowerCase()) ||
      book.title.toLowerCase().includes(topic.keyword.toLowerCase())
    );
  }, [selectedTopic, books]);

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-10">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lumina-slate-100 text-lumina-slate-900 text-[10px] font-bold uppercase tracking-widest transition-transform hover:scale-105">
          <Sparkles size={14} />
          Library Oracle
        </div>
        <h1 className="text-5xl font-light tracking-tight text-lumina-slate-900">Discover your next story</h1>
        <p className="text-lg text-lumina-slate-500 max-w-lg mx-auto">Let our curator guide you through the literary landscapes of your imagination.</p>
      </header>

      <section className="bg-lumina-slate-900 text-lumina-bg p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lumina-bg/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-lumina-bg/50 text-[10px] font-bold uppercase tracking-[0.2em]">What are you in the mood for?</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="e.g. A haunting mystery with sharp shadows"
                className="flex-1 bg-lumina-bg/5 border border-lumina-bg/10 rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-1 focus:ring-lumina-bg/30 transition-all placeholder:text-lumina-bg/20"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              />
              <button
                onClick={handleAskAI}
                disabled={isLoading}
                className="bg-lumina-bg text-lumina-slate-900 px-8 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl"
              >
                {isLoading ? 'Consulting...' : 'Discover'}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-lumina-bg/5 border border-lumina-bg/10 p-8 rounded-2xl space-y-4"
              >
                <Quote className="text-lumina-bg/20" size={32} />
                <p className="text-lg leading-relaxed text-lumina-bg/90">
                  {result}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-lumina-slate-400">Featured Collections</h2>
          {selectedTopic && (
            <button 
              onClick={() => setSelectedTopic(null)}
              className="text-[10px] font-bold uppercase tracking-widest text-lumina-indigo hover:underline"
            >
              Clear View
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTopics.map((feat) => (
            <motion.div 
              key={feat.id} 
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTopic(feat.id)}
              className={cn(
                "group p-8 rounded-3xl border transition-all cursor-pointer shadow-sm relative overflow-hidden",
                selectedTopic === feat.id 
                  ? "border-lumina-slate-900 bg-lumina-slate-900 text-white" 
                  : "border-lumina-slate-100 hover:border-lumina-slate-900 bg-lumina-bg text-lumina-slate-900"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors",
                selectedTopic === feat.id
                  ? "bg-white/10 text-white"
                  : "bg-lumina-slate-50 border border-lumina-slate-100 group-hover:bg-lumina-slate-900 group-hover:text-white"
              )}>
                <feat.icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
              <p className={cn(
                "text-sm",
                selectedTopic === feat.id ? "text-white/60" : "text-lumina-slate-500"
              )}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedTopic && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-lumina-slate-100" />
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lumina-slate-400">
                <Library size={14} />
                Documents found in {featuredTopics.find(t => t.id === selectedTopic)?.title}
              </div>
              <div className="h-px flex-1 bg-lumina-slate-100" />
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredBooks.map(book => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onUpdateProgress={updateBookProgress}
                    onUpdateStatus={updateStatus}
                    onDelete={deleteBook}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-lumina-slate-50 rounded-3xl border border-dashed border-lumina-slate-200">
                <BookOpen className="mx-auto text-lumina-slate-300 mb-4" size={48} />
                <p className="text-lumina-slate-500">None of your cataloged volumes match this archive sector yet.</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-lumina-slate-300 mt-2">Update genre tags in your library</p>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
