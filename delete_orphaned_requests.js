import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function deleteOrphanedRequests() {
  console.log('Fetching declined join requests...');
  const { data: requests, error: reqErr } = await supabase
    .from('join_requests')
    .select('id, team_id, student_id')
    .eq('status', 'DECLINED');

  if (reqErr) throw reqErr;
  console.log(`Found ${requests.length} declined requests.`);

  console.log('Fetching current team members...');
  const { data: members, error: memErr } = await supabase
    .from('team_members')
    .select('team_id, student_id');

  if (memErr) throw memErr;

  const memberSet = new Set(members.map(m => `${m.team_id}-${m.student_id}`));

  let fixedCount = 0;
  for (const req of requests) {
    if (!memberSet.has(`${req.team_id}-${req.student_id}`)) {
      console.log(`Deleting request: ${req.id} (student: ${req.student_id}, team: ${req.team_id})`);
      const { error: updateErr } = await supabase
        .from('join_requests')
        .delete()
        .eq('id', req.id);
      
      if (updateErr) console.error('Failed to delete:', updateErr);
      else fixedCount++;
    }
  }
  
  console.log(`Deleted ${fixedCount} declined join requests.`);
}

deleteOrphanedRequests();
