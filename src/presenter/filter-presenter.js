import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view';
import { FilterType, UpdateType } from '../const.js';
import { FiltersList } from '../data/filters-list.js';

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

  get filmListFilters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: FiltersList[FilterType.ALL](films).length,
      },
      {
        type: FilterType.Watchlist,
        name: 'Watchlist',
        count: FiltersList[FilterType.Watchlist](films).length,
      },
      {
        type: FilterType.History,
        name: 'History',
        count: FiltersList[FilterType.History](films).length,
      },
      {
        type: FilterType.Favorites,
        name: 'Favorites',
        count: FiltersList[FilterType.Favorites](films).length,
      },
    ];
  }

  init = () => {
    const filmListFilters = this.filmListFilters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filmListFilters, this.#filterModel.filmListFilter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  destroy = () => remove(this.#filterComponent);

  #handleModelEvent = () => this.init();

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filmListFilter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
