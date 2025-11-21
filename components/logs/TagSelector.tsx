'use client';

import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';

interface TagSelectorProps<T extends readonly string[]> {
  label: string;
  tags: T;
  selected: T[number][];
  onChange: (selected: T[number][]) => void;
}

export function TagSelector<T extends readonly string[]>({ label, tags, selected, onChange }: TagSelectorProps<T>) {
  const handleToggle = (tag: T[number]) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Toggle
            key={tag}
            pressed={selected.includes(tag)}
            onPressedChange={() => handleToggle(tag)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selected.includes(tag)
                ? 'bg-blue-500 text-white border-blue-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            } border`}
          >
            {tag}
          </Toggle>
        ))}
      </div>
    </div>
  );
}
