import moment from 'moment';

export default function format(dateToFormatString, locale) {
  var locale = require('../../resources/translations/messages.json');
  console.log(locale['delivery-estimator-in-hour']);
  const dateToFormat = new Date(dateToFormatString);
  if (isToday(dateToFormat)) {
    return formatToday(dateToFormat, locale);
  }
  return moment(dateToFormat).format(getLocaleSpecificDateFormat(locale));
}

const isToday = someDate => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

function formatToday(dateToFormat, locale) {
  const now = new Date();
  let message = 'hours';
  let param = Date.dateDiff('h', now, dateToFormat);
  if (param == 0) {
    message = 'minutes';
    param = Date.dateDiff('m', now, dateToFormat);
    if (param <= 0) {
      message = 'seconds';
    } else if (param == 1) {
      message = 'minute';
    }
  } else if (param == 1) {
    message = 'hour';
  }
  console.log(`in ${param} ${message}`);
  return `in ${param} ${message}`;
}

function getLocaleSpecificDateFormat(locale) {
  const by = 'by';
  switch (locale) {
    case 'de':
      return `${by} d. MMM`;
    case 'es':
      return `d ${by} MMM`;
    case 'ja':
      return 'MMMM dd日';
    default:
      return `${by} MMM` + ` d`;
  }
}

Date.dateDiff = function(datepart, fromdate, todate) {
  datepart = datepart.toLowerCase();
  const diff = todate - fromdate;
  const divideBy = {
    w: 604800000,
    d: 86400000,
    h: 3600000,
    m: 60000,
    s: 1000,
  };

  return Math.floor(diff / divideBy[datepart]);
};
