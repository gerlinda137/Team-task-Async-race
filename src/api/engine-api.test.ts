import { startEngine, driveEngine, stopEngine } from "./engine-api";

const TEST_CAR_ID = 1;
const MOCK_VELOCITY = 100;
const MOCK_DISTANCE = 5000;
const STATUS_OK = 200;
const STATUS_SERVER_ERROR = 500;

let lastFetchUrl = "";
let lastFetchOptions: RequestInit | undefined;

const originalFetch = globalThis.fetch;

const setupFetchMock = (isSuccess: boolean, status = STATUS_OK) => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    lastFetchUrl = input.toString();
    lastFetchOptions = init;

    return {
      ok: isSuccess,
      status: status,
      json: async () => ({
        velocity: MOCK_VELOCITY,
        distance: MOCK_DISTANCE,
      }),
    } as Response;
  }) as typeof fetch;
};

const restoreFetch = () => {
  globalThis.fetch = originalFetch;
};

async function runEngineApiTests(): Promise<void> {
  console.log("Running engine-api.ts tests...");

  setupFetchMock(true);
  const startData = await startEngine(TEST_CAR_ID);
  
  console.assert(startData.velocity === MOCK_VELOCITY, "Error: Incorrect velocity returned");
  console.assert(lastFetchUrl.includes("status=started"), "Error: Wrong status in URL for startEngine");
  console.assert(lastFetchOptions?.method === "PATCH", "Error: Should use PATCH method");

  setupFetchMock(true);
  await driveEngine(TEST_CAR_ID);
  console.assert(lastFetchUrl.includes("status=drive"), "Error: Wrong status in URL for driveEngine");

  setupFetchMock(true);
  await stopEngine(TEST_CAR_ID);
  console.assert(lastFetchUrl.includes("status=stopped"), "Error: Wrong status in URL for stopEngine");

  setupFetchMock(false, STATUS_SERVER_ERROR);
  try {
    await startEngine(TEST_CAR_ID);
    throw new Error("Test Failed: startEngine should have thrown an error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.assert(error.message.includes("Failed to start engine"), "Error: Wrong error message");
    }
  }

  setupFetchMock(false, STATUS_SERVER_ERROR);
  try {
    await driveEngine(TEST_CAR_ID);
    throw new Error("Test Failed: driveEngine should have thrown an error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.assert(error.message.includes(STATUS_SERVER_ERROR.toString()), "Error: Error message should include status code");
    }
  }

  restoreFetch();
  console.log("Finished engine-api.ts tests ✓");
}

try {
  await runEngineApiTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}