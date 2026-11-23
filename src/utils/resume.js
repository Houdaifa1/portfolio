export const resumeHref = '/Houdaifa_Drahm_CV.pdf';

export function openResume(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.dispatchEvent(new CustomEvent('open-cv-download'));
}
