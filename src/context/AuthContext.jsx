import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No profile yet — user just signed up
          return null;
        }
        throw fetchError;
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === 'SIGNED_IN' && newSession?.user) {
          const userProfile = await fetchProfile(newSession.user.id);
          setProfile(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Sign up with email + password, then create profile (Students only through portal)
  const signUp = async ({ email, collegeEmail, password, rollNo, fullName, gender, department, skills, phone, yearOfStudy, githubUrl, linkedinUrl }) => {
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanCollegeEmail = collegeEmail ? collegeEmail.trim().toLowerCase() : '';
      const cleanRollNo = rollNo ? rollNo.trim().toUpperCase() : null;
      const cleanPhone = phone ? phone.trim() : null;
      const skillsArray = Array.isArray(skills) ? skills : [];
      const userRole = 'student';

      // 1. Double check uniqueness: Check Roll No
      if (cleanRollNo) {
        const { data: existingRoll } = await supabase
          .from('profiles')
          .select('id')
          .ilike('roll_no', cleanRollNo)
          .maybeSingle();

        if (existingRoll) {
          throw new Error(`Roll Number "${cleanRollNo}" is already registered. Please check your roll number or log in.`);
        }
      }

      // 2. Double check uniqueness: Check College Email
      if (cleanCollegeEmail) {
        const { data: existingCollege } = await supabase
          .from('profiles')
          .select('id')
          .ilike('college_email', cleanCollegeEmail)
          .maybeSingle();

        if (existingCollege) {
          throw new Error(`College Mail ID "${cleanCollegeEmail}" is already registered. Please log in or use a different email.`);
        }
      }

      // 3. Double check uniqueness: Check Personal Email
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (existingEmail) {
        throw new Error(`Email address "${cleanEmail}" is already registered. Please log in instead.`);
      }

      // 4. Create auth user with complete user metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            roll_no: cleanRollNo,
            college_email: cleanCollegeEmail,
            gender: gender || 'Male',
            department: department || 'CSE',
            role: userRole,
            skills: skillsArray,
            phone: cleanPhone,
            year_of_study: yearOfStudy || null,
            github_url: githubUrl ? githubUrl.trim() : null,
            linkedin_url: linkedinUrl ? linkedinUrl.trim() : null
          }
        }
      });

      if (authError) throw authError;

      // In Supabase, if user already exists, GoTrue returns a user with empty identities
      if (authData?.user && authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }

      // 5. Automatically log the user in immediately
      if (authData?.user) {
        const { data: loginData } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        const activeUserId = loginData?.user?.id || authData.user.id;

        // 6. Directly update/ensure all profile fields are explicitly saved in PostgreSQL profiles table
        const profilePayload = {
          full_name: fullName.trim(),
          roll_no: cleanRollNo,
          college_email: cleanCollegeEmail,
          email: cleanEmail,
          gender: gender || 'Male',
          department: department || 'CSE',
          role: userRole,
          skills: skillsArray,
          phone: cleanPhone,
          year_of_study: yearOfStudy || null,
          github_url: githubUrl ? githubUrl.trim() : null,
          linkedin_url: linkedinUrl ? linkedinUrl.trim() : null
        };

        const { error: updateErr } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', activeUserId);

        if (updateErr) {
          console.warn('Profile direct sync note:', updateErr);
        }

        const userProfile = await fetchProfile(activeUserId);
        if (userProfile) setProfile(userProfile);
      }

      return { data: authData, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Sign in with personal email OR college mail ID + password
  const signIn = async ({ email, password }) => {
    setError(null);
    try {
      const cleanInput = email.trim().toLowerCase();
      let authEmail = cleanInput;

      // Check if user entered a College Mail ID instead of primary Auth email
      const { data: matchedProfile } = await supabase
        .from('profiles')
        .select('email')
        .ilike('college_email', cleanInput)
        .maybeSingle();

      if (matchedProfile?.email) {
        authEmail = matchedProfile.email;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
      }

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Sign out
  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (!signOutError) {
      setProfile(null);
      setSession(null);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    const userId = session?.user?.id || profile?.id;
    if (!userId) return { error: new Error('Not authenticated') };

    // Prevent role escalation: ensure students cannot change their role
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates.role;

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('Update profile error:', err);
      return { data: null, error: err };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (session?.user) {
      const userProfile = await fetchProfile(session.user.id);
      setProfile(userProfile);
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => profile?.role === role;

  // Check if user is a team leader
  const isTeamLeader = useCallback(async () => {
    if (!profile) return false;
    const { data } = await supabase
      .from('teams')
      .select('id')
      .eq('leader_id', profile.id)
      .limit(1);
    return data && data.length > 0;
  }, [profile]);

  // Reset password 6-digit OTP email trigger (Prioritizes College Mail ID if available)
  const resetPasswordForEmail = async (emailInput) => {
    setError(null);
    try {
      const cleanInput = emailInput.trim().toLowerCase();

      // 1. Check if user profile exists (search by personal email or college email)
      let userProfile = null;
      const { data: byPersonal } = await supabase
        .from('profiles')
        .select('id, email, college_email')
        .ilike('email', cleanInput)
        .maybeSingle();

      if (byPersonal) {
        userProfile = byPersonal;
      } else {
        const { data: byCollege } = await supabase
          .from('profiles')
          .select('id, email, college_email')
          .ilike('college_email', cleanInput)
          .maybeSingle();

        if (byCollege) {
          userProfile = byCollege;
        }
      }

      if (!userProfile) {
        throw new Error('No account found with this email address or College Mail ID.');
      }

      // Priority: Send to College Mail ID if present, otherwise Personal Email
      const hasCollegeEmail = !!(userProfile.college_email && userProfile.college_email.trim());
      const targetEmail = hasCollegeEmail ? userProfile.college_email.trim().toLowerCase() : userProfile.email.trim().toLowerCase();
      const primaryAuthEmail = userProfile.email.trim().toLowerCase();

      // 2. Generate and Send OTP code via Supabase Edge Function
      const { data: resData, error: invokeErr } = await supabase.functions.invoke('send-email', {
        body: { 
          email: targetEmail, 
          type: 'password_reset',
          targetEmail,
          primaryAuthEmail
        }
      });

      if (invokeErr || (resData && resData.error)) {
        throw new Error(invokeErr?.message || resData?.error || 'Failed to dispatch 6-digit OTP email.');
      }

      return {
        data: {
          targetEmail,
          primaryAuthEmail,
          isCollegeEmail: hasCollegeEmail
        },
        error: null
      };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Update password for logged in user
  const updatePassword = async (newPassword) => {
    setError(null);
    try {
      const { data, error: updateErr } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateErr) throw updateErr;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Verify 6-digit OTP code and update password
  const verifyOtpForPasswordReset = async ({ email, token, newPassword }) => {
    setError(null);
    try {
      const cleanInput = email.trim().toLowerCase();
      const cleanToken = token.trim();

      // Find user profile to resolve primary auth email
      let primaryEmail = cleanInput;
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email, college_email')
        .or(`email.ilike.${cleanInput},college_email.ilike.${cleanInput}`)
        .maybeSingle();

      if (userProfile?.email) {
        primaryEmail = userProfile.email;
      }

      // 1. Call Secure Backend RPC to verify OTP and reset password simultaneously
      const { data: rpcData, error: rpcErr } = await supabase.rpc('verify_otp_and_reset_password', {
        p_email: primaryEmail,
        p_otp: cleanToken,
        p_new_password: newPassword
      });

      if (rpcErr) {
        throw new Error(rpcErr.message || 'Database error occurred while resetting password.');
      }
      
      if (!rpcData || rpcData.success === false) {
        throw new Error(rpcData?.message || 'Invalid or expired 6-digit OTP code. Please check your email or request a new OTP.');
      }

      return { data: { success: true }, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Send 6-digit OTP code to College Mail ID for registration confirmation
  const sendRegistrationOtp = async (formData) => {
    setError(null);
    try {
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanCollegeEmail = formData.collegeEmail ? formData.collegeEmail.trim().toLowerCase() : '';
      const cleanRollNo = formData.rollNo ? formData.rollNo.trim().toUpperCase() : null;

      // 1. Uniqueness check: Roll No
      if (cleanRollNo) {
        const { data: existingRoll } = await supabase
          .from('profiles')
          .select('id')
          .ilike('roll_no', cleanRollNo)
          .maybeSingle();

        if (existingRoll) {
          throw new Error(`Roll Number "${cleanRollNo}" is already registered. Please check your roll number or log in.`);
        }
      }

      // 2. Uniqueness check: College Email
      if (cleanCollegeEmail) {
        const { data: existingCollege } = await supabase
          .from('profiles')
          .select('id')
          .ilike('college_email', cleanCollegeEmail)
          .maybeSingle();

        if (existingCollege) {
          throw new Error(`College Mail ID "${cleanCollegeEmail}" is already registered. Please log in or use a different email.`);
        }
      }

      // 3. Uniqueness check: Personal Email
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (existingEmail) {
        throw new Error(`Email address "${cleanEmail}" is already registered. Please log in instead.`);
      }

      // Strip passwords before sending to Edge Function for temporary DB storage
      const safeFormData = { ...formData };
      delete safeFormData.password;
      delete safeFormData.confirmPassword;

      // Call Supabase Edge Function to generate OTP, store it, and send email
      const { data: resData, error: invokeErr } = await supabase.functions.invoke('send-email', {
        body: { email: cleanCollegeEmail, type: 'registration', formData: safeFormData }
      });

      if (invokeErr || (resData && resData.error)) {
        throw new Error(invokeErr?.message || resData?.error || 'Failed to dispatch OTP verification email to College Mail ID.');
      }

      return {
        data: {
          collegeEmail: cleanCollegeEmail,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        },
        error: null
      };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Verify Registration OTP and Create Account
  const verifyRegistrationOtpAndCreateAccount = async ({ collegeEmail, otpToken, formData }) => {
    setError(null);
    try {
      const cleanCollegeEmail = collegeEmail.trim().toLowerCase();
      const cleanToken = otpToken.trim();

      // 1. Check OTP via secure RPC
      const { data: safeDbFormData, error: rpcError } = await supabase.rpc('verify_registration_otp', {
        p_email: cleanCollegeEmail,
        p_otp: cleanToken
      });

      if (rpcError) {
        throw new Error(rpcError.message || 'Invalid or expired 6-digit OTP code. Please check your College Mail ID or request a new OTP.');
      }

      // Merge the sanitized DB form data with the active in-memory formData (which has the password)
      const activeFormData = { ...(safeDbFormData || {}), ...formData };

      // 2. Now create the permanent account
      const signUpResult = await signUp(activeFormData);
      if (signUpResult.error) throw signUpResult.error;

      // 4. Send Registration Successful email via Edge Function
      try {
        await supabase.functions.invoke('send-email', {
          body: { email: cleanCollegeEmail, type: 'registration_success' }
        });
      } catch (mailErr) {
        console.warn('Failed to send registration success email:', mailErr);
      }

      return { data: signUpResult.data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    sendRegistrationOtp,
    verifyRegistrationOtpAndCreateAccount,
    resetPasswordForEmail,
    verifyOtpForPasswordReset,
    updatePassword,
    updateProfile,
    refreshProfile,
    hasRole,
    isTeamLeader,
    isAuthenticated: !!session?.user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
