import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('teams').select('recruitment_message').limit(1);
  if (error) {
    console.error('ERROR_OCCURRED:', error.message);
  } else {
    console.log('SUCCESS_DATA:', data);
  }
}

check();
