import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../lib/supabase';
import MemberSlot from '../components/MemberSlot';
import JoinRequestCard from '../components/JoinRequestCard';
import TeamInvitationsCard from '../components/TeamInvitationsCard';
import UserProfileModal from '../components/UserProfileModal';
import SkillTagSelector from '../components/SkillTagSelector';
import { DEPARTMENTS } from '../data/departments';
import { downloadPPTTemplate, downloadGuidelines } from '../utils/downloadResources';

export default function MyTeamPage() {
  const { profile } = useAuth();
  const { sendNotification } = useNotifications();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberProfiles, setMemberProfiles] = useState({});
  const [requests, setRequests] = useState([]);
  const [requestProfiles, setRequestProfiles] = useState({});
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [allProblemStatements, setAllProblemStatements] = useState([]);
  const [selectedPsId, setSelectedPsId] = useState('');
  const [selectedPsId2, setSelectedPsId2] = useState('');
  const [savingPs, setSavingPs] = useState(false);

  // Profile Preview Modal
  const [viewingProfile, setViewingProfile] = useState(null);
  const [viewingRole, setViewingRole] = useState(null);

  // Recruitment Advertisement
  const [neededSkills, setNeededSkills] = useState([]);
  const [recruitmentMessage, setRecruitmentMessage] = useState('');
  const [savingAd, setSavingAd] = useState(false);

  // Invite Modal & Candidate Search
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [candidateStudents, setCandidateStudents] = useState([]);
  const [allTeamAssignments, setAllTeamAssignments] = useState({});
  const [pendingInviteMap, setPendingInviteMap] = useState({});
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateDept, setCandidateDept] = useState('');
  const [candidateFemaleOnly, setCandidateFemaleOnly] = useState(false);
  const [invitingId, setInvitingId] = useState(null);

  // Pitch URLs
  const [activePitchTab, setActivePitchTab] = useState('PS1');
  const [pptUrl, setPptUrl] = useState('');
  const [pptUrl2, setPptUrl2] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrl2, setGithubUrl2] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrl2, setVideoUrl2] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorDepartment, setMentorDepartment] = useState('');
  const [savingMentor, setSavingMentor] = useState(false);

  useEffect(() => {
    if (profile) fetchTeamData();
  }, [profile]);

  async function fetchTeamData() {
    setLoading(true);

    // Fetch all themes for selection
    const { data: psList } = await supabase
      .from('problem_statements')
      .select('*')
      .order('ps_code');
    setAllProblemStatements(psList || []);

    // Find user's team
    const { data: memberData } = await supabase
      .from('team_members')
      .select('team_id, member_role')
      .eq('student_id', profile.id)
      .limit(1)
      .single();

    if (!memberData) {
      setLoading(false);
      return;
    }

    setIsLeader(memberData.member_role === 'Leader');

    // Fetch team with full theme details
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', memberData.team_id)
      .single();

    setTeam(teamData);
    setSelectedPsId(teamData?.ps_id || '');
    setSelectedPsId2(teamData?.ps_id_2 || '');
    setPptUrl(teamData?.ppt_url || '');
    setPptUrl2(teamData?.ppt_url_2 || '');
    setGithubUrl2(teamData?.github_url_2 || '');
    setVideoUrl(teamData?.video_url || '');
    setVideoUrl2(teamData?.video_url_2 || '');
    setMentorName(teamData?.mentor_name || '');
    setMentorDepartment(teamData?.mentor_department || '');
    setNeededSkills(teamData?.needed_skills || []);
    setRecruitmentMessage(teamData?.recruitment_message || '');

    // Fetch all members
    const { data: membersData } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', memberData.team_id)
      .order('joined_at');

    setMembers(membersData || []);

    // Fetch member profiles
    const memberIds = (membersData || []).map(m => m.student_id);
    if (memberIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', memberIds);

      const profileMap = {};
      (profilesData || []).forEach(p => { profileMap[p.id] = p; });
      setMemberProfiles(profileMap);
    }

    // Fetch pending join requests (if leader)
    if (memberData.member_role === 'Leader') {
      const { data: reqData } = await supabase
        .from('join_requests')
        .select('*')
        .eq('team_id', memberData.team_id)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

      setRequests(reqData || []);

      // Fetch request profiles
      const reqIds = (reqData || []).map(r => r.student_id);
      if (reqIds.length > 0) {
        const { data: reqProfilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', reqIds);

        const reqMap = {};
        (reqProfilesData || []).forEach(p => { reqMap[p.id] = p; });
        setRequestProfiles(reqMap);
      }

      // Fetch sent invitations (Leader only)
      try {
        const { data: invData } = await supabase
          .from('team_invitations')
          .select('id, team_id, student_id, status, created_at, profiles:student_id(id, full_name, roll_no, department, gender, skills)')
          .eq('team_id', memberData.team_id)
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false });

        setSentInvitations(invData || []);
      } catch (err) {
        console.warn('Invitations fetch note:', err);
      }
    }

    setLoading(false);
  }

  // Accept join request
  const handleAccept = async (requestId) => {
    if (members.length >= 6) {
      showToast('error', 'Team is full! Maximum 6 members allowed.');
      return;
    }

    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    await supabase.from('join_requests').update({ status: 'ACCEPTED' }).eq('id', requestId);

    // Add member to team
    await supabase.from('team_members').insert({
      team_id: team.id,
      student_id: request.student_id,
      member_role: 'Member'
    });

    // If team becomes full (6 members now), close recruitment
    if (members.length + 1 >= 6) {
      await supabase.from('teams').update({ is_open_for_recruitment: false }).eq('id', team.id);
    }

    // Notify student
    await sendNotification({
      userId: request.student_id,
      type: 'request_accepted',
      title: 'Join Request Accepted! ',
      message: `Your request to join team "${team.team_name}"has been accepted!`,
      metadata: { team_id: team.id }
    });

    showToast('success', 'Member added to the team!');
    fetchTeamData();
  };

  // Decline join request
  const handleDecline = async (requestId) => {
    const request = requests.find(r => r.id === requestId);

    await supabase.from('join_requests').update({ status: 'DECLINED' }).eq('id', requestId);

    if (request) {
      await sendNotification({
        userId: request.student_id,
        type: 'request_declined',
        title: 'Join Request Declined',
        message: `Your request to join team "${team.team_name}"was declined.`,
        metadata: { team_id: team.id }
      });
    }

    showToast('info', 'Request declined.');
    fetchTeamData();
  };

  // Remove member
  const handleRemoveMember = async (memberId, studentId) => {
    await supabase.from('team_members').delete().eq('id', memberId);

    // Ensure recruitment is open if a member is removed
    await supabase.from('teams').update({ is_open_for_recruitment: true }).eq('id', team.id);

    await sendNotification({
      userId: studentId,
      type: 'request_declined',
      title: 'Removed from Team',
      message: `You have been removed from team "${team.team_name}".`,
      metadata: { team_id: team.id }
    });

    showToast('info', 'Member removed.');
    fetchTeamData();
  };

  // Disband Team (Leader Only)
  const handleDisbandTeam = async () => {
    const confirmDisband = window.confirm(
      "Are you sure you want to completely disband and delete this team? This action is permanent and will remove all members."
    );
    if (!confirmDisband) return;

    try {
      // 1. Cancel all pending requests
      await supabase.from('join_requests').delete().eq('team_id', team.id);
      
      // 2. Cancel all pending invitations
      await supabase.from('team_invitations').delete().eq('team_id', team.id);
      
      // 3. Remove all team members
      await supabase.from('team_members').delete().eq('team_id', team.id);
      
      // 4. Delete the team itself
      await supabase.from('teams').delete().eq('id', team.id);
      
      showToast('success', 'Team disbanded successfully.');
      setTeam(null);
      setMembers([]);
      fetchTeamData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Fetch candidate students, existing team memberships, and pending invitations
  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const [studentsRes, membersRes, invitesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'student').order('full_name'),
        supabase.from('team_members').select('student_id, team_id, teams(id, team_name, is_locked)'),
        team?.id 
          ? supabase.from('team_invitations').select('id, student_id, status').eq('team_id', team.id).eq('status', 'PENDING')
          : Promise.resolve({ data: [] })
      ]);

      const studentList = studentsRes.data || [];
      const memberships = membersRes.data || [];
      const pendingInvites = invitesRes.data || [];

      const assignmentMap = {};
      memberships.forEach(m => {
        assignmentMap[m.student_id] = m.teams?.team_name || 'Another Team';
      });

      const invMap = {};
      pendingInvites.forEach(inv => {
        invMap[inv.student_id] = inv.id;
      });

      setAllTeamAssignments(assignmentMap);
      setPendingInviteMap(invMap);
      setCandidateStudents(studentList);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    fetchCandidates();
  };

  // Send invitation to a candidate
  const handleSendInvite = async (student) => {
    if (members.length >= 6) {
      showToast('error', 'Team is full! Maximum 6 members allowed.');
      return;
    }

    // SIH Guardrail: Cannot invite a student already in ANY team
    if (allTeamAssignments[student.id]) {
      showToast('error', `Cannot invite ${student.full_name} — already in team "${allTeamAssignments[student.id]}".`);
      return;
    }

    setInvitingId(student.id);

    // Live verification from DB to prevent race conditions
    const { data: freshCheck } = await supabase
      .from('team_members')
      .select('id, teams(team_name)')
      .eq('student_id', student.id)
      .limit(1);

    if (freshCheck && freshCheck.length > 0) {
      showToast('error', `Cannot invite ${student.full_name} — joined another team just now.`);
      await fetchCandidates();
      setInvitingId(null);
      return;
    }

    try {
      // 1. Create or update team_invitations row
      const { data: invData, error: invErr } = await supabase
        .from('team_invitations')
        .upsert({
          team_id: team.id,
          student_id: student.id,
          status: 'PENDING',
          created_at: new Date().toISOString()
        }, { onConflict: 'team_id,student_id' })
        .select()
        .single();

      if (invErr) {
        console.warn('team_invitations upsert note:', invErr);
      }

      // 2. Send Realtime Notification
      await sendNotification({
        userId: student.id,
        type: 'team_invite',
        title: 'Team Invitation ',
        message: `${profile.full_name} invited you to join team "${team.team_name}"! Check your invitations to accept.`,
        metadata: {
          team_id: team.id,
          team_name: team.team_name,
          invitation_id: invData?.id
        }
      });

      showToast('success', `Invitation sent to ${student.full_name}! Waiting for their acceptance.`);
      await fetchTeamData();
      await fetchCandidates();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setInvitingId(null);
    }
  };

  // Cancel an existing invitation
  const handleCancelInvite = async (invitationId, studentName) => {
    try {
      await supabase
        .from('team_invitations')
        .update({ status: 'CANCELLED' })
        .eq('id', invitationId);

      showToast('info', `Invitation for ${studentName || 'student'} cancelled.`);
      await fetchTeamData();
      await fetchCandidates();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Save or update Problem Statement
  const handleSaveProblemStatement = async () => {
    if (!selectedPsId) {
      showToast('error', 'Please select a Primary Problem Statement.');
      return;
    }
    if (selectedPsId2 && selectedPsId === selectedPsId2) {
      showToast('error', 'Secondary problem statement must be different from primary.');
      return;
    }
    setSavingPs(true);
    const { error } = await supabase
      .from('teams')
      .update({ ps_id: selectedPsId, ps_id_2: selectedPsId2 || null })
      .eq('id', team.id);

    if (error) {
      showToast('error', error.message);
    } else {
      showToast('success', 'Problem Statements updated successfully!');
      fetchTeamData();
    }
    setSavingPs(false);
  };

  // Save or update Mentor Details
  const handleSaveMentor = async () => {
    setSavingMentor(true);
    const { error } = await supabase
      .from('teams')
      .update({ mentor_name: mentorName, mentor_department: mentorDepartment })
      .eq('id', team.id);

    if (error) {
      showToast('error', error.message);
    } else {
      showToast('success', 'Mentor details updated successfully!');
      fetchTeamData();
    }
    setSavingMentor(false);
  };

  // Save Primary Pitch URLs
  const handleSavePrimaryUrls = async () => {
    const updates = { 
      ppt_url: pptUrl, 
      github_url: githubUrl, 
      video_url: videoUrl
    };
    if (selectedPsId) {
      updates.ps_id = selectedPsId;
      updates.ps_id_2 = selectedPsId2 || null;
    }
    const { error } = await supabase.from('teams').update(updates).eq('id', team.id);
    if (error) showToast('error', error.message);
    else {
      showToast('success', 'Primary PS Pitch details saved!');
      fetchTeamData();
    }
  };

  // Save Secondary Pitch URLs
  const handleSaveSecondaryUrls = async () => {
    const updates = { 
      ppt_url_2: pptUrl2, 
      github_url_2: githubUrl2,
      video_url_2: videoUrl2
    };
    if (selectedPsId) {
      updates.ps_id = selectedPsId;
      updates.ps_id_2 = selectedPsId2 || null;
    }
    const { error } = await supabase.from('teams').update(updates).eq('id', team.id);
    if (error) showToast('error', error.message);
    else {
      showToast('success', 'Secondary PS Pitch details saved!');
      fetchTeamData();
    }
  };

  // Lock team
  const handleLockTeam = async () => {
    const { data, error } = await supabase.rpc('lock_and_verify_sih_team', { p_team_id: team.id });

    if (error) {
      showToast('error', error.message);
    } else if (data && !data.success) {
      showToast('error', data.message);
    } else {
      showToast('success', data.message || 'Team locked successfully!');

      // Notify all members
      for (const member of members) {
        await sendNotification({
          userId: member.student_id,
          type: 'team_locked',
          title: 'Team Locked! ',
          message: `Team "${team.team_name}" has been locked and is pending SPOC verification.`,
          metadata: { team_id: team.id }
        });
      }

      fetchTeamData();
    }
  };

  // Save Recruitment Ad
  const handleSaveAd = async () => {
    setSavingAd(true);
    // Remove the message if skills are empty or message is empty
    const { error } = await supabase
      .from('teams')
      .update({
        needed_skills: neededSkills,
        recruitment_message: recruitmentMessage || ''
      })
      .eq('id', team.id);

    if (error) {
      showToast('error', error.message || 'Failed to save advertisement. Ensure you ran the SQL command.');
    } else {
      showToast('success', 'Recruitment Advertisement updated successfully!');
      fetchTeamData();
    }
    setSavingAd(false);
  };
  
  // Remove Recruitment Ad
  const handleRemoveAd = async () => {
    setSavingAd(true);
    const { error } = await supabase
      .from('teams')
      .update({
        needed_skills: [],
        recruitment_message: null
      })
      .eq('id', team.id);

    if (error) {
      showToast('error', error.message);
    } else {
      setNeededSkills([]);
      setRecruitmentMessage('');
      showToast('success', 'Advertisement removed.');
      fetchTeamData();
    }
    setSavingAd(false);
  };

  // Unlock team for editing (Leader only)
  const handleUnlockTeam = async () => {
    const confirmUnlock = window.confirm(
      `Are you sure you want to unlock team "${team.team_name}"for editing?\n\nThis will allow you to:\n• Change or select a different Problem Statement\n• Invite or remove team members\n• Update PPT & Demo URLs\n\nNote: If previously SPOC verified, SPOC will re-verify after you re-lock.`
    );
    if (!confirmUnlock) return;

    try {
      const { error } = await supabase
        .from('teams')
        .update({
          is_locked: false,
          is_spoc_verified: false,
          is_open_for_recruitment: members.length < 6
        })
        .eq('id', team.id);

      if (error) {
        showToast('error', error.message);
      } else {
        showToast('success', 'Team unlocked! All editing controls are now enabled.');

        // Notify members
        for (const member of members) {
          if (member.student_id !== profile.id) {
            await sendNotification({
              userId: member.student_id,
              type: 'team_unlocked',
              title: 'Team Unlocked for Editing ',
              message: `Team Leader ${profile.full_name} unlocked "${team.team_name}"to make updates.`,
              metadata: { team_id: team.id }
            });
          }
        }

        fetchTeamData();
      }
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Female member count
  const femaleCount = members.filter(m => memberProfiles[m.student_id]?.gender === 'Female').length;
  const currentPs1 = allProblemStatements.find(p => p.id === (selectedPsId || team?.ps_id));
  const currentPs2 = allProblemStatements.find(p => p.id === (selectedPsId2 || team?.ps_id_2));

  // Filter candidate students for invite modal (only unassigned students not in ANY team)
  const filteredCandidates = useMemo(() => {
    const currentMemberIds = new Set(members.map(m => m.student_id));
    return candidateStudents.filter(student => {
      // Exclude members already in THIS team
      if (currentMemberIds.has(student.id)) return false;
      // Exclude members already in ANY OTHER team
      if (allTeamAssignments[student.id]) return false;
      if (candidateFemaleOnly && student.gender !== 'Female') return false;
      if (candidateDept && student.department !== candidateDept) return false;
      if (candidateSearch) {
        const q = candidateSearch.toLowerCase().trim();
        const matchName = student.full_name?.toLowerCase().includes(q);
        const matchRoll = student.roll_no?.toLowerCase().includes(q);
        const matchDept = student.department?.toLowerCase().includes(q);
        const matchSkills = student.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRoll && !matchDept && !matchSkills) return false;
      }
      return true;
    });
  }, [candidateStudents, members, allTeamAssignments, candidateFemaleOnly, candidateDept, candidateSearch]);

  if (loading) {
    return <div className="page-container"><div className="loading-spinner"><div className="spinner" /></div></div>;
  }

  if (!team) {
    return (
      <div className="page-container">
        {/* Pending Team Invitations for Student */}
        <TeamInvitationsCard onUpdate={fetchTeamData} />

        <div className="empty-state">
          <div className="empty-icon"></div>
          <h3>You're not on a team yet</h3>
          <p>Create your own team or browse the marketplace to join one.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn btn-orange"onClick={() => navigate('/create-team')}>
               Create a Team
            </button>
            <button className="btn btn-outline"onClick={() => navigate('/marketplace')}>
               Browse Teams
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header flex-between"style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">{team.team_name}</h1>
          <p className="page-subtitle">
            {team.problem_statements
              ? `${team.problem_statements.ps_code} — ${team.problem_statements.title}`
              : 'No theme assigned'}
            {' · '}
            <span className={`pill-badge ${team.is_locked ? 'status-locked' : 'status-open'}`}>
              {team.is_locked ? 'Locked' : 'Open'}
            </span>
            {team.is_spoc_verified && (
              <span className="pill-badge status-verified"style={{ marginLeft: '6px' }}> SPOC Verified</span>
            )}
          </p>
        </div>
        {isLeader && (
          team.is_locked ? (
            <button
              className="btn btn-outline"
              onClick={handleUnlockTeam}
              style={{ borderColor: 'var(--orange)', color: 'var(--orange)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Unlock team to edit members, change theme, or update pitch links"
            >
              <span></span> Unlock Team for Editing
            </button>
          ) : (
            <button className="btn btn-navy"onClick={handleLockTeam}>
               Lock Team for SIH Submission
            </button>
          )
        )}
      </div>

      {/* Compliance Status */}
      <div className="card"style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px' }}>SIH Compliance Status</h3>
        <ul className="compliance-checklist">
          <li className="compliance-item">
            <span className={`check-icon ${members.length === 6 ? 'pass' : 'fail'}`}>
              {members.length === 6 ? '✓' : '✗'}
            </span>
            <span>6 Members — Current: {members.length}/6</span>
          </li>
          <li className="compliance-item">
            <span className={`check-icon ${femaleCount >= 1 ? 'pass' : 'fail'}`}>
              {femaleCount >= 1 ? '✓' : '✗'}
            </span>
            <span>At least 1 Female Member — Current: {femaleCount} </span>
          </li>
          <li className="compliance-item">
            <span className={`check-icon ${team.ps_id ? 'pass' : 'fail'}`}>
              {team.ps_id ? '✓' : '✗'}
            </span>
            <span>Problem Statement Assigned</span>
          </li>
        </ul>
      </div>

      {/* Team Roster */}
      <div className="card"style={{ marginBottom: '24px' }}>
        <div className="flex-between"style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ marginBottom: '4px' }}>Team Roster ({members.length}/6)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {members.length < 6 ? `${6 - members.length} slot(s) open for team recruitment.` : 'Team roster is full (6/6).'}
            </p>
          </div>
          {isLeader && !team.is_locked && members.length < 6 && (
            <button className="btn btn-orange"onClick={handleOpenInviteModal}>
               Invite / Add Members
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {members.map(member => (
            <MemberSlot
              key={member.id}
              member={member}
              profile={memberProfiles[member.student_id]}
              isLeader={member.member_role === 'Leader'}
              canRemove={isLeader && !team.is_locked && member.member_role !== 'Leader'}
              onRemove={handleRemoveMember}
              onClickProfile={(prof, role) => {
                setViewingProfile(prof);
                setViewingRole(role);
              }}
            />
          ))}
          {[...Array(Math.max(0, 6 - members.length))].map((_, i) => (
            <MemberSlot
              key={`empty-${i}`}
              member={null}
              onInviteClick={isLeader && !team.is_locked && members.length < 6 ? handleOpenInviteModal : undefined}
            />
          ))}
        </div>

        {isLeader && !team.is_locked && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" style={{ borderColor: 'var(--red)', color: 'var(--red)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleDisbandTeam}>
              <span>⚠️</span> Disband Team
            </button>
          </div>
        )}
      </div>

      {/* Recruitment Advertisement */}
      {isLeader && !team.is_locked && members.length < 6 && (
        <div className="card" style={{ marginBottom: '24px', border: '2px solid var(--orange)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--orange)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Public Board
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📣 Advertise Recruitment
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Looking for specific skills? Publish an ad to the SAH Landing Page and Login Page to attract talent!
          </p>
          
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>What skills do you need? (Max 2)</label>
            <SkillTagSelector
              selectedSkills={neededSkills}
              onChange={setNeededSkills}
              maxSkills={2}
            />
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Catchy Message / Pitch</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., We need a React wizard for our healthcare AI idea! Join us!"
              value={recruitmentMessage}
              onChange={(e) => setRecruitmentMessage(e.target.value)}
              maxLength={120}
            />
            <div className="form-hint" style={{ marginTop: '4px', fontSize: '0.75rem' }}>{recruitmentMessage.length}/120 characters</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              className="btn btn-orange"
              onClick={handleSaveAd}
              disabled={savingAd || neededSkills.length === 0}
            >
              {savingAd ? 'Publishing...' : 'Publish Advertisement'}
            </button>
            {(neededSkills.length > 0 || recruitmentMessage) && (
              <button
                className="btn btn-outline"
                onClick={handleRemoveAd}
                disabled={savingAd}
                style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              >
                Remove Ad
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sent Team Invitations (Leader only) */}
      {isLeader && !team.is_locked && sentInvitations.length > 0 && (
        <div className="card"style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}> Sent Invitations ({sentInvitations.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sentInvitations.map(inv => (
              <div
                key={inv.id}
                onClick={() => {
                  if (inv.profiles) {
                    setViewingProfile(inv.profiles);
                    setViewingRole('Invited Student');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--off-white)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
                title="Click to view invited student profile"
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: inv.profiles?.gender === 'Female' ? 'var(--purple)' : 'var(--navy)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {inv.profiles?.full_name?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{inv.profiles?.full_name || 'Invited Student'}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.5 }}> View Profile</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {inv.profiles?.roll_no ? `${inv.profiles.roll_no} · ` : ''}{inv.profiles?.department || 'Student'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                  <span className="pill-badge status-open"style={{ fontSize: '0.75rem' }}>
                     Awaiting Student Acceptance
                  </span>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleCancelInvite(inv.id, inv.profiles?.full_name)}
                    style={{ color: 'var(--red)', fontSize: '0.82rem' }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Requests (Leader only) */}
      {isLeader && !team.is_locked && requests.length > 0 && (
        <div className="card"style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}> Pending Join Requests ({requests.length})</h3>
          {requests.map(req => (
            <JoinRequestCard
              key={req.id}
              request={req}
              profile={requestProfiles[req.student_id]}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onClickProfile={(prof) => {
                setViewingProfile(prof);
                setViewingRole('Applicant');
              }}
            />
          ))}
        </div>
      )}

      {/* Problem Statement Selection & Details */}
      <div className="card"style={{ marginBottom: '24px' }}>
        <div className="flex-between"style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ marginBottom: '4px' }}> Problem Statement</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {team.is_locked 
                ? 'Team is locked — Problem statement is finalized for SIH / SAH evaluation.' 
                : 'Choose or change the theme your team will solve.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {team.ps_id && (
              <span className="pill-badge status-verified">
                 Primary: {currentPs1?.ps_code || 'Assigned'}
              </span>
            )}
            {team.ps_id_2 && (
              <span className="pill-badge status-verified">
                 Secondary: {currentPs2?.ps_code || 'Assigned'}
              </span>
            )}
            {isLeader && team.is_locked && (
              <button
                className="btn btn-sm btn-outline"
                onClick={handleUnlockTeam}
                style={{ borderColor: 'var(--orange)', color: 'var(--orange)', fontWeight: 600, fontSize: '0.75rem' }}
              >
                 Unlock to Change
              </button>
            )}
          </div>
        </div>

        {isLeader && !team.is_locked && (
          <div style={{ marginBottom: '20px', background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
            <label className="form-label"style={{ fontWeight: 600 }}>
              Primary Problem Statement <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={selectedPsId}
              onChange={(e) => setSelectedPsId(e.target.value)}
              style={{ flex: 1, minWidth: '280px', marginBottom: '12px' }}
            >
              <option value="">-- Select Primary Problem Statement --</option>
              {Array.from(new Set(allProblemStatements.map(ps => ps.domain))).sort().map(domain => (
                <optgroup key={`p-${domain}`} label={domain}>
                  {allProblemStatements.filter(ps => ps.domain === domain).map(ps => (
                    <option key={`p-${ps.id}`} value={ps.id}>
                      [{ps.ps_code}] {ps.title} ({ps.category})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <label className="form-label"style={{ fontWeight: 600 }}>
              Secondary Problem Statement (Optional)
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                value={selectedPsId2}
                onChange={(e) => setSelectedPsId2(e.target.value)}
                style={{ flex: 1, minWidth: '280px' }}
              >
                <option value="">-- Select Secondary Problem Statement --</option>
                {Array.from(new Set(allProblemStatements.map(ps => ps.domain))).sort().map(domain => (
                  <optgroup key={`s-${domain}`} label={domain}>
                    {allProblemStatements.filter(ps => ps.domain === domain).map(ps => (
                      <option key={`s-${ps.id}`} value={ps.id}>
                        [{ps.ps_code}] {ps.title} ({ps.category})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={handleSaveProblemStatement}
                disabled={savingPs || !selectedPsId || (selectedPsId === team.ps_id && selectedPsId2 === (team.ps_id_2 || ''))}
              >
                {savingPs ? 'Saving...' : 'Save Themes'}
              </button>
            </div>
          </div>
        )}

        {/* Display selected PS details card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentPs1 ? (
            <div style={{
              background: 'var(--off-white)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--navy)' }}>Primary Problem Statement</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.1rem' }}>
                  {currentPs1.ps_code}
                </span>
                <span className={`pill-badge ${currentPs1.category === 'Hardware' ? 'domain' : 'skill'}`}>
                  {currentPs1.category}
                </span>
                <span className="pill-badge domain"style={{ background: '#E3F2FD', color: '#1565C0' }}>
                  {currentPs1.domain}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '8px' }}>
                {currentPs1.title}
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <strong>Organization / Ministry:</strong> {currentPs1.organization || 'Government of India'}
              </div>
              {currentPs1.description && (
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                  {currentPs1.description}
                </p>
              )}
            </div>
          ) : (
            <div style={{
              background: '#FFF3E0',
              border: '1px solid #FFE0B2',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              color: '#E65100',
              fontSize: '0.9rem'
            }}>
              No Primary theme chosen yet. {isLeader ? 'Please select one from the dropdown above to satisfy SIH compliance.' : 'Ask your Team Leader to assign a theme.'}
            </div>
          )}

          {currentPs2 && (
            <div style={{
              background: 'var(--off-white)',
              border: '1px dashed var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--navy)' }}>Secondary Problem Statement</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.1rem' }}>
                  {currentPs2.ps_code}
                </span>
                <span className={`pill-badge ${currentPs2.category === 'Hardware' ? 'domain' : 'skill'}`}>
                  {currentPs2.category}
                </span>
                <span className="pill-badge domain"style={{ background: '#E3F2FD', color: '#1565C0' }}>
                  {currentPs2.domain}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '8px' }}>
                {currentPs2.title}
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <strong>Organization / Ministry:</strong> {currentPs2.organization || 'Government of India'}
              </div>
              {currentPs2.description && (
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                  {currentPs2.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mentor Details */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}> Mentor Details</h3>
          {isLeader && team.is_locked && (
            <button
              className="btn btn-sm btn-outline"
              onClick={handleUnlockTeam}
              style={{ borderColor: 'var(--orange)', color: 'var(--orange)', fontWeight: 600, fontSize: '0.75rem' }}
            >
               Unlock to Edit Mentor
            </button>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Mentor Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Dr. Smith"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            disabled={!isLeader || team.is_locked}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mentor Department</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Computer Science"
            value={mentorDepartment}
            onChange={(e) => setMentorDepartment(e.target.value)}
            disabled={!isLeader || team.is_locked}
          />
        </div>
        
        {isLeader && !team.is_locked && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={handleSaveMentor}
              disabled={savingMentor}
            >
              {savingMentor ? 'Saving...' : 'Save Mentor Details'}
            </button>
          </div>
        )}
      </div>

      {/* Pitch & Solution URLs */}
      {isLeader && (
        <div className="card"style={{ marginBottom: '24px' }}>
          <div className="flex-between"style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0 }}> Solution & Pitch URLs</h3>
            {team.is_locked && (
              <button
                className="btn btn-sm btn-outline"
                onClick={handleUnlockTeam}
                style={{ borderColor: 'var(--orange)', color: 'var(--orange)', fontWeight: 600, fontSize: '0.75rem' }}
              >
                 Unlock to Edit Pitch Links
              </button>
            )}
          </div>
          {/* Tabs for Primary/Secondary */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <button
              className={`btn btn-sm ${activePitchTab === 'PS1' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActivePitchTab('PS1')}
            >
              Primary PS
            </button>
            <button
              className={`btn btn-sm ${activePitchTab === 'PS2' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActivePitchTab('PS2')}
            >
              Secondary PS
            </button>
          </div>

          {/* Primary PS Links */}
          {activePitchTab === 'PS1' && (
            <div style={{ padding: '16px', background: 'var(--off-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--navy)' }}>Primary Problem Statement Submissions</h4>
              
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>PPT / Presentation URL</label>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={downloadPPTTemplate}
                    style={{
                      fontSize: '0.78rem',
                      padding: '5px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(255, 107, 0, 0.4)',
                      color: '#FF6B00',
                      background: 'rgba(255, 107, 0, 0.08)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PPT Template
                  </button>
                </div>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://docs.google.com/presentation/..."
                  value={pptUrl}
                  onChange={(e) => setPptUrl(e.target.value)}
                  disabled={team.is_locked}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>GitHub Repository URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/team/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={team.is_locked}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Video / Demo URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={team.is_locked}
                />
              </div>

              {!team.is_locked && (
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleSavePrimaryUrls}>
                    Save Primary PS Links
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Secondary PS Links */}
          {activePitchTab === 'PS2' && (
            <div style={{ padding: '16px', background: 'var(--off-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--navy)' }}>Secondary Problem Statement Submissions</h4>
              
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>PPT / Presentation URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://docs.google.com/presentation/..."
                  value={pptUrl2}
                  onChange={(e) => setPptUrl2(e.target.value)}
                  disabled={team.is_locked}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>GitHub Repository URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/team/repo"
                  value={githubUrl2}
                  onChange={(e) => setGithubUrl2(e.target.value)}
                  disabled={team.is_locked}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Video / Demo URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl2}
                  onChange={(e) => setVideoUrl2(e.target.value)}
                  disabled={team.is_locked}
                />
              </div>

              {!team.is_locked && (
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleSaveSecondaryUrls}>
                    Save Secondary PS Links
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Invite / Add Team Members Modal */}
      {showInviteModal && (
        <div className="modal-overlay"onClick={() => setShowInviteModal(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '780px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header flex-between"style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h3 style={{ margin: 0 }}> Invite / Add Team Members</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Search and recruit registered students for team <strong>{team.team_name}</strong> ({members.length}/6 members)
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowInviteModal(false)}
                style={{ fontSize: '1.2rem', padding: '4px 10px' }}
              >
                ✕
              </button>
            </div>

            {/* Filters */}
            <div style={{ padding: '16px 0', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search student name, roll number, or skills..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                style={{ flex: '1 1 240px' }}
              />
              <select
                className="form-select"
                value={candidateDept}
                onChange={(e) => setCandidateDept(e.target.value)}
                style={{ flex: '0 1 180px' }}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={candidateFemaleOnly}
                  onChange={(e) => setCandidateFemaleOnly(e.target.checked)}
                />
                <span>Female Candidates Only (SIH Requirement)</span>
              </label>
            </div>

            {/* Candidate List Body */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {loadingCandidates ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner"style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading registered candidates...</p>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--off-white)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}></div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    No students match your search criteria. Try modifying your filters.
                  </p>
                </div>
              ) : (
                filteredCandidates.map(student => {
                  const isAssigned = Boolean(allTeamAssignments[student.id]);
                  const assignedTeam = allTeamAssignments[student.id];

                  return (
                    <div
                      key={student.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: isAssigned ? 'var(--off-white)' : 'var(--white)',
                        border: isAssigned ? '1px solid var(--border-light)' : '1px solid #BBDEFB',
                        opacity: isAssigned ? 0.75 : 1,
                        gap: '14px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px', cursor: 'pointer' }}
                        onClick={() => {
                          setViewingProfile(student);
                          setViewingRole('Candidate');
                        }}
                        title="Click to view candidate's full profile"
                      >
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: student.gender === 'Female' ? 'var(--purple)' : 'var(--navy)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.95rem'
                        }}>
                          {student.full_name?.slice(0, 2).toUpperCase() || 'ST'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{student.full_name}</span>
                            {student.gender === 'Female' && <span title="Female candidate"></span>}
                            <span style={{ fontSize: '0.72rem', opacity: 0.5 }}> Profile</span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {student.roll_no ? `${student.roll_no} · ` : ''}{student.department} · {student.year_of_study || 'Student'}
                          </div>
                          {student.skills && student.skills.length > 0 && (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                              {student.skills.slice(0, 4).map(s => (
                                <span key={s} className="pill-badge skill"style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                        {isAssigned ? (
                          <div style={{ textAlign: 'right' }}>
                            <span className="pill-badge status-locked"style={{ fontSize: '0.75rem' }}>
                               In Team: {assignedTeam}
                            </span>
                            <button
                              className="btn btn-sm btn-ghost"
                              disabled
                              style={{ display: 'block', marginTop: '4px', fontSize: '0.75rem', opacity: 0.6 }}
                            >
                              Unavailable
                            </button>
                          </div>
                        ) : pendingInviteMap[student.id] ? (
                          <div style={{ textAlign: 'right' }}>
                            <span className="pill-badge status-open"style={{ fontSize: '0.75rem' }}>
                               Invite Sent
                            </span>
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => handleCancelInvite(pendingInviteMap[student.id], student.full_name)}
                              style={{ display: 'block', marginTop: '4px', fontSize: '0.75rem', color: 'var(--red)' }}
                            >
                              Cancel Invite
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSendInvite(student)}
                            disabled={invitingId === student.id || members.length >= 6}
                            style={{ minWidth: '130px' }}
                          >
                            {invitingId === student.id ? 'Sending...' : 'Send Invite'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                 Students already in another team cannot be invited to comply with SIH single-team policy.
              </span>
              <button className="btn btn-outline btn-sm"onClick={() => setShowInviteModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student / User Profile Modal */}
      {viewingProfile && (
        <UserProfileModal
          profile={viewingProfile}
          memberRole={viewingRole}
          hidePhone={viewingRole !== 'Leader' && viewingRole !== 'Member'}
          onClose={() => {
            setViewingProfile(null);
            setViewingRole('');
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '' : toast.type === 'error' ? '' : ''} {toast.message}
        </div>
      )}
    </div>
  );
}
