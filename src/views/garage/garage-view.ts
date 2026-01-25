import { BaseComponent } from "../../components/ui/base-component";
import { deleteCar, getCars } from "../../api/garage";
import { CarsList } from "../../components/cars-list";
import { CarForm } from "../../components/car-form";
import { Button } from "../../components/ui/button";
import { generateCars } from "../../utils/generate-cars";
import state from '../../store';

const CARS_PER_PAGE = 7;
const GENERATE_CARS_COUNT = 100;

export class GarageView extends BaseComponent {
  private carForm: CarForm;
  private generate100CarsBtn: Button;
  private page: number;
  private totalCount = 0;
  private totalPages = 0;

  private titleEl = document.createElement("h1");
  private pageEl = document.createElement("h2");
  private prevBtn = document.createElement("button");
  private nextBtn = document.createElement("button");

  private carsList: CarsList;

  constructor() {
    super("div", "garage-view");

    this.prevBtn.textContent = "Prev";
    this.nextBtn.textContent = "Next";
    this.page = state.garagePage;

    this.prevBtn.addEventListener(
      "click",
      () => void this.loadPage(this.page - 1),
    );
    this.nextBtn.addEventListener(
      "click",
      () => void this.loadPage(this.page + 1),
    );
    this.titleEl.textContent = `Garage ${this.totalCount}`;

    this.carForm = new CarForm(() => this.loadPage(this.page));
    this.generate100CarsBtn = new Button("create 100 cars", "", "button", () =>
      generateCars(GENERATE_CARS_COUNT, () => this.loadPage(this.page)),
    );
    this.carsList = new CarsList(
      (id) => void this.handleDelete(id),
      (car) => void this.carForm.setEditMode(car),
    );

    this.element.append(
      this.titleEl,
      this.generate100CarsBtn.getElement(),
      this.carForm.getElement(),
      this.pageEl,
      this.prevBtn,
      this.nextBtn,
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
    if (this.page === 1) {
      this.prevBtn.disabled = true;
    } else if (this.page > 1) {
      this.prevBtn.disabled = false;
    }
    this.nextBtn.disabled = this.page === this.totalPages ? true : false;
  }

  private async handleDelete(id: number): Promise<void> {
    await deleteCar(id);
    await this.loadPage(this.page);
  }
}
