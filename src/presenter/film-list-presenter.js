import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import FilmCardView from '../view/film-card-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import { render } from '../render';

const CARDS_ON_START = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmListPresenter {
  filmSectionComponent = new FilmSectionView;
  filmListComponent = new FilmListView;
  filmBoard = new FilmBoardView;
  topRatedfilmBoard = new FilmBoardView;
  mostCommentedfilmBoard = new FilmBoardView;
  topRatedFilmsComponent = new TopRatedFilmsView;
  mostCommendedFilmsComponent = new MostCommendedFilmsView;
  showMoreButtonComponent = new ShowMoreButtonView;

  init = (filmListContainer) => {
    this.filmListContainer = filmListContainer;

    render(this.filmSectionComponent, this.filmListContainer);
    render(this.filmListComponent, this.filmSectionComponent.getElement());
    render(this.filmBoard, this.filmListComponent.getElement());
    for (let i = 0; i < CARDS_ON_START; i++) {
      render(new FilmCardView(), this.filmBoard.getElement());
    }
    render(this.showMoreButtonComponent, this.filmListComponent.getElement());
    render(this.topRatedFilmsComponent, this.filmSectionComponent.getElement());
    render(this.topRatedfilmBoard, this.topRatedFilmsComponent.getElement());
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      render(new FilmCardView(), this.topRatedfilmBoard.getElement());
    }
    render(this.mostCommendedFilmsComponent, this.filmSectionComponent.getElement());
    render(this.mostCommentedfilmBoard , this.mostCommendedFilmsComponent.getElement());
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      render(new FilmCardView(), this.mostCommentedfilmBoard.getElement());
    }
  };
}
