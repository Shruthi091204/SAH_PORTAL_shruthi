import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load variables from the .env file in the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// =========================================================================
// SETUP: Automatically loaded from .env
// =========================================================================
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// You must add SUPABASE_SERVICE_ROLE_KEY to your .env file!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌ ERROR: Missing keys in your .env file!');
  console.error('Make sure your .env file contains:');
  console.error('VITE_SUPABASE_URL=your_url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key\n');
  process.exit(1);
}

// Create admin client that bypasses all security rules
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// =========================================================================
// USERS TO CREATE
// Add your 100 judges and admins here. They will instantly be created 
// with the password provided and their email will be auto-confirmed.
// =========================================================================
const usersToCreate = [
  {
    email: 'judge6@amrita.edu',
    password: 'SahJudge6@2026',
    full_name: 'Judge 6',
    department: 'CSE',
    role: 'judge'
  },
  {
    email: 'adminami@amrita.edu',
    password: 'SahAdminAmi@2026',
    full_name: 'Admin Ami',
    department: 'SAH Core',
    role: 'admin'
  }
];

async function bulkCreateUsers() {
  console.log(`\n🚀 Starting bulk creation of ${usersToCreate.length} users...\n`);
  
  let successCount = 0;
  let failCount = 0;

  for (const user of usersToCreate) {
    try {
      console.log(`Creating user: ${user.email} (${user.role})...`);
      
      // 1. Create the user in auth.users
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirms their email so they don't have to click a link
        user_metadata: {
          full_name: user.full_name,
          department: user.department,
          role: user.role
        }
      });

      if (authError) {
        console.error(`  ❌ Failed to create auth for ${user.email}: ${authError.message}`);
        failCount++;
        continue;
      }

      // 2. Wait a split second for the trigger in Supabase to create the profile row
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Force update the profile role using the admin client
      // (The admin client uses the service_role key, bypassing our security block trigger!)
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: user.role, full_name: user.full_name, department: user.department })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`  ❌ Failed to assign role ${user.role} to ${user.email}: ${profileError.message}`);
        failCount++;
      } else {
        console.log(`  ✅ Successfully created ${user.email} as ${user.role}!`);
        successCount++;
      }

    } catch (err) {
      console.error(`  ❌ Unexpected error for ${user.email}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Finished! Created: ${successCount} | Failed: ${failCount}\n`);
}

bulkCreateUsers();
