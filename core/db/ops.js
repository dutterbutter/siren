'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const send = require('../calls');
const s = require('./util');
const t = require('../../core/templates');
const logger = require('../../logger/logger');
const Reminder = mongoose.model('ReminderModel');

const insertReminder = (params, sender) => {
  let docs = s.parse(params);
  new Reminder({
    name: docs[0],
    date: docs[1],
    reoccurance: docs[2],
    time: docs[3],
    user: sender,
  }).save()
    .then(r => {
      let dateF = moment.utc(r.date).format('dddd, MMMM Do YYYY, h:mm:ss a');
      let text = `Reminder ${r.name} created for ${dateF}`;
      send.sendTextMessage(sender, text);
    })
    .catch(err => {
      console.log(err);
    });
};

const putReminder = async(params, sender) => {
  let docs = s.parse(params);
  if (!('reschedule' in params)) {
    await Reminder.updateOne({user: sender, name: params['old-name']},
      {$set: {name: docs[0]}});
    let text = `Reminder ${params['old-name']} has been renamed to ${docs[0]}`;
    send.sendTextMessage(sender, text);

    return;
  }
  await Reminder.updateOne({user: sender, date: params['date-time']},
    {$set: {date: docs[1], time: docs[3]}});
  let text = `Reminder has been rescheduled for ${docs[1]}`;
  send.sendTextMessage(sender, text);
};

const getReminder = async(params, sender) => {
  // let docs = s.parse(params);

  let response = await Reminder.find({user: sender});
  t.listFormatter(sender, response);
};

const delReminder = async(params, sender) => {
  let docs = s.parse(params);
  try {
    let response = await Reminder.findOneAndDelete({
      user: sender, name: docs[0],
    });
    let text = `Reminder ${response.name} has been deleted`;
    send.sendTextMessage(sender, text);
  } catch (e) {
    logger.logError('error deleting reminder', e);
  }
};

module.exports.insertReminder = insertReminder;
module.exports.putReminder = putReminder;
module.exports.getReminder = getReminder;
module.exports.delReminder = delReminder;
