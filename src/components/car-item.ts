import { BaseComponent } from "./ui/base-component";
import { CarIcon } from "./ui/car-icon";
import { Button } from "./ui/button";
import "./car-item.css";

import {
  startAnimation,
  stopAnimation,
  cancelAnimation,
} from "../utils/animation";
import { startEngine, stopEngine, driveEngine } from "../api/engine-api";

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
    onEdited: (car: Car) => void,
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
      this.renderVisualArea(car.color),
    );
  }

  private renderManagement(car: Car): HTMLElement {
    const container = document.createElement("div");
    container.className = "car__management";

    const editButton = new Button("edit", "edit-btn", "button", () =>
      this.onEdited(car),
    );
    const deleteButton = new Button("delete", "delete-btn", "button", () =>
      this.onDeleted(this.carId),
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
    this.startButton = this.createStartButton();
    this.stopButton = this.createStopButton();

    this.stopButton.getElement().disabled = true;
    container.append(
      this.startButton.getElement(),
      this.stopButton.getElement(),
    );
    return container;
  }

  private createStartButton(): Button {
    return new Button("A", "start-engine-btn", "button", async () => {
      this.unmarkBroken();
      this.toggleEngineUI(true);
      try {
        const { velocity, distance } = await startEngine(this.carId);
        const timeMs = distance / velocity;
        const animationPromise = startAnimation(
          this.carId,
          this.carVisualElement,
          timeMs,
        );
        await driveEngine(this.carId);
        await animationPromise;
      } catch (error) {
        console.warn("Engine broken:", error);
        cancelAnimation(this.carId);
        this.markBroken();
      } finally {
        this.toggleEngineUI(false);
      }
    });
  }

  private createStopButton(): Button {
    return new Button("B", "stop-engine-btn", "button", async () => {
      this.unmarkBroken();
      this.toggleEngineUI(false);
      try {
        await stopEngine(this.carId);
      } catch (error) {
        console.warn("stopEngine failed", error);
      }
      stopAnimation(this.carId);
    });
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

  private markBroken(): void {
    this.element.classList.add("car--broken");
  }

  private unmarkBroken(): void {
    this.element.classList.remove("car--broken");
  }
}
