'use strict';
let call = require('./messaging');
const moment = require('moment');

const sirenReminderTemplate = async(recID, elem) => {
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
              subtitle: 'Your reminder NAME !',
              buttons: [
                {
                  type: 'postback',
                  title: 'Confirm',
                  payload: 'REM_CONFIRM',
                }, {
                  type: 'postback',
                  title: 'Snooze',
                  payload: 'REM_SNOOZE',
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
    let date = momentDate.format('dddd, MMMM Do YYYY, h:mm:ss a');

    return {
      title: `🚨 ${r.name}`,
      subtitle: date,
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

const askTemplate = (text) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons: [
          {
            type: 'postback',
            title: 'Set Reminder',
            payload: 'SET_REM',
          },
          {
            type: 'postback',
            title: 'Ignore',
            payload: 'IGNORE',
          },
        ],
      },
    },
  };
};

module.exports.sirenReminderTemplate = sirenReminderTemplate;
module.exports.sendListMessage = sendListMessage;
module.exports.listFormatter = listFormatter;
module.exports.askTemplate = askTemplate;
