import { BaseComponent } from '../../components/ui/base-component';

export class WinnersView extends BaseComponent {
  constructor() {
    super('div', 'winners-view');
    this.element.innerHTML = `<h1>Winners (0)</h1><h2>Page #2</h2>`;
  }
}