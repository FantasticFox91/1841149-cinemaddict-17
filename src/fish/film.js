import {getRandomInteger, getRandomDecimalNumber, generateRandomNameFromArray, generateRandomDayFrom, generateRandomArrayFromArray} from '../util.js';
import { generateComment } from './comment.js';

const titles = [
  'A Little Pony Without The Carpet',
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor'
];

const directors = [
  'Steven Spielberg',
  'Quentin Tarantino',
  'Martin Scorsese',
  'Christopher Nolan',
  'Tim Burton',
];

const writers = [
  'Steven Spielberg',
  'Quentin Tarantino',
  'Martin Scorsese',
  'Woody Allen',
  'Spike Lee',
];

const actors = [
  'Tom Hanks',
  'Will Smith',
  'Keanu Reeves',
  'Scarlett Johansson',
  'Samuel L. Jackson',
];

const genres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Horror'
];

const countries = [
  'USA',
  'Ukraine',
  'Russia',
  'German',
  'Finland'
];

const posters = [
  'sagebrush-trail',
  'the-man-with-the-golden-arm',
  'santa-claus-conquers-the-martians',
  'the-dance-of-life',
  'the-great-flamarion',
];

const descriptions = [
  'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion\'s other assistant. Flamarion falls in love with Connie, the movie\'s femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.',
  'Four years after the destruction of Isla Nublar, dinosaurs now live--and hunt--alongside humans all over the world. This fragile balance will reshape the future and determine, once and for all, whether human beings are to remain the apex predators on a planet they now share with history\'s most fearsome creatures in a new Era',
  'The series follows Steven Grant, a mild- mannered gift-shop employee, who becomes plagued with blackouts and memories of another life. Steven discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven/Marc\'s enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt.',
  'Arthur Fleck works as a clown and is an aspiring stand-up comic. He has mental health issues, part of which involves uncontrollable laughter. Times are tough and, due to his issues and occupation, Arthur has an even worse time than most. Over time these issues bear down on him, shaping his actions, making him ultimately take on the persona he is more known as...Joker.'
];

export const generateFilm = () => ({
  id: getRandomInteger(0, 100),
  comments: Array.from({length: getRandomInteger(0, 100)}, generateComment),
  filmInfo: {
    title: generateRandomNameFromArray(titles),
    alternativeTitle: generateRandomNameFromArray(titles),
    totalRating: Number(getRandomDecimalNumber(10, 1)).toFixed(1),
    poster: `images/posters/${generateRandomNameFromArray(posters)}.jpg`,
    ageRating: getRandomInteger(0, 18),
    director: generateRandomArrayFromArray(directors, 3),
    writers: generateRandomArrayFromArray(writers, 3),
    actors: generateRandomArrayFromArray(actors, 3),
    release: {
      date: generateRandomDayFrom('year', -40, 0),
      releaseCountry: generateRandomNameFromArray(countries),
    },
    runtime: getRandomInteger(60, 180),
    genre: generateRandomArrayFromArray(genres, 3),
    description: generateRandomNameFromArray(descriptions),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  },
});
