import { startAnimation, stopAnimation, resetTransform } from "./animation";

globalThis.performance = { now: () => Date.now() } as Performance;

let rafCallback: FrameRequestCallback | undefined;
globalThis.requestAnimationFrame = (callBack: FrameRequestCallback) => {
  rafCallback = callBack;
  return 1;
};
globalThis.cancelAnimationFrame = () => {
  rafCallback = undefined;
};

const DEFAULT_PARENT_WIDTH = 1000;
const DEFAULT_ELEMENT_WIDTH = 200;

const createMockElement = (
  parentWidth = DEFAULT_PARENT_WIDTH,
  elementWidth = DEFAULT_ELEMENT_WIDTH
) => {
  const element = {
    style: { transform: "" },
    clientWidth: elementWidth,
    parentElement: {
      clientWidth: parentWidth,
    },
  };
  return element as unknown as HTMLElement;
};

const TEST_DURATION = 1000;
const TEST_ID_1 = 1;
const TEST_ID_2 = 2;
const TEST_ID_3 = 3;
const TEST_ID_4 = 4;
const ELEMENT_WIDTH = 500;
const PARENT_WIDTH = 500;
const HALF_PROGRESS = 500;

async function testResetTransform() {
  const element = createMockElement();
  resetTransform(element);
  console.assert(
    element.style.transform === "translateX(0px)",
    "ResetTransform failed"
  );
}

async function testStartAnimationError() {
  try {
    await startAnimation(TEST_ID_1, {} as HTMLElement, TEST_DURATION);
    console.error("Should have thrown 'No container' error");
  } catch {
    console.assert(true, "Wrong error message");
  }
}

async function testStopAnimation() {
  const element = createMockElement();
  const animPromise = startAnimation(TEST_ID_2, element, TEST_DURATION);
  stopAnimation(TEST_ID_2);
  const result = await animPromise;
  console.assert(
    result.finished === false,
    "StopAnimation should set finished to false"
  );
}

async function testZeroDistance() {
  const element = createMockElement(PARENT_WIDTH, ELEMENT_WIDTH);
  const result = await startAnimation(TEST_ID_3, element, TEST_DURATION);
  console.assert(
    result.finished === true,
    "Zero distance should finish immediately"
  );
}

async function testAnimationProgress() {
  const element = createMockElement(TEST_DURATION, 0);
  const animPromise = startAnimation(TEST_ID_4, element, TEST_DURATION);

  if (rafCallback) {
    const start = performance.now();
    (rafCallback as FrameRequestCallback)(start + HALF_PROGRESS);
    console.assert(
      element.style.transform === "translateX(500px)",
      "Progress calculation wrong at 50%"
    );
  }

  if (rafCallback) {
    (rafCallback as FrameRequestCallback)(performance.now() + TEST_DURATION);
  }
  const result = await animPromise;
  console.assert(result.finished === true, "Animation did not finish");
}

async function runTests() {
  console.log("Running animation.ts tests...");
  await testResetTransform();
  await testStartAnimationError();
  await testStopAnimation();
  await testZeroDistance();
  await testAnimationProgress();
  console.log("All tests passed!");
}

await runTests();
