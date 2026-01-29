import { Button } from "./button";

class MockButtonElement {
  public className = "";
  public textContent = "";
  public type = "button";
  public disabled = false;
  public eventListeners: Record<string, () => void> = {};

  public addEventListener(event: string, callback: () => void) {
    this.eventListeners[event] = callback;
  }

  public click() {
    if (!this.disabled && this.eventListeners["click"]) {
      this.eventListeners["click"]();
    }
  }
}

globalThis.document = {
  createElement: (tagName: string) => {
    if (tagName === "button") return new MockButtonElement();
    return {};
  },
} as unknown as Document;

async function runButtonTests(): Promise<void> {
  console.log("Running button.ts tests...");

  const TEST_LABEL = "Click Me";
  const TEST_CLASS = "btn-primary";
  const EXPECTED_INITIAL_DISABLED = false;
  const EXPECTED_FINAL_DISABLED = true;

  let clickCount = 0;
  const button = new Button(TEST_LABEL, TEST_CLASS, "button", () => {
    clickCount += 1;
  });

  const element = button.getElement() as unknown as MockButtonElement;

  console.assert(element.textContent === TEST_LABEL, "Error: Label not set correctly");
  console.assert(element.className === TEST_CLASS, "Error: Class name not set correctly");
  console.assert(element.type === "button", "Error: Button type not set correctly");

  element.click();
  console.assert(clickCount === 1, "Error: Click handler was not called");

  console.assert(element.disabled === EXPECTED_INITIAL_DISABLED, "Error: Should be enabled by default");
  
  button.setDisabled(true);
  console.assert(element.disabled === EXPECTED_FINAL_DISABLED, "Error: setDisabled(true) failed");
  
  element.click();
  console.assert(clickCount === 1, "Error: Click handler called while button was disabled");

  console.log("Finished button.ts tests ✓");
}

try {
  await runButtonTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}