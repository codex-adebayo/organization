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
  return <header className="nav">
    <a className="wordmark" href="#" aria-label="FORME home">forme<span>®</span></a>
    <span className="nav-note">Independent minds.<br />Extraordinary possibilities.</span>
    <Feedback className="menu-toggle" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>Menu <span>+</span></Feedback>
    <nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
      <a href="#work">Work <sup>03</sup></a><a href="#approach">Approach</a><a href="#studio">Studio</a>
      <a className="nav-contact" href="#contact">Let’s talk <span>↗</span></a>
    </nav>
  </header>;
}
