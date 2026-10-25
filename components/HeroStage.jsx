'use client';
import { useState } from 'react';
import Feedback from './effects/Feedback';
export default function HeroStage() {
  const [shifted, setShifted] = useState(false);
  return <div className={'hero-stage' + (shifted ? ' shifted' : '')} aria-label="An interactive typographic composition">
    <span className="stage-label">FORM / FEELING / FUNCTION</span>
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="stage-type" aria-hidden="true">Make<br /><em>an impression.</em></div>
    <span className="stage-bottom">An experiment in moving people.</span>
    <Feedback id="shift" className="stage-button" aria-label="Change the composition colour" onClick={() => setShifted(!shifted)}>A different perspective ↗</Feedback>
  </div>;
}
