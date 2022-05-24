import AbstarctView from '../framework/view/abstract-view';

const createMostCommentedFilmsTemplate = () => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`;

export default class MostCommentedFilmsView extends AbstarctView {
  get template() {
    return createMostCommentedFilmsTemplate();
  }
}
