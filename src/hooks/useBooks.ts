import { useState, useEffect } from 'react';
import { Book, BookStatus } from '@/types';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestoreUtils';
import { useAuth } from '@/contexts/AuthContext';

export function useBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const path = `users/${user.uid}/books`;
    const q = query(collection(db, path), orderBy('addedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return unsubscribe;
  }, [user]);

  const addBook = async (title: string, author: string, pages: number, status: BookStatus, genre?: string, collectionId?: string) => {
    if (!user) return;
    const path = `users/${user.uid}/books`;
    try {
      await addDoc(collection(db, path), {
        title,
        author,
        pages,
        status,
        genre: genre || 'Uncategorized',
        coverUrl: `https://picsum.photos/seed/${encodeURIComponent(title)}/400/600`,
        progress: status === 'Completed' ? 100 : 0,
        readPages: status === 'Completed' ? pages : 0,
        addedAt: new Date().toISOString(),
        userId: user.uid,
        collectionId: collectionId || null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateBookProgress = async (id: string, readPages: number) => {
    if (!user) return;
    const path = `users/${user.uid}/books/${id}`;
    try {
      const bookRef = doc(db, path);
      const book = books.find(b => b.id === id);
      if (!book) return;

      const pages = book.pages || 0;
      const progress = Math.min(100, Math.max(0, (readPages / pages) * 100));
      
      await updateDoc(bookRef, {
        readPages,
        progress,
        status: progress === 100 ? 'Completed' : 'Reading',
        completedAt: progress === 100 ? new Date().toISOString() : null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateStatus = async (id: string, status: BookStatus) => {
    if (!user) return;
    const path = `users/${user.uid}/books/${id}`;
    try {
      const bookRef = doc(db, path);
      await updateDoc(bookRef, {
        status,
        progress: status === 'Completed' ? 100 : (status === 'Want to Read' ? 0 : undefined), // undefined keeps it unchanged if Reading
        completedAt: status === 'Completed' ? new Date().toISOString() : null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateBookDetails = async (id: string, details: Partial<Book>) => {
    if (!user) return;
    const path = `users/${user.uid}/books/${id}`;
    try {
      const bookRef = doc(db, path);
      await updateDoc(bookRef, details);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteBook = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/books/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { books, loading, addBook, updateBookProgress, updateStatus, updateBookDetails, deleteBook };
}
