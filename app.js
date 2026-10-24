'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let observer;
function setupMotion() {
  if (observer) observer.disconnect();
  document.body.classList.remove('motion-ready');
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.body.classList.add('motion-ready');
  }
}
setupMotion();
motionPreference.addEventListener('change', setupMotion);
document.querySelector('#shift').addEventListener('click', () => document.querySelector('.hero-stage').classList.toggle('shifted'));
const concepts = {
  terrain: { title: 'Terrain', intro: 'An outdoor culture concept for people who want to get a little further from the everyday.', visual: 'Find your outside.', question: 'How might an outdoor brand feel more like an invitation than a catalogue of equipment?', direction: 'Earthy colour, monumental typography, and terrain-inspired forms create a welcoming editorial identity. The proposed digital journey moves from inspiration to exploration with clear, accessible navigation.' },
  ondo: { title: 'Ondo', intro: 'A listening culture concept built around the personal ritual of discovering sound.', visual: 'A sound of your own.', question: 'How could a listening brand express warmth and individuality in a crowded technical category?', direction: 'A warm vermilion palette, record-inspired geometry, and expressive type make the experience tactile. Motion follows the idea of rotation, with a complete static presentation for reduced-motion preferences.' },
  folio: { title: 'Folio', intro: 'A creative spaces concept that gives independent thinking room to grow.', visual: 'Room to grow.', question: 'How can a workspace identity convey a sense of possibility before someone visits the space?', direction: 'An architectural grid and soft, unexpected colours balance structure with creative energy. The proposed website brings space details, availability, and the visit journey into a clear content hierarchy.' }
};
const dialog = document.querySelector('#project-dialog');
let projectTrigger;
function closeProject() { dialog.close(); if (projectTrigger) projectTrigger.focus(); }
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.project;
  const concept = concepts[key];
  projectTrigger = button;
  document.querySelector('#dialog-title').textContent = concept.title;
  document.querySelector('#dialog-intro').textContent = concept.intro;
  document.querySelector('#dialog-question').textContent = concept.question;
  document.querySelector('#dialog-direction').textContent = concept.direction;
  const art = document.querySelector('#dialog-art');
  art.className = 'dialog-art ' + key;
  art.textContent = concept.visual;
  dialog.showModal();
  dialog.scrollTop = 0;
}));
document.querySelector('.dialog-close').addEventListener('click', closeProject);
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProject(); } });
dialog.addEventListener('close', () => { if (projectTrigger) projectTrigger.focus(); });
document.querySelector('.case-contact').addEventListener('click', closeProject);
let briefUrl;
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = ['PROJECT BRIEF', 'Prepared in the FORME agency concept preview', '', 'Name: ' + data.get('name'), 'Email: ' + data.get('email'), 'Company / website: ' + (data.get('company') || 'Not provided'), '', 'PROJECT AMBITION', data.get('ambition'), '', 'Investment: ' + data.get('budget'), 'Ideal timing: ' + data.get('timing'), '', 'This brief was created in your browser. It has not been sent to an agency.'].join('\n');
  if (briefUrl) URL.revokeObjectURL(briefUrl);
  briefUrl = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = briefUrl;
  link.download = 'project-brief.txt';
  link.textContent = 'Download your project brief';
  const status = document.querySelector('#form-status');
  status.replaceChildren(document.createTextNode('Your brief is ready. Nothing has been sent. '), link);
  link.click();
});
window.addEventListener('pagehide', () => { if (briefUrl) URL.revokeObjectURL(briefUrl); });
