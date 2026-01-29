import { BaseComponent } from "./base-component";

class MockElement {
  public className = "";
  public children: MockElement[] = [];
  public tagName: string;

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  public append(child: MockElement) {
    this.children.push(child);
  }
}

globalThis.document = {
  createElement: (tagName: string) => new MockElement(tagName),
} as unknown as Document;

class TestComponent extends BaseComponent<HTMLElement> {
  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    super(tag, className);
  }
}

async function runBaseComponentTests(): Promise<void> {
  console.log("Running base-component.ts tests...");

  const TEST_TAG = "section";
  const TEST_CLASS = "my-custom-class";

  const component = new TestComponent(TEST_TAG, TEST_CLASS);
  const element = component.getElement();

  console.assert(
    (element as unknown as MockElement).tagName === TEST_TAG.toUpperCase(),
    "Error: Component created with wrong tag name"
  );
  console.assert(
    element.className === TEST_CLASS,
    "Error: Component created with wrong class name"
  );

  const mockParent = new MockElement("div");
  component.mount(mockParent as unknown as HTMLElement);

  console.assert(
    mockParent.children.length === 1,
    "Error: Parent should have 1 child after mount"
  );
  console.assert(
    mockParent.children[0] === (element as unknown as MockElement),
    "Error: Parent's child is not the component's element"
  );

  console.log("Finished base-component.ts tests ✓");
}

try {
  await runBaseComponentTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}
