import { CarIcon } from "./car-icon";

const TEST_COLOR_RED = "#ff0000";
const TEST_COLOR_BLUE = "#0000ff";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

class MockSVGElement {
  public attributes: Record<string, string> = {};
  public children: MockSVGElement[] = [];

  constructor(
    public tagName: string,
    public namespaceURI: string
  ) {}

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): string | undefined {
    return this.attributes[name] || undefined;
  }

  public append(child: MockSVGElement): void {
    this.children.push(child);
  }
}

class MockDivElement {
  public className = "";
  public children: MockSVGElement[] = [];
  public append(child: MockSVGElement): void {
    this.children.push(child);
  }
}

globalThis.document = {
  createElement: (tagName: string) => {
    if (tagName === "div") return new MockDivElement();
    return {};
  },
  createElementNS: (namespace: string, tagName: string) => {
    return new MockSVGElement(tagName, namespace);
  },
} as unknown as Document;

async function runCarIconTests(): Promise<void> {
  console.log("Running car-icon.ts tests...");

  const carIcon = new CarIcon(TEST_COLOR_RED);
  const wrapper = carIcon.getElement() as unknown as MockDivElement;

  console.assert(
    wrapper.className === "car__img-wrapper",
    "Error: Wrapper should have correct class name"
  );

  console.assert(
    wrapper.children.length === 1,
    "Error: Wrapper should contain exactly one SVG child"
  );

  const svg = wrapper.children[0];
  console.assert(
    svg.namespaceURI === SVG_NAMESPACE,
    "Error: SVG should be created with correct namespace"
  );

  const group = svg.children[0];
  const path = group.children[0];

  console.assert(
    path.tagName === "path",
    "Error: Car icon should contain a path element"
  );
  console.assert(
    path.getAttribute("fill") === TEST_COLOR_RED,
    "Error: Path should be initialized with the provided color"
  );

  carIcon.setColor(TEST_COLOR_BLUE);
  console.assert(
    path.getAttribute("fill") === TEST_COLOR_BLUE,
    "Error: setColor failed to update the path's fill attribute"
  );

  console.log("Finished car-icon.ts tests ✓");
}

try {
  await runCarIconTests();
} catch (error) {
  console.error("Test suite failed");
  throw error;
}
