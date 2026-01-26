import { generateCars } from "./generate-cars";

let fetchCallCount = 0;
const originalFetch = globalThis.fetch;

const setupFetchMock = () => {
  fetchCallCount = 0;
  globalThis.fetch = (async () => {
    fetchCallCount++;
    return {
      ok: true,
      status: 201,
      json: async () => ({
        id: fetchCallCount,
        name: "Mock Car",
        color: "#ffffff",
      }),
    } as Response;
  }) as typeof fetch;
};

const restoreFetch = () => {
  globalThis.fetch = originalFetch;
};

async function runGenerateCarsTests() {
  console.log("Running generate-cars.ts tests...");

  setupFetchMock();

  let onCreatedCalled = Boolean(false);

  const carCount = 5;
  await generateCars(carCount, () => {
    onCreatedCalled = true;
  });

  console.assert(
    fetchCallCount === carCount,
    `Expected fetch to be called ${carCount} times, but got ${fetchCallCount}`
  );
  console.assert(
    onCreatedCalled === true,
    "onCreated callback was not called after generating cars"
  );

  setupFetchMock();

  let zeroOnCreatedCalled = false;

  await generateCars(0, () => {
    zeroOnCreatedCalled = true;
  });

  console.assert(
    fetchCallCount === 0,
    "Fetch should not be called when generating 0 cars"
  );
  console.assert(
    zeroOnCreatedCalled === Boolean(true),
    "onCreated should still be called even when count = 0"
  );

  restoreFetch();

  console.log("All generate-cars tests passed ✓");
}

try {
  await runGenerateCarsTests();
} catch (error) {
  console.error("Test suite failed:", error);
  throw error;
}
