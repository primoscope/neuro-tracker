import { StorageAdapter } from './types';
import { LogEntry } from '../schemas';

const STORAGE_KEYS = {
  LOGS: 'neurostack-logs',
  USER: 'neurostack-user',
  PIN: 'neurostack-pin',
};

export class LocalStorageAdapter implements StorageAdapter {
  mode: 'local' = 'local';

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Simple PIN-based auth for local mode
  async signUp(email: string, password: string) {
    if (!this.isAvailable()) {
      return { error: new Error('LocalStorage not available') };
    }

    // Store PIN (last 4 digits of password as PIN)
    const pin = password.slice(-4);
    localStorage.setItem(STORAGE_KEYS.PIN, pin);
    
    const user = {
      id: `local-${Date.now()}`,
      email,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { error: null };
  }

  async signIn(email: string, password: string) {
    if (!this.isAvailable()) {
      return { error: new Error('LocalStorage not available') };
    }

    const storedPin = localStorage.getItem(STORAGE_KEYS.PIN);
    const pin = password.slice(-4);
    
    if (!storedPin) {
      return { error: new Error('No account found. Please sign up first.') };
    }
    
    if (storedPin !== pin) {
      return { error: new Error('Incorrect password') };
    }
    
    return { error: null };
  }

  async signOut() {
    // Don't clear data, just session
    // User data persists in LocalStorage
  }

  async getUser() {
    if (!this.isAvailable()) return null;
    
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return { id: user.id, email: user.email };
    } catch {
      return null;
    }
  }

  private getStoredLogs(): LogEntry[] {
    if (!this.isAvailable()) return [];
    
    const logsStr = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!logsStr) return [];
    
    try {
      return JSON.parse(logsStr);
    } catch {
      return [];
    }
  }

  private saveLogs(logs: LogEntry[]) {
    if (!this.isAvailable()) return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }

  async createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const logs = this.getStoredLogs();
    
    const newLog: LogEntry = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    logs.push(newLog);
    this.saveLogs(logs);
    
    return newLog;
  }

  async updateLog(id: string, updates: Partial<LogEntry>): Promise<LogEntry> {
    const logs = this.getStoredLogs();
    const index = logs.findIndex(l => l.id === id);
    
    if (index === -1) {
      throw new Error('Log not found');
    }
    
    const updatedLog = { ...logs[index], ...updates };
    logs[index] = updatedLog;
    this.saveLogs(logs);
    
    return updatedLog;
  }

  async getLogs(limit?: number): Promise<LogEntry[]> {
    const logs = this.getStoredLogs();
    
    // Sort by occurred_at descending
    const sorted = logs.sort((a, b) => 
      new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );
    
    if (limit) {
      return sorted.slice(0, limit);
    }
    
    return sorted;
  }

  async getLastLog(): Promise<LogEntry | null> {
    const logs = await this.getLogs(1);
    return logs[0] || null;
  }

  async deleteLog(id: string): Promise<void> {
    const logs = this.getStoredLogs();
    const filtered = logs.filter(l => l.id !== id);
    this.saveLogs(filtered);
  }

  async exportData() {
    return {
      logs: this.getStoredLogs(),
      user: await this.getUser(),
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
    };
  }

  async importData(data: any) {
    if (data.logs && Array.isArray(data.logs)) {
      this.saveLogs(data.logs);
    }
  }
}

export const localAdapter = new LocalStorageAdapter();
