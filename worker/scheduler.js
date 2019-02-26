'use strict';
const CronJob = require('cron').CronJob;
const notificationsWorker = require('./worker');

const schedulerFactory = new CronJob('00 * * * * *', function() {
  notificationsWorker.run();
}, null, true, '');

module.exports.schedulerFactory = schedulerFactory;
