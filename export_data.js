import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: teams, error: err1 } = await supabase.from('teams').select(`
    id, team_name, leader_id,
    leader:profiles!leader_id(college_email),
    team_members(
      profiles(full_name, gender, roll_no, college_email)
    )
  `);

  if (err1) {
    console.error("Error fetching teams:", err1);
    
    // Fallback: fetch separately if relations aren't configured ideally
    const { data: allTeams } = await supabase.from('teams').select('*');
    const { data: allMembers } = await supabase.from('team_members').select('*');
    const { data: allProfiles } = await supabase.from('profiles').select('*');
    
    let fullyReg = 0;
    let notSix = 0;
    const excel = [];
    const leaders = [];
    
    for (const t of allTeams) {
      const tMembers = allMembers.filter(m => m.team_id === t.id);
      if (tMembers.length !== 6) notSix++;
      
      const pMembers = tMembers.map(tm => allProfiles.find(p => p.id === tm.student_id)).filter(Boolean);
      const fCount = pMembers.filter(p => p.gender?.toLowerCase() === 'female').length;
      
      if (pMembers.length === 6 && fCount >= 1) {
        fullyReg++;
        pMembers.forEach(p => {
          excel.push({ "Team Name": t.team_name, "Member Name": p.full_name, "Gender": p.gender, "Roll No": p.roll_no, "College Email": p.college_email });
        });
      }
      
      const leader = allProfiles.find(p => p.id === t.leader_id);
      if (leader && leader.college_email) leaders.push(leader.college_email);
    }
    
    finish(fullyReg, notSix, excel, leaders);
    return;
  }

  let fullyRegisteredCount = 0;
  let notSixCount = 0;
  const leaderEmails = [];
  const excelData = [];

  for (const team of teams) {
    const members = team.team_members.map(tm => tm.profiles).filter(Boolean);
    
    if (members.length !== 6) {
      notSixCount++;
    }

    const femaleCount = members.filter(m => m.gender?.toLowerCase() === 'female').length;
    
    if (members.length === 6 && femaleCount >= 1) {
      fullyRegisteredCount++;
      // Add to excel data
      members.forEach(m => {
        excelData.push({
          "Team Name": team.team_name,
          "Member Name": m.full_name,
          "Gender": m.gender,
          "Roll No": m.roll_no,
          "College Email": m.college_email
        });
      });
    }

    if (team.leader && team.leader.college_email) {
      leaderEmails.push(team.leader.college_email);
    }
  }

  finish(fullyRegisteredCount, notSixCount, excelData, leaderEmails);
}

function finish(fullyReg, notSix, excel, leaders) {
  console.log(`Teams with 6 members and >= 1 female: ${fullyReg}`);
  console.log(`Teams that don't have 6 members: ${notSix}`);
  
  const ws = xlsx.utils.json_to_sheet(excel);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Fully Registered Teams");
  xlsx.writeFile(wb, "FullyRegisteredTeams.xlsx");

  console.log("Excel file generated at FullyRegisteredTeams.xlsx");
  
  import('fs').then(fs => {
    fs.writeFileSync('leader_emails.txt', leaders.join('\n'));
    console.log("Leader emails written to leader_emails.txt");
  });
}

run();
