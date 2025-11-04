// Supabase Configuration
// Alli Nutrition App project credentials
const SUPABASE_URL = 'https://rkkoppppcxvbdzudzijw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJra29wcHBwY3h2YmR6dWR6aWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDExNDcsImV4cCI6MjA3NTYxNzE0N30.oLg5LsMNfuyuN3Vd_E0d1MQBQ5autzX1ZczczpthsgM';

// Export for use in other files
window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
}; 