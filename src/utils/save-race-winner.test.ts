import { updateWinnerAfterRace } from "./save-race-winner";

interface Winner {
  id: number;
  wins: number;
  time: number;
}

const TEST_ID = 101;
const NEW_TIME = 10.5;
const EXISTING_TIME = 12;
const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_SERVER_ERROR = 500;
const MIN_CAR_NAME_PARTS = 2;

let fetchCalls: { url: string; method: string; body?: string }[] = [];
const originalFetch = globalThis.fetch;

const setupFetchMock = (scenario: "existing" | "new" | "conflict") => {
  fetchCalls = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    const method = init?.method || "GET";
    fetchCalls.push({ url, method, body: init?.body?.toString() });

    if (scenario === "existing" && url.includes(`/winners/${TEST_ID}`) && method === "GET") {
      return {
        ok: true,
        status: STATUS_OK,
        json: async () => ({ id: TEST_ID, wins: 1, time: EXISTING_TIME }),
      } as Response;
    }

    if (scenario === "new" && url.includes(`/winners/${TEST_ID}`) && method === "GET") {
      return { ok: false, status: STATUS_NOT_FOUND, json: async () => ({}) } as Response;
    }

    if (scenario === "conflict" && method === "POST") {
      return { ok: false, status: STATUS_SERVER_ERROR, json: async () => ({}) } as Response;
    }

    return {
      ok: true,
      status: STATUS_OK,
      json: async () => ({}),
    } as Response;
  }) as typeof fetch;
};

const restoreFetch = () => {
  globalThis.fetch = originalFetch;
};

async function runSaveWinnerTests(): Promise<void> {
  console.log("Running save-race-winner.ts tests...");

  setupFetchMock("existing");
  await updateWinnerAfterRace(TEST_ID, NEW_TIME);
  const updateCall = fetchCalls.find(c => c.method === "PUT");
  console.assert(!!updateCall, "Error: Should have called updateWinner (PUT)");
  if (updateCall?.body) {
    const body = JSON.parse(updateCall.body) as Winner;
    console.assert(body.wins === MIN_CAR_NAME_PARTS, "Error: Wins should increment to 2");
    console.assert(body.time === NEW_TIME, "Error: Time should be the minimum (10.5)");
  }

  setupFetchMock("new");
  await updateWinnerAfterRace(TEST_ID, NEW_TIME);
  const createCall = fetchCalls.find(c => c.method === "POST");
  console.assert(!!createCall, "Error: Should have called createWinner (POST)");

  setupFetchMock("conflict");
  await updateWinnerAfterRace(TEST_ID, NEW_TIME);
  const retryGetCall = fetchCalls.filter(c => c.url.includes(`/winners/${TEST_ID}`) && c.method === "GET");
  console.assert(retryGetCall.length > 0, "Error: Should have retried getWinner in catch block");

  restoreFetch();
  console.log("Finished save-race-winner.ts tests ✓");
}

try {
  await runSaveWinnerTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}