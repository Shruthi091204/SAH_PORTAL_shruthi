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
  const guidelinesContent = `AMRITA VISHWA VIDYAPEETHAM — CHENNAI CAMPUS
Amrita School of Engineering and Computing
SMART AMRITA HACKATHON (SAH) 2026
Internal Hackathon for Smart India Hackathon (SIH) 2026
Guidelines for Students

The Smart Amrita Hackathon (SAH) 2026 is the campus-level Internal Hackathon through which Amrita Vishwa Vidyapeetham, Chennai Campus nominates its teams to Smart India Hackathon (SIH) 2026, the national initiative of the Ministry of Education’s Innovation Cell (MIC) and AICTE. Under SIH rules a student cannot register directly on the national portal: only teams that qualify through the Internal Hackathon may be nominated by the Campus SPOC (Single Point of Contact). SAH 2026 is therefore conducted to national standards, and every rule below mirrors the SIH framework without dilution.

1. Objectives
● Select, strictly on merit, the strongest teams for nomination to the SIH 2026 portal.
● Ensure every nominated idea is already prepared against the national screening parameters before it leaves the campus.
● Encourage interdisciplinary teams across departments, in both the Software and the Hardware editions.
● Identify solutions with potential for patenting, deployment with the sponsoring organisation, or startup incubation.

2. Eligibility — Who Can Apply?
● Who may apply: Students of any B.Tech, M.Tech or PhD programme, in any year of study, from any department of the Chennai Campus.
● Team size: Exactly 6 students, including a designated Team Leader. Teams of any other size cannot be nominated to the SIH portal.
● Woman member: Mandatory. Every team must include at least one woman member. All-women teams are welcome.
● Same institution: All six members must be from Amrita Chennai Campus. Inter-institution teams are not permitted. Members from different departments are strongly encouraged.
● Mentors: Up to two mentors — senior faculty or domain experts from any department. Mentor endorsement at registration is mandatory.
● Entries per student: One team only. A student found registered in two teams disqualifies both.
● Problem mapping: Each team must register against one SIH 2026 Problem Statement (with its PS ID) or one Student Innovation idea mapped to a notified SIH theme.

3. Problem Statements, Categories and Themes
● Problem Statements: Teams select from the SIH 2026 Problem Statements published on sih.gov.in and released to the campus by the Campus SPOC. Every entry must record the PS ID, PS Title, PS Category and Theme exactly as published on the portal.
● PS Category: Each entry belongs to one of two editions — Software or Hardware. Software teams must be predominantly strong in programming. Hardware teams should be multidisciplinary, combining mechanical, electronics, product design and programming skills.
● Student Innovation: A team may instead enter the Student Innovation category with its own idea, provided it is mapped to one of the notified SIH themes below.
● Themes (as notified by SIH): Smart Automation • Smart Education • Smart Vehicles • Robotics and Drones • Agriculture, FoodTech & Rural Development • MedTech / BioTech / HealthTech • Clean & Green Technology • Renewable / Sustainable Energy • Transportation & Logistics • Disaster Management • Blockchain & Cybersecurity • Space Technology • Heritage & Culture • Travel & Tourism • Fitness & Sports • Toys and Games • Miscellaneous.
● Essential condition: Concept notes, literature surveys and video-only entries will not be evaluated. Every team must bring a working proof of concept — a functional module or device, an integrated hardware–software system, an AI/ML model with live output, an IoT or cyber-physical system, or a validated test setup — alongside its Idea Presentation.

4. Selection Process and Key Dates
All deadlines close strictly at 5.00 p.m. on the date indicated. No extensions will be granted.

• Curtain Raiser & Registration Opens : Mon, 24 Aug 2026
  Orientation on SIH rules, team formation and problem statement selection. Online registration opens.

• Registration Closes                  : Sat, 5 Sep 2026
  Final deadline for the 6-member team, chosen PS ID, mentor endorsement and the six-slide Idea Presentation.

• Smart Amrita Hackathon (SAH) 2026    : Thu, 10 Sep 2026
  Live pitch, prototype demonstration and jury evaluation out of 50 marks, before faculty, researchers and industry experts.

• Announcement of Nominated Teams      : Fri, 11 Sep 2026
  Declaration of teams selected for nomination, in rank order, together with the waitlist.

• Boot Camp for Nominated Teams        : Tue–Sat, 15–19 Sep 2026
  Five-day intensive refinement of the idea, architecture review and mentor pairing ahead of national screening.

• Idea Submission on the SIH Portal    : Sun, 20 Sep 2026
  Institutional endorsement and upload of nominated team dossiers by the Campus SPOC.

Nomination ceiling: SIH permits an institute to nominate only a limited number of teams, and the ceiling changes from edition to edition. The exact number for SIH 2026 will be notified by the Campus SPOC once the portal opens. Teams will be nominated strictly in jury rank order, and a waitlist of five teams will be maintained. Nomination is made by the Campus SPOC alone; students cannot register themselves on the portal.

5. Evaluation Rubric
Each team is evaluated out of 50 marks during the live pitch and technical interaction. The criteria below mirror the parameters used for national idea screening:

Criterion                               Marks  What the Jury Looks For
------------------------------------------------------------------------------------------------------------------------
Novelty & Innovation                    10     Originality against existing and known approaches; clear differentiation from earlier SIH submissions and off-the-shelf products.
Technical Approach & Complexity         10     Soundness of architecture and methodology; justification of the technology stack; engineering depth and non-triviality.
Feasibility & Viability                 10     Buildability within the Grand Finale window; risks identified with credible mitigation; realism of cost, data and resource assumptions.
Impact, Scale & Sustainability         10     Benefit to the end user and the sponsoring organisation; scale of impact; social, economic and environmental sustainability; scope for future work.
Prototype & Demonstration Readiness     5      Evidence of a working module or validated proof of concept; quality of the live demonstration; ability to explain measured results.
Presentation & Format Compliance       5      Clarity of the pitch; adherence to the six-slide SIH Idea Submission format; quality of response to jury questions.
------------------------------------------------------------------------------------------------------------------------
TOTAL                                   50 Marks

Note: Every team member must be able to explain their individual contribution, and must clearly distinguish student-developed work from externally sourced hardware, software, libraries, datasets and AI-assisted code. Ideas that replicate earlier SIH entries will be marked down under Novelty.

6. Submission and Demonstration Requirements
● Idea Presentation: Six slides maximum, in the SIH Idea Submission format: (i) Title — PS ID, PS Title, Theme, PS Category, Team ID, Team Name and Idea Title; (ii) Proposed Solution; (iii) Technical Approach; (iv) Feasibility and Viability; (v) Impact and Benefits; (vi) Research and References. Use points, diagrams and infographics — not paragraphs.
● Demonstration display: Mandatory at the table: Team ID and Team Name, PS ID and PS Title, Theme and PS Category, all six members, mentor(s), department, the working prototype or software system, the key innovation and major results. Recommended: system architecture diagram, key performance metrics, and a QR code linking to the demonstration video or code repository.
● Backup demonstration: Every team must carry a backup — demonstration video, screenshots, sample datasets or recorded test results. This is a contingency for technical failure at the venue and does not substitute for a live demonstration.

7. Recognition and Awards
In addition to SIH National Portal Nomination, the jury will confer the following awards (Winner and Runner-Up):
● Best Software Edition Team: Highest overall score among entries in the Software PS Category.
● Best Hardware Edition Team: Highest overall score among entries in the Hardware PS Category.
● Best Student Innovation Idea: Strongest self-proposed idea mapped to a notified SIH theme.
● Theme Excellence Award: Best team in each SIH theme that receives at least three qualifying entries.
● Best Interdisciplinary Team: Most effective integration of two or more departments into a stronger solution.
● Best All-Women Team: Highest-scoring team composed entirely of women members.
● Young Innovator Award: Most promising team drawn from first- and second-year students.

Certificates and medals: Winner and Runner-Up team members will each receive a medal and a certificate of merit, alongside nomination support for SIH registration. All verified participating students will receive digital e-participation certificates.

8. General Guidelines
● Team composition is frozen at the close of registration. Members cannot be substituted afterwards, and the Team Leader cannot be changed.
● Reporting is compulsory. A registered team that does not report for jury evaluation forfeits both its participation certificates and any claim to nomination.
● Academic integrity. Work must be original. All libraries, datasets, APIs, purchased modules and AI-assisted development must be declared and cited. Misrepresentation of third-party work as student-developed will lead to disqualification.
● Safety. Projects involving high voltage or current, batteries, motors, lasers, chemicals, biological materials, pressurised systems or rotating machinery must be declared at registration and cleared by the Organising Committee, which may prohibit any demonstration considered unsafe.
● Event documentation. Photographs, video and team particulars from SAH 2026 will form part of the Internal Hackathon Report uploaded to the SIH portal by the Campus SPOC.

Issued by
The Organising Committee, Smart Amrita Hackathon (SAH) 2026
Amrita Vishwa Vidyapeetham — Chennai Campus`;

  const blob = new Blob([guidelinesContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Hackathon_Guidelines.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
