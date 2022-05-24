import AbstarctView from '../framework/view/abstract-view';

const createFilmListTemplate = () => '<section class="films"></section>';

export default class FilmSectionView extends AbstarctView {
  get template() {
    return createFilmListTemplate();
  }
}
