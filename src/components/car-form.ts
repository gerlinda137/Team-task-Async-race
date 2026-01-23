import { createCar } from "../api/garage";
import { BaseComponent } from "./ui/base-component";
import { Button } from "./ui/button";
import { ColorInput } from "./ui/color-input";
import { TextInput } from "./ui/text-input";
import "./car-form.css";

export class CarForm extends BaseComponent<HTMLFormElement> {
  private textInput = new TextInput("type car name", "create-name-input");
  private colorInput = new ColorInput("create-color-input");
  private submitBtn = new Button("create car", undefined, "submit");

  private onCreated?: () => void;
  constructor(onCreated?: () => void) {
    super("form", "car-form");
    this.onCreated = onCreated;
    this.element.append(
      this.textInput.getElement(),
      this.colorInput.getElement(),
      this.submitBtn.getElement(),
    );
    this.element.addEventListener(
      "submit",
      (event) => void this.handleSubmit(event),
    );
  }

  private async handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const name = this.textInput.getValue().trim();
    const color = this.colorInput.getColor();

    await createCar(name, color);
    this.textInput.setValue("");
    this.onCreated?.();
  }
}
