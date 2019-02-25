'use strict';

const parse = (params) => {
  let newDate;
  if ('date-time-new' in params) {
    newDate = params['date-time'].slice(0, 11);
    newDate = newDate + params['date-time-new'] + params['date-time'].slice(-1);

    let name = params.name;
    let date = newDate;
    let reoccurance = params.reoccurance;
    let time = params['date-time-new'];

    return [name, date, reoccurance, time];
  }
  let name = params.name;
  let date = params['date-time'];
  let reoccurance = params.reoccurance;
  let time = params['date-time'].slice(11);

  return [name, date, reoccurance, time];
};

module.exports.parse = parse;
