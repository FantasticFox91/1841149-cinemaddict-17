import AbstarctView from '../framework/view/abstract-view';

const createEmptyFilmsListTemplate = () => '<section class="films-list"><h2 class="films-list__title">There are no movies in our database</h2></section>';

export default class EmptyFilmsListView extends AbstarctView {
  get template() {
    return createEmptyFilmsListTemplate();
  }
}

