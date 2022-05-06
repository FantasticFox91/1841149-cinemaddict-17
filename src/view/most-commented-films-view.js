import AbstarctView from '../framework/view/abstract-view.js';

const createMostCommendedFilmsTemplate = () => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`;

export default class MostCommendedFilmsView extends AbstarctView {
  get template() {
    return createMostCommendedFilmsTemplate();
  }
}
