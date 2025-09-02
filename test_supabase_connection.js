// Test Supabase connection and table access
const supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url, 
    window.SUPABASE_CONFIG.anonKey
);

async function testSupabaseConnection() {
    console.log('Testing Supabase connection...');
    
    try {
        // Test 1: Basic connection
        console.log('Test 1: Basic connection test');
        const { data, error } = await supabase
            .from('waitlist')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('Connection test failed:', error);
            return false;
        } else {
            console.log('Connection test passed:', data);
        }
        
        // Test 2: Insert test (with a test email)
        console.log('Test 2: Insert test');
        const testEmail = 'test-' + Date.now() + '@example.com';
        const { data: insertData, error: insertError } = await supabase
            .from('waitlist')
            .insert([{ email: testEmail, source: 'connection_test' }]);
        
        if (insertError) {
            console.error('Insert test failed:', insertError);
            return false;
        } else {
            console.log('Insert test passed:', insertData);
            
            // Clean up test data
            await supabase
                .from('waitlist')
                .delete()
                .eq('email', testEmail);
            console.log('Test data cleaned up');
        }
        
        return true;
    } catch (err) {
        console.error('Exception during test:', err);
        return false;
    }
}

// Run test when page loads
document.addEventListener('DOMContentLoaded', function() {
    testSupabaseConnection().then(success => {
        if (success) {
            console.log('✅ Supabase connection test passed');
        } else {
            console.log('❌ Supabase connection test failed');
        }
    });
});
