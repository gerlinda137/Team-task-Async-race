import { BaseComponent } from "./base-component";

const SVG_NS = "http://www.w3.org/2000/svg";
const RADIX_BASE = 36;
const ID_START_INDEX = 2;
const ID_END_INDEX = 9;

export class CarIcon extends BaseComponent<HTMLDivElement> {
  private bodyPath: SVGPathElement;
  private svgContainer: HTMLDivElement;

  constructor(color: string) {
    super("div", "car__img-wrapper");

    this.svgContainer = document.createElement("div");
    this.svgContainer.className = "car__svg-container";
    const { svg, path } = this.createSvg(color);
    this.bodyPath = path;
    this.svgContainer.append(svg);
    this.element.append(this.svgContainer);
  }

  public setColor(color: string): void {
    this.bodyPath.setAttribute("fill", color);
  }

  private createSvg(color: string): {
    svg: SVGSVGElement;
    path: SVGPathElement;
  } {
    const svg = document.createElementNS(SVG_NS, "svg");
    const randomPart = Math.random()
      .toString(RADIX_BASE)
      .slice(ID_START_INDEX, ID_END_INDEX);
    const uniqueId = `car-icon-${randomPart}`;

    svg.setAttribute("width", "80");
    svg.setAttribute("height", "40");
    svg.setAttribute("viewBox", "0 0 90 90");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-labelledby", uniqueId);

    const title = document.createElementNS(SVG_NS, "title");
    title.id = uniqueId;
    title.textContent = `Racing car with color ${color}`;
    svg.append(title);

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute(
      "d",
      "M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 c -1.357 0 -2.696 0.107 -4.016 0.296 c -0.022 0.004 -0.044 0.006 -0.066 0.01 c -7.799 1.133 -14.802 5.468 -19.285 12.106 C 5.706 37.913 0 45.358 0 52.952 c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 c 0.969 4.866 5.269 8.545 10.416 8.545 s 9.447 -3.679 10.416 -8.545 h 30.139 c 0.969 4.866 5.27 8.545 10.416 8.545 s 9.446 -3.679 10.415 -8.545 H 84.1 c 3.254 0 5.9 -2.646 5.9 -5.9 C 90 44.441 83.894 37.331 75.479 36.045 z " +
        "M 43.269 26.602 c 7.065 0 13.848 2.949 18.676 8.094 H 39.464 l -3.267 -8.068 c 0.275 -0.009 0.55 -0.026 0.826 -0.026 H 43.269 z " +
        "M 32.08 27.118 l 3.068 7.578 H 18.972 C 22.429 30.813 27.018 28.169 32.08 27.118 z " +
        "M 19.767 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 s 6.623 2.971 6.623 6.623 C 26.39 60.427 23.419 63.397 19.767 63.397 z " +
        "M 70.738 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 c 3.651 0 6.622 2.971 6.622 6.623 C 77.36 60.427 74.39 63.397 70.738 63.397 z"
    );

    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute(
      "transform",
      "translate(1.4065934065934016 1.4065934065934016) scale(1 1)"
    );
    path.setAttribute("fill", color);
    group.append(path);
    svg.append(group);

    return { svg, path };
  }
}
