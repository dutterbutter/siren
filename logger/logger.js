'use strict';
const moment = require('moment');

const logInfo = (str) => {
  console.log(`[${moment().format()}] \x1b[32mINFO:: \x1b[0m`, str);
};

const logError = (str, err) => {
  console.log(`[${moment().format()}] \x1b[31mERROR:: \x1b[0m`, str, '', err);
};

module.exports.logInfo = logInfo;
module.exports.logError = logError;

