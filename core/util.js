'use strict';
let send = require('./calls');

const isDefined = (obj) => {
  if (typeof obj === 'undefined') {
    return false;
  }
  if (!obj) {
    return false;
  }
  return obj != null;
};

const sendTypingOff = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off',
  };

  send.callSendAPI(messageData);
};

const sendTypingOn = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on',
  };
  send.callSendAPI(messageData);
};

module.exports.sendTypingOn = sendTypingOn;
module.exports.sendTypingOff = sendTypingOff;
module.exports.isDefined = isDefined;

