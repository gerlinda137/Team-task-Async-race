import { BaseComponent } from '../../components/ui/base-component';

export class GarageView extends BaseComponent {
  constructor() {
    super('div', 'garage-view');
    this.element.innerHTML = `<h1>Garage (0)</h1><h2>Page #1</h2>`;
  }
}