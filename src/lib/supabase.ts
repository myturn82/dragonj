import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uzjdnbdkdlkbshmvsnxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6amRuYmRrZGxrYnNobXZzbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDkwOTksImV4cCI6MjA2MTM4NTA5OX0.nsjrSI_AZe2BkwmG5RTZyDE7FF1JrDoQGK3k7IN82uQ';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}); 