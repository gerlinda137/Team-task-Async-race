import { BaseComponent } from "../../components/ui/base-component";
import { getCars } from "../../api/garage";
import { CarsList } from "../../components/cars-list";
import { CarForm } from "../../components/car-form";

const CARS_PER_PAGE = 7;

export class GarageView extends BaseComponent {
  private carForm: CarForm;
  private page = 1;
  private totalCount = 0;
  private totalPages = 0;

  private titleEl = document.createElement("h1");
  private pageEl = document.createElement("h2");
  private prevBtn = document.createElement("button");
  private nextBtn = document.createElement("button");

  private carsList = new CarsList();

  constructor() {
    super("div", "garage-view");

    this.prevBtn.textContent = "Prev";
    this.nextBtn.textContent = "Next";

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

    this.element.append(
      this.titleEl,
      this.carForm.getElement(),
      this.pageEl,
      this.prevBtn,
      this.nextBtn,
      this.carsList.getElement(),
    );
    void this.loadPage(1);
  }

  private async loadPage(page: number): Promise<void> {
    const { cars, totalCount } = await getCars(page);

    this.page = page;

    this.totalCount = Number(totalCount) || 0;
    this.totalPages = Math.round(this.totalCount / CARS_PER_PAGE);
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
}
