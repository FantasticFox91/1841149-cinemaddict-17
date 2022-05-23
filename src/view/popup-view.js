import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeDate, humanizeDateAndTime } from '../utils/film.js';
import { calculateDuration, isPressedEscapeKey } from '../utils/common.js';
import { nanoid } from 'nanoid';

const BLANK_FILM = {
  filmInfo: {
    title: 'RandomTitle',
    alternativeTitle: 'RandomTitle',
    totalRating: 5.0,
    poster: 'images/posters/the-man-with-the-golden-arm.jpg',
    ageRating: 18,
    director: 'Tim Burton',
    writers: 'Tim Burton',
    actors: 'Tim Burton',
    release: {
      date: 2022,
      releaseCountry: 'USA',
    },
    runtime: 80,
    genre: 'Horror',
    description: 'Arthur Fleck works as a clown and is an aspiring stand-up comic. He has mental health issues, part of which involves uncontrollable laughter. Times are tough and, due to his issues and occupation, Arthur has an even worse time than most. Over time these issues bear down on him, shaping his actions, making him ultimately take on the persona he is more known as...Joker.'
  },
  userDetails: {
    watchlist: true,
    alreadyWatched: false,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: false
  },
};

const createPopupTemplate = (commentsData, film = BLANK_FILM, emojiSelected, typedComment) => {
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

  const showGenres = (genres) => {
    let template = '';
    genres.genre.forEach((el) => {
      template += `<span class="film-details__genre">${el}</span>`;
    });
    return template;
  };

  const createCommentTemplate = (commentData) => {
    const {emotion, comment, author, date} = commentData;

    return (
      `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${humanizeDateAndTime(date)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
        </li>
      `
    );
  };

  const generateComments = (comments) => comments.reduce((acc, comment) => `${acc} ${createCommentTemplate(comment)}`, '');

  const showSelectedEmoji = (emoji) => emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji">` : '';

  const showTypedComment = (comment) => comment ? `<textarea class='film-details__comment-input' name='comment'>${comment}</textarea>` : '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>';

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

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>

          <ul class="film-details__comments-list">
            ${generateComments(commentsData)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${showSelectedEmoji(emojiSelected)}
            </div>

            <label class="film-details__comment-label">
              ${showTypedComment(typedComment)}
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

export default class PopupView extends AbstractStatefulView {
  constructor(comments, film) {
    super();
    this._state = PopupView.parseDataToState(film, comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state.comments, this._state, this._state.emojiSelected, this._state.typedComment);
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
      this.#closePopUp();
    }
  };

  #onEmojiImageClick = (evt) => {
    const commentText = this.element.querySelector('.film-details__comment-input').value;
    if (evt.target.nodeName === 'IMG') {
      const emojiName = evt.target.src.slice(evt.target.src.lastIndexOf('/')+1, evt.target.src.lastIndexOf('.'));
      if(this._state.emojiSelected !== emojiName){
        const scrollPosition = this.element.scrollTop;
        this.updateElement({emojiSelected: emojiName, typedComment: commentText});
        this.element.scrollTop = scrollPosition;
      }
    }
  };

  #closePopUp = () => {
    document.body.classList.toggle('hide-overflow');
    document.body.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.element.remove();
  };

  #onSubmitForm = (evt) => {
    if (evt.ctrlKey && evt.code === 'Enter') {
      const scrollPosition = this.element.scrollTop;
      this._state.comments.push(this.#onSubmitFormPress());
      this.updateElement({emojiSelected: null, typedComment: null});
      this.element.scrollTop = scrollPosition;
    }
  };

  #onSubmitFormPress = () =>
    ({
      id: nanoid(),
      author: 'Tom Fisher',
      comment: this.element.querySelector('.film-details__comment-input').value,
      date: humanizeDateAndTime(new Date()),
      emotion: this.element.querySelector('.film-details__emoji-item:checked').value
    });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setFavouriteClickHandler(this._callback.favouriteClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
  };

  #setInnerHandlers = () => {
    document.addEventListener('keypress', this.#onSubmitForm);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#onEmojiImageClick);
  };

  static parseCommentToState = (comment) => this._state.comments.push(comment);

  static parseDataToState = (film, comments) => ({...film, comments, emojiSelected: null, typedComment: null});
}
