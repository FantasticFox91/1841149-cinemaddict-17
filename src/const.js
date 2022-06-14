const MAX_SHORT_DESCRIPTION_LENGTH = 140;
const MIN = 0;
const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];
const EXTRA_CARDS_COUNT = 2;
const FILMS_PER_STEP = 5;
const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATE_DOWN: 'rate-down'
};
const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_POPUP: 'UPDATE_POPUP',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};
const FilterType = {
  ALL: 'All',
  Watchlist: 'Watchlist',
  History: 'History',
  Favorites: 'Favorites'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { MIN, EMOTIONS, MAX_SHORT_DESCRIPTION_LENGTH, EXTRA_CARDS_COUNT, FILMS_PER_STEP, SortType, UserAction, UpdateType, FilterType, TimeLimit };
