import { getRandomName, getRandomColor } from "./random-cars";

const MIN_WORDS_EXPECTED = 2;

async function runRandomCarsTests(): Promise<void> {
  console.log("Running random-cars.ts tests...");

  const name = getRandomName();
  console.assert(typeof name === "string", "Error: Name should be a string");
  console.assert(
    name.split(" ").length >= MIN_WORDS_EXPECTED,
    "Error: Name should contain at least Brand and Model"
  );

  const color = getRandomColor();
  const hexRegex = /^#[0-9a-f]{6}$/;
  console.assert(
    hexRegex.test(color),
    "Error: Color " + color + " is not a valid 6-digit hex string"
  );

  const ITERATIONS = 100;
  for (let index = 0; index < ITERATIONS; index++) {
    const randomName = getRandomName();
    const randomColor = getRandomColor();

    if (randomName.includes("undefined") || randomColor.includes("undefined")) {
      throw new Error("Found undefined in random output at iteration " + index);
    }
  }

  console.log("Finished random-cars.ts tests ✓");
}

try {
  await runRandomCarsTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}
