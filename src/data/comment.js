import { generateRandomNameFromArray } from '../utils/common';
import { generateRandomDate } from '../utils/film';
import { AUTHORS, COMMENTS, MAX_DAY_GAP, MIN, EMOTIONS } from '../const';
let counter = 0;

export const generateComment = () => ({
  id: counter++,
  author: generateRandomNameFromArray(AUTHORS),
  comment: generateRandomNameFromArray(COMMENTS),
  date: generateRandomDate('day', MAX_DAY_GAP, MIN),
  emotion: generateRandomNameFromArray(EMOTIONS)
});
