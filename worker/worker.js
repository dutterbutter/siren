'use strict';
const ReminderModel = require('../core/db/model/reminder');

const notificationWorkerFactory = () => {
  return {
    run: () => {
      ReminderModel.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
