import {getRandomInteger, getRandomDecimalNumber, generateRandomNameFromArray, generateRandomDayFrom, generateRandomArrayFromArray} from '../util.js';
import {TITLES, DIRECTORS, WRITERS, ACTORS, GENRES, COUNTRIES, POSTERS, DESCRIPTIONS, MIN_ID, MAX_ID, MAX_RATING, MAX_AGE_RATING, MAX_ARRAY_LENGTH, MIN, MAX_YEAR_GAP, MIN_RUNTIME, MAX_RUNTIME} from '../const.js';

export const generateFilm = () => ({
  id: getRandomInteger(MIN_ID, MAX_ID),
  comments: [getRandomInteger(0, 100), getRandomInteger(0, 100), getRandomInteger(0, 100)],
  filmInfo: {
    title: generateRandomNameFromArray(TITLES),
    alternativeTitle: generateRandomNameFromArray(TITLES),
    totalRating: Number(getRandomDecimalNumber(MAX_RATING, MIN)).toFixed(1),
    poster: `images/posters/${generateRandomNameFromArray(POSTERS)}.jpg`,
    ageRating: getRandomInteger(MIN, MAX_AGE_RATING),
    director: generateRandomArrayFromArray(DIRECTORS, MAX_ARRAY_LENGTH),
    writers: generateRandomArrayFromArray(WRITERS, MAX_ARRAY_LENGTH),
    actors: generateRandomArrayFromArray(ACTORS, MAX_ARRAY_LENGTH),
    release: {
      date: generateRandomDayFrom('year', MAX_YEAR_GAP, MIN),
      releaseCountry: generateRandomNameFromArray(COUNTRIES),
    },
    runtime: getRandomInteger(MIN_RUNTIME, MAX_RUNTIME),
    genre: generateRandomArrayFromArray(GENRES, MAX_ARRAY_LENGTH),
    description: generateRandomNameFromArray(DESCRIPTIONS),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  },
});
