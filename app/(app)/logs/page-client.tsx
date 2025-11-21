'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Cloud, HardDrive } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SmartLogger } from '@/components/logs/SmartLogger';
import { LogHistory } from '@/components/logs/LogHistory';
import { useStorage } from '@/lib/storage';
import { LogEntry } from '@/lib/schemas';

export default function LogsPageClient() {
  const { adapter, mode, isReady } = useStorage();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!isReady) return;
      
      // Check auth
      const currentUser = await adapter.getUser?.();
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      
      setUser(currentUser);
      
      // Load logs
      const userLogs = await adapter.getLogs(20);
      setLogs(userLogs);
      setLoading(false);
    };
    
    loadData();
  }, [adapter, isReady, router]);

  const handleLogout = async () => {
    if (adapter.signOut) {
      await adapter.signOut();
    }
    router.push('/auth');
    router.refresh();
  };

  const handleLogCreated = (newLog: LogEntry) => {
    setLogs([newLog, ...logs]);
  };

  const handleLogUpdated = (updatedLog: LogEntry) => {
    setLogs(logs.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  if (!isReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-500">NeuroStack</h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              {mode === 'local' ? (
                <>
                  <HardDrive className="w-3 h-3" />
                  Local Storage
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3" />
                  Cloud Sync
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoggerOpen(true)}
              className="hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Log
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Smart Logger Form */}
        {isLoggerOpen && (
          <Card className="glass border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Log Your Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <SmartLogger
                onLogCreated={handleLogCreated}
                onLogUpdated={handleLogUpdated}
                onCancel={() => setIsLoggerOpen(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card className="glass border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <LogHistory logs={logs} />
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button for mobile */}
      <button
        onClick={() => setIsLoggerOpen(true)}
        className="fab sm:hidden"
        aria-label="Create new log"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
