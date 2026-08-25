/**
 * Utility functions to handle PPT Template and Hackathon Guidelines downloads
 * for SAH 2026 Student Portal.
 */

export function downloadPPTTemplate() {
  const pptContent = `================================================================================
AMRITA VISHWA VIDYAPEETHAM — CHENNAI CAMPUS
Amrita School of Engineering and Computing
SMART AMRITA HACKATHON (SAH) 2026
OFFICIAL SIX-SLIDE IDEA PRESENTATION TEMPLATE
================================================================================

INSTRUCTIONS FOR TEAMS:
- Prepare a maximum SIX (6) SLIDE presentation adhering strictly to the SIH format.
- Use points, system diagrams, and infographics — avoid dense paragraphs.
- Save your slides as a PPTX / PDF and upload to Google Drive or OneDrive.
- Set link sharing to "Anyone with the link can view".
- Submit your public PPT URL on the Student Portal Team Dashboard before registration closes.

--------------------------------------------------------------------------------
SLIDE 1: TITLE & TEAM PARTICULARS
--------------------------------------------------------------------------------
• Problem Statement ID (PS ID) (or Student Innovation Theme):
• Problem Statement Title:
• SIH Theme:
• PS Category (Software Edition / Hardware Edition):
• Team ID & Team Name:
• Team Leader Name, Department & Roll Number:
• Team Members (5 Members — Name, Department, Roll No, Gender):
• Mentor(s) Name & Designation:
• Institution: Amrita Vishwa Vidyapeetham, Chennai Campus

--------------------------------------------------------------------------------
SLIDE 2: PROPOSED SOLUTION
--------------------------------------------------------------------------------
• Detailed explanation of your proposed solution to the problem statement.
• Core novelty and innovation compared to existing / commercial solutions.
• Key functional capabilities and unique selling propositions (USPs).
• How your solution addresses the problem statement requirements.

--------------------------------------------------------------------------------
SLIDE 3: TECHNICAL APPROACH & ARCHITECTURE
--------------------------------------------------------------------------------
• High-level System Architecture Diagram / Data Flow / Block Diagram.
• Technology Stack (Frontend, Backend, Database, AI/ML models, Hardware components, IoT sensors).
• Methodology, engineering depth, and non-triviality of the technical design.
• Interdisciplinary integration (if applicable).

--------------------------------------------------------------------------------
SLIDE 4: FEASIBILITY & VIABILITY
--------------------------------------------------------------------------------
• Technical buildability within the Grand Finale window.
• Realism of cost, data, software, and hardware resource assumptions.
• Technical & execution risks identified with credible mitigation strategies.
• Safety considerations and regulatory compliance (if applicable).

--------------------------------------------------------------------------------
SLIDE 5: IMPACT, SCALE & SUSTAINABILITY
--------------------------------------------------------------------------------
• Direct benefits to end users and sponsoring organization.
• Scalability of the solution across regions or market segments.
• Social, economic, and environmental sustainability.
• Scope for future enhancements, patenting, or startup incubation.

--------------------------------------------------------------------------------
SLIDE 6: RESEARCH, REFERENCES & PROTOTYPE STATUS
--------------------------------------------------------------------------------
• Proof-of-concept / working prototype development status.
• References, datasets, literature surveys, and open-source libraries used.
• Individual team member contributions & citation of third-party assets.
• Link to demonstration video / repository (optional).
================================================================================`;

  const blob = new Blob([pptContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Idea_Presentation_Template.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadGuidelines() {
  const url = `${import.meta.env.BASE_URL}SAH2026_Hackathon_Guidelines_Revised_VJ_24.08.2026.pdf`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Hackathon_Guidelines_Revised.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadExpoGuidelines() {
  const url = `${import.meta.env.BASE_URL}SAH2026_Project_Expo_Guidelines_24.08.2026.pdf`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Project_Expo_Guidelines.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPosterGuidelines() {
  const content = `POSTER PRESENTATION 2026 - GUIDELINES\n\n1. Overview\nPresent your research methodologies and findings.\n\n2. Dimensions\nStandard A0 size (Portrait). \n\n3. Evaluation\nJudged on scientific rigor, visual clarity, and presentation skills.`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Poster_Presentation_2026_Guidelines.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
