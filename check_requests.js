import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function checkRequests() {
  const { data, error } = await supabase
    .from('join_requests')
    .select('id, team_id, student_id, status, teams(team_name)');

  if (error) throw error;
  console.log('All join requests:', data);
}

checkRequests();
