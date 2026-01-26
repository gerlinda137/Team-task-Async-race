import { BaseComponent } from "../../components/ui/base-component";
import { deleteCar, getCars } from "../../api/garage";
import { CarsList } from "../../components/cars-list";
import { CarForm } from "../../components/car-form";
import state from "../../store";
import { Button } from "../../components/ui/button";
import "./garage-view.css";
import { updateWinnerAfterRace } from "../../utils/save-race-winner";

const CARS_PER_PAGE = 7;
const MS_PER_SECOND = 1000;
const WINNER_TIME_DECIMALS = 2;

export class GarageView extends BaseComponent {
  private carForm!: CarForm;
  private page: number;
  private totalCount = 0;
  private totalPages = 0;

  private titleEl = document.createElement("h1");
  private pageEl = document.createElement("h2");
  private garageHeader = document.createElement("header");
  private paginationEl = document.createElement("div");
  private prevBtn!: Button;
  private nextBtn!: Button;
  private raceBtn!: Button;
  private resetBtn!: Button;
  private isRacing = false;
  private carsList!: CarsList;

  constructor() {
    super("div", "garage-view");
    this.page = state.garagePage;
    this.initPagination();
    this.initCarForm();
    this.initGarageHeader();
    this.initCarsList();
    this.initPaginationElements();
    this.initElement();
    void this.loadPage(this.page);
  }

  private initPagination(): void {
    this.paginationEl.className = "pagination";
    this.prevBtn = new Button(
      "Prev",
      "pagination__btn pagination__btn--prev",
      "button",
      () => void this.loadPage(this.page - 1),
    );
    this.nextBtn = new Button(
      "Next",
      "pagination__btn pagination__btn--next",
      "button",
      () => void this.loadPage(this.page + 1),
    );
  }

  private initCarForm(): void {
    this.titleEl.textContent = `Garage ${this.totalCount}`;
    this.carForm = new CarForm(() => this.loadPage(this.page));
  }

  private initGarageHeader(): void {
    this.garageHeader.className = "garage__header";
    this.garageHeader.append(
      this.carForm.getElement(),
      this.renderRaceControls(),
    );
  }

  private initCarsList(): void {
    this.carsList = new CarsList(
      (id) => void this.handleDelete(id),
      (car) => void this.carForm.setEditMode(car),
    );
  }

  private initPaginationElements(): void {
    this.paginationEl.append(
      this.prevBtn.getElement(),
      this.nextBtn.getElement(),
    );
  }

  private initElement(): void {
    this.element.append(
      this.titleEl,
      this.garageHeader,
      this.pageEl,
      this.paginationEl,
      this.carsList.getElement(),
    );
  }

  private async loadPage(page: number): Promise<void> {
    const { cars, totalCount } = await getCars(page);

    this.page = page;
    state.garagePage = this.page;
    this.totalCount = Number(totalCount) || 0;
    this.totalPages = Math.max(1, Math.ceil(this.totalCount / CARS_PER_PAGE));
    this.titleEl.textContent = `Garage ${totalCount}`;
    this.pageEl.textContent = `Page ${this.page} / ${this.totalPages}`;
    this.carsList.setCars(cars);
    this.updateBtns();
  }

  private updateBtns(): void {
    this.prevBtn.setDisabled(this.page <= 1);
    this.nextBtn.setDisabled(this.page >= this.totalPages);
  }

  private async handleDelete(id: number): Promise<void> {
    await deleteCar(id);
    await this.loadPage(this.page);
  }

  private async raceAll(): Promise<void> {
    if (this.isRacing) return;
    const carItems = this.carsList.getCarItems();
    if (carItems.length === 0) return;
    this.setRaceControlsState(true, false);
    const promises = carItems.map((carItem) => carItem.start());
    try {
      const winner = await Promise.any(promises);
      alert(
        `Winner: ${winner.name} — ${(winner.timeMs / MS_PER_SECOND).toFixed(WINNER_TIME_DECIMALS)}s`,
      );
      await updateWinnerAfterRace(
        winner.id,
        +(winner.timeMs / MS_PER_SECOND).toFixed(WINNER_TIME_DECIMALS),
      );
    } catch (error) {
      alert("No winner (all cars broken).");
      console.warn("No winner (all cars broken).", error);
    } finally {
      this.setRaceControlsState(false, true);
    }
  }

  private async resetAll(): Promise<void> {
    const items = this.carsList.getCarItems();
    await Promise.allSettled(items.map((carItem) => carItem.reset()));
  }

  private setRaceControlsState(isRacing: boolean, canReset: boolean): void {
    this.isRacing = isRacing;

    this.raceBtn.setDisabled(isRacing);
    this.resetBtn.setDisabled(!canReset);
  }

  private renderRaceControls(): HTMLElement {
    const container = document.createElement("div");
    container.className = "garage__race-controls";
    this.raceBtn = new Button("Race", "race-btn", "button", () => {
      void this.raceAll();
    });
    this.resetBtn = new Button("Reset", "reset-btn", "button", () => {
      void this.resetAll();
    });
    this.resetBtn.setDisabled(true);
    container.append(this.raceBtn.getElement(), this.resetBtn.getElement());
    return container;
  }
}
