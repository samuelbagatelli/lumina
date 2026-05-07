import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ArchiveCollection, OperationType } from '@/types';
import { handleFirestoreError } from '@/lib/firebase';

export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<ArchiveCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }

    const path = `users/${user.uid}/collections`;
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const colls = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ArchiveCollection));
      setCollections(colls);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addCollection = async (name: string, parentId: string | null = null) => {
    if (!user) return;
    const path = `users/${user.uid}/collections`;
    try {
      await addDoc(collection(db, path), {
        name,
        parentId,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteCollection = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/collections/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateCollectionName = async (id: string, name: string) => {
    if (!user) return;
    const path = `users/${user.uid}/collections/${id}`;
    try {
      await updateDoc(doc(db, path), { name });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return { collections, loading, addCollection, deleteCollection, updateCollectionName };
}
