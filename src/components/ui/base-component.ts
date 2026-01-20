export abstract class BaseComponent<T extends HTMLElement = HTMLElement> {
    protected element: T;
  
    constructor(tagName: keyof HTMLElementTagNameMap = 'div', className = '') {
      this.element = document.createElement(tagName) as T;
      this.element.className = className;
    }
  
    public getElement(): T {
      return this.element;
    }
  
    public mount(parent: HTMLElement): void {
      parent.append(this.element);
    }
  }