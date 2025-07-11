<!-- Adicione isso no seu index.html -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<script>
  const supabaseUrl = 'https://otujulkbkccsxuknkung.supabase.co'
  const supabaseKey =  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWp1bGtia2Njc3h1a25rdW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI3MzIsImV4cCI6MjA2Nzc2ODczMn0.MSHdM3AWZ0SMyJwjeMBAMLeUJYSy4I_nqpSy02vDhm4 // Substitua pela sua anon key do Supabase
  const supabase = supabase.createClient(supabaseUrl, supabaseKey)

  // Login com GitHub real
  document.getElementById('login-btn').addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
    if (error) console.error(error)
  })
</script>
