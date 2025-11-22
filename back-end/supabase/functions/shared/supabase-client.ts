import { createClient as createSupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

let _client: ReturnType<typeof createSupabaseClient> | null = null

export function getSupabaseClient() {
  if (_client) {
    return _client
  }

  // Try standard Supabase environment variables first, then fallback to custom ones
  const url = Deno.env.get("SUPABASE_URL") || Deno.env.get("DB_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY")

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL/DB_URL or SUPABASE_SERVICE_ROLE_KEY/SERVICE_ROLE_KEY")
  }

  _client = createSupabaseClient(url, serviceRoleKey)
  return _client
}

export function createSupabaseAnonClient() {
  // Try standard Supabase environment variables first, then fallback to custom ones
  const url = Deno.env.get("SUPABASE_URL") || Deno.env.get("DB_URL")
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("ANON_KEY")

  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL/DB_URL or SUPABASE_ANON_KEY/ANON_KEY")
  }

  return createSupabaseClient(url, anonKey)
}

