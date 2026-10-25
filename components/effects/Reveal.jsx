'use client';
import { createContext, useContext } from 'react';
import { useEntrance } from '../../hooks/useEntrance';

const DisabledContext = createContext(false);
export function EffectsScope({ disabled, children }) {
  const ancestorDisabled = useContext(DisabledContext);
  return <DisabledContext.Provider value={disabled || ancestorDisabled}>{children}</DisabledContext.Provider>;
}
export default function Reveal({
  as: Element = 'div', group, phase = 'scroll', kind = 'content',
  progression = false, index = 0, count = 0, children, ...props
}) {
  const disabled = useContext(DisabledContext);
  const { ref } = useEntrance({ phase, kind, progression, index, count, disabled });
  return <Element {...props} ref={ref} data-effect-group={group} data-effect-phase={phase}
    data-effect-kind={kind} data-effect-progression={progression ? String(count) : undefined}
    data-effect-index={progression ? String(index) : undefined}>{children}</Element>;
}
