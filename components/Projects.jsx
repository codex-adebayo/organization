'use client';
import { useRef } from 'react';
import Reveal from './effects/Reveal';
import Feedback from './effects/Feedback';

const concepts = {
  signal: {
    title: 'SignalOS',
    practice: 'Automation / Operations',
    intro: 'An illustrative operations layer that turns incoming work into structured decisions and owned next steps.',
    visual: 'One signal.\nOne owner.',
    question: 'How could a growing team move work across forms, inboxes, and internal tools without losing context?',
    direction: 'Map the intake, validate the record, apply agreed routing rules, create the next action, and surface exceptions for a person to resolve.',
    proof: ['Workflow map', 'Connected prototype', 'Exception runbook']
  },
  northstar: {
    title: 'Northstar',
    practice: 'Web design / Product story',
    intro: 'An illustrative digital flagship that makes a complex offer understandable, credible, and easy to act on.',
    visual: 'Make the\ncase clearly.',
    question: 'How can a specialist company turn deep expertise into a website that earns attention and qualified conversations?',
    direction: 'Shape the proposition, build a flexible editorial system, prototype the key journeys, then engineer a fast and accessible Next.js experience.',
    proof: ['Message system', 'Responsive design', 'Production build']
  },
  gatehouse: {
    title: 'Gatehouse',
    practice: 'Cybersecurity / Assurance',
    intro: 'An illustrative security engagement that turns technical findings into a prioritized and verifiable hardening plan.',
    visual: 'Find. Fix.\nVerify.',
    question: 'How can a team understand where its web estate is exposed and what should be fixed first?',
    direction: 'Agree the scope, review the attack surface, validate findings, rank remediation by business impact, and recheck the agreed fixes.',
    proof: ['Attack-surface review', 'Prioritized findings', 'Remediation verification']
  }
};

export default function Projects() {
  const dialog = useRef(null);

  function openProject(key) {
    const panel = dialog.current;
    if (!panel) return;
    panel.querySelectorAll('[data-project-panel]').forEach(section => {
      section.hidden = section.dataset.projectPanel !== key;
    });
    panel.setAttribute('aria-labelledby', 'dialog-title-' + key);
    if (!panel.open) panel.showModal();
    panel.scrollTop = 0;
  }
  function closeProject() {
    dialog.current?.close();
  }
  function backdropClick(event) {
    const panel = dialog.current;
    if (event.target !== panel) return;
    const bounds = panel.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) panel.close();
  }

  return <>
    <Reveal className="portfolio-projects" group="work-projects">
      {Object.entries(concepts).map(([key, project], index) =>
        <Feedback scaleOccupied preserveHover key={key} type="button" className={'portfolio-project project-' + key + (index === 0 ? ' project-featured' : '')}
          data-project={key} onClick={() => openProject(key)} aria-haspopup="dialog" aria-controls="project-dialog">
          <span className="project-visual">
            <span className="project-index">0{index + 1} / 03</span>
            <span className="project-signal" aria-hidden="true"><i></i><i></i><i></i></span>
            <strong>{project.visual.split('\n').map((line, lineIndex) => <span key={lineIndex}>{line}<br /></span>)}</strong>
            <span className="project-open">Open study ↗</span>
          </span>
          <span className="project-caption"><span>{project.title}<small>{project.practice}</small></span><span>Illustrative concept ↗</span></span>
        </Feedback>)}
    </Reveal>

    <dialog ref={dialog} id="project-dialog" aria-labelledby="dialog-title-signal" onClick={backdropClick}>
      {Object.entries(concepts).map(([key, concept], index) =>
        <div key={key} data-project-panel={key} hidden={index !== 0}>
          <Feedback type="button" className="dialog-close" aria-label="Close project" onClick={closeProject}>Close ✕</Feedback>
          <span className="eyebrow">ILLUSTRATIVE CONCEPT / {concept.practice.toUpperCase()}</span>
          <h2 id={'dialog-title-' + key}>{concept.title}</h2><p>{concept.intro}</p>
          <div className={'portfolio-dialog-visual dialog-' + key} aria-hidden="true">{concept.visual}</div>
          <div className="case-columns">
            <section><h3>The question</h3><p>{concept.question}</p></section>
            <section><h3>The direction</h3><p>{concept.direction}</p></section>
          </div>
          <div className="project-proof"><span>Proposed outputs</span><ul>{concept.proof.map(item => <li key={item}>{item}</li>)}</ul></div>
          <p className="case-note">A self-initiated concept used to demonstrate our approach. No customer deployment or measured result is claimed.</p>
          <a href="#contact" className="case-contact" onClick={closeProject}>Discuss a project like this ↗</a>
        </div>)}
    </dialog>
  </>;
}
