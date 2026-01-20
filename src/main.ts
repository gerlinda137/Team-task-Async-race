import './style.css';
import { Header } from './components/header';
import { GarageView, WinnersView } from './views';

class App {
  private root: HTMLElement;
  private header: Header;
  private currentView: GarageView | WinnersView | undefined = undefined;

  constructor(root: HTMLElement) {
    this.root = root;

    this.header = new Header((view) => this.switchView(view));

    this.init();
  }

  private init(): void {
    this.root.append(this.header.getElement());

    this.switchView('garage');
  }

  private switchView(viewName: 'garage' | 'winners'): void {
    if (this.currentView) {
      this.currentView.getElement().remove();
    }

    this.currentView = viewName === 'garage' ? new GarageView() : new WinnersView();

    this.root.append(this.currentView.getElement());
  }
}

const rootElement = document.querySelector<HTMLElement>('#app');

if (rootElement) {
  new App(rootElement);
}
