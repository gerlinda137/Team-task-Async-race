import { BaseComponent } from "../../components/ui/base-component";
import { deleteCar, getCars } from "../../api/garage";
import { CarsList } from "../../components/cars-list";
import { CarForm } from "../../components/car-form";
import state from "../../store";
import { Button } from "../../components/ui/button";
import "./garage-view.css";

const CARS_PER_PAGE = 7;

export class GarageView extends BaseComponent {
  private carForm: CarForm;
  private page: number;
  private totalCount = 0;
  private totalPages = 0;

  private titleEl = document.createElement("h1");
  private pageEl = document.createElement("h2");
  private paginationEl = document.createElement("div");
  private prevBtn: Button;
  private nextBtn: Button;

  private carsList: CarsList;

  constructor() {
    super("div", "garage-view");

    this.page = state.garagePage;
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
    this.titleEl.textContent = `Garage ${this.totalCount}`;

    this.carForm = new CarForm(() => this.loadPage(this.page));
    this.carsList = new CarsList(
      (id) => void this.handleDelete(id),
      (car) => void this.carForm.setEditMode(car),
    );

    this.paginationEl.append(
      this.prevBtn.getElement(),
      this.nextBtn.getElement(),
    );

    this.element.append(
      this.titleEl,
      this.carForm.getElement(),
      this.pageEl,
      this.paginationEl,
      this.carsList.getElement(),
    );
    void this.loadPage(this.page);
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
}
