import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  || 'https://haxpxpyfunhomzinffnb.supabase.co';   // fallback to your URL

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn(
    '⚠️ NEXT_PUBLIC_SUPABASE_URL is not defined. Falling back to hard-coded URL.'
  );
}
if (!supabaseKey) {
  console.warn(
    '⚠️ NEXT_PUBLIC_SUPABASE_KEY is not defined. Supabase calls will 401.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey || '');
