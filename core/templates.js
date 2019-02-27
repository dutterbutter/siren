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
                  title: `Snooze ${r.name}`,
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

const splitArray = (elements) => {
  let perChunk = 3; // items per chunk

  return elements.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
};


const listFormatter = (sender, reminders) => {
  for (let i = 0; i < reminders.length; i++) {
    let el = reminders[i].map((element, i) => {
      let momentDate = moment.utc(element.date.toISOString());
      let date = momentDate.format('dddd, MMMM Do YYYY, h:mm:ss a');
      let subtitle = `Reminder Set: ${date}`;
      return {
        title: `🚨 ${element.name.toUpperCase()}`,
        subtitle: subtitle,
        buttons: [
          {
            title: `Remove ${element.name}`,
            type: 'postback',
            payload: 'REMOVE_REM',
          },
        ],
      };
    });
    const obj = {
      template_type: 'list',
      top_element_style: 'compact',
      elements: JSON.stringify(el),
    };
    sendListMessage(sender, obj);
  }
};

const listFormatterWithOnly4Elements = (sender, reminders) => {
  const el = reminders.map((r, i) => {
    let momentDate = moment.utc(r.date.toISOString());
    let date = momentDate.format('dddd, MMMM Do YYYY, h:mm:ss a');
    let subtitle = `Reminder Set: ${date}`;
    return {
      title: `🚨 ${r.name.toUpperCase()}`,
      subtitle: subtitle,
      buttons: [
        {
          title: `Remove ${r.name}`,
          type: 'postback',
          payload: 'REMOVE_REM',
        },
      ],
    };
  });

  const obj = {
    template_type: 'list',
    top_element_style: 'compact',
    elements: JSON.stringify(el),
  };
  sendListMessage(sender, obj);
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
module.exports.splitArray = splitArray;
module.exports.listFormatterWithOnly4Elements = listFormatterWithOnly4Elements;
