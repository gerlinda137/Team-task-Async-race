import { BaseComponent } from "./base-component.ts";

export class Button extends BaseComponent<HTMLButtonElement> {
  constructor(
    label: string,
    className = "",
    type: "button" | "submit" = "button",
    onClick?: () => void,
  ) {
    super("button", className);
    this.element.textContent = label;
    this.element.type = type;
    if (onClick) {
      this.element.addEventListener("click", onClick);
    }
  }

  public setDisabled(state: boolean): void {
    this.element.disabled = state;
  }
}
