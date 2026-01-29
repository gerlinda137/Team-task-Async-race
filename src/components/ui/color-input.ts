import { BaseComponent } from "./base-component";

export class ColorInput extends BaseComponent<HTMLInputElement> {
  private colorStorageKey: string;
  private defaultColor: string;

  constructor(
    id: string,
    onChange?: (color: string) => void,
    defaultColor: string = "#d01e1e",
    colorStorageKey?: string,
  ) {
    super("input", "input-color");
    this.element.id = id;
    this.element.type = "color";
    this.defaultColor = defaultColor;
    this.colorStorageKey = colorStorageKey ?? id;

    const savedColor = localStorage.getItem(this.colorStorageKey);
    const initialColor = savedColor ?? this.defaultColor;

    this.element.value = initialColor;
    onChange?.(initialColor);

    if (onChange) {
      this.element.addEventListener("change", () => {
        const color = this.element.value;
        localStorage.setItem(this.colorStorageKey, color);
        onChange(this.element.value);
      });
    }
  }

  public getColor(): string {
    return this.element.value;
  }

  public setColor(color: string): void {
    this.element.value = color;
    localStorage.setItem(this.colorStorageKey, color);
  }

  public clear(): void {
    this.element.value = this.defaultColor;
    localStorage.removeItem(this.colorStorageKey);
  }
}
