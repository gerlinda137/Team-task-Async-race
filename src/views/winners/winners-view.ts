import { BaseComponent } from '../../components/ui/base-component';
import { getWinners } from '../../api/winners';

export class WinnersView extends BaseComponent {
  constructor() {
    super('div', 'winners-view');
    this.render();
  }

  private async render(): Promise<void> {
    const { totalCount } = await getWinners(1);

    this.element.innerHTML = `
      <h1>Winners (${totalCount})</h1>
      <h2>Page #1</h2>
    `;
  }
}