export const startEngine = async (carId: number): Promise<{ velocity: number }> => {
    await new Promise((r) => setTimeout(r, 120));

    const base = 180;
    const variance = (carId % 5) * 30;
    const velocity = Math.max(50, base + variance);
    return { velocity };
  };
  
  export const stopEngine = async (_carId: number): Promise<void> => {
    await new Promise((r) => setTimeout(r, 60));
    return;
  };