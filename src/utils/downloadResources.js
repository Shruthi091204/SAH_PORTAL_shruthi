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
  const url = `${import.meta.env.BASE_URL}SAH2026_Poster_Presentation_Guidelines_25_08_2026.pdf`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Poster_Presentation_Guidelines.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPosterTemplate() {
  const url = `${import.meta.env.BASE_URL}SAH2026_Poster_Template_A2.pptx`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Poster_Template_A2.pptx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPosterHardwareSample() {
  const url = `${import.meta.env.BASE_URL}SAH2026_Poster_Sample Poster_A2 Size_Robotics_25.08.2026.pdf`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Poster_Sample_Hardware_Robotics.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPosterSoftwareSample() {
  const url = `${import.meta.env.BASE_URL}SAH2026_Poster_Sample Poster_A2_AI-Based Research.pdf`;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SAH2026_Poster_Sample_Software_AI.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
