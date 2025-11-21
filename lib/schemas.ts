import { z } from 'zod';

// Compound schema
export const compoundSchema = z.object({
  name: z.string().min(1, 'Compound name is required'),
  dose: z.string().min(1, 'Dose is required'),
});

export type Compound = z.infer<typeof compoundSchema>;

// Tag groups
export const COGNITIVE_TAGS = [
  'Flow State',
  'Brain Fog',
  'Sharp',
  'Distracted',
  'Motivation',
  'Creative',
] as const;

export const PHYSICAL_TAGS = [
  'High Energy',
  'Jittery',
  'Headache',
  'Nausea',
  'Insomnia',
  'Muscle Tension',
] as const;

export const MOOD_TAGS = [
  'Anxious',
  'Calm',
  'Irritable',
  'Euphoric',
  'Social',
  'Numb',
] as const;

// Log entry schema
export const logEntrySchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  occurred_at: z.string().datetime(),
  compounds: z.array(compoundSchema),
  sentiment_score: z.number().int().min(1).max(5).nullable(),
  tags_cognitive: z.array(z.enum(COGNITIVE_TAGS)),
  tags_physical: z.array(z.enum(PHYSICAL_TAGS)),
  tags_mood: z.array(z.enum(MOOD_TAGS)),
  notes: z.string().optional().nullable(),
});

export type LogEntry = z.infer<typeof logEntrySchema>;

// Log entry insert/update schema (without server-generated fields)
export const logEntryInsertSchema = logEntrySchema.omit({
  id: true,
  user_id: true,
});

export type LogEntryInsert = z.infer<typeof logEntryInsertSchema>;

// Sentiment ratings
export const SENTIMENT_OPTIONS = [
  { value: 1, emoji: '😡', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Excellent' },
] as const;
