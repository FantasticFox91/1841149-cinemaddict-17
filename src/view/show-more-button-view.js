import AbstarctView from '../framework/view/abstract-view';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstarctView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onShowMoreButtonClick);
  };

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
