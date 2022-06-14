import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createPopupButtonsTemplate = (userDetails) => {
  const watchlistClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  return (`
  <section class="film-details__controls">
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}"
      id="watchlist"
      name="watchlist"
      ${userDetails.isDisabled ? 'disabled' : ''}>Add to watchlist</button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watched ${watchedClassName}"
      id="watched"
      name="watched" ${userDetails.isDisabled ? 'disabled' : ''}>Already watched</button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}"
      id="favorite"
      name="favorite" ${userDetails.isDisabled ? 'disabled' : ''}>Add to favorites</button>
  </section>`);
};

export default class PopupButtonsView extends AbstractStatefulView {
  constructor(userDetails, isDisabled) {
    super();
    this._state = PopupButtonsView.parseUserDetailsToState(userDetails);
    this._state.isDisabled = isDisabled;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupButtonsTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavoriteClick);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  static parseUserDetailsToState = (userDetails) => ({...userDetails});
}
