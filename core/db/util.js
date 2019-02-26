'use strict';
const moment = require('moment');

const parse = (params) => {
  console.log('PARAMS', params);
  let newDate;
  if ('date-time-new' in params) {
    newDate = params['date-time'].slice(0, 11);
    newDate = newDate + params['date-time-new'] + params['date-time'].slice(-1);

    let name = params.name;
    let date = newDate;
    let reoccurance = params.reoccurance;
    let time = params['date-time-new'];

    return [date, name, reoccurance, time];
  }
  if (params['date-time'].length <= 8){
    let d = moment().startOf('day') + 'T' + params['date-time'];
    console.log(d);
  }
  let name = params.name;
  let date = params['date-time'];
  let reoccurance = params.reoccurance;
  let time = params['date-time'].slice(11);

  return [date, name, reoccurance, time];
};

module.exports.parse = parse;
