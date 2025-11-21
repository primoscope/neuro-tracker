import { LogEntry } from '../schemas';

export type StorageMode = 'local' | 'supabase';

export interface StorageAdapter {
  mode: StorageMode;
  isAvailable: () => boolean;
  
  // Auth
  signUp?: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn?: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut?: () => Promise<void>;
  getUser?: () => Promise<{ id: string; email?: string } | null>;
  
  // Logs CRUD
  createLog: (log: Omit<LogEntry, 'id'>) => Promise<LogEntry>;
  updateLog: (id: string, log: Partial<LogEntry>) => Promise<LogEntry>;
  getLogs: (limit?: number) => Promise<LogEntry[]>;
  getLastLog: () => Promise<LogEntry | null>;
  deleteLog?: (id: string) => Promise<void>;
  
  // Data management
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<void>;
}

export interface StorageConfig {
  mode: StorageMode;
  supabaseUrl?: string;
  supabaseKey?: string;
}
