import { lazy, Suspense, useCallback, useEffect, useState } from "react";

// three.js + NASA imagery load only when someone presses play
const StoryFlight = lazy(() => import("./StoryFlight"));

export function openStoryModal() {
  window.dispatchEvent(new CustomEvent("open-story-modal"));
}

export default function StoryModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("open-story-modal", show);
    return () => window.removeEventListener("open-story-modal", show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true" aria-label="My story: the flight log">
      <Suspense fallback={<div className="flight-root"><div className="flight-title"><div className="eyebrow">Loading</div></div></div>}>
        <StoryFlight onClose={close} />
      </Suspense>
    </div>
  );
}
