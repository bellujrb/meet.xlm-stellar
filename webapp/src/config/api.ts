// API Configuration
// Set this to your Supabase project URL
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fmyubhvjgjsnltlgpmkz.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables in production
if (import.meta.env.PROD) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.error('⚠️ VITE_SUPABASE_URL is not set. Please configure it in Vercel environment variables.');
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('⚠️ VITE_SUPABASE_ANON_KEY is not set. Please configure it in Vercel environment variables.');
  }
}

export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

