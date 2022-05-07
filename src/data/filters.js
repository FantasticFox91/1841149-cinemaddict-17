const FILTERS = {
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites'
};

const Filter = {
  [FILTERS.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FILTERS.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FILTERS.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.favorite)
};

const generateFilter = (films) => Object.entries(Filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }),
);

export {generateFilter};
