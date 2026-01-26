import { BaseComponent } from "../../components/ui/base-component";
import { Button } from "../../components/ui/button";
import { CarIcon } from "../../components/ui/car-icon";
import { getWinners, WINNERS_PER_PAGE } from "../../api/winners";
import { getCar } from "../../api/garage";
import state from "../../store/store";
import "./index.css";

const PAGE_NEXT = 1;
const PAGE_PREV = -1;

interface WinnerWithDetails {
  id: number;
  wins: number;
  time: number;
  car: { name: string; color: string };
}

export class WinnersView extends BaseComponent {
  private titleEl = document.createElement("h1");
  private pageEl = document.createElement("h2");
  private tableContainer = document.createElement("div");
  private paginationContainer = document.createElement("div");

  private sortBy: "id" | "wins" | "time" = "id";
  private sortOrder: "ASC" | "DESC" = "ASC";
  private totalCount = 0;

  private prevBtn: Button;
  private nextBtn: Button;

  constructor() {
    super("div", "winners-view");
    this.paginationContainer.className = "pagination-btns";

    this.prevBtn = new Button("PREV", "nav-btn", "button", () =>
      this.handlePageChange(PAGE_PREV)
    );
    this.nextBtn = new Button("NEXT", "nav-btn", "button", () =>
      this.handlePageChange(PAGE_NEXT)
    );

    this.element.append(
      this.titleEl,
      this.pageEl,
      this.tableContainer,
      this.paginationContainer
    );

    this.paginationContainer.append(
      this.prevBtn.getElement(),
      this.nextBtn.getElement()
    );

    void this.loadData();
  }

  private async loadData(): Promise<void> {
    const page = state.winnersPage;
    const { winners, totalCount } = await getWinners(
      page,
      WINNERS_PER_PAGE,
      this.sortBy,
      this.sortOrder
    );
    this.totalCount = Number(totalCount);

    const enrichedWinners: WinnerWithDetails[] = await Promise.all(
      winners.map(async (winner) => ({
        ...winner,
        car: await getCar(winner.id),
      }))
    );

    this.renderHeader(totalCount, page);
    this.renderTable(enrichedWinners);
    this.updatePaginationButtons();
  }

  private renderHeader(total: string, page: number): void {
    this.titleEl.textContent = `Winners (${total})`;
    this.pageEl.textContent = `Page #${page}`;
  }

  private renderTable(winners: WinnerWithDetails[]): void {
    this.tableContainer.innerHTML = "";
    const table = document.createElement("table");
    table.className = "winners-table";

    table.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Car Image</th>
          <th>Name</th>
          <th class="sortable ${this.sortBy === "wins" ? "active" : ""}" data-sort="wins">
            Wins ${this.getSortIcon("wins")}
          </th>
          <th class="sortable ${this.sortBy === "time" ? "active" : ""}" data-sort="time">
            Best Time (s) ${this.getSortIcon("time")}
          </th>
        </tr>
      </thead>
      <tbody id="winners-body"></tbody>
    `;

    this.renderRows(table.querySelector("#winners-body")!, winners);
    this.initSortListeners(table);
    this.tableContainer.append(table);
  }

  private renderRows(tbody: HTMLElement, winners: WinnerWithDetails[]): void {
    let index = 0;
    for (const winner of winners) {
      const row = document.createElement("tr");
      const rowNumber = index + 1 + (state.winnersPage - 1) * WINNERS_PER_PAGE;

      row.innerHTML = `
        <td>${rowNumber}</td>
        <td class="car-icon-cell"></td>
        <td>${winner.car.name}</td>
        <td>${winner.wins}</td>
        <td>${winner.time}</td>
      `;

      const carIcon = new CarIcon(winner.car.color);
      row.querySelector(".car-icon-cell")?.append(carIcon.getElement());

      tbody.append(row);
      index += 1;
    }
  }

  private initSortListeners(table: HTMLTableElement): void {
    const sortableHeaders = table.querySelectorAll<HTMLElement>(".sortable");
    for (const header of sortableHeaders) {
      header.addEventListener("click", () => {
        const type = header.dataset.sort as "id" | "wins" | "time";
        this.toggleSort(type);
      });
    }
  }

  private updatePaginationButtons(): void {
    const isFirstPage = state.winnersPage <= 1;
    const isLastPage = state.winnersPage * WINNERS_PER_PAGE >= this.totalCount;

    (this.prevBtn.getElement() as HTMLButtonElement).disabled = isFirstPage;
    (this.nextBtn.getElement() as HTMLButtonElement).disabled = isLastPage;
  }

  private async handlePageChange(delta: number): Promise<void> {
    state.winnersPage += delta;
    await this.loadData();
  }

  private toggleSort(type: "id" | "wins" | "time"): void {
    if (this.sortBy === type) {
      this.sortOrder = this.sortOrder === "ASC" ? "DESC" : "ASC";
    } else {
      this.sortBy = type;
      this.sortOrder = "ASC";
    }
    void this.loadData();
  }

  private getSortIcon(target: string): string {
    if (this.sortBy !== target) return "↕";
    return this.sortOrder === "ASC" ? "↑" : "↓";
  }
}
