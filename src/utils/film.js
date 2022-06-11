import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(RelativeTime);

// const onj = {
//   'year': [],
//   'month': [],
//   'da'
// }

const humanizeYear = (date) => dayjs(date).get('year');

const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeDateAndTime = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

const humanizeCommentDate = (date) => dayjs(date).fromNow();
//   const secondDifference = dayjs(Date.now()).diff(dayjs(date), 'second');
//   const minuteDifference = dayjs(Date.now()).diff(dayjs(date), 'minute');
//   const hourDifference = dayjs(Date.now()).diff(dayjs(date), 'hour');
//   const dayDifference = dayjs(Date.now()).diff(dayjs(date), 'day');
//   const monthDiferenece = dayjs(Date.now()).diff(dayjs(date), 'month');
//   const yearDiferenece = dayjs(Date.now()).diff(dayjs(date), 'year');

//   console.log(dayjs(date).fromNow());

//   if(yearDiferenece) {
//     return `${yearDiferenece} ${yearDiferenece > 1 ? 'years' : 'year'} ago`;
//   } else if (monthDiferenece) {
//     return `${monthDiferenece} ${monthDiferenece > 1 ? 'years' : 'year'} ago`;
//   } else if (dayDifference) {
//     return `${dayDifference} ${dayDifference > 1 ? 'days' : 'day'} ago`;
//   } else if (hourDifference) {
//     return `${hourDifference} ${hourDifference > 1 ? 'hours' : 'hour'} ago`;
//   } else if (minuteDifference) {
//     return `${minuteDifference} ${minuteDifference > 1 ? 'minutes' : 'minute'} ago`;
//   } else if (secondDifference) {
//     return 'Few seconds ago';
//   } else {
//     return 'Now';
//   }
// };

export { humanizeYear, humanizeDateAndTime, humanizeDate, humanizeCommentDate };
