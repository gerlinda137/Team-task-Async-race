import { BaseComponent } from "./ui/base-component";
import { CarIcon } from "./ui/car-icon";

interface Car {
  name: string;
  color: string;
  id: number;
}

export class CarItem extends BaseComponent<HTMLLIElement> {
  constructor(car: Car) {
    super("li", "car-list__item");
    this.element.id = car.id.toString();
    this.render(car);
  }

  private render(car: Car) {
    const carTitle = document.createElement("h2");
    carTitle.className = "car__title";
    carTitle.textContent = car.name;
    const carIcon = new CarIcon(car.color);
    this.element.append(carTitle);
    this.element.append(carIcon.getElement());
  }
}
