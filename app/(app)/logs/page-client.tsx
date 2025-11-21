'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { SmartLogger } from '@/components/logs/SmartLogger';
import { LogHistory } from '@/components/logs/LogHistory';

type Log = Database['public']['Tables']['logs']['Row'];

interface LogsPageClientProps {
  initialLogs: Log[];
  user: User;
}

export default function LogsPageClient({ initialLogs, user }: LogsPageClientProps) {
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleLogCreated = (newLog: Log) => {
    setLogs([newLog, ...logs]);
  };

  const handleLogUpdated = (updatedLog: Log) => {
    setLogs(logs.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-500">NeuroStack</h1>
            <p className="text-sm text-slate-400">Track your stack</p>
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
                userId={user.id}
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
