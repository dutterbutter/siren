/*eslint-disable */
const mongoose = require('mongoose');
const moment = require('moment');
const temp = require('../../templates');
let Schema = mongoose.Schema;

const reminderSchema = new Schema({

  user: {type: String},
  date: {type: Date, createIndexes: true},
  time: {type: String},
  reoccurance: {type: String},
  name: {type: String},

});

reminderSchema.methods.requiresNotification = function(date) {
  let check = moment(date).format("YYYY-MM-DDTHH:mm:ss\\Z");
  return Math.round(moment.duration(moment(this.date).utc()
        .diff(moment(check).utc())
    ).asMinutes()) === 0;
};

reminderSchema.statics.sendNotifications = function(callback) {
    const searchDate = moment().format();
    ReminderModel
        .find()
        .then(function (reminders) {
            reminders = reminders.filter((r) => {
                return r.requiresNotification(searchDate);
            });
            if (reminders.length > 0) {
                temp.sirenReminderTemplate(reminders)
            }
        });
};

const ReminderModel = mongoose.model('ReminderModel', reminderSchema);

module.exports = ReminderModel;
