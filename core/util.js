'use strict';

let call = require('./messaging');

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

  call.callSendAPI(messageData);
};

/*
 * Turn typing indicator on
 *
 */
const sendTypingOn = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on',
  };
  call.callSendAPI(messageData);
};

module.exports.sendTypingOn = sendTypingOn;
module.exports.sendTypingOff = sendTypingOff;
module.exports.isDefined = isDefined;
