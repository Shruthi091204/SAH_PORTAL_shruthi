import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runPurge() {
  console.log('Fetching existing OTP records (with pagination)...');
  
  let allData = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.from('registration_otps').select('id, form_data').range(from, from + PAGE_SIZE - 1);
    if (error) {
      console.error('Error fetching OTP records:', error);
      return;
    }

    if (data && data.length > 0) {
      allData = [...allData, ...data];
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        from += PAGE_SIZE;
      }
    } else {
      hasMore = false;
    }
  }
  
  let purgedCount = 0;
  console.log(`Found ${allData.length} total records. Inspecting for passwords...`);
  
  for (const record of allData) {
    if (record.form_data && (record.form_data.password || record.form_data.confirmPassword)) {
      const safeData = { ...record.form_data };
      delete safeData.password;
      delete safeData.confirmPassword;
      
      const { error: updateErr } = await supabase
        .from('registration_otps')
        .update({ form_data: safeData })
        .eq('id', record.id);
        
      if (updateErr) {
        console.error(`Error updating record ${record.id}:`, updateErr);
      } else {
        purgedCount++;
      }
    }
  }
  
  console.log(`Purged plain-text passwords from ${purgedCount} records.`);
}

runPurge();
