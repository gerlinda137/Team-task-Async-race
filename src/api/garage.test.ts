import { getCars, createCar, editCar, deleteCar, getCar } from "./garage";

const TEST_ID = 123;
const TEST_PAGE = 1;
const TEST_LIMIT = 7;
const TOTAL_COUNT_MOCK = "20";
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_NOT_FOUND = 404;

interface Car {
  name: string;
  color: string;
  id: number;
}

let lastFetchUrl = "";
let lastFetchOptions: RequestInit | undefined;
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

async function runGarageApiTests(): Promise<void> {
  console.log("Running garage.ts tests...");

  const mockCars: Car[] = [{ name: "Tesla", color: "#fff", id: TEST_ID }];
  setupFetchMock(mockCars, true, STATUS_OK, { "X-Total-Count": TOTAL_COUNT_MOCK });
  
  const garageData = await getCars(TEST_PAGE, TEST_LIMIT);
  console.assert(lastFetchUrl.includes(`_page=${TEST_PAGE}`), "Error: URL missing page param");
  console.assert(garageData.totalCount === TOTAL_COUNT_MOCK, "Error: Total count header mismatch");
  console.assert(garageData.cars.length === 1, "Error: Cars array length mismatch");

  setupFetchMock({ name: "BMW", color: "#000", id: TEST_ID }, true, STATUS_CREATED);
  const newCar = await createCar("BMW", "#000");
  console.assert(lastFetchOptions?.method === "POST", "Error: Should use POST method");
  console.assert(newCar.name === "BMW", "Error: Created car name mismatch");

  setupFetchMock({ name: "Audi", color: "#ccc", id: TEST_ID });
  const updatedCar = await editCar("Audi", "#ccc", TEST_ID);
  console.assert(lastFetchUrl.endsWith(`/${TEST_ID}`), "Error: URL should end with car ID");
  console.assert(lastFetchOptions?.method === "PUT", "Error: Should use PUT method");
  console.assert(updatedCar.color === "#ccc", "Error: Updated color mismatch");

  setupFetchMock({}, true);
  await deleteCar(TEST_ID);
  console.assert(lastFetchOptions?.method === "DELETE", "Error: Should use DELETE method");

  setupFetchMock({ name: "Lexus", color: "#111", id: TEST_ID });
  const singleCar = await getCar(TEST_ID);
  console.assert(singleCar.name === "Lexus", "Error: getCar returned wrong data");

  setupFetchMock({}, false, STATUS_NOT_FOUND);
  try {
    await deleteCar(TEST_ID);
    throw new Error("Test Failed: deleteCar should have thrown");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.assert(error.message.includes(STATUS_NOT_FOUND.toString()), "Error: Exception should include status code");
    }
  }

  restoreFetch();
  console.log("Finished garage.ts tests ✓");
}

try {
  await runGarageApiTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}