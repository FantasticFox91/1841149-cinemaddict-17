import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeDate } from '../utils/film';
import { calculateDuration, isPressedEscapeKey } from '../utils/common';
import { BLANK_FILM } from '../const';

const createPopupTemplate = (film = BLANK_FILM) => {
  const { userDetails, filmInfo } = film;

  const watchlistClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

  const showGenres = ({genre}) => genre.reduce((acc, genr) => `${acc} ${createGenreTemplate(genr)}`, '');

  return (`
  <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeDate(filmInfo.release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${calculateDuration(filmInfo.runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${showGenres(filmInfo)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>
      </form>
    </section>
  `);
};

export default class PopupView extends AbstractStatefulView {
  #changeFilm = null;
  #film = null;
  #filmsModel = null;

  constructor(film, filmsModel, changeFilm) {
    super();
    this._state = PopupView.parseDataToState(film);
    this.#changeFilm = changeFilm;
    this.#film = film;
    this.#filmsModel = filmsModel;
  }

  get template() {
    return createPopupTemplate(this._state, this._state.emojiSelected, this._state.typedComment);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
  };

  setFavouriteClickHandler = (callback) => {
    this._callback.favouriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavouriteClick);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  };

  _restoreHandlers = () => {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setFavouriteClickHandler(this._callback.favouriteClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
    this.element.querySelector('.film-details__control-button--watchlist').classList.toggle('film-details__control-button--active');
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
    this.element.querySelector('.film-details__control-button--watched').classList.toggle('film-details__control-button--active');
  };

  #onFavouriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favouriteClick();
    this.element.querySelector('.film-details__control-button--favorite').classList.toggle('film-details__control-button--active');
  };

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
    document.body.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.element.remove();
  };

  #onDocumentEscKeydown = (evt) => {
    if (isPressedEscapeKey(evt)) {
      evt.preventDefault();
      this.#close();
    }
  };

  #close = () => {
    document.body.classList.toggle('hide-overflow');
    document.body.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.element.remove();
  };

  static parseCommentToState = (comment) => this._state.comments.push(comment);

  static parseDataToState = (film) => ({...film, emojiSelected: null, typedComment: null});
}
