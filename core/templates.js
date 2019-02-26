'use strict';
const send = require('./calls');
const moment = require('moment');

const sirenReminderTemplate = async(params) => {
  const messageData = params.map((r) => {
    let momentDate = moment.utc(r.date.toISOString());
    let date = momentDate.format('dddd, MMMM Do YYYY, h:mm:ss a');
    return {
      recipient: {
        id: r.user,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `🚨 ${r.name.toUpperCase()}`,
              subtitle: date,
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
            }],
          },
        },
      },
    };
  });
  await send.callSendAPI(messageData[0]);
};

const listFormatter = (recipientId, reminders) => {
  const el = reminders.map((r, i) => {
    let momentDate = moment.utc(r.date.toISOString());
    let date = momentDate.format('dddd, MMMM Do YYYY, h:mm:ss a');
    let subtitle = `Reminder Set: ${date}`;
    return {
      title: `🚨 ${r.name.toUpperCase()}`,
      subtitle: subtitle,
      buttons: [
            {
              title: "Remove",
              type: "postback",
              payload: "REMOVE_REM",
            }
        ]
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
  await send.callSendAPI(messageData);
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
