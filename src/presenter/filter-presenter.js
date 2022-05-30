import { render, replace, remove, RenderPosition } from '../framework/render.js';
import MainNavigationView from '../view/main-navigation-view';
import { FilterType, UpdateType } from '../const.js';
import { Filter } from '../data/filters.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: Filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.Watchlist,
        name: 'Watchlist',
        count: Filter[FilterType.Watchlist](films).length,
      },
      {
        type: FilterType.History,
        name: 'History',
        count: Filter[FilterType.History](films).length,
      },
      {
        type: FilterType.Favorites,
        name: 'Favorites',
        count: Filter[FilterType.Favorites](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new MainNavigationView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
