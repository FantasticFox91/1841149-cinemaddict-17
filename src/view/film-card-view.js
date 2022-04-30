import { createElement } from '../render.js';
import { calculateDuration, humanizeTaskGetYear} from '../util.js';
import {MAX_SHORT_DESCRIPTION_LENGTH, MIN} from '../const.js';

const generateDescription = (desc) => {
  if (desc.length > MAX_SHORT_DESCRIPTION_LENGTH) {
    desc = desc.slice(MIN, MAX_SHORT_DESCRIPTION_LENGTH).concat('...');
  }
  return desc;
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
        <p class="film-card__rating">${filmInfo.totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${humanizeTaskGetYear(filmInfo.release.date)}</span>
          <span class="film-card__duration">${calculateDuration(filmInfo.runtime)}</span>
          <span class="film-card__genre">${filmInfo.genre[0]}</span>
        </p>
        <img src="${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
        <p class="film-card__description">${generateDescription(filmInfo.description)}</p>
        <span class="film-card__comments">${comments.length} comment${comments.length > 1 ? 's' : ''}</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};
export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
