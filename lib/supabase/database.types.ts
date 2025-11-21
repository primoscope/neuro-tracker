export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      logs: {
        Row: {
          id: string
          user_id: string
          created_at: string
          occurred_at: string
          compounds: Json
          sentiment_score: number | null
          tags_cognitive: string[]
          tags_physical: string[]
          tags_mood: string[]
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          occurred_at?: string
          compounds?: Json
          sentiment_score?: number | null
          tags_cognitive?: string[]
          tags_physical?: string[]
          tags_mood?: string[]
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          occurred_at?: string
          compounds?: Json
          sentiment_score?: number | null
          tags_cognitive?: string[]
          tags_physical?: string[]
          tags_mood?: string[]
          notes?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
