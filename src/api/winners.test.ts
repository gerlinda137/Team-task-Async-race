import { getWinners, getWinner, createWinner, updateWinner, WINNERS_PER_PAGE } from "./winners";

const TEST_ID = 5;
const TEST_PAGE = 1;
const TEST_WINS = 3;
const TEST_TIME = 10.5;
const TOTAL_COUNT_MOCK = "50";
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_NOT_FOUND = 404;

let lastFetchUrl = "";
let lastFetchOptions: RequestInit | undefined ;
const originalFetch = globalThis.fetch;

const setupFetchMock = (responseBody: unknown, ok = true, status = STATUS_OK, headers = {}) => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    lastFetchUrl = input.toString();
    lastFetchOptions = init;

    const headerMap = new Map(Object.entries(headers));

    return {
      ok,
      status,
      json: async () => responseBody,
      headers: {
        get: (name: string) => headerMap.get(name) || undefined,
      },
    } as Response;
  }) as typeof fetch;
};

const restoreFetch = () => {
  globalThis.fetch = originalFetch;
};

async function runWinnersApiTests(): Promise<void> {
  console.log("Running winners.ts tests...");

  setupFetchMock([], true, STATUS_OK, { "X-Total-Count": TOTAL_COUNT_MOCK });
  const winnersData = await getWinners(TEST_PAGE, WINNERS_PER_PAGE, "time", "DESC");
  console.assert(lastFetchUrl.includes("_sort=time"), "Error: Sort parameter missing");
  console.assert(lastFetchUrl.includes("_order=DESC"), "Error: Order parameter missing");
  console.assert(winnersData.totalCount === TOTAL_COUNT_MOCK, "Error: Total count mismatch");

  setupFetchMock({ id: TEST_ID, wins: TEST_WINS, time: TEST_TIME });
  const winner = await getWinner(TEST_ID);
  console.assert(winner?.wins === TEST_WINS, "Error: Winner data mismatch");

  setupFetchMock({}, false, STATUS_NOT_FOUND);
  const missingWinner = await getWinner(TEST_ID);
  console.assert(missingWinner === undefined, "Error: Should return undefined for 404");

  setupFetchMock({}, true, STATUS_CREATED);
  const createResponse = await createWinner({ id: TEST_ID, wins: 1, time: TEST_TIME });
  console.assert(lastFetchOptions?.method === "POST", "Error: Method should be POST");
  console.assert(createResponse.status === STATUS_CREATED, "Error: Status should be 201");

  setupFetchMock({}, true, STATUS_OK);
  await updateWinner(TEST_ID, { wins: TEST_WINS, time: TEST_TIME }); // This was missing
  console.assert(lastFetchOptions?.method === "PUT", "Error: Method should be PUT");
  console.assert(lastFetchUrl.includes(`/winners/${TEST_ID}`), "Error: URL missing winner ID");

  restoreFetch();
  console.log("Finished winners.ts tests ✓");
}

try {
  await runWinnersApiTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}