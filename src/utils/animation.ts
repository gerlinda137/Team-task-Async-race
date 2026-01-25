const MS_IN_SEC = 1000;

export interface AnimationResult {
  timeMs: number;
  finished: boolean;
}

type AnimRecord = {
  rafId: number | null;
  element: HTMLElement;
  startTs: number;
  duration: number;
  resolve: (response: AnimationResult) => void;
};

const animations = new Map<number, AnimRecord>();

export const startAnimation = (carId: number, element: HTMLElement, velocity: number): Promise<AnimationResult> => {
  const container = element.parentElement as HTMLElement | null;
  if (!container) {
    return Promise.reject(new Error("Element has no parent container for animation"));
  }

  const fullDistance = Math.max(0, container.clientWidth - element.clientWidth);
  const duration = velocity > 0 ? (fullDistance / velocity) * MS_IN_SEC : Infinity;
  const startTs = performance.now();

  if (animations.has(carId)) {
    stopAnimation(carId);
  }

  let rafId: number | undefined = undefined;

  return new Promise<AnimationResult>((resolve) => {
    function step(ts: number) {
      const rec = animations.get(carId);
      if (!rec) {
        return;
      }

      const elapsed = ts - rec.startTs;
      const progress = rec.duration === Infinity ? 0 : Math.min(elapsed / rec.duration, 1);
      element.style.transform = `translateX(${progress * fullDistance}px)`;

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
        rec.rafId = rafId;
        animations.set(carId, rec);
      } else {
        if (rec.rafId !== null) {
          cancelAnimationFrame(rec.rafId);
        }
        animations.delete(carId);
        element.style.transform = `translateX(${fullDistance}px)`;
        resolve({ timeMs: rec.duration, finished: true });
      }
    }

    animations.set(carId, {
      rafId,
      element,
      startTs,
      duration,
      resolve,
    });

    rafId = requestAnimationFrame(step);
    const rec = animations.get(carId);
    if (rec) {
      rec.rafId = rafId;
      animations.set(carId, rec);
    }

    if (fullDistance === 0) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      animations.delete(carId);
      element.style.transform = `translateX(0px)`;
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
    console.warn("Could not reset transform on stop:", error);
  }

  try {
    rec.resolve({ timeMs: rec.duration, finished: false });
  } catch (error) {
    console.log("Could not resolve animation promise on stop:", error);
  }

  animations.delete(carId);
};