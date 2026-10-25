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
    const text = ['AUTOMATION PROJECT BRIEF', 'Prepared with the FORME data automation preview', '',
      'Name: ' + data.get('name'), 'Email: ' + data.get('email'),
      'Company / website: ' + (data.get('company') || 'Not provided'), '',
      'WORKFLOW TO IMPROVE', data.get('ambition'), '', 'Tools / data sources: ' + (data.get('sources') || 'To be discussed'), '',
      'Investment: ' + data.get('budget'), 'Ideal timing: ' + data.get('timing'), '',
      'This brief was created in your browser. It has not been sent to an agency.'].join('\n');
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    currentUrl.current = url;
    setBriefUrl(url);
    const link = document.createElement('a');
    link.href = url; link.download = 'automation-brief.txt'; link.click();
  }
  return <form id="brief-form" onSubmit={createBrief}><div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength="100" placeholder="How should we call you?" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@company.com" /></label></div><label>Company / website <span>(optional)</span><input name="company" autoComplete="organization" maxLength="200" placeholder="A little context" /></label><label>Tools or data sources <span>(optional)</span><input name="sources" maxLength="300" placeholder="CRM, spreadsheets, forms, an internal API…" /></label><label>What would you like to automate?<textarea name="ambition" required minLength="10" maxLength="4000" rows="3" placeholder="Describe the repeated task, tools involved, and what should happen instead…"></textarea></label><div className="form-row"><label>Investment in mind<select defaultValue="" name="budget" required><option value="">Choose an option</option><option>Help me scope it</option><option>Exploring a budget</option><option>I have a budget — details in my brief</option></select></label><label>Ideal timing<select defaultValue="" name="timing" required><option value="">Choose an option</option><option>As soon as practical</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Let’s work it out</option></select></label></div><Feedback preserveHover className="submit" type="submit">Create my automation brief <span>↗</span></Feedback><p id="form-status" role="status">{briefUrl && <>Your automation brief is ready. Nothing has been sent. <a href={briefUrl} download="automation-brief.txt">Download your automation brief</a></>}</p><noscript><p>Brief download needs JavaScript. You can still copy your answers into a document.</p></noscript></form>;
}
