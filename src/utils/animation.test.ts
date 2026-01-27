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

interface MockHTMLElement {
  className: string;
  style: { transform: string };
  clientWidth: number;
  parentElement: { clientWidth: number } | undefined;
  closest: (selector: string) => MockHTMLElement | undefined;
}

const createMockElement = (
  parentWidth = DEFAULT_PARENT_WIDTH,
  elementWidth = DEFAULT_ELEMENT_WIDTH,
  className = ""
): HTMLElement => {
  const element: MockHTMLElement = {
    className,
    style: { transform: "" },
    clientWidth: elementWidth,
    parentElement: parentWidth >= 0 ? { clientWidth: parentWidth } : undefined,
    closest(selector: string): MockHTMLElement | undefined {
      const cleanSelector = selector.replace(".", "");
      if (this.className.includes(cleanSelector)) {
        return this;
      }
      return undefined;
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
const HALF_PROGRESS_TIME = 500;
const INVALID_PARENT_FLAG = -1;

async function testResetTransform(): Promise<void> {
  const element = createMockElement(
    DEFAULT_PARENT_WIDTH,
    DEFAULT_ELEMENT_WIDTH,
    "car__svg-container"
  );
  resetTransform(element);
  console.assert(
    element.style.transform === "translateX(0px)",
    "ResetTransform failed"
  );
}

async function testStartAnimationError(): Promise<void> {
  try {
    const elementNoParent = createMockElement(INVALID_PARENT_FLAG);
    await startAnimation(TEST_ID_1, elementNoParent, TEST_DURATION);
    throw new Error("Should have thrown 'No container' error but didn't");
  } catch (error) {
    const newError = error as Error;
    console.assert(
      newError.message === "No container",
      `Expected 'No container' but got: ${newError.message}`
    );
  }
}

async function testStopAnimation(): Promise<void> {
  const element = createMockElement();
  const animPromise = startAnimation(TEST_ID_2, element, TEST_DURATION);
  stopAnimation(TEST_ID_2);
  const result = await animPromise;
  console.assert(
    result.finished === false,
    "StopAnimation should set finished to false"
  );
}

async function testZeroDistance(): Promise<void> {
  const element = createMockElement(PARENT_WIDTH, ELEMENT_WIDTH);
  const result = await startAnimation(TEST_ID_3, element, TEST_DURATION);
  console.assert(
    result.finished === true,
    "Zero distance should finish immediately"
  );
}

async function testAnimationProgress(): Promise<void> {
  const parentWidth = 1000;
  const elementWidth = 0;
  const element = createMockElement(parentWidth, elementWidth);

  const animPromise = startAnimation(TEST_ID_4, element, TEST_DURATION);

  if (rafCallback) {
    const startTime = performance.now();
    rafCallback(startTime + HALF_PROGRESS_TIME);

    console.assert(
      element.style.transform === "translateX(500px)",
      `Progress calculation wrong. Expected 500px, got ${element.style.transform}`
    );
  }

  if (rafCallback) {
    rafCallback(performance.now() + TEST_DURATION + 1);
  }

  const result = await animPromise;
  console.assert(result.finished === true, "Animation did not finish");
}

async function runTests(): Promise<void> {
  console.log("Running animation.ts tests...");
  await testResetTransform();
  await testStartAnimationError();
  await testStopAnimation();
  await testZeroDistance();
  await testAnimationProgress();
  console.log("Finished animation.ts tests ✓");
}

try {
  await runTests();
} catch (error) {
  throw new Error(
    `Test suite execution failed: ${error instanceof Error ? error.message : String(error)}`
  );
}
