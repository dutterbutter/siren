'use strict';
const msg = require('./messaging');
const send = require('./calls');
const ops = require('../core/db/ops');
const temp = require('./templates');

const handleApiAiAction = (sender, act, text, ctx, param, flag) => {
  switch (act) {
    case 'reminders.add':
      send.sendTextMessage(sender, text);
      if (!flag) { ops.insertReminder(param, sender); }
      break;
    case 'reminders.reschedule':
      send.sendTextMessage(sender, text);
      if (!flag) {
        param['reschedule'] = true;
        ops.putReminder(param, sender);
      }
      break;
    case 'reminders.rename':
      send.sendTextMessage(sender, text);
      if (!flag) {
        param['rename'] = true;
        ops.putReminder(param, sender);
      }
      break;
    case 'reminders.remove':
      send.sendTextMessage(sender, text);
      if (!flag) { ops.delReminder(param, sender); }
      break;
    case 'reminders.snooze':
      send.sendTextMessage(sender, text);
      if (!flag) { console.log(param); }
      break;
    case 'reminders.get':
      send.sendTextMessage(sender, text);
      if (!flag) { ops.getReminder(param, sender); }
      break;
    case 'reminders.get.past':
      send.sendTextMessage(sender, text);
      if (!flag) { console.log(param); }
      break;
    default:
      // unhandled action, just send back the text
      send.sendTextMessage(sender, text);
  }
};

const handleApiPostBack = async(sender, recipient, payload) => {
  switch (payload) {
    case 'SET_REM':
      let text = 'Set a reminder';
      msg.sendToApiAi(sender, text);
      break;
    case 'IGNORE':
      let res = 'Okay not a problem!';
      send.sendTextMessage(sender, res);
      break;
    case 'SHOW_ALL_REM':
      msg.sendToApiAi(sender, 'get all reminders');
      break;
    case 'REMOVE_REM':
      msg.sendToApiAi(sender, 'remove a reminder');
      break;
    case 'UPDATE_REM':
      msg.sendToApiAi(sender, 'reschedule a reminder');
      break;
    case 'GET_STARTED':
      let response = temp.askTemplate('Would you like to set a reminder?');
      let messageData = {
        recipient: {
          id: sender,
        },
        message: response,
      };
      await send.callSendAPI(messageData);
  }
};

module.exports.handleApiAiAction = handleApiAiAction;
module.exports.handleApiPostBack = handleApiPostBack;
