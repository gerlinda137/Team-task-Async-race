const MS_IN_SEC = 1000;

export interface AnimationState {
  id: number;
  startTime: number;
  passed: number;
}

const animations = new Map<number, AnimationState>();

export const startAnimation = (
  carId: number,
  element: HTMLElement,
  distance: number,
  velocity: number
): void => {
  const duration = (distance / velocity) * MS_IN_SEC;
  const start = performance.now();

  const container = element.parentElement as HTMLElement;
  const fullDistance = container.clientWidth - element.clientWidth;

  function step(timestamp: number) {
    const state = animations.get(carId);
    if (!state) return;

    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    element.style.transform = `translateX(${progress * fullDistance}px)`;

    if (progress < 1) {
      state.id = requestAnimationFrame(step);
    }
  }

  animations.set(carId, {
    id: requestAnimationFrame(step),
    startTime: start,
    passed: 0,
  });
};
