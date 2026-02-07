import { createClient } from '@supabase/supabase-js'
import { MockSupabaseClient, isMockMode } from './mock-data'

export function createAdminClient() {
  if (isMockMode) {
    return new MockSupabaseClient() as unknown as ReturnType<typeof createClient>
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
