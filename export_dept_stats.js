import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: profiles, error: err1 } = await supabase.from('profiles').select('*');
  if (err1) {
    console.error("Error fetching profiles:", err1);
    return;
  }

  const { data: teamMembers, error: err2 } = await supabase.from('team_members').select('student_id');
  if (err2) {
    console.error("Error fetching team members:", err2);
    return;
  }

  const inTeamSet = new Set(teamMembers.map(tm => tm.student_id));

  // Initialize stats object
  const stats = {};
  
  // Initialize Excel data by year
  const excelData = {
    '1': [],
    '2': [],
    '3': [],
    '4': []
  };

  profiles.forEach(p => {
    let dept = (p.department || 'Unknown').toUpperCase().trim();
    
    // Normalize some common department names if needed
    if (dept.includes('COMPUTER SCIENCE') || dept === 'CSE') dept = 'CSE';
    if (dept.includes('ELECTRONICS') && dept.includes('COMMUNICATION') || dept === 'ECE') dept = 'ECE';
    if (dept.includes('ARTIFICIAL INTELLIGENCE') || dept === 'AIE' || dept === 'AI') dept = 'AI/AIE';
    if (dept.includes('CYBER SECURITY') || dept === 'CYS') dept = 'CYS';
    if (dept.includes('MECHANICAL') || dept === 'MECH') dept = 'MECH';

    const year = p.year_of_study ? p.year_of_study.toString() : 'Unknown';
    const isInTeam = inTeamSet.has(p.id);
    const teamStatus = isInTeam ? 'In a team' : 'not in a team';

    // Update stats
    if (!stats[dept]) stats[dept] = {};
    if (!stats[dept][year]) stats[dept][year] = 0;
    stats[dept][year]++;

    // Add to Excel data if it's year 1-4
    if (['1', '2', '3', '4'].includes(year)) {
      excelData[year].push({
        'Name': p.full_name,
        'Roll No': p.roll_no,
        'College Email': p.college_email,
        'Department': dept,
        'Team Status': teamStatus
      });
    }
  });

  // Print stats report
  console.log("--- REGISTRATION COUNT BY DEPARTMENT & YEAR ---");
  const sortedDepts = Object.keys(stats).sort();
  for (const dept of sortedDepts) {
    console.log(`\n${dept}`);
    const years = Object.keys(stats[dept]).sort();
    for (const year of years) {
      console.log(`${year}st/nd/rd/th yr: ${stats[dept][year]} students`);
    }
  }

  // Create Excel workbook
  const wb = xlsx.utils.book_new();
  
  const yearNames = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };
  
  for (const year of ['1', '2', '3', '4']) {
    // Sort by department, then name
    excelData[year].sort((a, b) => {
      if (a.Department < b.Department) return -1;
      if (a.Department > b.Department) return 1;
      if (a.Name < b.Name) return -1;
      if (a.Name > b.Name) return 1;
      return 0;
    });

    const ws = xlsx.utils.json_to_sheet(excelData[year]);
    xlsx.utils.book_append_sheet(wb, ws, yearNames[year]);
  }

  xlsx.writeFile(wb, 'DepartmentWiseRegistrations.xlsx');
  console.log("\nExcel file created: DepartmentWiseRegistrations.xlsx");
}

run();
