'use client';
import { useEffect, useState } from 'react';
import { Story } from 'react-kino/story';
import { agencyStory } from '../lib/agency-story.mjs';
import Reveal, { EffectsScope } from './effects/Reveal';
import Feedback from './effects/Feedback';

const components = {
  ClarityNarrative: <Reveal group="story-clarity-copy" className="story-narrative">
    <h2>First, find<br /><em>the idea.</em></h2>
    <p>Before a colour, a typeface, or a line of code: a clear thought. What makes you different, and why should someone care?</p>
    <p className="story-caption">Strategy gives the creative work something to stand for.</p>
  </Reveal>,
  ClarityVisual: <Reveal kind="media" group="story-clarity-media" className="story-art story-clarity" aria-label="Scattered thoughts resolve into one clear idea">
    <span className="story-art-label">AN EXPLORATION IN CLARITY</span>
    <span className="thought thought-one" aria-hidden="true">What if?</span>
    <span className="thought thought-two" aria-hidden="true">Why this?</span>
    <span className="thought thought-three" aria-hidden="true">For whom?</span>
    <span className="central-idea">One clear<br /><em>thought.</em></span>
    <span className="story-art-footer">A direction worth following. ↗</span>
  </Reveal>,
  ExpressionNarrative: <Reveal group="story-expression-copy" className="story-narrative">
    <h2>Then, make<br /><em>it unmistakable.</em></h2>
    <p>Give that thought a world of its own. Type, colour, composition, and interaction work together until the experience feels like one coherent expression.</p>
    <p className="story-caption">The design is the story, in a form you can explore.</p>
  </Reveal>,
  ExpressionVisual: <Reveal kind="media" group="story-expression-media" className="story-art story-expression" aria-label="A typographic identity becomes a digital composition">
    <span className="story-art-label">ONE IDEA. EVERY DETAIL.</span>
    <div className="identity-sheet"><span>FORM / FEELING / FUNCTION</span><strong>Make<br /><em>your mark.</em></strong><div className="identity-swatches" aria-hidden="true"><i /><i /><i /></div></div>
    <span className="story-art-footer">Built to be recognised. ↗</span>
  </Reveal>
};

export default function AgencyStory() {
  const [enhanced, setEnhanced] = useState(false);
  const [reading, setReading] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return <section id="story" className="agency-story" aria-labelledby="story-title">
    <div className="story-toolbar">
      <Reveal group="story-heading"><span className="eyebrow">THE THINKING BEHIND THE FEELING</span><h2 id="story-title">From first spark to first impression.</h2></Reveal>
      <Feedback type="button" aria-pressed={reading} onClick={() => setReading(value => !value)}>{reading ? 'Explore with scroll' : 'Read without motion'} <span aria-hidden="true">↗</span></Feedback>
    </div>
    <div id="agency-story-content" data-reading={String(!enhanced || reading)}>
      <EffectsScope disabled={reading}><Story document={agencyStory} components={components} reading={!enhanced || reading} className="agency-kino" /></EffectsScope>
    </div>
  </section>;
}
