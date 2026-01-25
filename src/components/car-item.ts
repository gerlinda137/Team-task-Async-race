import { BaseComponent } from "./ui/base-component";
import { CarIcon } from "./ui/car-icon";
import { Button } from "./ui/button";
import "./car-item.css";

export interface Car {
  name: string;
  color: string;
  id: number;
}

export class CarItem extends BaseComponent<HTMLLIElement> {
  private carId: number;
  private onEdited: (car: Car) => void;
  private onDeleted: (id: number) => void;

  private startButton!: Button;
  private stopButton!: Button;

  constructor(car: Car, onDeleted: () => void, onEdited: (car: Car) => void) {
    super("li", "car-list__item");
    this.carId = car.id;
    this.element.id = `car-${car.id}`;
    this.onEdited = onEdited;
    this.onDeleted = onDeleted;
    this.render(car);
  }

  private render(car: Car) {
    const managementControls = document.createElement("div");
    managementControls.className = "car__management";

    const editButton = new Button("edit", "edit-btn", "button", () =>
      this.onEdited(car)
    );
    const deleteButton = new Button("delete", "delete-btn", "button", () =>
      this.onDeleted(this.carId)
    );
    const carTitle = document.createElement("h2");
    carTitle.className = "car__title";
    carTitle.textContent = car.name;

    managementControls.append(
      editButton.getElement(),
      deleteButton.getElement(),
      carTitle
    );

    const engineControls = document.createElement("div");
    engineControls.className = "car__engine-controls";

    this.startButton = new Button("A", "start-engine-btn", "button", () =>
      this.toggleEngineUI(true)
    );
    this.stopButton = new Button("B", "stop-engine-btn", "button", () =>
      this.toggleEngineUI(false)
    );

    this.stopButton.getElement().disabled = true;

    engineControls.append(
      this.startButton.getElement(),
      this.stopButton.getElement()
    );

    const visualArea = document.createElement("div");
    visualArea.className = "car__visual-area";
    const carIcon = new CarIcon(car.color);
    visualArea.append(carIcon.getElement());

    this.element.append(managementControls, engineControls, visualArea);
  }

  private toggleEngineUI(isStarting: boolean): void {
    const startButtonElement =
      this.startButton.getElement() as HTMLButtonElement;
    const stopButtonElement = this.stopButton.getElement() as HTMLButtonElement;

    if (isStarting) {
      startButtonElement.disabled = true;
      stopButtonElement.disabled = false;
    } else {
      startButtonElement.disabled = false;
      stopButtonElement.disabled = true;
    }
  }
}
