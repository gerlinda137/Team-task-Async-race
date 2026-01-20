import { BaseComponent } from './ui/base-component';
import { Button } from './ui/button';

export class Header extends BaseComponent {
  constructor(onViewChange: (view: 'garage' | 'winners') => void) {
    super('header', 'app-header');

    const garageButton = new Button('TO GARAGE', () => onViewChange('garage'), 'nav-btn');
    const winnersButton = new Button('TO WINNERS', () => onViewChange('winners'), 'nav-btn');

    this.element.append(garageButton.getElement(), winnersButton.getElement());
  }
}
