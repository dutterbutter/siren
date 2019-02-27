'use strict';
const logger = require('../logger/logger');
const axios = require('axios');

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
    console.log(error.response.headers);
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
