import {getRandomInteger, generateRandomNameFromArray, generateRandomDayFrom} from '../util.js';

const authors = [
  'Ilya O\'Reilly',
  'Tom Cruise',
  'John Doe',
  'Tim Macoveev',
  'Tim Burton'
];

const comments = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?'
];

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

export const generateComment = () => ({
  id: getRandomInteger(1,100),
  author: generateRandomNameFromArray(authors),
  comment: generateRandomNameFromArray(comments),
  date: generateRandomDayFrom('day', -7, 0),
  emotion: generateRandomNameFromArray(emotions)
});
