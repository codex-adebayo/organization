'use client';
import { useEffect } from 'react';
export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    function setup() {
      observer?.disconnect();
      document.body.classList.remove('motion-ready');
      if (preference.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
      document.body.classList.add('motion-ready');
    }
    setup();
    preference.addEventListener('change', setup);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', setup);
      document.body.classList.remove('motion-ready');
    };
  }, []);
  return null;
}
