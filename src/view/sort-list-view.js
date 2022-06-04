import AbstarctView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortListTemplate = (sortType) =>
  `
  <ul class="sort">
    <li>
      <a href="#" class="sort__button ${sortType === 'default' ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a>
    </li>
    <li>
      <a href="#" class="sort__button ${sortType === 'date-down' ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE_DOWN}">Sort by date</a>
    </li>
    <li>
    <a href="#" class="sort__button ${sortType === 'rate-down' ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATE_DOWN}">Sort by rating</a>
    </li>
  </ul>`;

export default class SortListView extends AbstarctView {
  #sortType = null;

  constructor(sortType) {
    super();
    this.#sortType = sortType;
  }

  get template() {
    return createSortListTemplate(this.#sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#onSortClick);
  };

  #onSortClick = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    this.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
