const MIN_ID = 1;
const MAX_ID = 100;
const MAX_DAY_GAP = -7;
const MAX_YEAR_GAP = -40;
const MIN = 0;
const MAX_RATING = 10;
const MAX_AGE_RATING = 21;
const MAX_ARRAY_LENGTH = 3;
const MIN_RUNTIME = 20;
const MAX_RUNTIME = 180;
const MAX_SHORT_DESCRIPTION_LENGTH = 140;
const AUTHORS = [
  'Ilya O\'Reilly',
  'Tom Cruise',
  'John Doe',
  'Tim Macoveev',
  'Tim Burton'
];
const COMMENTS = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?'
];
const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];
const TITLES = [
  'A Little Pony Without The Carpet',
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor'
];
const DIRECTORS = [
  'Steven Spielberg',
  'Quentin Tarantino',
  'Martin Scorsese',
  'Christopher Nolan',
  'Tim Burton',
];
const WRITERS = [
  'Steven Spielberg',
  'Quentin Tarantino',
  'Martin Scorsese',
  'Woody Allen',
  'Spike Lee',
];
const ACTORS = [
  'Tom Hanks',
  'Will Smith',
  'Keanu Reeves',
  'Scarlett Johansson',
  'Samuel L. Jackson',
];
const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Horror'
];
const COUNTRIES = [
  'USA',
  'Ukraine',
  'Russia',
  'German',
  'Finland'
];
const POSTERS = [
  'sagebrush-trail',
  'the-man-with-the-golden-arm',
  'santa-claus-conquers-the-martians',
  'the-dance-of-life',
  'the-great-flamarion',
];
const DESCRIPTIONS = [
  'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion\'s other assistant. Flamarion falls in love with Connie, the movie\'s femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.',
  'Four years after the destruction of Isla Nublar, dinosaurs now live--and hunt--alongside humans all over the world. This fragile balance will reshape the future and determine, once and for all, whether human beings are to remain the apex predators on a planet they now share with history\'s most fearsome creatures in a new Era',
  'The series follows Steven Grant, a mild- mannered gift-shop employee, who becomes plagued with blackouts and memories of another life. Steven discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven/Marc\'s enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt.',
  'Arthur Fleck works as a clown and is an aspiring stand-up comic. He has mental health issues, part of which involves uncontrollable laughter. Times are tough and, due to his issues and occupation, Arthur has an even worse time than most. Over time these issues bear down on him, shaping his actions, making him ultimately take on the persona he is more known as...Joker.'
];
const DEFAULT_DATE_AND_TIME = '2019-04-12T16:12:32.554Z';
const MOCK_FILMS_AMOUNT = 30;
const MOCK_COMMENTS_AMMOUNT = 100;
const EXTRA_CARDS_COUNT = 2;
const FILMS_PER_STEP = 5;
const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATE_DOWN: 'rate-down'
};
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
};
const FilterType = {
  ALL: 'All',
  Watchlist: 'Watchlist',
  History: 'History',
  Favorites: 'Favorites'
};

export { MIN_ID, MAX_ID, MAX_DAY_GAP, AUTHORS, COMMENTS, EMOTIONS, TITLES, DIRECTORS, WRITERS, ACTORS, GENRES,
  COUNTRIES, POSTERS, DESCRIPTIONS, MIN, MAX_RATING, MAX_AGE_RATING, MAX_ARRAY_LENGTH, MAX_YEAR_GAP, MIN_RUNTIME,
  MAX_RUNTIME, MAX_SHORT_DESCRIPTION_LENGTH, DEFAULT_DATE_AND_TIME, MOCK_FILMS_AMOUNT, MOCK_COMMENTS_AMMOUNT, EXTRA_CARDS_COUNT, FILMS_PER_STEP,
  SortType, BLANK_FILM, UserAction, UpdateType, FilterType };
