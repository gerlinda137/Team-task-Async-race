import { BaseComponent } from "./base-component";

export class TextInput extends BaseComponent<HTMLInputElement> {
  constructor(placeholder: string, id: string) {
    super("input", "input-text");
    this.element.placeholder = placeholder;
    this.element.id = id;
  }

  public getValue() {
    return this.element.value;
  }

  public setValue(value: string) {
    this.element.value = value;
  }
}
