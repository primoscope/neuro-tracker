'use client';

import { Label } from '@/components/ui/label';
import { SENTIMENT_OPTIONS } from '@/lib/schemas';

interface SentimentSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function SentimentSelector({ value, onChange }: SentimentSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>How was your day overall?</Label>
      <div className="flex justify-between gap-2">
        {SENTIMENT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
              value === option.value
                ? 'border-blue-500 bg-blue-500/20 scale-110'
                : 'border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-3xl">{option.emoji}</span>
            <span className="text-xs text-slate-400">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
