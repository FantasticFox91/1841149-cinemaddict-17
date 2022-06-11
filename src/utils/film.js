import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTime);

const humanizeYear = (date) => dayjs(date).get('year');

const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeDateAndTime = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

const humanizeCommentDate = (date) => dayjs(date).fromNow();

export { humanizeYear, humanizeDateAndTime, humanizeDate, humanizeCommentDate };
