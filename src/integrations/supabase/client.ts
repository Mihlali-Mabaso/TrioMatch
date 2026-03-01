import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddeldfqrjmlkrumrauhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZWxkZnFyam1sa3J1bXJhdWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjE1MTQsImV4cCI6MjA4Nzc5NzUxNH0.fYC5grkuVnYDUYGOpMU50rxtc7y6A-Qje6x-2sLQoGs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
