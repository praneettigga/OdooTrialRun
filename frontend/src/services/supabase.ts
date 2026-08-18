import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

let client: SupabaseClient<Database> | undefined

export function getSupabase() {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.local.')
  }

  client = createClient<Database>(url, key)
  return client
}
