import { createCar } from "../api/garage";
import { getRandomColor, getRandomName } from "./random-cars";

export const generateCars = async (
  count: number,
  onCreated: () => void,
): Promise<void> => {
  const generationQueue: Promise<unknown>[] = [];
  for (let index = 0; index < count; index++) {
    generationQueue.push(createCar(getRandomName(), getRandomColor()));
  }
  await Promise.all(generationQueue);
  await onCreated();
};
