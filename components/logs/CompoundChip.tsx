'use client';

import { useState } from 'react';
import { Compound } from '@/lib/schemas';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface CompoundChipProps {
  compound: Compound;
  onRemove: () => void;
  onUpdate: (compound: Compound) => void;
}

const DOSE_PRESETS = ['25mg', '50mg', '100mg', '200mg', '500mg', '1g'];

export function CompoundChip({ compound, onRemove, onUpdate }: CompoundChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customDose, setCustomDose] = useState(compound.dose);

  const handleDoseSelect = (dose: string) => {
    onUpdate({ ...compound, dose });
    setIsOpen(false);
  };

  const handleCustomDose = () => {
    if (customDose.trim()) {
      onUpdate({ ...compound, dose: customDose.trim() });
      setIsOpen(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-sm">
      <span className="font-medium">{compound.name}</span>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`px-2 py-0.5 rounded ${
              compound.dose
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            } transition-colors text-xs`}
          >
            {compound.dose || 'Set dose'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 glass border-slate-700">
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-300">Quick select</div>
            <div className="grid grid-cols-3 gap-2">
              {DOSE_PRESETS.map((dose) => (
                <Button
                  key={dose}
                  type="button"
                  size="sm"
                  variant={compound.dose === dose ? 'default' : 'outline'}
                  onClick={() => handleDoseSelect(dose)}
                  className="h-8"
                >
                  {dose}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Custom dose</div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., 150mg"
                  value={customDose}
                  onChange={(e) => setCustomDose(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomDose()}
                  className="h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCustomDose}
                  className="h-8"
                >
                  Set
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
