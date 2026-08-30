import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function cleanUpOrphanedInvitations() {
  console.log('Fetching accepted team invitations...');
  const { data: invitations, error: reqErr } = await supabase
    .from('team_invitations')
    .select('id, team_id, student_id')
    .eq('status', 'ACCEPTED');

  if (reqErr) throw reqErr;
  console.log(`Found ${invitations.length} accepted invitations.`);

  console.log('Fetching current team members...');
  const { data: members, error: memErr } = await supabase
    .from('team_members')
    .select('team_id, student_id');

  if (memErr) throw memErr;

  const memberSet = new Set(members.map(m => `${m.team_id}-${m.student_id}`));

  let fixedCount = 0;
  for (const inv of invitations) {
    if (!memberSet.has(`${inv.team_id}-${inv.student_id}`)) {
      console.log(`Orphaned invitation found: ${inv.id} (student: ${inv.student_id}, team: ${inv.team_id})`);
      const { error: updateErr } = await supabase
        .from('team_invitations')
        .update({ status: 'DECLINED' })
        .eq('id', inv.id);
      
      if (updateErr) console.error('Failed to update:', updateErr);
      else fixedCount++;
    }
  }
  
  console.log(`Fixed ${fixedCount} orphaned team invitations.`);
}

cleanUpOrphanedInvitations();
