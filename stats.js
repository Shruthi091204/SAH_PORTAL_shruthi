import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: students, error: err1 } = await supabase.from('profiles').select('id, department').eq('role', 'student');
  const { data: teamMembers, error: err2 } = await supabase.from('team_members').select('student_id');

  if(err1) console.error(err1);
  if(err2) console.error(err2);

  const deptCounts = {};
  students.forEach(s => {
    const dept = s.department || 'Unknown';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });
  
  const assignedSet = new Set(teamMembers.map(tm => tm.student_id));
  const assignedCount = students.filter(s => assignedSet.has(s.id)).length;
  const unassignedCount = students.length - assignedCount;

  console.log(JSON.stringify({
    totalStudents: students.length,
    assignedCount,
    unassignedCount,
    deptCounts
  }, null, 2));
}

run();
