import { FilterType } from '../const';
import AbstarctView from '../framework/view/abstract-view';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.Favorites]: 'There are no favorite movies in you list. Try to add something',
  [FilterType.History]: 'There are no movies in your history list. Let\'s choose and watch something',
  [FilterType.Watchlist]: 'There are no movies in your watchlist. Let\'s add some movies to your watchlist',
};

const createEmptyFilmsListTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return `<section class="films-list"><h2 class="films-list__title">${noFilmsTextValue}</h2></section>`;
};
export default class EmptyFilmsListView extends AbstarctView {
  #filterType = null;

  constructor (filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyFilmsListTemplate(this.#filterType);
  }
}

