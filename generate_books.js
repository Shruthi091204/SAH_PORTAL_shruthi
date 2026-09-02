import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: students, error: err1 } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student');

  const { data: teamMembers, error: err2 } = await supabase
    .from('team_members')
    .select('student_id');

  if (err1 || err2) {
    console.error("DB Error:", err1 || err2);
    return;
  }

  const teamSet = new Set(teamMembers.map(tm => tm.student_id));

  // Organize by department -> year -> students
  const departments = {};

  students.forEach(s => {
    const dept = s.department || 'Unknown';
    const year = s.year_of_study || 'Unknown Year';
    
    if (!departments[dept]) departments[dept] = {};
    if (!departments[dept][year]) departments[dept][year] = [];

    departments[dept][year].push({
      'Roll No': s.roll_no || '',
      'Name': s.full_name || '',
      'Personal Email': s.email || '',
      'College Email': s.college_email || '',
      'Gender': s.gender || '',
      'Phone': s.phone || '',
      'Team Status': teamSet.has(s.id) ? 'IN TEAM' : 'NOT IN TEAM'
    });
  });

  const outDir = 'C:\\Users\\anand\\.gemini\\antigravity-ide\\brain\\3288727b-537e-4752-870e-f79e173c97f1\\Department_Books';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Create Excel books
  for (const [dept, years] of Object.entries(departments)) {
    const workbook = xlsx.utils.book_new();

    for (const [year, studentList] of Object.entries(years)) {
      // Sort by Roll No
      studentList.sort((a, b) => a['Roll No'].localeCompare(b['Roll No']));
      
      const worksheet = xlsx.utils.json_to_sheet(studentList);
      
      // Sanitize sheet name (max 31 chars, no special chars)
      let sheetName = year.replace(/[\\/?*\[\]:]/g, '').substring(0, 31);
      
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    const safeDeptName = dept.replace(/[\\/?*\[\]:]/g, '_');
    const filePath = path.join(outDir, `${safeDeptName}_Book.xlsx`);
    xlsx.writeFile(workbook, filePath);
    console.log(`Generated: ${filePath}`);
  }
  
  console.log("All books generated successfully!");
}

run();
