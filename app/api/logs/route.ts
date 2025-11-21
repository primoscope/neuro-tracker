import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const logData = {
      user_id: body.user_id,
      occurred_at: body.occurred_at,
      compounds: body.compounds,
      sentiment_score: body.sentiment_score,
      tags_cognitive: body.tags_cognitive,
      tags_physical: body.tags_physical,
      tags_mood: body.tags_mood,
      notes: body.notes,
    };

    const { data, error } = await supabase
      .from('logs')
      .insert([logData] as any)
      .select()
      .single() as any;

    if (error) {
      console.error('Error creating log:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('logs')
      .update({
        occurred_at: updateData.occurred_at,
        compounds: updateData.compounds,
        sentiment_score: updateData.sentiment_score,
        tags_cognitive: updateData.tags_cognitive,
        tags_physical: updateData.tags_physical,
        tags_mood: updateData.tags_mood,
        notes: updateData.notes,
      } as any)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own logs
      .select()
      .single() as any;

    if (error) {
      console.error('Error updating log:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
