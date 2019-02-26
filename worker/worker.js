'use strict';
const ReminderModel = require('../data/model/reminder');

const notificationWorkerFactory = () => {
  return {
    run: () => {
      ReminderModel.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
