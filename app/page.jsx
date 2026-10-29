import Header from '../components/Header';
import HeroSculpture from '../components/HeroSculpture';
import Projects from '../components/Projects';
import BriefForm from '../components/BriefForm';
import Reveal from '../components/effects/Reveal';
import Feedback from '../components/effects/Feedback';

const practices = [
  {
    id: 'automation', number: '01', label: 'AUTOMATION',
    title: 'Let the work move itself.',
    copy: 'We connect the systems your team already uses and turn repeatable handoffs into visible, dependable workflows. People stay in control where judgment matters.',
    inputs: ['Forms & inboxes', 'CRM & operations', 'Business rules'],
    flow: ['Capture', 'Decide', 'Route'], checkpoint: 'Human review for exceptions',
    deliverables: ['Workflow and data mapping', 'Integrations and automations', 'Monitoring, documentation, handover']
  },
  {
    id: 'web-design', number: '02', label: 'WEB DESIGN',
    title: 'Turn attention into action.',
    copy: 'We clarify your proposition, design a distinct digital system, and engineer the production experience. Every page has a job and every interaction earns its place.',
    inputs: ['Positioning', 'Content & journeys', 'Design system'],
    flow: ['Frame', 'Design', 'Build'], checkpoint: 'Accessible, responsive, production ready',
    deliverables: ['Digital strategy and messaging', 'UX, visual design, prototyping', 'Next.js engineering and launch support']
  },
  {
    id: 'cybersecurity', number: '03', label: 'CYBERSECURITY',
    title: 'Find the risk. Prove the fix.',
    copy: 'We review the web estate, validate meaningful weaknesses, and turn findings into an ordered remediation plan. Consequential actions stay with the right human owner.',
    inputs: ['Approved scope', 'Web & cloud surface', 'Existing controls'],
    flow: ['Discover', 'Validate', 'Harden'], checkpoint: 'Evidence and owner approval',
    deliverables: ['Attack-surface and application review', 'Prioritized remediation guidance', 'Fix verification and security handover']
  }
];

const steps = [
  { number: '01', title: 'Frame the problem.', copy: 'We define the outcome, the people involved, the current system, and the boundaries that matter.', output: 'Brief, scope, success criteria' },
  { number: '02', title: 'Design the system.', copy: 'We shape the experience, workflow, or security plan before committing effort to production.', output: 'Architecture, prototype, delivery plan' },
  { number: '03', title: 'Build with evidence.', copy: 'We work in reviewable increments and test the important paths as the solution takes shape.', output: 'Working system and validation' },
  { number: '04', title: 'Launch with ownership.', copy: 'We document decisions, train the owner, and leave the team with a clear way to operate and improve it.', output: 'Handover, runbook, next priorities' }
];

export default function HomePage() {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <Header />
    <main id="main">
      <section id="top" className="portfolio-hero" aria-labelledby="hero-title">
        <div className="portfolio-hero-grid">
          <Reveal phase="hero" group="hero-copy" className="portfolio-hero-copy">
            <div className="eyebrow"><span className="status-dot" />INDEPENDENT DIGITAL PRACTICE<span className="edition">LAGOS / WORKING GLOBALLY</span></div>
            <h1 id="hero-title">Build better.<br /><em>Move securely.</em></h1>
            <p className="portfolio-hero-lede">Automation that removes drag. Websites that make the case. Cybersecurity that protects what matters.</p>
            <div className="portfolio-hero-actions">
              <Feedback as="a" id="hero-brief-link" className="primary-action" href="#contact">Start a project <span aria-hidden="true">↗</span></Feedback>
              <a className="text-action" href="#services">Explore our practice <span aria-hidden="true">↓</span></a>
            </div>
          </Reveal>
          <HeroSculpture />
        </div>
        <div className="portfolio-hero-rail" aria-label="Core practices">
          <span>01 Automation</span><span>02 Web design</span><span>03 Cybersecurity</span>
        </div>
      </section>

      <section id="services" className="practice-section">
        <Reveal group="practice-intro" className="practice-intro">
          <span className="eyebrow">THE PRACTICE / 03 CAPABILITIES</span>
          <h2>One partner for the system,<br /><em>the experience, and the risk.</em></h2>
          <p>Each engagement has a clear brief, named decisions, and evidence you can carry forward.</p>
        </Reveal>
        <div className="practice-list">
          {practices.map((practice, index) => <Reveal as="article" key={practice.id} id={practice.id}
            group={'practice-' + index} progression count={3} index={index} className={'practice-card practice-' + practice.id}>
            <div className="practice-copy">
              <div className="practice-kicker"><span>{practice.number}</span><span>{practice.label}</span></div>
              <h3>{practice.title}</h3><p>{practice.copy}</p>
              <ul className="practice-deliverables">{practice.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
              <a href="#contact">Brief this practice ↗</a>
            </div>
            <div className="practice-console" aria-label={practice.label + ' delivery model'}>
              <div className="console-head"><span>FORME / {practice.label}</span><span>READY TO SCOPE</span></div>
              <div className="console-inputs">{practice.inputs.map(item => <span key={item}>{item}</span>)}</div>
              <ol>{practice.flow.map((item, flowIndex) => <li key={item}><span>0{flowIndex + 1}</span><strong>{item}</strong></li>)}</ol>
              <div className="console-check"><span>CHECKPOINT</span><strong>{practice.checkpoint}</strong></div>
            </div>
          </Reveal>)}
        </div>
      </section>

      <section id="work" className="portfolio-work section-pad">
        <Reveal group="work-copy" className="portfolio-section-heading">
          <span className="eyebrow">SELECTED THINKING / SELF-INITIATED</span>
          <h2>Ideas made<br /><em>specific.</em></h2>
          <p>Three concept studies show how we turn a broad ambition into a system people can understand, use, and trust.</p>
        </Reveal>
        <Projects />
      </section>

      <section id="approach" className="operating-section">
        <Reveal group="operating-intro" className="operating-intro">
          <span className="eyebrow">HOW WE WORK</span>
          <h2>Agency craft.<br /><em>Operational clarity.</em></h2>
          <p>A single process adapts to all three practices. The output changes; the discipline stays the same.</p>
        </Reveal>
        <div className="operating-grid">
          {steps.map((step, index) => <Reveal as="article" key={step.number} group={'operating-step-' + index}
            progression count={4} index={index} className="operating-step">
            <span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p><small>Output / {step.output}</small>
          </Reveal>)}
        </div>
      </section>

      <section className="standards-section">
        <Reveal group="standards-copy" className="standards-grid">
          <div><span className="eyebrow">DELIVERY STANDARD</span><h2>Acts with a brief.<br /><em>Hands back proof.</em></h2></div>
          <div className="standards-list">
            <p><span>01</span><strong>Bounded by scope</strong><small>Access, actions, and success criteria are agreed before delivery starts.</small></p>
            <p><span>02</span><strong>Human at the checkpoint</strong><small>Brand, business, and security decisions stay with an accountable person.</small></p>
            <p><span>03</span><strong>Evidence over theatre</strong><small>Working prototypes, test results, documentation, and verified fixes make progress visible.</small></p>
          </div>
        </Reveal>
      </section>

      <section className="portfolio-contact-section section-pad" id="contact">
        <Reveal group="contact-content">
          <div className="eyebrow">START WITH THE REAL PROBLEM</div>
          <h2>What should<br /><em>work better?</em><span aria-hidden="true">↗</span></h2>
          <div className="contact-layout">
            <div className="contact-copy"><p>Bring the repeated work, the ambitious website, or the security concern. We’ll turn it into a clear first engagement.</p>
              <div className="contact-practices"><span>Automation</span><span>Web design</span><span>Cybersecurity</span></div>
              <p className="contact-disclosure">This portfolio preview creates a project brief in your browser. It does not send or store your details. Contact delivery will be connected before public launch.</p>
            </div>
            <BriefForm />
          </div>
        </Reveal>
      </section>
    </main>
    <footer className="portfolio-footer">
      <Reveal className="footer-promo" group="footer-promo"><a className="portfolio-wordmark" href="#top" aria-label="FORME home">forme<span>®</span></a><p>Build better. Move securely.</p></Reveal>
      <span>Automation · Web design · Cybersecurity</span><a href="#top">Back to top ↑</a>
    </footer>
  </>;
}