import { BaseComponent } from "./ui/base-component";
import { Button } from "./ui/button";
import "./header.css";

export class Header extends BaseComponent {
  constructor(onViewChange: (view: "garage" | "winners") => void) {
    super("header", "app-header");

    const garageButton = new Button("TO GARAGE", "nav-btn", "button", () =>
      onViewChange("garage"),
    );
    const winnersButton = new Button("TO WINNERS", "nav-btn", "button", () =>
      onViewChange("winners"),
    );

    this.element.append(garageButton.getElement(), winnersButton.getElement());
  }
}
