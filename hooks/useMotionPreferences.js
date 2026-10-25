'use client';
import { useSyncExternalStore } from 'react';
import { EFFECTS } from '../lib/effects-contract.mjs';

// Shared browser subscription. Primitive bitmask snapshots remain referentially stable.
const listeners = new Set();
let queries;
function getQueries() {
  if (!queries) queries = [
    matchMedia(EFFECTS.reducedQuery), matchMedia(EFFECTS.phoneQuery), matchMedia(EFFECTS.hoverQuery)
  ];
  return queries;
}
function snapshot() {
  if (typeof window === 'undefined') return 0;
  const [reduced, phone, hover] = getQueries();
  return 1 | (reduced.matches ? 2 : 0) | (phone.matches ? 4 : 0) | (hover.matches ? 8 : 0);
}
function notify() { listeners.forEach(listener => listener()); }
function subscribe(listener) {
  const media = getQueries();
  if (!listeners.size) media.forEach(query => query.addEventListener('change', notify));
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) media.forEach(query => query.removeEventListener('change', notify));
  };
}
const serverSnapshot = () => 0;
export function useMotionPreferences() {
  const value = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return { ready: value !== 0, reduced: Boolean(value & 2), phone: Boolean(value & 4), hover: Boolean(value & 8) };
}
