import AbstarctView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () => '<section class="films"></section>';

export default class FilmSectionView extends AbstarctView {
  get template() {
    return createFilmListTemplate();
  }
}
