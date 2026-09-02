import { createClient } from '@supabase/supabase-js';
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
    return;
  }

  const incompleteLeaderEmails = [];

  for (const team of teams) {
    const members = team.team_members.map(tm => tm.profiles).filter(Boolean);
    const femaleCount = members.filter(m => m.gender?.toLowerCase() === 'female').length;
    
    // Check if the team is NOT full/fully registered
    if (members.length !== 6 || femaleCount === 0) {
      if (team.leader && team.leader.college_email) {
        incompleteLeaderEmails.push(team.leader.college_email);
      }
    }
  }

  import('fs').then(fs => {
    fs.writeFileSync('incomplete_leader_emails.txt', incompleteLeaderEmails.join('\n'));
    console.log(`Found ${incompleteLeaderEmails.length} leaders with incomplete teams.`);
    console.log("Emails written to incomplete_leader_emails.txt");
  });
}

run();
