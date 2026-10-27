'use client';
import { Component, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./HeroSculptureScene'), { ssr: false, loading: () => null });

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroSculpture() {
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setReady(false), []);
  useEffect(() => {
    const media = matchMedia('(min-width: 1100px) and (prefers-reduced-motion: no-preference)');
    const update = () => { setEligible(media.matches); setReady(false); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <div className="cinema-sculpture" aria-hidden="true" data-sculpture data-renderer={eligible && ready ? 'webgl' : 'poster'}>
    <img className="sculpture-poster" src="/sculpture.svg" width="640" height="640" alt="" draggable="false" />
    {eligible && <SceneBoundary onError={onLost}><Scene onReady={onReady} onLost={onLost} /></SceneBoundary>}
  </div>;
}
