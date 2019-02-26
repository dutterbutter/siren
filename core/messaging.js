'use strict';
const uuid = require('uuid');

const apiai = require('apiai');
const util = require('./util');
const logger = require('../logger/logger');
const trigger = require('./actions');
const send = require('./calls');

const apiAiService = apiai(process.env.DIALOG_FLOW_TOKEN, {
  language: 'en',
  requestSource: 'fb',
});
const sessionIds = new Map();

const receivedMsg = (event) => {
  let senderID = event.sender.id;
  let message = event.message;

  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid.v1());
  }
  // You may get a text or attachment but not both
  let messageText = message.text;
  let messageAttachments = message.attachments;

  if (messageText) {
    sendToApiAi(senderID, messageText);
  } else if (messageAttachments) {
    // handleMessageAttachments(messageAttachments, senderID);
  }
};

const receivedPostback = (e) => {
  let senderID = e.sender.id;
  let recipientID = e.recipient.id;
  let payload = e.postback.payload;
  let title = e.postback.title;
  console.log(e);
  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid.v1());
  }
  trigger.handleApiPostBack(senderID, recipientID, payload, title);
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
  let action = response.result.action;
  let contexts = response.result.contexts;
  let parameters = response.result.parameters;
  let isComplete = response.result.actionIncomplete;

  util.sendTypingOff(sender);

  if (responseText === '' && !util.isDefined(action)) {
    logger.logError('Unknown query' + response.result.resolvedQuery);
    send.sendTextMessage(
      sender,
      "I'm not sure what you want. Can you be more specific?"
    );
  } else if (util.isDefined(action)) {
    trigger.handleApiAiAction(
      sender, action, responseText, contexts, parameters, isComplete
    );
  } else if (util.isDefined(responseData) &&
      util.isDefined(responseData.facebook)) {
    try {
      logger.logInfo('Response as formatted message' + responseData.facebook);
      send.sendTextMessage(sender, responseData.facebook);
    } catch (err) {
      send.sendTextMessage(sender, err.message);
    }
  } else if (util.isDefined(responseText)) {
    send.sendTextMessage(sender, responseText);
  }
};

module.exports.sendToApiAi = sendToApiAi;
module.exports.receivedMsg = receivedMsg;
module.exports.receivedPostback = receivedPostback;

