import AbstarctView from '../framework/view/abstract-view';

const createFilmListTemplate = () => '<div class="films-list__container"></div>';

export default class FilmBoardView extends AbstarctView{
  get template() {
    return createFilmListTemplate();
  }
}
