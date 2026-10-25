'use client';
import { useEffect, useState } from 'react';
import { Story } from 'react-kino/story';
import { agencyStory } from '../lib/agency-story.mjs';
import Reveal, { EffectsScope } from './effects/Reveal';
import Feedback from './effects/Feedback';

const components = {
  ClarityNarrative: <Reveal group="story-clarity-copy" className="story-narrative">
    <h2>Find the work<br /><em>worth automating.</em></h2>
    <p>Start with one repeatable process. Map its inputs, owners, and exceptions before deciding which parts should move automatically.</p>
    <p className="story-caption">A clear workflow gives the automation a practical purpose.</p>
  </Reveal>,
  ClarityVisual: <Reveal kind="media" group="story-clarity-media" className="story-art story-clarity" aria-label="Inputs, owners, and exceptions resolve into a defined workflow">
    <span className="story-art-label">A WORKFLOW WORTH IMPROVING</span>
    <span className="thought thought-one" aria-hidden="true">Inputs?</span>
    <span className="thought thought-two" aria-hidden="true">Owners?</span>
    <span className="thought thought-three" aria-hidden="true">Exceptions?</span>
    <span className="central-idea">One clear<br /><em>workflow.</em></span>
    <span className="story-art-footer">A flow your team can understand. ↗</span>
  </Reveal>,
  ExpressionNarrative: <Reveal group="story-expression-copy" className="story-narrative">
    <h2>Keep people<br /><em>in control.</em></h2>
    <p>Define access, review points, and exception handling before the flow goes live. Make it clear when a person needs to check a result or take over.</p>
    <p className="story-caption">Automation should make responsibility visible.</p>
  </Reveal>,
  ExpressionVisual: <Reveal kind="media" group="story-expression-media" className="story-art story-expression" aria-label="A structured workflow includes input checks, business rules, and human review">
    <span className="story-art-label">CLEAR RULES. VISIBLE OWNERSHIP.</span>
    <div className="identity-sheet"><span>INPUT / RULE / REVIEW</span><strong>Built for<br /><em>real work.</em></strong><div className="identity-swatches" aria-hidden="true"><i /><i /><i /></div></div>
    <span className="story-art-footer">Designed for the people who use it. ↗</span>
  </Reveal>
};

export default function AgencyStory() {
  const [enhanced, setEnhanced] = useState(false);
  const [reading, setReading] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return <section id="story" className="agency-story" aria-labelledby="story-title">
    <div className="story-toolbar">
      <Reveal group="story-heading"><span className="eyebrow">THE OPERATING PRINCIPLES</span><h2 id="story-title">Useful automation starts with a clear workflow.</h2></Reveal>
      <Feedback type="button" aria-pressed={reading} onClick={() => setReading(value => !value)}>{reading ? 'Explore with scroll' : 'Read without motion'} <span aria-hidden="true">↗</span></Feedback>
    </div>
    <div id="agency-story-content" data-reading={String(!enhanced || reading)}>
      <EffectsScope disabled={reading}><Story document={agencyStory} components={components} reading={!enhanced || reading} className="agency-kino" /></EffectsScope>
    </div>
  </section>;
}
