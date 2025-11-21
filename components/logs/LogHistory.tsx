'use client';

import { LogEntry, SENTIMENT_OPTIONS, Compound } from '@/lib/schemas';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface LogHistoryProps {
  logs: LogEntry[];
}

export function LogHistory({ logs }: LogHistoryProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No logs yet. Start tracking your stack!</p>
      </div>
    );
  }

  const getSentimentColor = (score: number | null) => {
    if (!score) return 'bg-slate-700 border-slate-600';
    if (score >= 4) return 'bg-green-500/20 border-green-500/50';
    if (score === 3) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getSentimentEmoji = (score: number | null) => {
    if (!score) return '😐';
    return SENTIMENT_OPTIONS.find((s) => s.value === score)?.emoji || '😐';
  };

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const compounds = log.compounds as Compound[];
        const topCompounds = compounds.slice(0, 3);

        return (
          <div
            key={log.id}
            className={`p-4 rounded-lg border-2 ${getSentimentColor(
              log.sentiment_score
            )} hover:scale-[1.02] transition-transform cursor-pointer`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getSentimentEmoji(log.sentiment_score)}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-200">
                      {format(new Date(log.occurred_at), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-slate-400">
                      {format(new Date(log.occurred_at), 'h:mm a')}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {topCompounds.map((compound, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-full text-xs"
                    >
                      <span className="font-medium">{compound.name}</span>
                      {compound.dose && (
                        <span className="text-slate-400">({compound.dose})</span>
                      )}
                    </div>
                  ))}
                  {compounds.length > 3 && (
                    <div className="inline-flex items-center px-2 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
                      +{compounds.length - 3} more
                    </div>
                  )}
                </div>
                {log.notes && (
                  <p className="text-sm text-slate-400 line-clamp-2">{log.notes}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
