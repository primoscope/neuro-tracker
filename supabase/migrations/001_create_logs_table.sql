-- Create logs table
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    compounds JSONB NOT NULL DEFAULT '[]'::jsonb,
    sentiment_score INTEGER CHECK (sentiment_score BETWEEN 1 AND 5),
    tags_cognitive TEXT[] NOT NULL DEFAULT '{}'::text[],
    tags_physical TEXT[] NOT NULL DEFAULT '{}'::text[],
    tags_mood TEXT[] NOT NULL DEFAULT '{}'::text[],
    notes TEXT
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS logs_occurred_at_idx ON public.logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS logs_user_occurred_idx ON public.logs(user_id, occurred_at DESC);

-- Enable Row Level Security
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view only their own logs
CREATE POLICY "Users can view own logs"
    ON public.logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert only their own logs
CREATE POLICY "Users can insert own logs"
    ON public.logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update only their own logs
CREATE POLICY "Users can update own logs"
    ON public.logs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own logs
CREATE POLICY "Users can delete own logs"
    ON public.logs
    FOR DELETE
    USING (auth.uid() = user_id);
