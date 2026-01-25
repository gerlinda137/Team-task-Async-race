const ENGINE_START_DELAY = 120;
const ENGINE_STOP_DELAY = 60;
const BASE_VELOCITY = 180;
const VELOCITY_VARIANCE_FACTOR = 30;
const VELOCITY_VARIANCE_MODULO = 5;
const MIN_VELOCITY = 40;

export const startEngine = async (
  carId: number
): Promise<{ velocity: number }> => {
  await new Promise((r) => setTimeout(r, ENGINE_START_DELAY));

  const variance =
    (carId % VELOCITY_VARIANCE_MODULO) * VELOCITY_VARIANCE_FACTOR;
  const velocity = Math.max(MIN_VELOCITY, BASE_VELOCITY + variance);
  return { velocity };
};

export const stopEngine = async (): Promise<void> => {
  await new Promise((r) => setTimeout(r, ENGINE_STOP_DELAY));
};
