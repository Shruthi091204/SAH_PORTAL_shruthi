import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import * as xlsx from 'xlsx';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fetchAll(table) {
  let allData = [];
  let from = 0;
  const step = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, from + step - 1);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      break;
    }
    
    allData = allData.concat(data);
    
    if (data.length < step) {
      break;
    }
    
    from += step;
  }
  
  return allData;
}

async function backup() {
  console.log("Starting full database backup with pagination...");

  console.log("Fetching profiles...");
  const profiles = await fetchAll('profiles');

  console.log("Fetching teams...");
  const teams = await fetchAll('teams');

  console.log("Fetching team members...");
  const teamMembers = await fetchAll('team_members');

  // Save to JSON
  const backupData = {
    timestamp: new Date().toISOString(),
    profiles,
    teams,
    teamMembers
  };
  fs.writeFileSync('database_backup.json', JSON.stringify(backupData, null, 2));
  
  // Save to Excel
  console.log("Generating Excel file...");
  const wb = xlsx.utils.book_new();

  const profilesWS = xlsx.utils.json_to_sheet(profiles);
  xlsx.utils.book_append_sheet(wb, profilesWS, "Profiles");

  const teamsWS = xlsx.utils.json_to_sheet(teams);
  xlsx.utils.book_append_sheet(wb, teamsWS, "Teams");

  const membersWS = xlsx.utils.json_to_sheet(teamMembers);
  xlsx.utils.book_append_sheet(wb, membersWS, "Team Members");

  xlsx.writeFile(wb, "FullDatabaseBackup.xlsx");

  console.log(`Backup completed successfully! Saved ${profiles.length} profiles, ${teams.length} teams, and ${teamMembers.length} team members to 'database_backup.json' and 'FullDatabaseBackup.xlsx'.`);
}

backup().catch(console.error);
