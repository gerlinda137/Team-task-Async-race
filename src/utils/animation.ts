const ZERO_DISTANCE = 0;
const INITIAL_PROGRESS = 0;
const MAX_PROGRESS = 1;

export interface AnimationResult {
  timeMs: number;
  finished: boolean;
}

type AnimRecord = {
  rafId: number | null;
  element: HTMLElement;
  startTs: number;
  duration: number;
  fullDistance: number;
  resolve: (response: AnimationResult) => void;
};

const animations = new Map<number, AnimRecord>();

const updateFrame = (carId: number, ts: number) => {
  const rec = animations.get(carId);
  if (!rec) return;

  const elapsed = ts - rec.startTs;
  const progress =
    rec.duration === Infinity
      ? INITIAL_PROGRESS
      : Math.min(elapsed / rec.duration, MAX_PROGRESS);

  rec.element.style.transform = `translateX(${progress * rec.fullDistance}px)`;

  if (progress < MAX_PROGRESS) {
    rec.rafId = requestAnimationFrame((newTs) => updateFrame(carId, newTs));
  } else {
    finalizeAnimation(carId, true);
  }
};

const finalizeAnimation = (carId: number, finished: boolean) => {
  const rec = animations.get(carId);
  if (!rec) return;

  if (rec.rafId !== null) cancelAnimationFrame(rec.rafId);
  if (finished)
    rec.element.style.transform = `translateX(${rec.fullDistance}px)`;

  rec.resolve({ timeMs: rec.duration, finished });
  animations.delete(carId);
};

export const startAnimation = (
  carId: number,
  element: HTMLElement,
  timeMs: number,
): Promise<AnimationResult> => {
  const container = element.parentElement as HTMLElement | null;
  if (!container) return Promise.reject(new Error("No container"));

  const fullDistance = Math.max(
    ZERO_DISTANCE,
    container.clientWidth - element.clientWidth,
  );

  if (animations.has(carId)) stopAnimation(carId);

  return new Promise<AnimationResult>((resolve) => {
    if (fullDistance === ZERO_DISTANCE) {
      element.style.transform = `translateX(0px)`;
      return resolve({ timeMs: ZERO_DISTANCE, finished: true });
    }

    const duration = timeMs > ZERO_DISTANCE ? timeMs : Infinity;

    const rec: AnimRecord = {
      rafId: null,
      element,
      startTs: performance.now(),
      duration,
      fullDistance,
      resolve,
    };
    animations.set(carId, rec);
    rec.rafId = requestAnimationFrame((ts) => updateFrame(carId, ts));
  });
};

export const stopAnimation = (carId: number): void => {
  const rec = animations.get(carId);
  if (!rec) return;

  if (rec.rafId !== null) cancelAnimationFrame(rec.rafId);
  rec.resolve({ timeMs: rec.duration, finished: false });
  animations.delete(carId);
};

export const resetTransform = (element: HTMLElement): void => {
  element.style.transform = "translateX(0px)";
};

export const cancelAnimation = (carId: number): void => {
  const rec = animations.get(carId);
  if (!rec) return;

  if (rec.rafId !== null) cancelAnimationFrame(rec.rafId);
  rec.resolve({ timeMs: rec.duration, finished: false });
  animations.delete(carId);
};
