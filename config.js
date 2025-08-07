// Supabase Configuration
// Replace these with your actual Supabase credentials from your project settings
const SUPABASE_URL = 'https://ardwcshtrgeqlkgkecxn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZHdjc2h0cmdlcWxrZ2tlY3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzYwMTYsImV4cCI6MjA3MDExMjAxNn0.VmWnYKVFG5UOjpg4fPG_3ahI83PxmsJBzYjhavcZTKo';

// Export for use in other files
window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
}; 