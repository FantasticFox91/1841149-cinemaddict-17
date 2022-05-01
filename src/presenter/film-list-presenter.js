import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import FilmCardView from '../view/film-card-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import PopupView from '../view/popup-view.js';
import { render } from '../render';

const EXTRA_CARDS_COUNT = 2;
const siteFooterElement = document.querySelector('.footer');

const isPressedEscapeKey = (evt) => evt.key === 'Escape';

const onDocumentEscKeydown = (evt) => {
  if (isPressedEscapeKey(evt)) {
    evt.preventDefault();
    closePopUp();
  }
};


const showPopUp = (film, commentsData) => {
  document.body.classList.toggle('hide-overflow');
  render(new PopupView(film, commentsData),  siteFooterElement, 'afterend');
  document.body.addEventListener('keydown', onDocumentEscKeydown);
  document.querySelector('.film-details__close-btn').addEventListener('click', closePopUp);
};

function closePopUp () {
  document.body.classList.toggle('hide-overflow');
  document.body.removeEventListener('keydown', onDocumentEscKeydown);
  document.querySelector('.film-details').remove();
}

export default class FilmListPresenter {
  filmSectionComponent = new FilmSectionView;
  filmListComponent = new FilmListView;
  filmBoard = new FilmBoardView;
  topRatedfilmBoard = new FilmBoardView;
  mostCommentedfilmBoard = new FilmBoardView;
  topRatedFilmsComponent = new TopRatedFilmsView;
  mostCommendedFilmsComponent = new MostCommendedFilmsView;
  showMoreButtonComponent = new ShowMoreButtonView;


  init = (filmListContainer, filmsModel) => {
    this.filmListContainer = filmListContainer;
    this.filmsModel = filmsModel;
    this.filmsBoard = [...this.filmsModel.getFilms()];
    this.comments = [...this.filmsModel.getComments()];

    render(this.filmSectionComponent, this.filmListContainer);
    render(this.filmListComponent, this.filmSectionComponent.getElement());
    render(this.filmBoard, this.filmListComponent.getElement());
    for (let i = 0; i < this.filmsBoard.length; i++) {
      render(new FilmCardView(this.filmsBoard[i]), this.filmBoard.getElement());
    }
    render(this.showMoreButtonComponent, this.filmListComponent.getElement());
    render(this.topRatedFilmsComponent, this.filmSectionComponent.getElement());
    render(this.topRatedfilmBoard, this.topRatedFilmsComponent.getElement());
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      render(new FilmCardView(this.filmsBoard[i]), this.topRatedfilmBoard.getElement());
    }
    render(this.mostCommendedFilmsComponent, this.filmSectionComponent.getElement());
    render(this.mostCommentedfilmBoard , this.mostCommendedFilmsComponent.getElement());
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      render(new FilmCardView(this.filmsBoard[i]), this.mostCommentedfilmBoard.getElement());
    }
    document.querySelectorAll('.film-card').forEach((card) => card.addEventListener('click', () => {
      const object = this.filmsBoard.find((film) => film.id === Number(card.dataset.id));
      const selectedComments = this.comments.filter(({id}) => object.comments.some((commentId) => commentId === Number(id)));
      showPopUp(object, selectedComments);
    }));
  };
}
