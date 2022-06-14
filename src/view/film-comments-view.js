import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeCommentDate } from '../utils/film';
import dayjs from 'dayjs';
import { UpdateType, UserAction } from '../const';
import he from 'he';

const showSelectedEmoji = (emoji) => emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji">` : '';

const showTypedComment = (comment) => comment ? `<textarea class='film-details__comment-input' name='comment'>${comment}</textarea>` : '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>';

const createCommentTemplate = (commentData) => {
  const { emotion, comment, author, date, id } = commentData;

  return (
    `
    <li class="film-details__comment" data-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
      </li>
    `
  );
};

const generateComments = (comments) => comments.sort((commentA, commentB) => dayjs(commentA.date).diff(dayjs(commentB.date))).reduce((acc, comment) => `${acc} ${createCommentTemplate(comment)}`, '');

const createFilmListTemplate = (commentsData, state) => {
  const isSmile = state.emojiSelected === 'smile'
    ? 'checked'
    : '';

  const isSleeping = state.emojiSelected === 'sleeping'
    ? 'checked'
    : '';

  const isPuke = state.emojiSelected === 'puke'
    ? 'checked'
    : '';

  const isAngry = state.emojiSelected === 'angry'
    ? 'checked'
    : '';

  return (`
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>
        <ul class="film-details__comments-list">
          ${generateComments(commentsData)}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${showSelectedEmoji(state.emojiSelected)}
          </div>

          <label class="film-details__comment-label">
            ${showTypedComment(state.typedComment)}
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isSmile}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isSleeping}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isPuke}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isAngry}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  `);
};

export default class FilmCommentsView extends AbstractStatefulView {
  #filmComments = null;
  #changeComments = null;

  constructor(film, filmComments, changeComments) {
    super();
    this.#changeComments = changeComments;
    this.#filmComments = filmComments;
    this.#setInnerHandlers();
    this._state = FilmCommentsView.parseDataToState(film, this.#filmComments);
  }

  get template() {
    return createFilmListTemplate(this.#filmComments, this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__new-comment').addEventListener('keypress', this.#onSubmitForm);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#onEmojiImageClick);
    this.element.querySelectorAll('.film-details__comment').forEach((comment) => comment.addEventListener('click', this.#onDeleteButtonClick));
  };

  #onEmojiImageClick = (evt) => {
    const commentText = this.element.querySelector('.film-details__comment-input').value;
    if (evt.target.nodeName === 'INPUT') {
      const emojiName = evt.target.value;
      if(this._state.emojiSelected !== emojiName){
        const scrollPosition = this.element.scrollTop;
        this.updateElement({emojiSelected: emojiName, typedComment: he.encode(commentText)});
        this.element.scrollTop = scrollPosition;
      }
    }
  };

  #onSubmitFormPress = () =>
    ({
      'comment': he.encode(this.element.querySelector('.film-details__comment-input').value),
      'emotion': (this.element.querySelector('.film-details__emoji-item:checked') === null) ? 'smile' : this.element.querySelector('.film-details__emoji-item:checked').value
    });

  #onSubmitForm = (evt) => {
    if (evt.ctrlKey && evt.code === 'Enter') {
      const newCommentContainer = evt.currentTarget;
      const newCommentTextArea = newCommentContainer.querySelector('textarea');
      newCommentTextArea.disabled = true;
      const scrollPosition = this.element.scrollTop;
      const newComment = this.#onSubmitFormPress();
      const filteredFilmCommentIds = this._state.comments.map((comment) => comment.id);
      const updatedFilm = {...this._state, comments: filteredFilmCommentIds};
      delete updatedFilm.emojiSelected;
      delete updatedFilm.typedComment;
      this.element.scrollTop = scrollPosition;

      this.#changeComments(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        updatedFilm,
        [newComment, newCommentContainer]
      );
    }
  };

  #onDeleteButtonClick = (evt) => {
    const commentContainer = evt.currentTarget;
    if (evt.target.nodeName === 'BUTTON') {
      evt.preventDefault();
      const commentId = commentContainer.dataset.id;
      const filteredFilmCommentIds = this._state.comments.filter((comment) => comment.id !== commentId).map((comment) => comment.id);
      const updatedFilm = {...this._state, comments: filteredFilmCommentIds};
      const deletedComment = this._state.comments.find((comment) => comment.id === commentId);
      evt.target.disabled = true;
      evt.target.textContent = 'Deleting...';

      delete updatedFilm.emojiSelected;
      delete updatedFilm.typedComment;

      this.#changeComments(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        updatedFilm,
        [deletedComment, commentContainer]
      );
    }
  };

  static parseDataToState = (film, comments) => ({...film, comments, emojiSelected: null, typedComment: null});
}
