'use strict';
const msg = require('./messaging');
const ops = require('../core/db/ops');
const temp = require('./templates');

const handleApiAiAction = (sender, act, text, ctx, param, flag) => {
  switch (act) {
    case 'reminders.add':
      msg.sendTextMessage(sender, text);
      if (!flag) { ops.insertReminder(param, sender); }
      break;
    case 'reminders.reschedule':
      msg.sendTextMessage(sender, text);
      if (!flag) {
        param['reschedule'] = true;
        ops.putReminder(param, sender);
      }
      break;
    case 'reminders.rename':
      msg.sendTextMessage(sender, text);
      if (!flag) {
        param['rename'] = true;
        ops.putReminder(param, sender);
      }
      break;
    case 'reminders.remove':
      msg.sendTextMessage(sender, text);
      if (!flag) { ops.delReminder(param, sender); }
      break;
    case 'reminders.snooze':
      msg.sendTextMessage(sender, text);
      if (!flag) { console.log(param); }
      break;
    case 'reminders.get':
      msg.sendTextMessage(sender, text);
      if (!flag) { ops.getReminder(param, sender); }
      break;
    case 'reminders.get.past':
      msg.sendTextMessage(sender, text);
      if (!flag) { console.log(param); }
      break;
    default:
      // unhandled action, just send back the text
      msg.sendTextMessage(sender, text);
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
      msg.sendTextMessage(sender, res);
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
      await msg.callSendAPI(messageData);
  }
};

module.exports.handleApiAiAction = handleApiAiAction;
module.exports.handleApiPostBack = handleApiPostBack;
