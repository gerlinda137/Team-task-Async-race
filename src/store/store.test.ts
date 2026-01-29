import state, { setGaragePage, getGaragePage } from "./store";

const INITIAL_PAGE = 1;
const NEW_PAGE_NUMBER = 5;
const RESET_PAGE_NUMBER = 2;

async function runStoreTests(): Promise<void> {
  console.log("Running store/index.ts tests...");

  console.assert(
    state.garagePage === INITIAL_PAGE,
    "Error: Initial garagePage should be " + INITIAL_PAGE
  );
  console.assert(
    state.winnersPage === INITIAL_PAGE,
    "Error: Initial winnersPage should be " + INITIAL_PAGE
  );

  setGaragePage(NEW_PAGE_NUMBER);
  console.assert(
    state.garagePage === NEW_PAGE_NUMBER,
    "Error: setGaragePage failed to update state.garagePage to " + NEW_PAGE_NUMBER
  );

  const currentPage = getGaragePage();
  console.assert(
    currentPage === NEW_PAGE_NUMBER,
    "Error: getGaragePage returned " + currentPage + " instead of " + NEW_PAGE_NUMBER
  );

  setGaragePage(RESET_PAGE_NUMBER);
  console.assert(
    getGaragePage() === RESET_PAGE_NUMBER,
    "Error: State did not update on second set call"
  );

  console.log("Finished store/index.ts tests ✓");
}

try {
  await runStoreTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}