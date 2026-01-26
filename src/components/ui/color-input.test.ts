import { ColorInput } from "./color-input";

class MockInput {
  public id = "";
  public className = "";
  public type = "text";
  public value = "#000000";
  private eventListeners: Record<string, () => void> = {};

  public addEventListener(event: string, callback: () => void) {
    this.eventListeners[event] = callback;
  }

  public triggerChange(newValue: string) {
    this.value = newValue;
    if (this.eventListeners["change"]) {
      this.eventListeners["change"]();
    }
  }
}

globalThis.document = {
  createElement: (tagName: string) => {
    if (tagName === "input") return new MockInput();
    return {};
  },
} as unknown as Document;

async function runColorInputTests(): Promise<void> {
  console.log("Running color-input.ts tests...");

  const TEST_ID = "car-color-picker";
  const INITIAL_COLOR = "#ff0000";
  const NEW_COLOR = "#00ff00";

  let capturedColor = "";
  const colorInput = new ColorInput(TEST_ID, (color) => {
    capturedColor = color;
  });

  const element = colorInput.getElement() as unknown as MockInput;

  console.assert(element.id === TEST_ID, "Error: Input ID was not set correctly");
  console.assert(element.type === "color", "Error: Input type should be 'color'");
  console.assert(element.className === "input-color", "Error: Missing CSS class");

  colorInput.setColor(INITIAL_COLOR);
  console.assert(colorInput.getColor() === INITIAL_COLOR, "Error: getColor did not return the value set by setColor");

  element.triggerChange(NEW_COLOR);
  
  console.assert(
    capturedColor === NEW_COLOR, 
    "Error: onChange callback was not triggered with the correct color"
  );
  console.assert(
    colorInput.getColor() === NEW_COLOR,
    "Error: State mismatch after change event"
  );

  console.log("Finished color-input.ts tests ✓");
}

try {
  await runColorInputTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}