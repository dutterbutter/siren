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
    name: docs[1].toLowerCase(),
    date: docs[0],
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
    try {
      await Reminder.updateOne({user: sender, name: params['old-name']},
        {$set: {name: docs[1]}});
      let text = `Reminder ${params['old-name']} renamed to ${docs[1]}`;
      send.sendTextMessage(sender, text);

      return;
    } catch (e) {
      logger.logError('update error: ', e);
    }
  }
  try {
    await Reminder.updateOne({user: sender, name: docs[1] },
      {$set: {date: docs[0], time: docs[3]}});
    let dateF = moment.utc(docs[0]).format('dddd, MMMM Do YYYY, h:mm:ss a');
    let text = `Reminder has been rescheduled for ${dateF}`;
    send.sendTextMessage(sender, text);
  } catch (e) {
    logger.logError('update error: ', e);
  }
};

const getReminder = async(params, sender) => {
  let response = await Reminder.find({user: sender});
  switch (response.length) {
    case 0:
      let text = 'You have no reminders set!';
      send.sendTextMessage(sender, text);
      break;
    case 1:
      let momentDate = moment.utc(response[0].date.toISOString());
      let date = momentDate.format('dddd, MMMM Do YYYY, h:mm:ss a');
      let msg = `Reminder ${response[0].name.toUpperCase()} set for ${date}`;
      send.sendTextMessage(sender, msg);
      break;
    case 4:
      t.listFormatterWithOnly4Elements(sender, response);
      break;
    default:
      let chunks = t.splitArray(response);
      t.listFormatter(sender, chunks);
  }
};

const delReminder = async(params, sender) => {
  try {
    let name = params;
    if (typeof params === 'object') {
      name = params.name;
    }
    let response = await Reminder.findOneAndDelete({
      user: sender, name: name.toLowerCase(),
    });
    let text = `Reminder ${response.name} has been deleted`;
    send.sendTextMessage(sender, text);
  } catch (e) {
    logger.logError('error deleting reminder', e);
  }
};

const getOne = async(params, sender) => {
  try {
    let response = await Reminder.findOne({
      user: sender, name: params['name'],
    });
    return response;
  } catch (e) {
    logger.logError('error ', e);
  }
};

module.exports.insertReminder = insertReminder;
module.exports.putReminder = putReminder;
module.exports.getReminder = getReminder;
module.exports.delReminder = delReminder;
module.exports.getOne = getOne;
