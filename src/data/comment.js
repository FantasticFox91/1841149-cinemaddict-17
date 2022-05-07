import {generateRandomNameFromArray} from '../utils/common.js';
import {generateRandomDate} from '../utils/film.js';
import {AUTHORS, COMMENTS, MAX_DAY_GAP, MIN, EMOTIONS} from '../const.js';
let counter = 0;

export const generateComment = () => ({
  id: counter++,
  author: generateRandomNameFromArray(AUTHORS),
  comment: generateRandomNameFromArray(COMMENTS),
  date: generateRandomDate('day', MAX_DAY_GAP, MIN),
  emotion: generateRandomNameFromArray(EMOTIONS)
});
