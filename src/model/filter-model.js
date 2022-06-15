import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filmListFilter = FilterType.ALL;

  get filmListFilter() {
    return this.#filmListFilter;
  }

  setFilter = (updateType, filmListFilter) => {
    this.#filmListFilter = filmListFilter;
    this._notify(updateType, filmListFilter);
  };
}
