import { AUTOMATION_STAGES } from '../lib/automation-journey.mjs';
import Reveal from './effects/Reveal';

// A server-rendered reading section: no scroll subscription, progress or decorative scene.
export default function HeroScrollSection() {
  return <section id="hero-flow" className="automation-flow" aria-labelledby="flow-title">
    <Reveal group="flow-heading" className="flow-heading">
      <span className="eyebrow">ONE RECORD. A BETTER WAY THROUGH.</span>
      <h2 id="flow-title">From scattered data<br /><em>to useful action.</em></h2>
      <p>Three connected stages. A clear path from the tools you use to the decisions you make.</p>
    </Reveal>
    <div className="flow-chapters">
      {AUTOMATION_STAGES.map((stage, index) => <Reveal as="article" key={stage.id}
        group={'flow-step-' + index} id={'flow-' + stage.id} className="flow-chapter">
        <span className="eyebrow">{String(index + 1).padStart(2, '0')} / {stage.label.toUpperCase()}</span>
        <h3>{stage.title}</h3><p>{stage.copy}</p>
        <div className="flow-example">{stage.example}</div><p className="flow-detail">{stage.detail}</p>
      </Reveal>)}
    </div>
    <p className="flow-disclosure">Illustrative workflow. No customer data or live processing is shown.</p>
  </section>;
}
