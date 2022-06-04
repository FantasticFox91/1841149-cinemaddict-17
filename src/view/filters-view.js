import AbstarctView from '../framework/view/abstract-view';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;
  return (
    `
      <a href="#${type}" class="main-navigation__item ${currentFilterType === type ? 'main-navigation__item--active' : ''}" data-filter-type='${name}'>
        ${name}
        ${type !== 'All' ? `<span class="main-navigation__item-count"> ${count} </span>` : ''}
      </a>
    `
  );
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.reduce((acc, filter) => `${acc} ${createFilterItemTemplate(filter, currentFilterType  )}`, '');
  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FiltersView extends AbstarctView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#onFilterClick);
  };

  #onFilterClick = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    const filterName = evt.target.dataset.filterType;
    this.element.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    this._callback.filterTypeChange(filterName);
  };
}
