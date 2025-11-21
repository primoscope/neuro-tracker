import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogsPageClient from './page-client';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch initial logs for SSR
  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching logs:', error);
  }

  return <LogsPageClient initialLogs={logs || []} user={user} />;
}
