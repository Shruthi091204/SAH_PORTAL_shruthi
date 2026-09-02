# Implementation Plan: Secure Password Reset Vulnerability

## Goal
The current RPC function `reset_user_password_by_email` allows anyone to change any user's password using just their email, bypassing the OTP requirement entirely. We need to lock down the `password_resets` table and replace the vulnerable RPC with a secure one that internally verifies the OTP before updating the password.

## User Review Required
> [!CAUTION]
> This plan will permanently drop the old vulnerable RPC function and replace it with a secure one. It also enables Row Level Security on the `password_resets` table to prevent attackers from reading other users' OTPs.

## Proposed Changes

### 1. Database Security (SQL)
I will provide a SQL script for you to run in the Supabase SQL Editor. This script will:
- **Drop** the vulnerable `reset_user_password_by_email` function.
- **Create** a new secure function named `secure_reset_password(p_email, p_otp, p_new_password)`. This function will securely run on the server, check if the OTP exists and is unexpired for the given email, update the password in `auth.users`, and immediately delete the OTP record.
- **Enable RLS** on the `password_resets` table, blocking all direct `SELECT`, `INSERT`, `UPDATE`, and `DELETE` requests from the public internet.

### 2. Frontend Updates

#### [MODIFY] `src/context/AuthContext.jsx`
I will replace the two-step insecure reset process (verifying OTP via direct query, then calling the old RPC) with a single, atomic call to the new secure RPC:
```javascript
const { data: rpcData, error: rpcErr } = await supabase.rpc('secure_reset_password', {
  p_email: primaryEmail,
  p_otp: cleanToken,
  p_new_password: newPassword
});
```

## Verification Plan
- Verify that calling the old vulnerable endpoint returns a 404/Not Found error.
- Verify that running a standard password reset flow via the portal UI works successfully.
