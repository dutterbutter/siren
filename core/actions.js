'use strict';
const msg = require('./messaging');

const handleApiAiAction = (sender, act, text, ctx, param) => {
  switch (act) {
    case 'send-text':
      let responseTextt = 'This is example of Text message.';
      msg.sendTextMessage(sender, responseTextt);
      break;
    default:
      // unhandled action, just send back the text

      msg.sendTextMessage(sender, text);
  }
};

module.exports.handleApiAiAction = handleApiAiAction;
