import { CarIcon } from "./car-icon";

const TEST_COLOR_RED = "#ff0000";
const TEST_COLOR_BLUE = "#0000ff";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

interface MockNode {
  tagName: string;
  className: string;
  namespaceURI?: string;
  attributes: Record<string, string>;
  children: MockNode[];
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | undefined;
  append(...nodes: (MockNode | string)[]): void;
}

class MockElement implements MockNode {
  public attributes: Record<string, string> = {};
  public children: MockNode[] = [];
  public className = "";

  constructor(
    public tagName: string,
    public namespaceURI?: string
  ) {}

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): string | undefined {
    return this.attributes[name];
  }

  public append(...nodes: (MockNode | string)[]): void {
    for (const node of nodes) {
      if (typeof node !== "string") {
        this.children.push(node);
      }
    }
  }
}

globalThis.document = {
  createElement: (tagName: string) => new MockElement(tagName),
  createElementNS: (namespace: string, tagName: string) =>
    new MockElement(tagName, namespace),
} as unknown as Document;

async function runCarIconTests(): Promise<void> {
  console.log("Running car-icon.ts tests...");

  const carIcon = new CarIcon(TEST_COLOR_RED);

  const wrapper = carIcon.getElement() as unknown as MockNode;

  console.assert(
    wrapper.className === "car__img-wrapper",
    "Error: Wrapper should have correct class name"
  );

  const svgContainer = wrapper.children[0];
  console.assert(
    svgContainer?.className === "car__svg-container",
    "Error: Wrapper should contain the svg-container div"
  );

  const svg = svgContainer.children[0];
  console.assert(
    svg?.namespaceURI === SVG_NAMESPACE,
    `Error: SVG should be created with correct namespace. Got: ${svg?.namespaceURI}`
  );

  const group = svg.children[0];
  const path = group.children[0];

  console.assert(
    path?.tagName === "path",
    "Error: Car icon should contain a path element"
  );

  console.assert(
    path?.getAttribute("fill") === TEST_COLOR_RED,
    "Error: Path should be initialized with the provided color"
  );

  carIcon.setColor(TEST_COLOR_BLUE);
  console.assert(
    path?.getAttribute("fill") === TEST_COLOR_BLUE,
    "Error: setColor failed to update the path's fill attribute"
  );

  console.log("Finished car-icon.ts tests ✓");
}

try {
  await runCarIconTests();
} catch (error) {
  throw new Error(
    `Test suite failed: ${error instanceof Error ? error.message : String(error)}`
  );
}
