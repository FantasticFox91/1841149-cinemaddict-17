import { createElement } from '../render.js';

const createNewFooterStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class NewFooterStatistics {
  getTemplate() {
    return createNewFooterStatisticsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
