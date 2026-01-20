import { BaseComponent } from '../../components/ui/base-component';
import { getCars } from '../../api/garage';

export class GarageView extends BaseComponent {
  constructor() {
    super('div', 'garage-view');
    this.render();
  }

  private async render(): Promise<void> {
    const { totalCount } = await getCars(1);

    this.element.innerHTML = `
      <h1>Garage (${totalCount})</h1>
      <h2>Page #1</h2>
    `;
  }
}