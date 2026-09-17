import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createBrowserClient<Database>(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseAnonKey || 'dummy'
);
