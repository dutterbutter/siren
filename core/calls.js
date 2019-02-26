'use strict';
const logger = require('../logger/logger');
const axios = require('axios');

// * Call the Send API. The message data goes in the body. If successful, we'll
// * get the message id in a response
// *
// */
const callSendAPI = async(messageData) => {
  const url = 'https://graph.facebook.com/v3.0/me/messages?access_token='
        + process.env.FB_PAGE_ACCESS;
  try {
    const response = await axios.post(url, messageData);
    if (response.status === 200) {
      let recipientId = response.data.recipient_id;
      let messageId = response.data.message_id;
      if (messageId) {
        logger.logInfo(`sent ${messageId} to recipient ${recipientId}`);
      } else {
        logger.logInfo(`successfully API for recipient ${recipientId}`);
      }
    }
  } catch (error) {
    console.log('errrrrrr', error);
  }
};

const sendTextMessage = async(recipientId, text) => {
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: text,
    },
  };
  await callSendAPI(messageData);
};

module.exports.callSendAPI = callSendAPI;
module.exports.sendTextMessage = sendTextMessage;
