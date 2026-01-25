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

  // the element we will animate (prefer the <svg> inside the icon wrapper)
  private carVisualElement!: HTMLElement;

  constructor(car: Car, onDeleted: (id: number) => void, onEdited: (car: Car) => void) {
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

    const editButton = new Button("edit", "edit-btn", "button", () => this.onEdited(car));
    const deleteButton = new Button("delete", "delete-btn", "button", () => this.onDeleted(this.carId));
    const carTitle = document.createElement("h2");
    carTitle.className = "car__title";
    carTitle.textContent = car.name;

    managementControls.append(editButton.getElement(), deleteButton.getElement(), carTitle);

    const engineControls = document.createElement("div");
    engineControls.className = "car__engine-controls";

    // Start button handler: request engine velocity then animate the car svg
    this.startButton = new Button("A", "start-engine-btn", "button", async () => {
      // update UI immediately
      this.toggleEngineUI(true);

      try {
        const { velocity } = await startEngine(this.carId);

        // startAnimation resolves with finished:true if it reached the end,
        // or finished:false if stopAnimation was called
        const result = await startAnimation(this.carId, this.carVisualElement, velocity);

        // optional: you can handle winner/timing logic here if needed when result.finished === true
      } catch (err) {
        console.warn("Engine/animation error:", err);
      } finally {
        // ensure UI returns to stopped state after animation finishes or was interrupted
        this.toggleEngineUI(false);
      }
    });

    // Stop button handler: stop animation and call stopEngine shim
    this.stopButton = new Button("B", "stop-engine-btn", "button", async () => {
      // update UI immediately
      this.toggleEngineUI(false);

      try {
        await stopEngine(this.carId);
      } catch (err) {
        console.warn("stopEngine failed", err);
      }

      // stop animation and reset car position
      stopAnimation(this.carId);
    });

    // initially stop is disabled
    this.stopButton.getElement().disabled = true;

    engineControls.append(this.startButton.getElement(), this.stopButton.getElement());

    const visualArea = document.createElement("div");
    visualArea.className = "car__visual-area";

    const carIcon = new CarIcon(car.color);
    const iconWrapper = carIcon.getElement();

    // IMPORTANT: animate the inner <svg> (if present). Fall back to the wrapper when no svg.
    const svgElement =
      (iconWrapper.querySelector && (iconWrapper.querySelector("svg") as HTMLElement | null)) || null;
    this.carVisualElement = (svgElement as HTMLElement) ?? (iconWrapper as HTMLElement);

    visualArea.append(iconWrapper);

    this.element.append(managementControls, engineControls, visualArea);
  }

  private toggleEngineUI(isStarting: boolean): void {
    const startButtonElement = this.startButton.getElement() as HTMLButtonElement;
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