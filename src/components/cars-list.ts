import { CarItem, type Car } from "./car-item";
import { BaseComponent } from "./ui/base-component";

export class CarsList extends BaseComponent<HTMLUListElement> {
  constructor() {
    super("ul", "car-list");
  }

  public setCars(cars: Car[]): void {
    for (const car of cars) {
      const carItem = new CarItem(car);
      this.element.append(carItem.getElement());
    }
  }
}
