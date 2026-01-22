import { BaseComponent } from "./base-component";

const SVG_NS = "http://www.w3.org/2000/svg";

export class CarIcon extends BaseComponent<HTMLDivElement> {
  private bodyPath: SVGPathElement;

  constructor(color: string) {
    super("div", "car__img-wrapper");

    const { svg, path } = this.createSvg(color);
    this.bodyPath = path;
    this.element.append(svg);
  }

  public setColor(color: string): void {
    this.bodyPath.setAttribute("fill", color);
  }

  private createSvg(color: string): {
    svg: SVGSVGElement;
    path: SVGPathElement;
  } {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "256");
    svg.setAttribute("height", "256");
    svg.setAttribute("viewBox", "0 0 256 256");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute(
      "d",
      "M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 " +
        "c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 " +
        "c -1.357 0 -2.696 0.107 -4.016 0.296 " +
        "c -7.799 1.133 -14.802 5.468 -19.285 12.106 " +
        "C 5.706 37.913 0 45.358 0 52.952 " +
        "c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 " +
        "c 0.969 4.866 5.269 8.545 10.416 8.545 " +
        "s 9.447 -3.679 10.416 -8.545 h 30.139 " +
        "c 0.969 4.866 5.27 8.545 10.416 8.545 " +
        "s 9.446 -3.679 10.415 -8.545 H 84.1 " +
        "c 3.254 0 5.9 -2.646 5.9 -5.9 " +
        "C 90 44.441 83.894 37.331 75.479 36.045 z",
    );
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute(
      "transform",
      "translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)",
    );
    path.setAttribute("fill", color);
    group.append(path);
    svg.append(group);

    return { svg, path };
  }
}
