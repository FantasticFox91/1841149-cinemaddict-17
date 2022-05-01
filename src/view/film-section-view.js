import { createElement } from '../render.js';

const createFilmListTemplate = () => '<section class="films"></section>';

export default class FilmSectionView {
  getTemplate() {
    return createFilmListTemplate();
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
