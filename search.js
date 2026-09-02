import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const emailToCheck = 'ch.en.u4cce26020@ch.students.amrita.edu';
  
  const { data: exactMatch } = await supabase
    .from('profiles')
    .select('*')
    .or(`email.eq.${emailToCheck},college_email.eq.${emailToCheck}`);
    
  if (exactMatch && exactMatch.length > 0) {
    console.log(`Found ${emailToCheck}:`, exactMatch.map(u => u.full_name || u.email));
  } else {
    console.log(`${emailToCheck} NOT FOUND.`);
  }

  const { data: jabili } = await supabase
    .from('profiles')
    .select('*')
    .or('email.ilike.%jabili1416%,college_email.ilike.%jabili1416%,full_name.ilike.%jabili%');

  if (jabili && jabili.length > 0) {
    console.log(`Found jabili:`, jabili.map(u => ({ name: u.full_name, email: u.email, college: u.college_email })));
  } else {
    console.log(`jabili NOT FOUND.`);
  }
}

run();
