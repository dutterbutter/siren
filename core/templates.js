'use strict';
let call = require('./messaging');
const moment = require('moment');

const getReminderTemplate = async(recID, elem) => {
  console.log(elem);
  let messageData = {
    recipient: {
      id: recID,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Reminder',
              image_url: './assets/reminder.jpg',
              subtitle: 'These are your reminders.',
              buttons: [
                {
                  type: 'web_url',
                  url: 'https://petersfancybrownhats.com',
                  title: 'View Website',
                }, {
                  type: 'postback',
                  title: 'Start Chatting',
                  payload: 'DEVELOPER_DEFINED_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
  await call.callSendAPI(messageData);
};

const listFormatter = (recipientId, reminders) => {
  const el = reminders.map((r, i) => {
    let momentDate = moment.utc(r.date.toISOString());
    let date = momentDate.format('YYYY-MM-DD hh:mm:ss A Z');

    return {
      title: `${r.name} ⏰`,
      subtitle: date.slice(0, -6),
    };
  });

  const obj = {
    template_type: 'list',
    top_element_style: 'compact',
    elements: JSON.stringify(el),
  };
  sendListMessage(recipientId, obj);
};


const sendListMessage = async(recipientId, elements) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: elements,
      },
    },
  };
  await call.callSendAPI(messageData);
};

module.exports.getReminderTemplate = getReminderTemplate;
module.exports.sendListMessage = sendListMessage;
module.exports.listFormatter = listFormatter;
