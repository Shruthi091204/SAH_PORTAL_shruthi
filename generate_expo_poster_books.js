import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function parseRollNo(rollNo) {
  if (!rollNo) return { dept: 'Unknown Dept', year: 'Unknown Year' };
  
  // Example: CH.SC.U4CSE25127
  // Matches "CSE", "25"
  const match = rollNo.toUpperCase().match(/([A-Z]+)(\d{2})\d{3}$/);
  
  if (match) {
    const dept = match[1];
    const yr = match[2];
    
    let yearStr = `Batch 20${yr}`;
    if (yr === '23') yearStr = '4th Year';
    if (yr === '24') yearStr = '3rd Year';
    if (yr === '25') yearStr = '2nd Year';
    if (yr === '26') yearStr = '1st Year';
    
    if (dept === 'VID') {
      return { dept: 'MTECH VLSI', year: yearStr };
    }
    
    return { dept, year: yearStr };
  }
  
  return { dept: 'Unknown Dept', year: 'Unknown Year' };
}

async function run() {
  const { data: posters, error: err1 } = await supabase.from('poster_presentations').select('*');
  const { data: expos, error: err2 } = await supabase.from('project_expo_registrations').select('*');

  if (err1 || err2) {
    console.error("DB Error:", err1 || err2);
    return;
  }

  // 1. Process Poster Presentations
  const posterDepts = {};
  
  posters.forEach(p => {
    const { dept, year } = parseRollNo(p.author_roll);
    
    if (!posterDepts[dept]) posterDepts[dept] = {};
    if (!posterDepts[dept][year]) posterDepts[dept][year] = [];
    
    posterDepts[dept][year].push({
      'Roll No': p.author_roll || '',
      'Name': p.author_name || '',
      'Email': p.author_email || '',
      'Role': 'Author',
      'Poster Title': p.poster_title || '',
      'Track': p.track || '',
      'Faculty Mentor': p.faculty_mentor_name || ''
    });
  });

  // 2. Process Project Expo
  const expoDepts = {};
  
  const addExpoStudent = (roll, name, email, role, title, domain, mentor) => {
    if (!roll || !name) return; // Skip empty members
    
    const { dept, year } = parseRollNo(roll);
    
    if (!expoDepts[dept]) expoDepts[dept] = {};
    if (!expoDepts[dept][year]) expoDepts[dept][year] = [];
    
    expoDepts[dept][year].push({
      'Roll No': roll || '',
      'Name': name || '',
      'Email': email || '',
      'Role': role,
      'Project Title': title || '',
      'Domain': domain || '',
      'Faculty Mentor': mentor || ''
    });
  };

  expos.forEach(e => {
    addExpoStudent(e.leader_roll, e.leader_name, e.leader_email, 'Leader', e.project_title, e.domain, e.faculty_mentor_name);
    addExpoStudent(e.member_2_roll, e.member_2_name, '', 'Member 2', e.project_title, e.domain, e.faculty_mentor_name);
    addExpoStudent(e.member_3_roll, e.member_3_name, '', 'Member 3', e.project_title, e.domain, e.faculty_mentor_name);
  });

  // 3. Write Excel Files
  const baseOutDir = 'C:\\Users\\anand\\.gemini\\antigravity-ide\\brain\\3288727b-537e-4752-870e-f79e173c97f1';
  
  const writeBooks = (dataDict, folderName) => {
    const outDir = path.join(baseOutDir, folderName);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    for (const [dept, years] of Object.entries(dataDict)) {
      const workbook = xlsx.utils.book_new();

      for (const [year, studentList] of Object.entries(years)) {
        // Sort by Roll No
        studentList.sort((a, b) => a['Roll No'].localeCompare(b['Roll No']));
        
        const worksheet = xlsx.utils.json_to_sheet(studentList);
        
        // Sanitize sheet name
        let sheetName = year.replace(/[\\/?*\[\]:]/g, '').substring(0, 31);
        
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
      }

      const safeDeptName = dept.replace(/[\\/?*\[\]:]/g, '_');
      const filePath = path.join(outDir, `${safeDeptName}_Book.xlsx`);
      xlsx.writeFile(workbook, filePath);
    }
  };

  writeBooks(posterDepts, 'Poster_Presentation_Books');
  writeBooks(expoDepts, 'Project_Expo_Books');
  
  console.log("All Expo and Poster books generated successfully!");
}

run();
