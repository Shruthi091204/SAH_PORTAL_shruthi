import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: students, error: err1 } = await supabase
    .from('profiles')
    .select('college_email, email')
    .eq('role', 'student');

  if(err1) {
    console.error(err1);
    return;
  }

  // Use college_email if available, fallback to regular email just in case
  const emails = students.map(s => s.college_email || s.email).filter(Boolean);
  
  const part1 = emails.slice(0, 450).join(',\n');
  const part2 = emails.slice(450).join(',\n');
  
  const basePath = 'C:\\Users\\anand\\.gemini\\antigravity-ide\\brain\\3288727b-537e-4752-870e-f79e173c97f1';

  fs.writeFileSync(path.join(basePath, 'student_college_emails_part1.txt'), part1);
  fs.writeFileSync(path.join(basePath, 'student_college_emails_part2.txt'), part2);
  
  console.log(`Successfully exported ${emails.length} emails into 2 files (450 in Part 1, ${emails.length - 450} in Part 2).`);
}

run();
