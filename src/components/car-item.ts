import { BaseComponent } from "./ui/base-component";
import { CarIcon } from "./ui/car-icon";
import "./car-item.css";
import { Button } from "./ui/button";

export interface Car {
  name: string;
  color: string;
  id: number;
}

export class CarItem extends BaseComponent<HTMLLIElement> {
  private carId: number;
  private onEdited: (car: Car) => void;
  private onDeleted: (id: number) => void;

  constructor(car: Car, onDeleted: () => void, onEdited: (car: Car) => void) {
    super("li", "car-list__item");
    this.carId = car.id;
    this.element.id = car.id.toString();
    this.onEdited = onEdited;
    this.onDeleted = onDeleted;
    this.render(car);
  }

  private render(car: Car) {
    const carTitle = document.createElement("h2");
    carTitle.className = "car__title";
    carTitle.textContent = car.name;
    const carIcon = new CarIcon(car.color);
    const editCarButton = new Button("edit", "", "button", () =>
      this.onEdited(car),
    );
    const deleteCarButton = new Button("delete", "", "button", () =>
      this.onDeleted(this.carId),
    );
    this.element.append(carTitle);
    this.element.append(editCarButton.getElement());
    this.element.append(deleteCarButton.getElement());
    this.element.append(carIcon.getElement());
  }
}
