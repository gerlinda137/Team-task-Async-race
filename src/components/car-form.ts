import { createCar, editCar } from "../api/garage";
import { BaseComponent } from "./ui/base-component";
import { Button } from "./ui/button";
import { ColorInput } from "./ui/color-input";
import { TextInput } from "./ui/text-input";
import "./car-form.css";
import type { Car } from "./car-item";
import { CarIcon } from "./ui/car-icon";
import { generateCars } from "../utils/generate-cars";

const GENERATE_CARS_COUNT = 100;

export class CarForm extends BaseComponent<HTMLFormElement> {
  private textInput = new TextInput("type car name", "create-name-input");
  private previewIcon = new CarIcon("#000000");
  private colorInput = new ColorInput(
    "create-color-input",
    this.handleColorChange.bind(this),
  );
  private editingCarId: number | null = null;
  private submitBtn = new Button("create car", undefined, "submit");
  private generate100CarsBtn: Button;

  private onCreated?: () => void;
  constructor(onCreated?: () => void) {
    super("form", "car-form");
    this.colorInput.setColor("#d01e1e");
    this.previewIcon.setColor("#d01e1e");
    this.onCreated = onCreated;
    this.generate100CarsBtn = new Button("create 100 cars", "", "button", () =>
      generateCars(GENERATE_CARS_COUNT, () => this.onCreated?.()),
    );
    this.element.append(
      this.previewIcon.getElement(),
      this.textInput.getElement(),
      this.colorInput.getElement(),

      this.submitBtn.getElement(),
      this.generate100CarsBtn.getElement(),
    );
    this.element.addEventListener(
      "submit",
      (event) => void this.handleSubmit(event),
    );
  }

  public setEditMode(car: Car): void {
    this.editingCarId = car.id;
    this.textInput.setValue(car.name);
    this.colorInput.setColor(car.color);
    this.previewIcon.setColor(car.color);
    this.submitBtn.getElement().textContent = "update car";
  }

  private handleColorChange(color: string): void {
    this.previewIcon.setColor(color);
  }

  private async handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const name = this.textInput.getValue().trim();
    const color = this.colorInput.getColor();
    await (this.editingCarId === null
      ? createCar(name, color)
      : editCar(name, color, this.editingCarId));

    this.textInput.setValue("");
    this.editingCarId = null;
    this.submitBtn.getElement().textContent = "create car";
    this.onCreated?.();
  }
}
