/**
 * Lumina Book Tracker Types
 */

export type BookStatus = 'Want to Read' | 'Reading' | 'Completed';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: BookStatus;
  progress: number; // Percent 0-100
  rating?: number;
  genre?: string;
  synopsis?: string;
  notes?: string;
  addedAt: string;
  completedAt?: string;
  pages?: number;
  readPages?: number;
  userId: string;
  collectionId?: string;
}

export interface ArchiveCollection {
  id: string;
  name: string;
  parentId: string | null;
  userId: string;
  createdAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  genre?: string;
}
