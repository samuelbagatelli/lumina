import React from 'react';
import AddBookForm from '@/components/books/AddBookForm';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AddPage() {
  const { addBook } = useBooks();
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumina-slate-900" />
    </div>
  );

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="py-12">
      <header className="max-w-2xl mx-auto text-center mb-12 space-y-4">
        <h1 className="text-4xl font-light tracking-tight text-lumina-slate-900">New Catalog Entry</h1>
        <p className="text-lumina-slate-500 text-sm">Expand your private collection with a new volume.</p>
      </header>
      <AddBookForm onAdd={addBook} />
    </div>
  );
}
