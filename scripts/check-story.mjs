import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { parseStory, serializeStory, inspectStory } from 'react-kino/document';
import { agencyStory, storyRegistrations } from '../lib/agency-story.mjs';

const json = serializeStory(agencyStory);
assert.deepEqual(parseStory(json), agencyStory, 'Portable story must round-trip');
const diagnostics = inspectStory(agencyStory, storyRegistrations);
assert.deepEqual(diagnostics, [], 'Story must contain no validation or registration warnings');
await mkdir('.story-check', { recursive: true });
await writeFile('.story-check/agency.kino.json', json);
console.log('Agency story validates, has complete registrations, and round-trips.');
