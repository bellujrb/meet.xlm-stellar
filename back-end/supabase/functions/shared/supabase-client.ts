import { createClient as createSupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

let _client: ReturnType<typeof createSupabaseClient> | null = null

export function getSupabaseClient() {
  if (_client) {
    return _client
  }

  const url = Deno.env.get("DB_URL")
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY")

  if (!url || !serviceRoleKey) {
    throw new Error("Missing DB_URL or SERVICE_ROLE_KEY")
  }

  _client = createSupabaseClient(url, serviceRoleKey)
  return _client
}

export function createSupabaseAnonClient() {
  const url = Deno.env.get("DB_URL")
  const anonKey = Deno.env.get("ANON_KEY")

  if (!url || !anonKey) {
    throw new Error("Missing DB_URL or ANON_KEY")
  }

  return createSupabaseClient(url, anonKey)
}

