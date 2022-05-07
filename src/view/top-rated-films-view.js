import AbstarctView from '../framework/view/abstract-view.js';

const createTopRatedFilmsTemplate = () => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`;

export default class TopRatedFilmsView extends AbstarctView {
  get template() {
    return createTopRatedFilmsTemplate();
  }
}
