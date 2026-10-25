'use client';
import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { AUTOMATION_STAGES } from '../lib/automation-journey.mjs';
import HeroStage from './HeroStage';
import Reveal from './effects/Reveal';

export default function HeroScrollSection() {
  const target = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const { reduced } = useMotionPreferences();
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.3 });
  useMotionValueEvent(scrollYProgress, 'change', value => {
    const index = Math.min(2, Math.floor(Math.max(0, value) * 3));
    if (activeRef.current !== index) { activeRef.current = index; setActive(index); }
    if (target.current) target.current.dataset.progress = String(value);
  });
  return <section ref={target} id="hero-flow" className="automation-flow" aria-labelledby="flow-title"
    data-automation-flow data-active-stage={AUTOMATION_STAGES[active].id}>
    <Reveal group="flow-heading" className="flow-heading">
      <span className="eyebrow">ONE RECORD. A BETTER WAY THROUGH.</span>
      <h2 id="flow-title">From scattered data<br /><em>to useful action.</em></h2>
      <p>Scroll to follow a record through a connected workflow.</p>
    </Reveal>
    <div className="automation-flow-layout">
      <div className="flow-chapters">
        {AUTOMATION_STAGES.map((stage, index) => <Reveal as="article" key={stage.id}
          group={'flow-step-' + index} id={'flow-' + stage.id} className="flow-chapter">
          <span className="eyebrow">{String(index + 1).padStart(2, '0')} / {stage.label.toUpperCase()}</span>
          <h3>{stage.title}</h3><p>{stage.copy}</p>
          <div className="flow-example">{stage.example}</div><p className="flow-detail">{stage.detail}</p>
        </Reveal>)}
      </div>
      <div className="automation-flow-visual" data-flow-visual>
        <div className="flow-visual-heading"><span className="eyebrow">THE DATA JOURNEY</span><span>{AUTOMATION_STAGES[active].label}</span></div>
        <HeroStage externalProgress={smoothProgress} controlId="data-journey-motion-toggle" labelPrefix="data journey" />
        <div className="flow-visual-footer">
          <ol className="flow-phase-nav" aria-label="Workflow stages">
            {AUTOMATION_STAGES.map((stage, index) => <li key={stage.id}><a href={'#flow-' + stage.id}
              aria-current={active === index ? 'step' : undefined}>{String(index + 1).padStart(2, '0')} {stage.label}</a></li>)}
          </ol>
          <div className="flow-progress-track" aria-hidden="true">
            <motion.div className="flow-progress-fill" style={{ scaleX: reduced ? 1 : smoothProgress }} />
          </div>
        </div>
      </div>
    </div>
    <p className="flow-disclosure">Illustrative workflow. No customer data or live processing is shown.</p>
  </section>;
}
