import Header from '../components/Header';
import HeroStage from '../components/HeroStage';
import Projects from '../components/Projects';
import BriefForm from '../components/BriefForm';
import Motion from '../components/Motion';

export default function HomePage() {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <Header />
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
<div className="eyebrow"><span className="status-dot"></span> A new perspective on digital <span className="edition">STUDIO CONCEPT / VOL. 01</span></div>
<h1 id="hero-title">Good ideas.<br /><span className="hero-bottom"><em>Unforgettable</em><span className="asterisk" aria-hidden="true">✳</span></span>experiences.</h1>
<div className="hero-foot"><p>We bring clarity to the complex.<br />And a little unexpected to everything.</p><a className="circle-link" href="#work"><span>Discover our thinking</span><span className="round-arrow">↓</span></a></div>
<HeroStage /></section>
      <section id="work" className="work section-pad">
<div className="section-top reveal"><div className="eyebrow">01 / SELECTED EXPLORATIONS</div><p>Different challenges.<br />The same restless curiosity.</p></div>
<h2 className="section-title reveal">Less expected.<br /><em>More remembered.</em></h2>
<p className="concept-note">Self-initiated concepts. A look at our creative direction, not commissioned client work.</p>
<Projects />
</section>
      <section className="manifesto section-pad" id="studio"><div className="eyebrow reveal">02 / A POINT OF VIEW</div><p className="manifesto-text reveal">The world has enough<br />of the <em>ordinary.</em><br />We’re here to make<br />something <span className="ink-underline">matter.</span></p><div className="manifesto-bottom reveal"><span className="big-star" aria-hidden="true">✳</span><p>FORME is a working identity for an independent digital agency. The ambition is simple: bring thoughtful strategy, distinctive design, and considered engineering into the same conversation.</p><p>Because a website should do more than look good. It should express who you are, make your value clear, and give people a reason to take the next step.</p></div></section>
      <section className="expertise section-pad" id="expertise"><div className="section-top reveal"><span className="eyebrow">03 / WHAT WE BRING</span><h2>From first question<br />to final <em>detail.</em></h2></div><div className="services">
<details className="reveal" open><summary><span>01</span><h3>Strategy & direction</h3><span className="plus">+</span></summary><div className="service-body"><p>Start with the right questions. Define what makes the business different, who needs to hear it, and what the experience should achieve.</p><ul><li>Discovery & positioning</li><li>Creative direction</li><li>Content & experience planning</li></ul></div></details>
<details className="reveal"><summary><span>02</span><h3>Identity & expression</h3><span className="plus">+</span></summary><div className="service-body"><p>A coherent visual language that gives your business a recognisable point of view, from the smallest detail to the biggest impression.</p><ul><li>Visual identity</li><li>Typography & art direction</li><li>Digital brand systems</li></ul></div></details>
<details className="reveal"><summary><span>03</span><h3>Digital experiences</h3><span className="plus">+</span></summary><div className="service-body"><p>Websites and interfaces shaped around real people. Clear journeys, expressive composition, and interactions that make sense.</p><ul><li>Web & interface design</li><li>Responsive systems</li><li>Prototypes & motion design</li></ul></div></details>
<details className="reveal"><summary><span>04</span><h3>Creative engineering</h3><span className="plus">+</span></summary><div className="service-body"><p>Translate the idea into a resilient experience. Build for performance, access, and the people who will maintain it.</p><ul><li>Frontend development</li><li>Interaction engineering</li><li>Accessibility & performance review</li></ul></div></details>
</div><p className="fine-print">Proposed capabilities for the agency. Final service scope will be confirmed before launch.</p></section>
      <section id="approach" className="process section-pad"><div className="section-top reveal"><span className="eyebrow">04 / HOW IT COMES TOGETHER</span><p>Room to explore.<br />A clear way forward.</p></div><div className="process-layout"><h2 className="reveal">Good chemistry.<br /><em>Great process.</em><span className="process-mark" aria-hidden="true">↳</span></h2><div className="steps"><article className="reveal"><span>01 / DISCOVER</span><h3>Understand the ambition.</h3><p>We listen, challenge assumptions, and define what success should look like. You bring the context; we shape the right questions.</p><small>Output: a shared brief and clear priorities.</small></article><article className="reveal"><span>02 / DEFINE</span><h3>Find the central idea.</h3><p>We connect the positioning, story, and experience into a direction that feels specific to your business.</p><small>Output: creative direction and experience structure.</small></article><article className="reveal"><span>03 / DESIGN</span><h3>Make it feel inevitable.</h3><p>We explore, prototype, and refine the visual system with you. Typography, content, and motion develop together.</p><small>Output: responsive designs and an interactive prototype.</small></article><article className="reveal"><span>04 / DELIVER</span><h3>Bring every detail to life.</h3><p>We build, test, and prepare for launch, checking the experience across screens, inputs, and motion preferences.</p><small>Output: a tested website and a practical handover.</small></article></div></div></section>
      <section className="contact section-pad" id="contact"><div className="eyebrow reveal">05 / SOMETHING STARTS HERE</div><h2 className="reveal">What are you<br /><em>imagining?</em><span aria-hidden="true">↗</span></h2><div className="contact-layout"><div className="contact-copy"><p>A bold first step. A better next chapter.<br />Let’s give your idea some shape.</p><p className="contact-disclosure">This preview creates a project brief you can download. It does not send an enquiry or store your details on a server. Agency contact details will be added before launch.</p></div>
<BriefForm /></div></section>
    </main>
    <footer><a className="wordmark" href="#" aria-label="FORME home">forme<span>®</span></a><p>A little curiosity goes a long way.</p><span>Working identity · Concept edition</span><a href="#main">Back to top ↑</a></footer>
    <Motion />
  </>;
}
