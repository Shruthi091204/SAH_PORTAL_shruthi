/**
 * Utility functions to handle PPT Template and Hackathon Guidelines downloads
 * for SAH 2026 Student Portal.
 */

export function downloadPPTTemplate() {
  const url = `${import.meta.env.BASE_URL}SIH2026-IDEA-Presentation-Format.pptx`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SIH2026_Idea_Presentation_Template.pptx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
