// supabase.js

const supabaseUrl = 'https://otujulkbkccsxuknkung.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWp1bGtia2Njc3h1a25rdW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI3MzIsImV4cCI6MjA2Nzc2ODczMn0.MSHdM3AWZ0SMyJwjeMBAMLeUJYSy4I_nqpSy02vDhm4';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseClient = supabase;
