'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CompoundAutocomplete } from './CompoundAutocomplete';
import { CompoundChip } from './CompoundChip';
import { TagSelector } from './TagSelector';
import { SentimentSelector } from './SentimentSelector';
import { COGNITIVE_TAGS, PHYSICAL_TAGS, MOOD_TAGS, Compound } from '@/lib/schemas';
import { Check, Copy, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

type Log = Database['public']['Tables']['logs']['Row'];

interface SmartLoggerProps {
  userId: string;
  onLogCreated: (log: Log) => void;
  onLogUpdated: (log: Log) => void;
  onCancel: () => void;
}

export function SmartLogger({ userId, onLogCreated, onLogUpdated, onCancel }: SmartLoggerProps) {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedCognitiveTags, setSelectedCognitiveTags] = useState<typeof COGNITIVE_TAGS[number][]>([]);
  const [selectedPhysicalTags, setSelectedPhysicalTags] = useState<typeof PHYSICAL_TAGS[number][]>([]);
  const [selectedMoodTags, setSelectedMoodTags] = useState<typeof MOOD_TAGS[number][]>([]);
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [occurredAt, setOccurredAt] = useState(() => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic
  const saveLog = useCallback(async () => {
    if (compounds.length === 0) return;

    setSaving(true);
    setSaveStatus('saving');

    const logData = {
      user_id: userId,
      occurred_at: new Date(occurredAt).toISOString(),
      compounds: JSON.parse(JSON.stringify(compounds)),
      sentiment_score: sentimentScore,
      tags_cognitive: selectedCognitiveTags,
      tags_physical: selectedPhysicalTags,
      tags_mood: selectedMoodTags,
      notes: notes || null,
    };

    try {
      if (currentLogId) {
        // Update existing log
        const updateData = {
          occurred_at: logData.occurred_at,
          compounds: logData.compounds,
          sentiment_score: logData.sentiment_score,
          tags_cognitive: logData.tags_cognitive,
          tags_physical: logData.tags_physical,
          tags_mood: logData.tags_mood,
          notes: logData.notes,
        };
        
        const response = await fetch('/api/logs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentLogId, ...updateData }),
        });
        
        if (!response.ok) throw new Error('Failed to update log');
        const data = await response.json();
        onLogUpdated(data);
      } else {
        // Create new log
        const response = await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        });
        
        if (!response.ok) throw new Error('Failed to create log');
        const data = await response.json();
        setCurrentLogId(data.id);
        onLogCreated(data);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving log:', error);
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
  }, [compounds, selectedCognitiveTags, selectedPhysicalTags, selectedMoodTags, sentimentScore, notes, occurredAt, currentLogId, userId, onLogCreated, onLogUpdated]);

  // Debounced auto-save
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (compounds.length > 0) {
        saveLog();
      }
    }, 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [compounds, selectedCognitiveTags, selectedPhysicalTags, selectedMoodTags, sentimentScore, notes, occurredAt, saveLog]);

  // Copy yesterday's log
  const copyYesterday = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.error('No previous log found');
        return;
      }

      // Pre-fill form with yesterday's data
      setCompounds(data.compounds as Compound[]);
      setSelectedCognitiveTags(data.tags_cognitive as typeof COGNITIVE_TAGS[number][]);
      setSelectedPhysicalTags(data.tags_physical as typeof PHYSICAL_TAGS[number][]);
      setSelectedMoodTags(data.tags_mood as typeof MOOD_TAGS[number][]);
      setSentimentScore(data.sentiment_score);
      // Don't copy notes to avoid duplication
      setNotes('');
      
      // Reset occurred_at to now
      const now = new Date();
      setOccurredAt(format(now, "yyyy-MM-dd'T'HH:mm"));
    } catch (error) {
      console.error('Error copying yesterday:', error);
    }
  };

  const handleAddCompound = (compound: Compound) => {
    setCompounds([...compounds, compound]);
  };

  const handleRemoveCompound = (index: number) => {
    setCompounds(compounds.filter((_, i) => i !== index));
  };

  const handleUpdateCompound = (index: number, updatedCompound: Compound) => {
    setCompounds(compounds.map((c, i) => (i === index ? updatedCompound : c)));
  };

  return (
    <div className="space-y-6">
      {/* Save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-slate-400">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Saved</span>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyYesterday}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Yesterday
        </Button>
      </div>

      {/* Compound Input */}
      <div className="space-y-3">
        <Label>Compounds</Label>
        <CompoundAutocomplete onAdd={handleAddCompound} />
        <div className="flex flex-wrap gap-2">
          {compounds.map((compound, index) => (
            <CompoundChip
              key={index}
              compound={compound}
              onRemove={() => handleRemoveCompound(index)}
              onUpdate={(updated) => handleUpdateCompound(index, updated)}
            />
          ))}
        </div>
      </div>

      {/* Occurred At */}
      <div className="space-y-2">
        <Label htmlFor="occurred_at">When did you take this?</Label>
        <Input
          id="occurred_at"
          type="datetime-local"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
        />
      </div>

      {/* Cognitive Tags */}
      <TagSelector
        label="Cognitive Effects"
        tags={COGNITIVE_TAGS}
        selected={selectedCognitiveTags}
        onChange={setSelectedCognitiveTags}
      />

      {/* Physical Tags */}
      <TagSelector
        label="Physical Effects"
        tags={PHYSICAL_TAGS}
        selected={selectedPhysicalTags}
        onChange={setSelectedPhysicalTags}
      />

      {/* Mood Tags */}
      <TagSelector
        label="Mood Effects"
        tags={MOOD_TAGS}
        selected={selectedMoodTags}
        onChange={setSelectedMoodTags}
      />

      {/* Sentiment Score */}
      <SentimentSelector value={sentimentScore} onChange={setSentimentScore} />

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any observations or additional context..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Close
        </Button>
        <Button
          onClick={saveLog}
          disabled={saving || compounds.length === 0}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
        >
          {saving ? 'Saving...' : currentLogId ? 'Update Log' : 'Save Log'}
        </Button>
      </div>
    </div>
  );
}
