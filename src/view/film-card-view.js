import { humanizeYear} from '../utils/film';
import { calculateDuration } from '../utils/common';
import { MAX_SHORT_DESCRIPTION_LENGTH, MIN } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const generateDescription = (description) => {
  if (description.length > MAX_SHORT_DESCRIPTION_LENGTH) {
    description = description.slice(MIN, MAX_SHORT_DESCRIPTION_LENGTH).concat('...');
  }
  return description;
};

const createFilmCardTemplate = (film) => {
  const {id, comments, filmInfo, userDetails} = film;

  const watchlistClassName = userDetails.watchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--active'
    : '';

  return (
    `<article class="film-card" data-id='${id}'>
      <a class="film-card__link">
        <h3 class="film-card__title">${filmInfo.title}</h3>
        <p class="film-card__rating">${filmInfo.totalRating.toFixed(1)}</p>
        <p class="film-card__info">
          <span class="film-card__year">${humanizeYear(filmInfo.release.date)}</span>
          <span class="film-card__duration">${calculateDuration(filmInfo.runtime)}</span>
          <span class="film-card__genre">${filmInfo.genre[0]}</span>
        </p>
        <img src="${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
        <p class="film-card__description">${generateDescription(filmInfo.description)}</p>
        <span class="film-card__comments">${comments.length} comment${comments.length > 1 ? 's' : ''}</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button" ${film.isDisabled ? 'disabled' : ''}>Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button" ${film.isDisabled ? 'disabled' : ''}>Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button" ${film.isDisabled ? 'disabled' : ''}>Mark as favorite</button>
      </div>
    </article>`
  );
};
export default class FilmCardView extends AbstractStatefulView {
  constructor(film, isDisabled) {
    super();
    this._state = FilmCardView.parseFilmToState(film);
    this._state.isDisabled = isDisabled;
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
  };

  setFavouriteClickHandler = (callback) => {
    this._callback.favouriteClick = callback;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#onWatchlistClick);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#onWatchedClick);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#onFavouriteClick);
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #onFavouriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favouriteClick();
  };

  static parseFilmToState = (film) => ({...film});

  static parseStateToFilm = (state) => {
    const film = {...state};
    delete film.isDisabled;
    return film;
  };
}
