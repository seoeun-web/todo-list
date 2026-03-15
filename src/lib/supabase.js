
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cqdrpnsfvzohzknzxgww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZHJwbnNmdnpvaHprbnp4Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDc4MDIsImV4cCI6MjA4OTEyMzgwMn0.Se1pycvUu2l6uD87a8XjaE3ubUaB9P0E-Y-RZogz24c';
export const supabase = createClient(supabaseUrl, supabaseKey)