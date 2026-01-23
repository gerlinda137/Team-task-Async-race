import { BaseComponent } from "./base-component";

export class ColorInput extends BaseComponent<HTMLInputElement> {
  constructor(id: string, onChange?: (color: string) => void) {
    super("input", "input-color");
    this.element.id = id;
    this.element.type = "color";

    if (onChange) {
      this.element.addEventListener("change", () => {
        onChange(this.element.value);
      });
    }
  }

  public getColor(): string {
    return this.element.value;
  }

  public setColor(color: string): void {
    this.element.value = color;
  }
}
