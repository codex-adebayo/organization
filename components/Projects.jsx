'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal from './effects/Reveal';
import Feedback from './effects/Feedback';
const concepts = {
  "terrain": {
    "title": "Lead intake",
    "intro": "An illustrative workflow for turning a new enquiry into a structured record and an owned next step.",
    "visual": "Capture. Qualify. Route.",
    "question": "How can every enquiry reach the right person without being copied between tools?",
    "direction": "Proposed flow: collect structured input, check required fields, deduplicate records, then create a CRM entry and route a task. Failed checks go to an exception queue for human review."
  },
  "ondo": {
    "title": "Reporting loop",
    "intro": "An illustrative reporting flow that connects approved sources to a consistent operational view.",
    "visual": "Clarity, on repeat.",
    "question": "How could a team stop assembling the same recurring report by hand?",
    "direction": "Proposed flow: load approved source data on a schedule, map metrics consistently, validate the refresh, and publish a dashboard. Notify the owner when a data quality check or refresh fails."
  },
  "folio": {
    "title": "Operations handoff",
    "intro": "An illustrative handoff that gives the next team the information and ownership it needs.",
    "visual": "Work, in sync.",
    "question": "What should happen after one team finishes its part of a process?",
    "direction": "Proposed flow: validate the handoff record, create the next task with the required context, assign an owner, and track the approval. Missing inputs and overdue steps remain visible for follow-up."
  }
};
export default function Projects() {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const [active, setActive] = useState('terrain');
  const [present, setPresent] = useState(false);
  const concept = concepts[active];
  useEffect(() => {
    if (present && !dialog.current.open) {
      dialog.current.showModal();
      dialog.current.scrollTop = 0;
    }
  }, [present]);
  function openProject(key, button) {
    trigger.current = button;
    setActive(key);
    setPresent(true);
  }
  function closeProject() {
    dialog.current?.close();
    setPresent(false);
  }
  function backdropClick(event) {
    if (event.target !== dialog.current) return;
    const bounds = dialog.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProject();
  }
  return <>
    <Reveal className="projects" group="work-projects">
<Feedback preserveHover className="project project-wide" data-project="terrain" onClick={event => openProject('terrain', event.currentTarget)} aria-haspopup="dialog"><span className="art terrain"><span className="art-top">INFLOW <span>CRM ORCHESTRATION</span></span><span className="terrain-shape"></span><span className="terrain-head">Capture.<br />Qualify. Route.</span><span className="art-small">ILLUSTRATIVE AUTOMATION BLUEPRINT</span><span className="project-open">Explore workflow ↗</span></span><span className="project-meta"><span>Lead intake <small>CRM & operations / Workflow concept</small></span><span>Capture · Validate · Assign ↗</span></span></Feedback>
<Feedback preserveHover className="project" data-project="ondo" onClick={event => openProject('ondo', event.currentTarget)} aria-haspopup="dialog"><span className="art ondo"><span className="art-top">SIGNAL <span>REPORTING AUTOMATION</span></span><span className="ondo-disc"></span><span className="ondo-type">Clarity,<br />on repeat.</span><span className="project-open">Explore workflow ↗</span></span><span className="project-meta"><span>Reporting loop <small>Operational insight / Workflow concept</small></span><span>Refresh · Check · Publish ↗</span></span></Feedback>
<Feedback preserveHover className="project project-offset" data-project="folio" onClick={event => openProject('folio', event.currentTarget)} aria-haspopup="dialog"><span className="art folio"><span className="art-top">HANDOFF <span>CONNECTED OPERATIONS</span></span><span className="folio-window"><span>THE NEXT STEP, ALREADY CLEAR</span><strong>Work,<br />in sync.</strong><span className="folio-grid"><i></i><i></i><i></i></span><span>The right context. The right owner. ↗</span></span><span className="project-open">Explore workflow ↗</span></span><span className="project-meta"><span>Operations handoff <small>Team coordination / Workflow concept</small></span><span>Validate · Route · Follow up ↗</span></span></Feedback>
</Reveal>
    <dialog ref={dialog} id="project-dialog" aria-labelledby="dialog-title" onClick={backdropClick} onCancel={event => { event.preventDefault(); closeProject(); }} onClose={() => { setPresent(false); trigger.current?.focus(); }}>
      {present && <div data-project-panel={active}>
      <Feedback className="dialog-close" aria-label="Close project" onClick={event => closeProject()}>Close ✕</Feedback>
      <span className="eyebrow">ILLUSTRATIVE BLUEPRINT / NOT A CLIENT DEPLOYMENT</span>
      <h2 id="dialog-title">{concept.title}</h2><p id="dialog-intro">{concept.intro}</p>
      <div id="dialog-art" className={'dialog-art ' + active} aria-hidden="true">{concept.visual}</div>
      <div className="case-columns">
        <section><h3>The question</h3><p>{concept.question}</p></section>
        <section><h3>The direction</h3><p>{concept.direction}</p></section>
      </div>
      <p className="case-note">An illustrative automation concept. No live integration, customer deployment, or measured business outcome is claimed.</p>
      <a href="#contact" className="case-contact" onClick={event => closeProject()}>Have a workflow like this? Create a brief ↗</a>
      </div>}
    </dialog>
  </>;
}
