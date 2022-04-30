import {getRandomInteger, generateRandomNameFromArray, generateRandomDayFrom} from '../util.js';
import { MIN_ID, MAX_ID, AUTHORS, COMMENTS, MAX_DAY_GAP, MIN, EMOTIONS} from '../const.js';

export const generateComment = () => ({
  id: getRandomInteger(MIN_ID,MAX_ID),
  author: generateRandomNameFromArray(AUTHORS),
  comment: generateRandomNameFromArray(COMMENTS),
  date: generateRandomDayFrom('day', MAX_DAY_GAP, MIN),
  emotion: generateRandomNameFromArray(EMOTIONS)
});
