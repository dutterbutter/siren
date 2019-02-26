'use strict';
const CronJob = require('cron').CronJob;
const notificationsWorker = require('./worker');
const logger = require('../logger/logger');

const schedulerFactory = new CronJob('00 * * * * *', function() {
  logger.logInfo('scheduler running...');
  notificationsWorker.run();
}, null, true, '');

module.exports.schedulerFactory = schedulerFactory;
