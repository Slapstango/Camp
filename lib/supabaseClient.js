import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Sanity checks
if (!supabaseUrl) console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseKey) console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;