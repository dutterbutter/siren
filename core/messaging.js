'use strict';
const uuid = require('uuid');
const axios = require('axios');
const apiai = require('apiai');
const util = require('./util');
const logger = require('../logger/logger');
const trigger = require('./actions');

const apiAiService = apiai(process.env.DIALOG_FLOW_TOKEN, {
  language: 'en',
  requestSource: 'fb',
});
const sessionIds = new Map();

const receivedMsg = (event) => {
  let senderID = event.sender.id;
  // let recipientID = event.recipient.id;
  // let timeOfMessage = event.timestamp;
  let message = event.message;

  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid.v1());
  }

  // let messageId = message.mid;
  // let appId = message.app_id;
  // let metadata = message.metadata;

  // You may get a text or attachment but not both
  let messageText = message.text;
  let messageAttachments = message.attachments;

  if (messageText) {
    // send message to api.ai
    sendToApiAi(senderID, messageText);
  } else if (messageAttachments) {
    // handleMessageAttachments(messageAttachments, senderID);
  }
};

const sendToApiAi = (sender, text) => {
  util.sendTypingOn(sender);
  let apiaiRequest = apiAiService.textRequest(text, {
    sessionId: sessionIds.get(sender),
  });

  apiaiRequest.on('response', response => {
    if (util.isDefined(response.result)) {
      handleApiAiResponse(sender, response);
    }
  });

  apiaiRequest.on('error', error => console.error(error));
  apiaiRequest.end();
};

const handleApiAiResponse = (sender, response) => {
  let responseText = response.result.fulfillment.speech;
  let responseData = response.result.fulfillment.data;
  // let messages = response.result.fulfillment.messages;
  let action = response.result.action;
  let contexts = response.result.contexts;
  let parameters = response.result.parameters;

  util.sendTypingOff(sender);

  if (responseText === '' && !util.isDefined(action)) {
    // api ai could not evaluate input.
    logger.logError('Unknown query' + response.result.resolvedQuery);
    sendTextMessage(
      sender,
      "I'm not sure what you want. Can you be more specific?"
    );
  } else if (util.isDefined(action)) {
    trigger.handleApiAiAction(
      sender, action, responseText, contexts, parameters
    );
  } else if (util.isDefined(responseData) &&
      util.isDefined(responseData.facebook)) {
    try {
      logger.logInfo('Response as formatted message' + responseData.facebook);
      sendTextMessage(sender, responseData.facebook);
    } catch (err) {
      sendTextMessage(sender, err.message);
    }
  } else if (util.isDefined(responseText)) {
    sendTextMessage(sender, responseText);
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

// * Call the Send API. The message data goes in the body. If successful, we'll
// * get the message id in a response
// *
// */
const callSendAPI = async(messageData) => {
  const url = 'https://graph.facebook.com/v3.0/me/messages?access_token='
      + process.env.FB_PAGE_ACCESS;
  const response = await axios.post(url, messageData);
  try {
    if (response.status === 200) {
      let recipientId = response.data.recipient_id;
      let messageId = response.data.message_id;
      if (messageId) {
        logger.logInfo(`
        Successfully sent ${messageId} to recipient ${recipientId}
        `);
      } else {
        logger.logInfo(`Successfully API for recipient ${recipientId}`);
      }
    }
  } catch (error) {
    logger.logError(error.response.headers);
  }
};

module.exports.receivedMsg = receivedMsg;
module.exports.sendTextMessage = sendTextMessage;
module.exports.callSendAPI = callSendAPI;
// module.exports.receivedPostback = receivedPostback;
