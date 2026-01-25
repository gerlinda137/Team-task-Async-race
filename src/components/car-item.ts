import { BaseComponent } from "./ui/base-component";
import { CarIcon } from "./ui/car-icon";
import { Button } from "./ui/button";
import "./car-item.css";

import { startAnimation, stopAnimation } from "../utils/animation";
import { startEngine, stopEngine } from "../utils/engine-api";

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
  private carVisualElement!: HTMLElement;

  constructor(
    car: Car,
    onDeleted: (id: number) => void,
    onEdited: (car: Car) => void
  ) {
    super("li", "car-list__item");
    this.carId = car.id;
    this.element.id = `car-${car.id}`;
    this.onEdited = onEdited;
    this.onDeleted = onDeleted;
    this.render(car);
  }

  private render(car: Car): void {
    this.element.append(
      this.renderManagement(car),
      this.renderEngineControls(),
      this.renderVisualArea(car.color)
    );
  }

  private renderManagement(car: Car): HTMLElement {
    const container = document.createElement("div");
    container.className = "car__management";

    const editButton = new Button("edit", "edit-btn", "button", () =>
      this.onEdited(car)
    );
    const deleteButton = new Button("delete", "delete-btn", "button", () =>
      this.onDeleted(this.carId)
    );

    const title = document.createElement("h2");
    title.className = "car__title";
    title.textContent = car.name;

    container.append(editButton.getElement(), deleteButton.getElement(), title);
    return container;
  }

  private renderEngineControls(): HTMLElement {
    const container = document.createElement("div");
    container.className = "car__engine-controls";

    this.startButton = new Button(
      "A",
      "start-engine-btn",
      "button",
      async () => {
        this.toggleEngineUI(true);
        try {
          const { velocity } = await startEngine(this.carId);
          await startAnimation(this.carId, this.carVisualElement, velocity);
        } catch (error) {
          console.warn("Engine/animation error:", error);
        } finally {
          this.toggleEngineUI(false);
        }
      }
    );

    this.stopButton = new Button("B", "stop-engine-btn", "button", async () => {
      this.toggleEngineUI(false);
      try {
        await stopEngine();
      } catch (error) {
        console.warn("stopEngine failed", error);
      }
      stopAnimation(this.carId);
    });

    this.stopButton.getElement().disabled = true;
    container.append(
      this.startButton.getElement(),
      this.stopButton.getElement()
    );
    return container;
  }

  private renderVisualArea(color: string): HTMLElement {
    const visualArea = document.createElement("div");
    visualArea.className = "car__visual-area";

    const carIcon = new CarIcon(color);
    const iconWrapper = carIcon.getElement();
    const svg = iconWrapper.querySelector("svg");

    this.carVisualElement =
      (svg as unknown as HTMLElement) ?? (iconWrapper as HTMLElement);
    visualArea.append(iconWrapper);
    return visualArea;
  }

  private toggleEngineUI(isStarting: boolean): void {
    const startButton = this.startButton.getElement() as HTMLButtonElement;
    const stopButton = this.stopButton.getElement() as HTMLButtonElement;

    startButton.disabled = isStarting;
    stopButton.disabled = !isStarting;
  }
}
