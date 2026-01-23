import { CarItem, type Car } from "./car-item";
import { BaseComponent } from "./ui/base-component";
import "./car-list.css";

export class CarsList extends BaseComponent<HTMLUListElement> {
  private onDeleted: (id: number) => void;
  constructor(onDeleted: (id: number) => void) {
    super("ul", "car-list");
    this.onDeleted = onDeleted;
  }

  public setCars(cars: Car[]): void {
    this.element.innerHTML = "";
    for (const car of cars) {
      const carItem = new CarItem(car, () => this.onDeleted(car.id));
      this.element.append(carItem.getElement());
    }
  }
}
