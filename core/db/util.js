'use strict';

const parse = (params) => {
  let newDate;
  let flag;
  if ('date-time-new' in params) {
    newDate = params['date-time'].slice(0, 11);
    newDate = newDate + params['date-time-new'] + params['date-time'].slice(-1);
    console.log(newDate);
    flag = false;
  }
  let name = params.name;
  let date = (flag ? params['date-time'] : newDate);
  let reoccurance = params.reoccurance;
  let time = (flag ? params['date-time'].slice(11) : params['date-time-new']);

  return [name, date, reoccurance, time];
};

module.exports.parse = parse;
