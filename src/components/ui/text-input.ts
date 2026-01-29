import { BaseComponent } from "./base-component";

export class TextInput extends BaseComponent<HTMLInputElement> {
  private textStorageKey: string;
  constructor(placeholder: string, id: string, textStorageKey?: string) {
    super("input", "input-text");
    this.element.placeholder = placeholder;
    this.element.id = id;
    this.textStorageKey = textStorageKey ?? id;

    const savedValue = localStorage.getItem(this.textStorageKey);
    if (savedValue !== null) {
      this.element.value = savedValue;
    }

    this.element.addEventListener("input", () => {
      this.syncToStorage();
    });
  }

  public getValue() {
    return this.element.value;
  }

  public setValue(value: string) {
    this.element.value = value;
  }

  public clear(): void {
    this.element.value = "";
    localStorage.removeItem(this.textStorageKey);
  }

  private syncToStorage(): void {
    const value = this.element.value.trim();
    if (value.length > 0) {
      localStorage.setItem(this.textStorageKey, value);
    } else {
      localStorage.removeItem(this.textStorageKey);
    }
  }
}
