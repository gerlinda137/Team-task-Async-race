import { BaseComponent } from "./base-component";

export class textInput extends BaseComponent<HTMLInputElement> {
  constructor(placeholder: string, id: string) {
    super("input", "input-text");
    this.element.placeholder = placeholder;
    this.element.id = id;
  }
}
