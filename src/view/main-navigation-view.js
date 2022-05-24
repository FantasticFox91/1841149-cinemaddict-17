import AbstarctView from '../framework/view/abstract-view';

const createFilterItemTemplate = (filter) => {
  const { name, count } = filter;

  return (
    `
      <a href="#${name}" class="main-navigation__item">
        ${name} <span class="main-navigation__item-count">${count}</span>
      </a>
    `
  );
};

const createMainNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.reduce((acc, filter) => `${acc} ${createFilterItemTemplate(filter)}`, '');
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">
        All movies
      </a>
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class MainNavigationView extends AbstarctView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }
}
