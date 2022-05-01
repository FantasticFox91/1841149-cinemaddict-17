import {generateRandomNameFromArray, generateRandomDayFrom} from '../util.js';
import {AUTHORS, COMMENTS, MAX_DAY_GAP, MIN, EMOTIONS} from '../const.js';
let counter = 0;

export const generateComment = () => ({
  id: counter++,
  author: generateRandomNameFromArray(AUTHORS),
  comment: generateRandomNameFromArray(COMMENTS),
  date: generateRandomDayFrom('day', MAX_DAY_GAP, MIN),
  emotion: generateRandomNameFromArray(EMOTIONS)
});
