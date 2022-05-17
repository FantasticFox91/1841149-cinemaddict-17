import AbstarctView from '../framework/view/abstract-view.js';
import { SortType } from '../utils/common.js';

const createFilterListTemplate = () => `
<ul class="sort">
  <li>
    <a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a>
  </li>
  <li>
    <a href="#" class="sort__button" data-sort-type="${SortType.DATE_DOWN}">Sort by date</a>
  </li>
  <li>
  <a href="#" class="sort__button" data-sort-type="${SortType.RATE_DOWN}">Sort by rating</a>
  </li>
</ul>`;

export default class FilterListView extends AbstarctView {
  get template() {
    return createFilterListTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#onFilterClick);
  };

  #onFilterClick = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    this.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
