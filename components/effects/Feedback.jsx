'use client';
import { useInteractionFeedback } from '../../hooks/useInteractionFeedback';
export default function Feedback({
  as: Element = 'button', scaleOccupied = false, preserveHover = false, preservePress = false,
  children, ...props
}) {
  const ref = useInteractionFeedback({ scaleOccupied, preserveHover, preservePress });
  return <Element {...props} ref={ref} data-feedback>{children}</Element>;
}
