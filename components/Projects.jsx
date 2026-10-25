'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal from './effects/Reveal';
import Feedback from './effects/Feedback';
const concepts = {
  terrain: { title: 'Terrain', intro: 'An outdoor culture concept for people who want to get a little further from the everyday.', visual: 'Find your outside.', question: 'How might an outdoor brand feel more like an invitation than a catalogue of equipment?', direction: 'Earthy colour, monumental typography, and terrain-inspired forms create a welcoming editorial identity. The proposed digital journey moves from inspiration to exploration with clear, accessible navigation.' },
  ondo: { title: 'Ondo', intro: 'A listening culture concept built around the personal ritual of discovering sound.', visual: 'A sound of your own.', question: 'How could a listening brand express warmth and individuality in a crowded technical category?', direction: 'A warm vermilion palette, record-inspired geometry, and expressive type make the experience tactile. Motion follows the idea of rotation, with a complete static presentation for reduced-motion preferences.' },
  folio: { title: 'Folio', intro: 'A creative spaces concept that gives independent thinking room to grow.', visual: 'Room to grow.', question: 'How can a workspace identity convey a sense of possibility before someone visits the space?', direction: 'An architectural grid and soft, unexpected colours balance structure with creative energy. The proposed website brings space details, availability, and the visit journey into a clear content hierarchy.' }
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
<Feedback preserveHover className="project project-wide" data-project="terrain" onClick={event => openProject('terrain', event.currentTarget)} aria-haspopup="dialog"><span className="art terrain"><span className="art-top">TERRAIN® <span>FIND YOUR OUTSIDE</span></span><span className="terrain-shape"></span><span className="terrain-head">A different<br />kind of escape.</span><span className="art-small">OUTDOOR CULTURE, REIMAGINED.</span><span className="project-open">Explore concept ↗</span></span><span className="project-meta"><span>Terrain <small>Outdoor culture / Concept study</small></span><span>Strategy · Identity · Digital ↗</span></span></Feedback>
<Feedback preserveHover className="project" data-project="ondo" onClick={event => openProject('ondo', event.currentTarget)} aria-haspopup="dialog"><span className="art ondo"><span className="art-top">ondo <span>EVERYDAY, ELEVATED.</span></span><span className="ondo-disc"></span><span className="ondo-type">A sound<br />of your own.</span><span className="project-open">Explore concept ↗</span></span><span className="project-meta"><span>Ondo <small>Listening culture / Concept study</small></span><span>Brand · Experience ↗</span></span></Feedback>
<Feedback preserveHover className="project project-offset" data-project="folio" onClick={event => openProject('folio', event.currentTarget)} aria-haspopup="dialog"><span className="art folio"><span className="art-top">folio/ <span>A PLACE FOR WHAT’S NEXT.</span></span><span className="folio-window"><span>YOUR NEXT CHAPTER</span><strong>Room<br />to grow.</strong><span className="folio-grid"><i></i><i></i><i></i></span><span>Spaces for independent thinking. ↗</span></span><span className="project-open">Explore concept ↗</span></span><span className="project-meta"><span>Folio <small>Creative spaces / Concept study</small></span><span>Positioning · Web · Development ↗</span></span></Feedback>
</Reveal>
    <dialog ref={dialog} id="project-dialog" aria-labelledby="dialog-title" onClick={backdropClick} onCancel={event => { event.preventDefault(); closeProject(); }} onClose={() => { setPresent(false); trigger.current?.focus(); }}>
      {present && <div data-project-panel={active}>
      <Feedback className="dialog-close" aria-label="Close project" onClick={event => closeProject()}>Close ✕</Feedback>
      <span className="eyebrow">SELF-INITIATED CONCEPT / NOT CLIENT WORK</span>
      <h2 id="dialog-title">{concept.title}</h2><p id="dialog-intro">{concept.intro}</p>
      <div id="dialog-art" className={'dialog-art ' + active} aria-hidden="true">{concept.visual}</div>
      <div className="case-columns">
        <section><h3>The question</h3><p>{concept.question}</p></section>
        <section><h3>The direction</h3><p>{concept.direction}</p></section>
      </div>
      <p className="case-note">An illustrative exploration of the agency’s proposed approach. No commissioned relationship or measured business outcome is claimed.</p>
      <a href="#contact" className="case-contact" onClick={event => closeProject()}>Have a challenge like this? Create a brief ↗</a>
      </div>}
    </dialog>
  </>;
}
