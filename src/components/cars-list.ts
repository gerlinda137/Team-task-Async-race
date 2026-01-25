import { CarItem, type Car } from "./car-item";
import { BaseComponent } from "./ui/base-component";
import "./car-list.css";

export class CarsList extends BaseComponent<HTMLUListElement> {
  private onEdited: (car: Car) => void;
  private onDeleted: (id: number) => void;
  constructor(onDeleted: (id: number) => void, onEdited: (car: Car) => void) {
    super("ul", "car-list");
    this.onEdited = onEdited;
    this.onDeleted = onDeleted;
  }

  public setCars(cars: Car[]): void {
    this.element.innerHTML = "";
    for (const car of cars) {
      const carItem = new CarItem(
        car,
        () => this.onDeleted(car.id),
        () => this.onEdited(car),
      );
      this.element.append(carItem.getElement());
    }
  }
}
