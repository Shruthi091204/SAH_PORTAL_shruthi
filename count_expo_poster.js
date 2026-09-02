import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function parseRollNo(rollNo) {
  if (!rollNo) return { dept: 'Unknown', year: 'Unknown' };
  const match = rollNo.toUpperCase().match(/([A-Z]+)(\d{2})\d{3}$/);
  if (match) {
    let dept = match[1];
    const yr = match[2];
    let yearStr = `Batch 20${yr}`;
    if (yr === '23') yearStr = '4th Year';
    if (yr === '24') yearStr = '3rd Year';
    if (yr === '25') yearStr = '2nd Year';
    if (yr === '26') yearStr = '1st Year';
    
    if (dept === 'CYS') dept = 'CSE CYS';
    if (dept === 'AIE' || dept === 'AI') dept = 'CSE AI';
    
    return { dept, year: yearStr };
  }
  return { dept: 'Unknown', year: 'Unknown' };
}

async function run() {
  const { data: posters } = await supabase.from('poster_presentations').select('*');
  const { data: expos } = await supabase.from('project_expo_registrations').select('*');

  const posterCounts = {};
  posters.forEach(p => {
    const { dept, year } = parseRollNo(p.author_roll);
    if (!posterCounts[dept]) posterCounts[dept] = {};
    if (!posterCounts[dept][year]) posterCounts[dept][year] = 0;
    posterCounts[dept][year]++;
  });

  const expoCounts = {};
  let totalExpoProjects = expos.length;
  const addExpoStudent = (roll) => {
    if (!roll) return;
    const { dept, year } = parseRollNo(roll);
    if (!expoCounts[dept]) expoCounts[dept] = {};
    if (!expoCounts[dept][year]) expoCounts[dept][year] = 0;
    expoCounts[dept][year]++;
  };

  expos.forEach(e => {
    addExpoStudent(e.leader_roll);
    addExpoStudent(e.member_2_roll);
    addExpoStudent(e.member_3_roll);
  });

  console.log("--- POSTER PRESENTATIONS COUNT ---");
  for (const dept of Object.keys(posterCounts).sort()) {
    console.log(`\n${dept}`);
    for (const year of Object.keys(posterCounts[dept]).sort()) {
      console.log(`${year}: ${posterCounts[dept][year]} students`);
    }
  }

  console.log("\n--- PROJECT EXPO COUNT (STUDENTS BY DEPT) ---");
  for (const dept of Object.keys(expoCounts).sort()) {
    console.log(`\n${dept}`);
    for (const year of Object.keys(expoCounts[dept]).sort()) {
      console.log(`${year}: ${expoCounts[dept][year]} students`);
    }
  }
  
  console.log(`\nTotal Expo Projects Registered: ${totalExpoProjects}`);
  console.log(`Total Poster Presentations Registered: ${posters.length}`);
}
run();
