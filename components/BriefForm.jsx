'use client';
import { useEffect, useRef, useState } from 'react';
import Feedback from './effects/Feedback';

export default function BriefForm() {
  const [briefUrl, setBriefUrl] = useState('');
  const currentUrl = useRef('');
  useEffect(() => () => { if (currentUrl.current) URL.revokeObjectURL(currentUrl.current); }, []);

  function createBrief(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = [
      'FORME PROJECT BRIEF', 'Created in the FORME portfolio preview', '',
      'Name: ' + data.get('name'), 'Email: ' + data.get('email'),
      'Company / website: ' + (data.get('company') || 'Not provided'),
      'Primary service: ' + data.get('service'), '',
      'THE OPPORTUNITY', data.get('ambition'), '',
      'Current systems / context: ' + (data.get('context') || 'To be discussed'), '',
      'Investment: ' + data.get('budget'), 'Ideal timing: ' + data.get('timing'), '',
      'This brief was created in your browser. It has not been sent to an agency.'
    ].join('\n');
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    currentUrl.current = url;
    setBriefUrl(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'forme-project-brief.txt';
    link.click();
  }

  return <form id="brief-form" onSubmit={createBrief}>
    <div className="form-row">
      <label>Your name<input name="name" autoComplete="name" required maxLength="100" placeholder="How should we call you?" /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@company.com" /></label>
    </div>
    <label>Company / website <span>(optional)</span><input name="company" autoComplete="organization" maxLength="200" placeholder="A little context" /></label>
    <label>Primary service<select defaultValue="" name="service" required>
      <option value="">Choose a practice</option>
      <option>Automation</option><option>Web design</option><option>Cybersecurity</option><option>Connected engagement</option>
    </select></label>
    <label>What needs to change?<textarea name="ambition" required minLength="10" maxLength="4000" rows="4"
      placeholder="Describe the opportunity, risk, or experience you want to improve…"></textarea></label>
    <label>Current systems / context <span>(optional)</span><input name="context" maxLength="400"
      placeholder="Tools, website, infrastructure, constraints, or known risks…" /></label>
    <div className="form-row">
      <label>Investment in mind<select defaultValue="" name="budget" required>
        <option value="">Choose an option</option><option>Help me scope it</option><option>£5k–£15k</option>
        <option>£15k–£40k</option><option>£40k+</option>
      </select></label>
      <label>Ideal timing<select defaultValue="" name="timing" required>
        <option value="">Choose an option</option><option>As soon as practical</option><option>Within 1–3 months</option>
        <option>Within 3–6 months</option><option>Let’s work it out</option>
      </select></label>
    </div>
    <Feedback preserveHover className="submit portfolio-submit" type="submit">Create my project brief <span aria-hidden="true">↗</span></Feedback>
    <p id="form-status" role="status">{briefUrl && <>Your project brief is ready. Nothing has been sent. <a href={briefUrl} download="forme-project-brief.txt">Download it again</a></>}</p>
    <noscript><p>Brief download needs JavaScript. You can still copy your answers into a document.</p></noscript>
  </form>;
}