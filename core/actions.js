'use strict';
const msg = require('./messaging');
const ops = require('../core/db/ops');

const handleApiAiAction = (sender, act, text, ctx, param, flag) => {
  switch (act) {
    case 'send-text':
      let responseTextt = 'This is example of Text message.';
      msg.sendTextMessage(sender, responseTextt);
      break;
    case 'reminders.add':
      msg.sendTextMessage(sender, text);
      if (!flag) {ops.insertReminder(param, sender)}
        break;
    case 'reminders.reschedule':
      msg.sendTextMessage(sender, text);
      if(!flag) {
        param['reschedule'] = true;
        ops.putReminder(param, sender)
      }
      break;
    case 'reminders.rename':
      msg.sendTextMessage(sender, text);
      if(!flag) {
        param['rename'] = true;
        ops.putReminder(param, sender);
      }
      break;
    case 'reminders.remove':
      msg.sendTextMessage(sender, text);
      if(!flag) {ops.delReminder(param, sender)}
      break;
    case 'reminders.snooze':
      msg.sendTextMessage(sender, text);
      if(!flag) {console.log(param)}
      break;
    case 'reminders.get':
      msg.sendTextMessage(sender, text);
      if(!flag) {ops.getReminder(param, sender)}
      break;
    case 'reminders.get.past':
      msg.sendTextMessage(sender, text);
      if(!flag) {console.log(param)}
      break;
      default:
      // unhandled action, just send back the text

      msg.sendTextMessage(sender, text);
  }
};

module.exports.handleApiAiAction = handleApiAiAction;
