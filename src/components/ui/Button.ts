import { BaseComponent } from './BaseComponent';

export class Button extends BaseComponent<HTMLButtonElement> {
  constructor(label: string, onClick: () => void, className = '') {
    super('button', className);
    this.element.textContent = label;
    this.element.addEventListener('click', onClick);
  }

  public setDisabled(state: boolean): void {
    this.element.disabled = state;
  }
}