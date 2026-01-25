const MS_IN_SEC = 1000;

export interface AnimationResult {
  timeMs: number;
  finished: boolean;
}

interface AnimRecord {
  rafId: number | null;
  element: HTMLElement;
  startTs: number;
  duration: number;
}

const animations = new Map<number, AnimRecord>();

export const startAnimation = (carId: number, element: HTMLElement, velocity: number): Promise<AnimationResult> => {
  const container = element.parentElement as HTMLElement;
  if (!container) {
    return Promise.reject(new Error("Element has no parent container for animation"));
  }

  const fullDistance = Math.max(0, container.clientWidth - element.clientWidth);
  const duration = velocity > 0 ? (fullDistance / velocity) * MS_IN_SEC : Infinity;
  const start = performance.now();

  if (animations.has(carId)) {
    stopAnimation(carId);
  }

  let rafId: number | undefined = undefined;

  return new Promise<AnimationResult>((resolve) => {
    function step(ts: number) {
      const elapsed = ts - start;
      const progress = duration === Infinity ? 0 : Math.min(elapsed / duration, 1);
      element.style.transform = `translateX(${progress * fullDistance}px)`;

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
        animations.set(carId, { rafId, element, startTs: start, duration });
      } else {
        animations.delete(carId);
        rafId = undefined;
        resolve({ timeMs: duration, finished: true });
      }
    }

    rafId = requestAnimationFrame(step);
    animations.set(carId, { rafId, element, startTs: start, duration });

    if (fullDistance === 0) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      element.style.transform = `translateX(0px)`;
      animations.delete(carId);
      resolve({ timeMs: 0, finished: true });
    }
  });
};

export const stopAnimation = (carId: number): void => {
  const rec = animations.get(carId);
  if (!rec) return;

  if (rec.rafId !== null) {
    cancelAnimationFrame(rec.rafId);
  }
  try {
    rec.element.style.transform = "";
  } catch (error) {
    console.warn("Could not reset transform", error);
  }
  animations.delete(carId);
};