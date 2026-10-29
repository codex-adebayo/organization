'use client';
import { useEffect, useState } from 'react';
import Feedback from './effects/Feedback';

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <header className="portfolio-nav">
    <a className="portfolio-wordmark" href="#top" aria-label="FORME home">forme<span>®</span></a>
    <span className="portfolio-nav-note">Digital systems<br />built with intent.</span>
    <Feedback className="menu-toggle portfolio-menu" aria-expanded={open} aria-controls="navigation"
      onClick={() => setOpen(value => !value)}>Menu <span aria-hidden="true">{open ? '−' : '+'}</span></Feedback>
    <nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
      <a href="#services">Services <sup>03</sup></a>
      <a href="#work">Work</a>
      <a href="#approach">Approach</a>
      <a className="portfolio-contact" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
    </nav>
  </header>;
}