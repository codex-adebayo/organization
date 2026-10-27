import Header from '../components/Header';
import HeroSculpture from '../components/HeroSculpture';
import HeroScrollSection from '../components/HeroScrollSection';
import Projects from '../components/Projects';
import BriefForm from '../components/BriefForm';
import Reveal from '../components/effects/Reveal';
import Feedback from '../components/effects/Feedback';
import AgencyStory from '../components/AgencyStory';

const services = [
  { title: 'Data integration', copy: 'Connect approved sources and make their data usable together. Define the fields, checks, and sync behaviour before information moves between systems.', items: ['API and tool connections', 'Data mapping and validation', 'Scheduled or event-based sync'] },
  { title: 'Workflow automation', copy: 'Replace repeatable handoffs with a clear sequence of triggers, rules, and actions. Keep ownership, approval points, and exceptions visible.', items: ['Process and trigger design', 'Routing and approval flows', 'Exception handling'] },
  { title: 'Reporting & insight', copy: 'Bring operational information into a view your team can act on. Agree consistent metrics, validate refreshes, and surface the changes that need attention.', items: ['Automated reporting', 'Dashboards and useful alerts', 'Data quality checks'] },
  { title: 'AI-assisted workflows', copy: 'Use AI for a defined task, such as extracting fields or classifying requests. Add review steps and fallbacks before a result drives the next action.', items: ['Document extraction', 'Request classification', 'Human review and safeguards'] }
];
const steps = [
  { label: 'DISCOVER', title: 'Map the real workflow.', copy: 'Identify the repeated work, source systems, owners, and bottlenecks. Agree what a useful outcome would look like before choosing the tools.', output: 'A workflow map and agreed success criteria.' },
  { label: 'DESIGN', title: 'Plan the connections.', copy: 'Define the data model, access boundaries, business rules, and review points. Decide how the flow should behave when an input is missing or a step fails.', output: 'An integration plan with clear controls.' },
  { label: 'BUILD', title: 'Build and validate.', copy: 'Implement a bounded flow, test it with approved sample data, and review both the normal path and the exceptions with the people who use it.', output: 'A working automation with tested conditions.' },
  { label: 'DELIVER', title: 'Launch with visibility.', copy: 'Set up the agreed monitoring and ownership, document how the flow runs, and make the handover practical for your team.', output: 'A runbook, handover, and operational visibility.' }
];

export default function HomePage() {
  return <>
    <a className="skip" href="#main">Skip to content</a><Header />
    <main id="main">
      <section className="hero-experience" aria-labelledby="hero-title" data-hero-experience>
        <div className="hero hero-cinema">
          <div className="cinema-horizon" aria-hidden="true" />
          <Reveal phase="hero" group="hero-copy" className="cinema-copy">
            <div className="eyebrow"><span className="status-dot" />DATA AUTOMATION, WITH PURPOSE<span className="edition">DATA / WORKFLOWS / INTELLIGENCE</span></div>
            <h1 id="hero-title">Less busywork.<br /><em>More flow.</em></h1>
            <div className="hero-foot"><p>Connect your tools. Automate repeatable work. Turn scattered information into useful decisions.</p>
              <a className="circle-link" href="#hero-flow"><span>Explore the data journey</span><span className="round-arrow">↓</span></a></div>
            <Feedback as="a" id="hero-brief-link" className="hero-brief-link" href="#contact">Scope an automation <span aria-hidden="true">↗</span></Feedback>
          </Reveal>
          <HeroSculpture />
          <div className="cinema-caption"><span>FROM COMPLEXITY TO CLARITY</span><span>CONNECTED SYSTEMS. HUMAN DECISIONS.</span></div>
        </div>
        <HeroScrollSection />
      </section>
      <AgencyStory />
      <section id="work" className="work section-pad">
        <Reveal group="work-copy"><div className="section-top"><div className="eyebrow">01 / ILLUSTRATIVE WORKFLOWS</div><p>Where repeated work<br />can become a reliable flow.</p></div>
          <h2 className="section-title">Practical flows.<br /><em>Real possibilities.</em></h2>
          <p className="concept-note">Illustrative automation blueprints. These are proposed workflows, not client deployments.</p>
        </Reveal><Projects />
      </section>
      <section className="manifesto section-pad" id="studio"><Reveal group="studio-content">
        <div className="eyebrow">02 / WHY WE EXIST</div>
        <p className="manifesto-text">Less chasing.<br />Fewer handoffs.<br />More room for<br /><em>meaningful work.</em></p>
        <div className="manifesto-bottom"><span className="big-star" aria-hidden="true">✳</span>
          <p>We’re building an agency around a practical idea: the tools your team already uses should work together.</p>
          <p>We design data pipelines, automate repeatable processes, and make operational information easier to trust. Every engagement starts by understanding how the work gets done.</p>
        </div>
      </Reveal></section>
      <section className="expertise section-pad" id="expertise">
        <Reveal group="expertise-copy" className="section-top"><span className="eyebrow">03 / HOW WE CAN HELP</span><h2>Connected systems.<br /><em>Useful outcomes.</em></h2></Reveal>
        <Reveal group="expertise-services"><div className="services">
          {services.map((service, index) => <details key={service.title} open={index === 0}>
            <Feedback as="summary"><span>{String(index + 1).padStart(2, '0')}</span><h3>{service.title}</h3><span className="plus">+</span></Feedback>
            <div className="service-body"><p>{service.copy}</p><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul></div>
          </details>)}
        </div><p className="fine-print">Proposed service scope. Tool access, data requirements, and delivery details are agreed during discovery.</p></Reveal>
      </section>
      <section id="approach" className="process section-pad">
        <Reveal className="section-top" group="process-intro"><span className="eyebrow">04 / HOW WE WORK</span><p>Start with one workflow.<br />Build from there.</p></Reveal>
        <div className="process-layout"><Reveal as="h2" group="process-heading">Clear inputs.<br /><em>Useful outcomes.</em><span className="process-mark" aria-hidden="true">↳</span></Reveal>
          <div className="steps">{steps.map((step, index) => <Reveal as="article" key={step.label} group={'process-step-' + index} progression count={4} index={index}>
            <span>{String(index + 1).padStart(2, '0')} / {step.label}</span><h3>{step.title}</h3><p>{step.copy}</p><small>Output: {step.output}</small>
          </Reveal>)}</div>
        </div>
      </section>
      <section className="contact section-pad" id="contact"><Reveal group="contact-content">
        <div className="eyebrow">05 / FIND YOUR FIRST FLOW</div><h2>What should<br /><em>work better?</em><span aria-hidden="true">↗</span></h2>
        <div className="contact-layout"><div className="contact-copy"><p>Tell us what your team repeats.<br />Let’s find a better flow.</p>
          <p className="contact-disclosure">This preview creates an automation brief you can download. It does not send an enquiry or store your details on a server. Agency contact details will be added before launch.</p>
        </div><BriefForm /></div>
      </Reveal></section>
    </main>
    <footer><Reveal className="footer-promo" group="footer-promo"><a className="wordmark" href="#" aria-label="FORME home">forme<span>®</span></a><p>Connected data. Less manual work.</p></Reveal>
      <span>Working identity · Data automation</span><a href="#main">Back to top ↑</a>
    </footer>
  </>;
}
