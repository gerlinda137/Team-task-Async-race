import { TextInput } from "./text-input";

class MockTextInput {
  public id = "";
  public className = "";
  public placeholder = "";
  public value = "";
}

globalThis.document = {
  createElement: (tagName: string) => {
    if (tagName === "input") return new MockTextInput();
    return {};
  },
} as unknown as Document;

async function runTextInputTests(): Promise<void> {
  console.log("Running text-input.ts tests...");

  const TEST_PLACEHOLDER = "Enter car name...";
  const TEST_ID = "car-name-input";
  const TEST_VALUE = "Tesla Model S";

  const textInput = new TextInput(TEST_PLACEHOLDER, TEST_ID);
  const element = textInput.getElement() as unknown as MockTextInput;

  console.assert(
    element.placeholder === TEST_PLACEHOLDER,
    "Error: Placeholder was not set correctly"
  );
  console.assert(element.id === TEST_ID, "Error: ID was not set correctly");
  console.assert(
    element.className === "input-text",
    "Error: CSS class name mismatch"
  );

  textInput.setValue(TEST_VALUE);
  console.assert(
    element.value === TEST_VALUE,
    "Error: Internal element value was not updated"
  );
  console.assert(
    textInput.getValue() === TEST_VALUE,
    "Error: getValue did not return the correct value"
  );

  textInput.setValue("");
  console.assert(
    textInput.getValue() === "",
    "Error: Failed to clear the input value"
  );

  console.log("Finished text-input.ts tests ✓");
}

try {
  await runTextInputTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}
