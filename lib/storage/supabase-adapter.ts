import { createClient } from '../supabase/client';
import { StorageAdapter } from './types';
import { LogEntry } from '../schemas';

export class SupabaseStorageAdapter implements StorageAdapter {
  mode: 'supabase' = 'supabase';
  private supabase = createClient();

  isAvailable(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    return !!(url && key && url !== '' && key !== '' && 
             url !== 'https://placeholder.supabase.co' && key !== 'placeholder');
  }

  async signUp(email: string, password: string) {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' 
          ? `${window.location.origin}/logs` 
          : undefined,
      },
    });

    return { error: error ? new Error(error.message) : null };
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error ? new Error(error.message) : null };
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
    };
  }

  async createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const user = await this.getUser();
    if (!user) throw new Error('Not authenticated');

    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        occurred_at: log.occurred_at,
        compounds: log.compounds,
        sentiment_score: log.sentiment_score,
        tags_cognitive: log.tags_cognitive,
        tags_physical: log.tags_physical,
        tags_mood: log.tags_mood,
        notes: log.notes,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create log');
    }

    return response.json();
  }

  async updateLog(id: string, updates: Partial<LogEntry>): Promise<LogEntry> {
    const response = await fetch('/api/logs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to update log');
    }

    return response.json();
  }

  async getLogs(limit: number = 20): Promise<LogEntry[]> {
    const user = await this.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('logs')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return data as unknown as LogEntry[];
  }

  async getLastLog(): Promise<LogEntry | null> {
    const logs = await this.getLogs(1);
    return logs[0] || null;
  }

  async deleteLog(id: string): Promise<void> {
    const user = await this.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error('Failed to delete log');
    }
  }

  async exportData() {
    const user = await this.getUser();
    const logs = await this.getLogs(1000); // Get more logs for export

    return {
      logs,
      user,
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      source: 'supabase',
    };
  }

  async importData(data: any) {
    const user = await this.getUser();
    if (!user) throw new Error('Not authenticated');

    if (data.logs && Array.isArray(data.logs)) {
      // Import logs one by one
      for (const log of data.logs) {
        try {
          await this.createLog({
            occurred_at: log.occurred_at,
            compounds: log.compounds,
            sentiment_score: log.sentiment_score,
            tags_cognitive: log.tags_cognitive,
            tags_physical: log.tags_physical,
            tags_mood: log.tags_mood,
            notes: log.notes,
          });
        } catch (error) {
          console.error('Failed to import log:', error);
        }
      }
    }
  }
}

export const supabaseAdapter = new SupabaseStorageAdapter();
